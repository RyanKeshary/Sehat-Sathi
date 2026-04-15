import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  },
  allergies: [String],
  existingConditions: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
  address: {
    village: String,
    district: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  governmentId: {
    idType: String,
    idNumber: String,
  },
  familyMembers: [{
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    relation: String,
  }],
  consentRecords: [{
    purpose: String,
    grantedAt: { type: Date, default: Date.now },
    revokedAt: Date,
  }],
  vitals: {
    weight: Number,
    height: Number,
    lastBP: String,
    lastSugar: Number,
  }
}, {
  timestamps: true,
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
