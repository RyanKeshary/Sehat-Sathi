import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialties: [{
    type: String,
    required: true,
  }],
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
  }],
  languages: [String],
  consultationFee: {
    type: Number,
    default: 0,
  },
  availableSlots: [{
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: String, // HH:mm
    endTime: String,   // HH:mm
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  experienceYears: Number,
  clinicAddress: String,
}, {
  timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
