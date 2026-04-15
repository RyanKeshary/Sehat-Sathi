import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
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
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g., '500mg'
    frequency: { type: String, required: true }, // e.g., 'twice a day'
    timing: { type: String, enum: ['before-food', 'after-food', 'anytime'], default: 'after-food' },
    duration: { type: String, required: true }, // e.g., '5 days'
    instructions: String,
  }],
  diagnosis: String,
  advice: String,
  isDispensed: {
    type: Boolean,
    default: false,
  },
  digitalSignature: String,
  qrCode: String,
}, {
  timestamps: true,
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
