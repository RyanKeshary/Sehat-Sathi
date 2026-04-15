import mongoose from 'mongoose';

const emergencyRequestSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  requesterName: String,
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [lng, lat]
    address: String,
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'on-site', 'resolved', 'cancelled'],
    default: 'pending',
  },
  urgencyLevel: {
    type: String,
    enum: ['critical', 'serious', 'stable'],
    default: 'serious',
  },
  assignedAmbulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // role: ambulanceOp
  },
  resolvedAt: Date,
  notes: String,
}, {
  timestamps: true,
});

emergencyRequestSchema.index({ location: '2dsphere' });

const EmergencyRequest = mongoose.model('EmergencyRequest', emergencyRequestSchema);
export default EmergencyRequest;
