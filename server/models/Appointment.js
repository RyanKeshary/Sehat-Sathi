import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'audio', 'chat', 'in-person'],
    default: 'video',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
  },
  queueToken: Number,
  symptoms: [String],
  urgencyLevel: {
    type: String,
    enum: ['emergency', 'high', 'medium', 'low'],
    default: 'low',
  },
  notes: String,
  consultationSummary: String,
  followUpDate: Date,
  reasonForVisit: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  createdOffline: {
    type: Boolean,
    default: false,
  },
  syncedAt: Date,
}, {
  timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
