import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  recordType: {
    type: String,
    enum: ['consultation', 'prescription', 'labReport', 'vaccination', 'diagnosis', 'surgery', 'maternal', 'chronic'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  data: mongoose.Schema.Types.Mixed,
  attachmentUrls: [String],
  isOfflineSynced: {
    type: Boolean,
    default: true,
  },
  encryptedFields: [String],
  qrCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharedWith: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedAt: { type: Date, default: Date.now },
    revokedAt: Date,
    permissions: [String],
  }],
}, {
  timestamps: true,
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
export default HealthRecord;
