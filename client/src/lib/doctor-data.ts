export type TriageLevel = "GREEN" | "YELLOW" | "RED";

export type QueueItem = {
  id: string;
  patientName: string;
  appointmentTime: string;
  triageLevel: TriageLevel;
  triageCategory: string;
  symptoms: {
    original: string;
    translated: string;
  };
  waitTime: string;
  isUrgent: boolean;
};

export type DoctorStats = {
  totalConsultations: number;
  nextIn: string;
  weeklyPatients: number;
  avgRating: number;
};

export const MOCK_QUEUE: QueueItem[] = [
  {
    id: "q1",
    patientName: "Rahul K.",
    appointmentTime: "10:15 AM",
    triageLevel: "RED",
    triageCategory: "Emergency",
    symptoms: {
      original: "छाती में तेज दर्द और सांस लेने में तकलीफ हो रही है।",
      translated: "Severe chest pain and difficulty breathing."
    },
    waitTime: "2 mins",
    isUrgent: true,
  },
  {
    id: "q2",
    patientName: "Sneha M.",
    appointmentTime: "10:30 AM",
    triageLevel: "YELLOW",
    triageCategory: "Schedule Visit",
    symptoms: {
      original: "पिछले 3 दिनों से तेज बुखार और सिरदर्द है।",
      translated: "High fever and headache for segments of the last 3 days."
    },
    waitTime: "12 mins",
    isUrgent: false,
  },
  {
    id: "q3",
    patientName: "Anita B.",
    appointmentTime: "11:00 AM",
    triageLevel: "GREEN",
    triageCategory: "Self-Care",
    symptoms: {
      original: "त्वचा पर हल्की खुजली और लाल चकत्ते हैं।",
      translated: "Mild skin itching and red rashes."
    },
    waitTime: "45 mins",
    isUrgent: false,
  }
];

export const MOCK_DOCTOR_STATS: DoctorStats = {
  totalConsultations: 8,
  nextIn: "12 minutes",
  weeklyPatients: 34,
  avgRating: 4.8
};

export const MOCK_EARNINGS = [
  { id: "e1", date: "14 Apr 2026", patient: "Rahul K.", duration: "15 min", fee: "₹500", paymentStatus: "Paid", payoutStatus: "Scheduled", isRural: false },
  { id: "e2", date: "14 Apr 2026", patient: "Amit S.", duration: "20 min", fee: "₹0", paymentStatus: "Free-Rural", payoutStatus: "Community Service", isRural: true },
  { id: "e3", date: "13 Apr 2026", patient: "Priya V.", duration: "12 min", fee: "₹500", paymentStatus: "Paid", payoutStatus: "Completed", isRural: false },
];
