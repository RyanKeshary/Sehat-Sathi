import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  testName: {
    type: String,
    required: true,
  },
  results: [{
    parameter: String,
    value: String,
    unit: String,
    normalRange: String,
    isAbnormal: Boolean,
  }],
  status: {
    type: String,
    enum: ['pending', 'sample-collected', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // role: labTech
  },
  reportUrl: String,
  labNotes: String,
  conductedAt: Date,
}, {
  timestamps: true,
});

const LabReport = mongoose.model('LabReport', labReportSchema);
export default LabReport;
