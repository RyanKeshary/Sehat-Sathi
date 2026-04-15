import { NextResponse } from "next/server";

/**
 * Sehat AI — Conversational Medical Triage Engine v2
 * 
 * Properly matches symptoms using word-level tokenization, fuzzy matching,
 * and multi-category scoring. Each symptom category generates a unique,
 * contextual response.
 */

// ────────────────────────────────────────────────────────
// 1. WORD-LEVEL TOKENIZER
// ────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\u0900-\u097F]/g, " ") // keep ascii + devanagari
    .split(/\s+/)
    .filter(Boolean);
}

function textContainsAny(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  const words = tokenize(text);
  let hits = 0;
  
  for (const term of terms) {
    // Full phrase match (e.g., "chest pain" in "i have chest pain")
    if (lower.includes(term.toLowerCase())) {
      hits += 2; // phrase match is worth more
      continue;
    }
    // Individual word match (e.g., "pain" in "i have pain in body")
    const termWords = term.toLowerCase().split(/\s+/);
    for (const tw of termWords) {
      if (words.includes(tw)) {
        hits += 1;
      }
    }
  }
  return hits;
}

// ────────────────────────────────────────────────────────
// 2. SYMPTOM CATEGORIES — Each with many trigger words
// ────────────────────────────────────────────────────────

interface SymptomCategory {
  id: string;
  name: string;
  triggers: string[]; // English words/phrases
  hindiTriggers: string[]; // Hindi transliterated words
  triageLevel: "green" | "yellow" | "red";
  confidence: number;
  requiresEmergency: boolean;
  symptoms: string[];
  response: string;
}

const CATEGORIES: SymptomCategory[] = [
  // ═══════════════════════════════════════
  // RED — EMERGENCY
  // ═══════════════════════════════════════
  {
    id: "cardiac",
    name: "Cardiac Emergency",
    triggers: [
      "chest pain", "chest", "heart attack", "heart", "cardiac",
      "left arm pain", "arm pain", "tightness in chest", "heavy chest",
      "chest pressure", "squeezing", "palpitation", "palpitations",
      "jaw pain", "sweating profusely", "cold sweat",
    ],
    hindiTriggers: [
      "seene", "chhati", "dil", "heart", "dard seene",
      "bhari chhati", "dil ka daura", "pasina", "paseena",
      "chhati mein dard",
    ],
    triageLevel: "red",
    confidence: 0.95,
    requiresEmergency: true,
    symptoms: ["Chest Pain", "Cardiac Symptoms", "Palpitations"],
    response: `🔴 **EMERGENCY — Possible Cardiac Event Detected**

Based on your symptoms, this could be a serious heart-related condition requiring immediate medical attention.

**Take these steps RIGHT NOW:**
1. 🚑 **Call 108 (Ambulance)** or rush to the nearest hospital ER immediately
2. 💊 Chew one **Aspirin 325mg** if available (unless allergic)
3. 🪑 Sit upright in a comfortable position — do NOT lie flat
4. 👕 Loosen any tight clothing around chest and neck
5. 🧘 Breathe slowly and try to stay calm

**⚠️ Warning Signs of Heart Attack:**
- Crushing/squeezing chest pain lasting > 5 minutes
- Pain radiating to left arm, jaw, or back
- Profuse sweating with nausea
- Feeling of impending doom

**Do NOT wait** — every minute matters. Call 108 now.

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "breathing",
    name: "Respiratory Emergency",
    triggers: [
      "breathing", "breathless", "breathe", "suffocating", "suffocation",
      "cannot breathe", "cant breathe", "short of breath", "shortness",
      "gasping", "choking", "asthma", "asthma attack", "wheezing",
      "oxygen", "difficulty breathing", "hard to breathe",
    ],
    hindiTriggers: [
      "saans", "saans nahi", "dum ghut", "dam", "saans lene",
      "saans phoolna", "dama",
    ],
    triageLevel: "red",
    confidence: 0.92,
    requiresEmergency: true,
    symptoms: ["Breathing Difficulty", "Respiratory Distress"],
    response: `🔴 **EMERGENCY — Breathing Difficulty Detected**

Difficulty breathing is a medical emergency that requires **immediate attention**.

**What to do RIGHT NOW:**
1. 🚑 **Call 108** for an ambulance immediately
2. 🪑 Sit upright — do NOT lie down (this helps open airways)
3. 💨 If you have an inhaler (for asthma), take 2 puffs now
4. 🪟 Open windows and doors for fresh air
5. 👕 Remove tight clothing around your chest and throat
6. 🧘 Try pursed-lip breathing: breathe in through nose (2 sec), out through mouth (4 sec)

**Go to hospital IMMEDIATELY if:**
- Lips or fingertips turning blue/purple
- Cannot speak full sentences
- Chest muscles pulling in with each breath
- Gasping or making whistling sounds

**Possible causes:** Asthma attack, pneumonia, allergic reaction (anaphylaxis), heart failure, anxiety attack

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "stroke",
    name: "Stroke Warning",
    triggers: [
      "stroke", "face drooping", "slurred speech", "numbness",
      "one side", "paralysis", "sudden weakness", "confusion",
      "vision loss", "sudden headache worst", "balance",
    ],
    hindiTriggers: [
      "lakwa", "ek taraf", "chehra", "bolne mein",
      "hath pair", "chakkar", "gehri sir dard",
    ],
    triageLevel: "red",
    confidence: 0.93,
    requiresEmergency: true,
    symptoms: ["Possible Stroke", "Neurological Emergency"],
    response: `🔴 **EMERGENCY — Possible Stroke Detected**

Use the **FAST** test:
- **F**ace: Is one side drooping? Ask them to smile.
- **A**rms: Can they raise both arms? Does one drift down?
- **S**peech: Is their speech slurred or strange?
- **T**ime: If ANY of these are present, call **108 NOW**

**Every minute counts.** Brain cells die rapidly during a stroke.

**Do this immediately:**
1. Call 108 — note the exact time symptoms started
2. Do NOT give food, water, or any medicine
3. Lay the person on their side (recovery position)
4. Keep them calm and still
5. Do NOT let them fall asleep

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },

  // ═══════════════════════════════════════
  // YELLOW — SEE DOCTOR WITHIN 2-3 DAYS
  // ═══════════════════════════════════════
  {
    id: "fever",
    name: "Fever & Infection",
    triggers: [
      "fever", "temperature", "hot", "chills", "shivering",
      "sweating", "night sweats", "burning", "warm", "high temp",
      "100 degrees", "102", "103", "104", "malaria", "dengue",
      "typhoid", "infection",
    ],
    hindiTriggers: [
      "bukhar", "taap", "tez bukhar", "badan garam",
      "thandi lag", "kaampna", "garmi", "bukhar aa raha",
    ],
    triageLevel: "yellow",
    confidence: 0.85,
    requiresEmergency: false,
    symptoms: ["Fever", "Elevated Temperature", "Chills"],
    response: `🟡 **Moderate Concern — Fever Detected**

Fever is your body's way of fighting infection. Here's how to manage it:

**Immediate Home Care:**
• 💊 Take **Paracetamol (Crocin/Dolo 650mg)** — 1 tablet every 6-8 hours
• 💧 Drink plenty of fluids — water, ORS, coconut water, nimbu paani
• 🛏️ Rest in a cool, well-ventilated room
• 🧊 Place a damp cloth on your forehead to reduce temperature
• 🍲 Eat light, easily digestible food (khichdi, dal, fruits)

**⚠️ See a Doctor If:**
• Fever persists beyond **3 days**
• Temperature exceeds **102°F (39°C)** consistently
• You develop a rash, severe body pain, or vomiting
• Eyes become red or you see bleeding from nose/gums (dengue warning)

**Get Tested:** In malaria-endemic areas, get a **rapid malaria + dengue test** at your nearest PHC.

**Common causes in rural India:** Viral fever, Malaria, Dengue, Typhoid — all need proper diagnosis.

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "stomach",
    name: "Stomach & Digestive Issues",
    triggers: [
      "stomach", "stomach pain", "stomach ache", "abdomen", "belly",
      "diarrhea", "loose motion", "loose stool", "vomiting", "vomit",
      "nausea", "nauseous", "acidity", "gas", "bloating", "indigestion",
      "food poisoning", "cramps", "gastric", "constipation", "dysentery",
      "blood in stool", "worms",
    ],
    hindiTriggers: [
      "pet", "pet dard", "pet mein", "ulti", "dast", "latrine",
      "ji machalna", "ji mita", "gas", "kabz", "acidity",
      "pet phoolna", "pet kharab",
    ],
    triageLevel: "yellow",
    confidence: 0.86,
    requiresEmergency: false,
    symptoms: ["Stomach Pain", "Digestive Distress"],
    response: `🟡 **Moderate Concern — Stomach/Digestive Issue**

Stomach issues need careful management, especially to prevent dehydration.

**Immediate Treatment:**
• 🥤 **ORS is #1 priority** — Mix 1 ORS packet in 1 liter clean water. Sip frequently.
  - No ORS? Mix: 6 tsp sugar + ½ tsp salt in 1 liter boiled/clean water
• 🍌 **BRAT diet** — Bananas, Rice (plain), Apple, Toast. Keep meals light.
• ❌ Avoid: spicy food, oily food, dairy, raw vegetables
• 💊 For acidity: Take antacid (Gelusil/Digene) after meals
• 🫚 Ginger tea or jeera water can help with nausea

**For Children:**
• Continue breastfeeding + ORS
• Give **Zinc** tablets: 10mg/day (under 6 months), 20mg/day (6 months - 5 years) for 10-14 days

**🚨 Rush to Hospital If:**
• Blood in stool or vomit
• Cannot keep ANY fluids down for 6+ hours
• Severe dehydration signs: dry mouth, no urination, sunken eyes
• Severe abdominal pain that doesn't move or worsens
• High fever (>102°F) with stomach pain

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "diabetes",
    name: "Diabetes / Blood Sugar",
    triggers: [
      "diabetes", "diabetic", "sugar", "blood sugar", "glucose",
      "thirst", "thirsty", "frequent urination", "urination",
      "wound healing", "wounds not healing", "blurry vision",
      "numbness feet", "tingling", "weight loss", "insulin",
    ],
    hindiTriggers: [
      "madhumeh", "cheeni", "sugar ki bimari", "baar baar peshab",
      "bahut pyaas", "ghav na bharna", "sugar badh",
    ],
    triageLevel: "yellow",
    confidence: 0.82,
    requiresEmergency: false,
    symptoms: ["Possible Diabetes", "Blood Sugar Concerns"],
    response: `🟡 **Moderate Concern — Possible Blood Sugar Issue**

Your symptoms may suggest diabetes or blood sugar imbalance. This is very common and manageable with proper care.

**What to Do:**
• 🔬 Get **Fasting Blood Sugar** and **HbA1c** test at your nearest lab
• 💊 If already on medication, ensure you're taking it regularly — never skip doses
• 🥗 **Diet changes:** Reduce rice/roti portions, avoid sugar and sweets, eat more green vegetables and dal
• 🚶 **Walk 30 minutes daily** — even a slow walk helps significantly
• 🦶 Check your feet daily for cuts, sores, or redness

**Warning Signs — See Doctor Urgently If:**
• Wounds that won't heal in 2+ weeks
• Blurry vision or frequent headaches
• Tingling or numbness in hands/feet (neuropathy)
• Unexplained weight loss despite normal eating
• Fruity-smelling breath + confusion (diabetic emergency — call 108)

**Government Programs:** Visit your nearest PHC for free diabetes screening under NPCDCS.

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "pregnancy",
    name: "Pregnancy Related",
    triggers: [
      "pregnant", "pregnancy", "baby", "expecting", "delivery",
      "morning sickness", "missed period", "prenatal", "antenatal",
      "labour", "labor", "contractions", "bleeding pregnancy",
      "baby movement", "kick count",
    ],
    hindiTriggers: [
      "garbh", "garbhvati", "pet se", "bachcha", "prasav",
      "mahavari band", "ulti subah", "delivery",
    ],
    triageLevel: "yellow",
    confidence: 0.88,
    requiresEmergency: false,
    symptoms: ["Pregnancy Related", "Maternal Health"],
    response: `🟡 **Important — Pregnancy Guidance**

Pregnancy needs regular professional monitoring. Here's your guide:

**Essential Care:**
• 💊 Take **Folic Acid** (5mg) + **Iron** (1 tablet daily) as prescribed
• 🥗 Eat: green vegetables, milk/curd, eggs, fruits, jaggery (gur), nuts
• 💧 Drink 8-10 glasses of water daily
• 🏥 Attend ALL scheduled **Antenatal Check-ups** (ANC) — minimum 4 visits
• 📊 Get **BP and weight** checked at every visit
• 💉 Take **TT injection** as scheduled

**🚨 RUSH TO HOSPITAL If:**
• Vaginal bleeding at ANY stage
• Severe abdominal pain or cramping
• Severe headache + blurred vision (pre-eclampsia)
• Water breaks before due date
• Baby movements decrease or stop
• Swelling of face/hands (not just feet)
• Fever during pregnancy

**Free Government Services:**
ASHA worker → Janani Suraksha Yojana (JSY) for free institutional delivery and cash assistance.

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "injury",
    name: "Injury / Wound / Fracture",
    triggers: [
      "injury", "injured", "wound", "cut", "bleeding", "bleed",
      "fracture", "broken bone", "broken", "sprain", "swollen",
      "fall", "fell", "accident", "burn", "burned", "snake bite",
      "bite", "dog bite", "stitches", "bruise",
    ],
    hindiTriggers: [
      "chot", "ghav", "khoon", "tuta", "haddi", "gir gaya",
      "jal gaya", "saanp", "kutta kata", "sujan", "moch",
    ],
    triageLevel: "yellow",
    confidence: 0.87,
    requiresEmergency: false,
    symptoms: ["Physical Injury", "Wound/Trauma"],
    response: `🟡 **Injury Detected — First Aid Guide**

**For Cuts/Wounds:**
• 🧼 Wash wound gently with clean water and soap
• 🩹 Apply pressure with clean cloth to stop bleeding
• 💊 Apply antiseptic (Betadine/Dettol) and cover with sterile bandage
• 💉 Get **Tetanus (TT) injection** if not taken in last 5 years

**For Burns:**
• 🚿 Run cool (NOT ice-cold) water over the burn for 10-20 minutes
• ❌ Do NOT apply toothpaste, butter, or ice
• 🩹 Cover loosely with clean cloth or cling film
• 💊 Take paracetamol for pain

**For Suspected Fracture:**
• 🦴 Do NOT move the injured part
• 🪵 Splint it using a stick/cardboard and cloth
• 🏥 Go to hospital for X-ray

**🚨 Go to Hospital IMMEDIATELY If:**
• Deep wound that won't stop bleeding
• Bone visible or limb bent unnaturally
• Snake/animal bite (note time of bite)
• Burn larger than your palm or on face/joints
• Head injury with vomiting or drowsiness

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },

  // ═══════════════════════════════════════
  // GREEN — SELF-CARE AT HOME
  // ═══════════════════════════════════════
  {
    id: "headache",
    name: "Headache",
    triggers: [
      "headache", "head pain", "head ache", "head hurts", "migraine",
      "head", "temple", "forehead pain", "throbbing", "head heavy",
      "tension headache",
    ],
    hindiTriggers: [
      "sir dard", "sar dard", "sir", "sar", "sir bhari",
      "sar mein dard", "aadha sir",
    ],
    triageLevel: "green",
    confidence: 0.88,
    requiresEmergency: false,
    symptoms: ["Headache"],
    response: `🟢 **Self-Care — Headache Management**

Most headaches can be managed at home safely.

**Home Remedies:**
• 💊 Take **Paracetamol 500mg** (Crocin) — 1 tablet with water
• 🛏️ Rest in a dark, quiet room for 30 minutes
• 🧊 Apply cold compress (wet cloth/ice pack) on forehead for 15 minutes
• 💧 **Drink water** — dehydration is the #1 cause of headaches
• 💆 Gently massage your temples and back of neck
• ☕ A cup of tea/coffee can help if it's a tension headache

**Prevention Tips:**
• Sleep 7-8 hours regularly
• Don't skip meals
• Reduce screen time
• Stay hydrated (8+ glasses of water daily)
• Manage stress with deep breathing

**⚠️ See Doctor URGENTLY If:**
• Worst headache of your life (sudden, severe)
• Headache + stiff neck + high fever (meningitis risk)
• Headache with vision changes, confusion, or weakness
• Headache after a head injury
• Recurring headaches for weeks

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "cold_cough",
    name: "Cold, Cough & Sore Throat",
    triggers: [
      "cold", "cough", "coughing", "sore throat", "throat",
      "runny nose", "nose", "sneezing", "sneeze", "congestion",
      "blocked nose", "phlegm", "mucus", "flu", "nasal",
      "tonsil", "tonsils", "hoarse", "voice",
    ],
    hindiTriggers: [
      "khansi", "zukam", "gala", "gale mein", "naak",
      "naak bahna", "chhink", "balgam", "gala kharab",
      "thand lag", "gala dard",
    ],
    triageLevel: "green",
    confidence: 0.87,
    requiresEmergency: false,
    symptoms: ["Cough", "Cold", "Sore Throat"],
    response: `🟢 **Self-Care — Cold & Cough Treatment**

Very common, especially with weather changes. Usually resolves in 5-7 days.

**Home Treatment:**
• 🧂 **Warm salt water gargle** — 3-4 times daily for sore throat
• ☕ Drink warm fluids — ginger tea with honey, haldi doodh (turmeric milk)
• 🫁 **Steam inhalation** — add eucalyptus oil/Vicks to hot water, inhale for 10 min
• 💊 Paracetamol for mild body ache or low-grade fever
• 🍯 Honey + ginger juice — 1 tsp 3 times daily (soothing for cough)
• 🫚 **Kadha** — Boil tulsi, ginger, black pepper, cloves, cinnamon in water. Drink warm.

**Dietary Tips:**
• Warm soups, khichdi, and light meals
• Avoid cold drinks, ice cream, and fried food
• Vitamin C helps — eat amla, oranges, lemon

**⚠️ See a Doctor If:**
• Cough lasts more than **2 weeks** (possible TB — visit DOTS center)
• Coughing blood or thick green/yellow phlegm
• High fever (>102°F) that doesn't respond to paracetamol
• Difficulty breathing or wheezing
• Severe throat pain with difficulty swallowing

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "skin",
    name: "Skin Issues",
    triggers: [
      "skin", "rash", "itching", "itch", "itchy", "allergy",
      "allergic", "hives", "pimple", "acne", "eczema", "fungal",
      "ringworm", "scabies", "swelling", "boil", "abscess",
      "redness", "bumps", "spots", "dry skin", "dandruff",
    ],
    hindiTriggers: [
      "chamdi", "khujli", "daane", "allergy", "sujan",
      "khaarish", "daad", "phunsi", "laal", "rashes",
    ],
    triageLevel: "green",
    confidence: 0.84,
    requiresEmergency: false,
    symptoms: ["Skin Issue", "Rash/Itching"],
    response: `🟢 **Self-Care — Skin Issue Management**

Most skin issues are treatable at home unless they're spreading or severe.

**Home Treatment:**
• 🧴 Apply **Calamine lotion** for itching relief
• 💊 Take **Cetirizine 10mg** (1 tablet at night) for allergic itch/hives
• 🧼 Keep affected area clean and dry
• ❌ Do NOT scratch — it spreads infection
• 🧊 Cold compress helps reduce swelling and itching
• 👕 Wear loose, cotton clothing

**For Specific Issues:**
• **Fungal infection/Ringworm (daad):** Clotrimazole cream 2x daily for 2-3 weeks
• **Scabies (khujli):** Permethrin cream — wash all bedding and clothes in hot water
• **Prickly heat:** Prickly heat powder, stay in cool environment

**🚨 See Doctor Immediately If:**
• Rash spreading rapidly over hours
• Swelling of face, lips, or throat (anaphylaxis — emergency)
• Pus or signs of deep infection (warm, painful, growing)
• Fever along with widespread rash
• Rash after starting a new medicine

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "pain_body",
    name: "Body Pain / Joint Pain",
    triggers: [
      "pain", "body pain", "body ache", "joint", "joints",
      "knee", "back pain", "back", "shoulder", "neck pain",
      "muscle", "muscle pain", "leg pain", "leg", "weakness",
      "fatigue", "tired", "exhausted", "stiffness",
      "arthritis", "cramp", "cramps",
    ],
    hindiTriggers: [
      "dard", "badan dard", "jodo mein", "ghutna",
      "kamar", "peeth", "thakan", "kamzori",
      "tang dard", "moch", "akad",
    ],
    triageLevel: "green",
    confidence: 0.83,
    requiresEmergency: false,
    symptoms: ["Body Pain", "Joint Pain", "Fatigue"],
    response: `🟢 **Self-Care — Body/Joint Pain Management**

Body aches and joint pain are very common. Here's how to feel better:

**Immediate Relief:**
• 💊 **Paracetamol 500-650mg** for pain relief (1 tablet every 6-8 hours, max 4/day)
• 🧊 **Ice pack** for acute/new pain (first 48 hours) — 15 min on, 15 min off
• ♨️ **Warm compress** for chronic/ongoing pain — helps relax muscles
• 🛏️ Rest the affected area, avoid heavy lifting
• 💆 Gentle massage with warm oil (mustard/coconut oil + camphor)

**For Knee/Joint Pain:**
• 🚶 Keep moving — gentle walks are better than complete rest
• 🏋️ Strengthen muscles around the joint (simple exercises)
• 🧎 Avoid sitting cross-legged or on the floor if it hurts
• Maintain healthy weight to reduce joint stress

**For Back Pain:**
• Sleep on a firm mattress
• Practice good posture — don't hunch
• Hot water bottle on the lower back before sleep

**⚠️ See a Doctor If:**
• Pain persists more than 2 weeks with no improvement
• Joint is hot, red, and very swollen (could be infection)
• Pain after a fall/accident (rule out fracture)
• Numbness or tingling with the pain
• Night pain that wakes you from sleep

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "eye",
    name: "Eye Problems",
    triggers: [
      "eye", "eyes", "vision", "blurry", "redness", "red eye",
      "watering", "tears", "conjunctivitis", "pink eye",
      "eye pain", "swollen eye", "itchy eye",
    ],
    hindiTriggers: [
      "aankh", "nazar", "dhundla", "aankh laal",
      "aankh mein dard", "paani aana", "aankh suji",
    ],
    triageLevel: "green",
    confidence: 0.82,
    requiresEmergency: false,
    symptoms: ["Eye Problem"],
    response: `🟢 **Self-Care — Eye Problem**

**For Red/Irritated Eyes:**
• 🚿 Wash eyes gently with clean cool water
• ❌ Do NOT rub your eyes
• 🧊 Cold compress (clean wet cloth) over closed eyes for 10 minutes
• 😎 Wear sunglasses outdoors
• 👐 Wash hands frequently — conjunctivitis is contagious

**For Watery/Itchy Eyes (Allergy):**
• Antihistamine eye drops (available OTC)
• Keep windows closed during high pollen/dust
• Wash face and eyes when coming from outside

**⚠️ See an Eye Doctor If:**
• Sudden vision loss or blurring
• Eye pain that doesn't go away
• Seeing flashes of light or floating spots
• Eye injury (even minor — could be serious)

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "dental",
    name: "Dental / Tooth Problems",
    triggers: [
      "tooth", "teeth", "dental", "toothache", "gum", "gums",
      "cavity", "wisdom tooth", "swollen gum", "bleeding gum",
      "mouth", "mouth sore", "ulcer mouth",
    ],
    hindiTriggers: [
      "daant", "daant dard", "masuda", "masude",
      "munh", "munh mein chhale",
    ],
    triageLevel: "green",
    confidence: 0.83,
    requiresEmergency: false,
    symptoms: ["Toothache", "Dental Issue"],
    response: `🟢 **Self-Care — Dental Pain Management**

**For Toothache:**
• 🧂 **Warm salt water rinse** — 1 tsp salt in a glass of warm water, swish and spit
• 🧄 **Clove oil** — apply a drop on the painful tooth (natural analgesic)
• 💊 **Ibuprofen 400mg** (Brufen) for pain and swelling — take with food
• 🧊 Ice pack on the cheek over the painful area
• ❌ Avoid very hot, cold, or sweet foods

**For Mouth Ulcers:**
• Apply glycerine or Boroglycerine on the ulcer
• Warm salt water rinse 3-4 times daily
• Drink cool liquids, eat soft food
• Vitamin B12 deficiency can cause recurring ulcers — eat eggs, milk, paneer

**See a Dentist If:**
• Pain persists beyond 2 days
• Visible swelling in the face/jaw
• Tooth is chipped, broken, or knocked out
• Bleeding gums that won't stop

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "mental_health",
    name: "Mental Health / Anxiety / Sleep",
    triggers: [
      "anxiety", "anxious", "stress", "stressed", "depression", "depressed",
      "sad", "sleeping", "insomnia", "sleep", "cant sleep",
      "worry", "worried", "panic", "nervous", "restless",
      "lonely", "hopeless", "suicidal", "mental",
    ],
    hindiTriggers: [
      "chinta", "pareshan", "neend nahi", "udaas", "akela",
      "darr", "ghabrahat", "tension", "tanav",
    ],
    triageLevel: "yellow",
    confidence: 0.80,
    requiresEmergency: false,
    symptoms: ["Anxiety", "Stress", "Sleep Issues"],
    response: `🟡 **Important — Mental Health Support**

Your mental health is just as important as physical health. You're not alone, and help is available.

**Immediate Coping Techniques:**
• 🧘 **4-7-8 Breathing:** Breathe in for 4 seconds, hold for 7, breathe out for 8. Repeat 5 times.
• 🚶 **Walk outside** for 15-20 minutes — fresh air and sunlight help
• 📝 Write down what's bothering you — it helps organize worrying thoughts
• 🎵 Listen to calming music or nature sounds
• 👥 Talk to someone you trust — family, friend, or helpline

**For Better Sleep:**
• 📵 No screens (phone/TV) 1 hour before bed
• ☕ No tea/coffee after 4 PM
• 🫖 Drink warm milk or chamomile tea before bed
• 🕐 Go to bed and wake up at the same time daily
• 🌑 Keep your room dark and cool

**Helplines (Free & Confidential):**
• 📞 **iCall:** 9152987821
• 📞 **Vandrevala Foundation:** 9999 666 555 (24/7)
• 📞 **NIMHANS:** 080-46110007

**⚠️ If you're having thoughts of self-harm, please call any helpline immediately. You matter.**

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
  {
    id: "child_health",
    name: "Child Health / Pediatric",
    triggers: [
      "child", "baby", "infant", "toddler", "newborn",
      "my child", "my baby", "kid", "son", "daughter",
      "crying", "not eating", "rash baby", "diaper",
      "vaccination", "vaccine", "breastfeeding", "breast feeding",
    ],
    hindiTriggers: [
      "baccha", "bachhe", "chhota", "beti", "beta",
      "doodh nahi", "ro raha", "bacche ko", "teeka",
    ],
    triageLevel: "yellow",
    confidence: 0.85,
    requiresEmergency: false,
    symptoms: ["Child Health Concern"],
    response: `🟡 **Child Health — Monitor Carefully**

Children need special attention as they can deteriorate quickly.

**General Child Care:**
• 🤱 Continue breastfeeding as much as possible (under 6 months: ONLY breastmilk)
• 💧 For diarrhea: Give ORS + Zinc supplements (10-20mg daily for 10-14 days)
• 🌡️ For fever: Paracetamol drops (dose based on weight) + lukewarm sponging
• 🍌 Keep feeding — do NOT stop food during illness

**💉 Vaccination Reminders:**
Ensure your child's immunization is up to date (free at government health centers).

**🚨 Take Child to Hospital IMMEDIATELY If:**
• Unable to breastfeed or drink fluids
• Very sleepy, difficult to wake up, or unusually lethargic
• Breathing fast (>50 breaths/min for infant, >40 for child)
• Skin pinch goes back slowly (dehydration)
• High fever (>104°F) not responding to medicine
• Convulsions/seizures
• Rash with fever that doesn't blanch when pressed

**ASHA Worker:** Your local ASHA can help with immunization schedule and growth monitoring.

_This is preliminary guidance only. Please consult a certified doctor for diagnosis._`,
  },
];

// ────────────────────────────────────────────────────────
// 3. CONVERSATIONAL RESPONSES (for non-symptom messages)
// ────────────────────────────────────────────────────────

interface ConversationPattern {
  triggers: string[];
  response: string;
}

const CONVERSATIONS: ConversationPattern[] = [
  {
    triggers: ["hello", "hi", "hey", "namaste", "namaskar", "good morning", "good evening"],
    response: `Namaste! 🙏 Welcome to Sehat AI.

I'm your digital health companion. I can help you understand your symptoms and guide you on what to do next.

**How to use me:**
• Describe your symptoms in simple words (English or Hindi)
• Example: "I have fever and headache since 2 days"
• Example: "mujhe pet mein dard ho raha hai"


I'll analyze your symptoms and tell you:
- Whether you need emergency care 🔴
- Whether you should see a doctor soon 🟡
- Or if you can manage at home 🟢

**What are you feeling today?**`,
  },
  {
    triggers: ["thank", "thanks", "shukriya", "dhanyavad", "dhanyawaad"],
    response: `You're welcome! 😊 I'm glad I could help.

**Remember:**
• If symptoms worsen, please visit your nearest health center immediately
• Keep taking medications as prescribed
• Stay hydrated and get adequate rest
• For emergencies, always call **108**

Take care of yourself! 🌿 Feel free to come back anytime you need health guidance.`,
  },
  {
    triggers: ["who are you", "what are you", "what can you do", "help", "kya kar sakte"],
    response: `I'm **Sehat AI** — your digital health assistant powered by Sehat Sathi platform.

**What I Can Do:**
🩺 Analyze your symptoms and suggest whether you need emergency care, a doctor visit, or home treatment
🌐 Understand symptoms in English and Hindi
📋 Give practical first-aid and home care advice
📞 Provide emergency helpline numbers
🏥 Guide you to the right type of specialist

**What I Cannot Do:**
❌ I cannot diagnose diseases — only a real doctor can do that
❌ I cannot prescribe prescription medicines
❌ I am NOT a replacement for professional medical advice

**Try telling me your symptoms!** For example:
• "I have a bad headache since morning"
• "My child has fever and is not eating"
• "mujhe khasi ho rahi hai aur gale mein dard hai"`,
  },
  {
    triggers: ["ok", "okay", "hmm", "achha", "theek", "alright", "fine"],
    response: `Is there anything else you'd like to know about your health? I'm here to help.

You can tell me:
• Any new symptoms you're experiencing
• Ask about a specific health condition
• Get emergency contact numbers
• Learn about home remedies

Just type your concern and I'll guide you! 🩺`,
  },
  {
    triggers: ["bye", "goodbye", "alvida", "bye bye"],
    response: `Take care! 🌿 Remember:
• Keep drinking water 💧
• Take your medicines on time 💊
• If symptoms get worse, visit your nearest PHC 🏥
• For emergencies: **108** 🚑

Wishing you good health. Come back anytime! 🙏`,
  },
];

// ────────────────────────────────────────────────────────
// 4. MATCHING ENGINE — Scores all categories
// ────────────────────────────────────────────────────────

interface MatchResult {
  category: SymptomCategory | null;
  conversation: ConversationPattern | null;
  score: number;
}

function findBestMatch(userMessage: string): MatchResult {
  const lower = userMessage.toLowerCase().trim();
  const words = tokenize(userMessage);

  // 1. Score every symptom category FIRST — symptoms take priority
  let bestCat: SymptomCategory | null = null;
  let bestScore = 0;

  for (const cat of CATEGORIES) {
    const englishScore = textContainsAny(userMessage, cat.triggers);
    const hindiScore = textContainsAny(userMessage, cat.hindiTriggers);
    const totalScore = englishScore + hindiScore;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestCat = cat;
    }
  }

  // If we found a symptom match (even weak), use it
  if (bestScore >= 1 && bestCat) {
    return { category: bestCat, conversation: null, score: bestScore };
  }

  // 2. Only check conversational patterns if NO symptoms matched
  //    Use WORD-BOUNDARY matching to avoid "hi" matching "high"
  for (const conv of CONVERSATIONS) {
    const isMatch = conv.triggers.some(trigger => {
      // Build a regex with word boundaries so "hi" doesn't match "high"
      const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\s|[^a-z])${escaped}(?:$|\\s|[^a-z])`, 'i');
      return regex.test(` ${lower} `); // pad with spaces for boundary matching
    });
    if (isMatch) {
      return { category: null, conversation: conv, score: 50 };
    }
  }

  // 3. No match — use probing fallback
  return { category: null, conversation: null, score: 0 };
}

// ────────────────────────────────────────────────────────
// 5. PROBING FALLBACK — Asks follow-up questions
// ────────────────────────────────────────────────────────

function getProbingResponse(userMessage: string): string {
  // Try to identify SOME context from the message
  const lower = userMessage.toLowerCase();
  
  if (lower.length < 10) {
    return `I'd like to help you. Could you describe your symptoms in more detail?

**Try something like:**
• "I have fever and headache since 2 days"
• "My stomach hurts and I feel nauseous"
• "I fell down and my knee is swollen"
• "mujhe bahut thakan aur kamzori lag rahi hai"

The more detail you share, the better I can guide you! 🩺`;
  }

  // Check for some vague health words
  const vagueHealthWords = ["sick", "unwell", "not well", "not feeling", "feel bad", "problem", "issue", "bimar", "tabiyet", "tabiyat"];
  if (vagueHealthWords.some(w => lower.includes(w))) {
    return `I understand you're not feeling well. Let me help you — I need a bit more detail.

**Can you tell me:**
1. **Where** does it hurt? (head, chest, stomach, throat, joints, etc.)
2. **How long** have you been feeling this way?
3. **How severe** is it on a scale of 1-10?
4. **Other symptoms?** (fever, nausea, weakness, cough, etc.)

For example: "I have a bad headache and fever since yesterday, about 7/10 severity"

This helps me give you the right guidance! 🩺`;
  }

  return `Thank you for reaching out. I want to make sure I give you the right advice.

**Could you describe your symptoms more specifically?**

Here are some things that help me:
• **What symptoms** do you have? (pain, fever, cough, rash, etc.)
• **Where** in your body? (head, chest, stomach, back, legs, etc.)
• **How long** have you had them?
• **How bad** is it? (mild, moderate, severe)

**Some examples:**
• "I have a sore throat and runny nose since 3 days"
• "Sharp stomach pain with vomiting since morning"
• "My child has high fever and rash"
• "mujhe kamar mein bahut dard ho raha hai"

I'm here to help — just tell me what's going on! 🩺

_For emergencies, call **108** immediately._`;
}

// ────────────────────────────────────────────────────────
// 6. API ROUTE HANDLER — Streaming Response
// ────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { message, language, conversationHistory = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Find the best match
    const match = findBestMatch(message);
    
    let responseText: string;
    let triageData: any = null;

    if (match.conversation) {
      // It's a conversational message (greeting, thanks, etc.)
      responseText = match.conversation.response;
    } else if (match.category) {
      // It's a symptom match
      const cat = match.category;
      responseText = cat.response;
      triageData = {
        triageLevel: cat.triageLevel,
        symptoms: cat.symptoms,
        confidence: cat.confidence,
        requiresEmergency: cat.requiresEmergency,
      };
    } else {
      // No match — use probing fallback
      responseText = getProbingResponse(message);
    }

    // Stream the response word-by-word
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const words = responseText.split(" ");

        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? " " : "");
          controller.enqueue(encoder.encode(chunk));
          // Variable delay for natural feel
          const delay = words[i].startsWith("**") ? 35 : words[i].length > 8 ? 25 : 15;
          await new Promise((r) => setTimeout(r, delay));
        }

        // Append triage data if symptoms were matched
        if (triageData) {
          controller.enqueue(
            encoder.encode(`\n__TRIAGE_DATA__${JSON.stringify(triageData)}`)
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Symptom API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
