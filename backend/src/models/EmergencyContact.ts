import mongoose, { Document, Schema } from 'mongoose';

export interface IEmergencyContact extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyContactSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  relationship: {
    type: String,
    required: [true, 'Relationship is required'],
    trim: true,
    maxlength: [30, 'Relationship cannot be more than 30 characters']
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
EmergencyContactSchema.index({ userId: 1, isActive: 1 });
EmergencyContactSchema.index({ userId: 1, isPrimary: 1 });

export default mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);
