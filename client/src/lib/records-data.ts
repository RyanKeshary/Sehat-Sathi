export type RecordType = "PRESCRIPTION" | "LAB_REPORT" | "VITALS" | "VACCINATION";

export type RecordEntry = {
  id: string;
  type: RecordType;
  title: string;
  doctorName: string;
  date: Date;
  syncStatus: "SYNCED" | "OFFLINE";
  data: any; // specific data payload based on type
};

export const MOCK_RECORDS: RecordEntry[] = [
  {
    id: "rec_1",
    type: "PRESCRIPTION",
    title: "General Checkup",
    doctorName: "Dr. Priya Sharma",
    date: new Date("2025-01-15T10:30:00Z"),
    syncStatus: "SYNCED",
    data: {
      hospital: "Sehat Sathi Hub",
      abdmLinked: true,
      validDays: 30,
      medications: [
        { name: "Paracetamol 500mg", dose: "1 Tablet", freq: "SOS", duration: "3 Days", instructions: "After meals if fever > 100°F" },
        { name: "Amoxicillin 250mg", dose: "1 Capsule", freq: "BD", duration: "5 Days", instructions: "Complete full course" }
      ]
    }
  },
  {
    id: "rec_2",
    type: "LAB_REPORT",
    title: "Complete Blood Count",
    doctorName: "Apollo Diagnostics",
    date: new Date("2024-12-20T08:15:00Z"),
    syncStatus: "SYNCED",
    data: {
      reportId: "CBC-89021",
      pdfUrl: "/mock-report.pdf", // Mocked later
      highlights: [
        { parameter: "Hemoglobin", value: "11.2 g/dL", ref: "12.0-15.5", isAbnormal: true },
        { parameter: "WBC Count", value: "6,500 /cumm", ref: "4,000-11,000", isAbnormal: false },
        { parameter: "Platelets", value: "2.1 Lakhs/cumm", ref: "1.5-4.5", isAbnormal: false }
      ]
    }
  },
  {
    id: "rec_3",
    type: "VITALS",
    title: "Monthly BP Log",
    doctorName: "Self Added",
    date: new Date("2024-12-10T14:20:00Z"),
    syncStatus: "OFFLINE",
    data: {
      chartData: [
        { date: "Dec 01", sys: 120, dia: 80 },
        { date: "Dec 03", sys: 125, dia: 82 },
        { date: "Dec 05", sys: 130, dia: 85 },
        { date: "Dec 07", sys: 118, dia: 78 },
        { date: "Dec 10", sys: 122, dia: 82 },
      ]
    }
  },
  {
    id: "rec_4",
    type: "VACCINATION",
    title: "COVID Booster",
    doctorName: "District Hospital",
    date: new Date("2024-11-05T09:00:00Z"),
    syncStatus: "SYNCED",
    data: {
      vaccineName: "Covishield Dose 3",
      batchNo: "CV89021",
      nextDueDate: null
    }
  }
];
