/**
 * AI Symptom Analysis Service
 * Provides logic-based triage for rural health contexts.
 */

// Simple Triage Logic Tree (normally would be loaded from a larger JSON)
const symptomRules = {
  chest_pain: {
    urgency: 'emergency',
    causes: ['Possible cardiac issue', 'Severe respiratory distress'],
    advice: ['Do not exert yourself', 'Seek immediate medical attention', 'Call SOS'],
    specialty: 'Cardiologist',
  },
  high_fever: {
    urgency: 'high',
    causes: ['Infection', 'Malaria', 'Dengue'],
    advice: ['Stay hydrated', 'Use cold compress', 'Monitor temperature every 4 hours'],
    specialty: 'General Physician',
  },
  maternal_bleeding: {
    urgency: 'emergency',
    causes: ['Pregnancy complication'],
    advice: ['Lie down immediately', 'Call for emergency transport', 'Emergency checkup'],
    specialty: 'Gynecologist',
  },
  diarrhea_child: {
    urgency: 'high',
    causes: ['Dehydration', 'Gastrointestinal infection'],
    advice: ['Administer ORS immediately', 'Do not stop breastfeeding', 'Consult pediatrician'],
    specialty: 'Pediatrician',
  },
  general_cough: {
    urgency: 'low',
    causes: ['Common cold', 'Mild allergy'],
    advice: ['Rest', 'Warm fluids', 'Steam inhalation'],
    specialty: 'General Physician',
  }
};

/**
 * Analyze symptoms and return triage results
 * @param {Object} data - { symptoms: string[], patientInfo: Object, language: string }
 */
export const analyzeSymptoms = async (data) => {
  const { symptoms, patientInfo, language } = data;
  
  let topResult = {
    urgencyLevel: 'medium',
    possibleCauses: ['Needs clinical evaluation'],
    nextSteps: ['Book a general consultation'],
    recommendedSpecialty: 'General Physician',
    emergencyWarning: false,
    homeCareTips: ['Monitor symptoms for next 24 hours']
  };

  // Check for critical symptom matches
  for (const symptom of symptoms) {
    const key = symptom.toLowerCase().replace(/ /g, '_');
    if (symptomRules[key]) {
      const rule = symptomRules[key];
      
      // Upgrade urgency if critical match found
      if (rule.urgency === 'emergency' || (topResult.urgencyLevel !== 'emergency' && rule.urgency === 'high')) {
        topResult = {
          urgencyLevel: rule.urgency,
          possibleCauses: rule.causes,
          nextSteps: rule.advice,
          recommendedSpecialty: rule.specialty,
          emergencyWarning: rule.urgency === 'emergency',
          homeCareTips: rule.advice
        };
      }
    }
  }

  // TODO: Add AI/LLM hook here if needed for more complex natural language parsing
  
  return topResult;
};
