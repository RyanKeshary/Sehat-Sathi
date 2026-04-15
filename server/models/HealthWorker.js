import mongoose from 'mongoose';

const healthWorkerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedVillage: String,
  assignedDistrict: String,
  patientsManaged: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  }],
  vitalsCapturedToday: {
    type: Number,
    default: 0,
  },
  lastSyncAt: Date,
  skills: [String], // e.g., 'Primary care', 'Maternal care', 'Vaccination'
  emergencyReports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmergencyRequest',
  }],
}, {
  timestamps: true,
});

const HealthWorker = mongoose.model('HealthWorker', healthWorkerSchema);
export default HealthWorker;
