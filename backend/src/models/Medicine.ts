import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  dosage: string;
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'as_needed';
  times: string[]; // Array of time strings like ["08:00", "20:00"]
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  isAISuggested: boolean;
  instructions?: string;
  sideEffects?: string[];
  reminders: {
    enabled: boolean;
    times: string[];
    days: number[]; // 0-6 (Sunday-Saturday)
  };
  completionHistory: {
    date: Date;
    time: string;
    completed: boolean;
    notes?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    maxlength: [100, 'Medicine name cannot be more than 100 characters']
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true,
    maxlength: [50, 'Dosage cannot be more than 50 characters']
  },
  frequency: {
    type: String,
    enum: ['once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'as_needed'],
    required: true
  },
  times: [{
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
  }],
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAISuggested: {
    type: Boolean,
    default: false
  },
  instructions: {
    type: String,
    maxlength: [500, 'Instructions cannot be more than 500 characters']
  },
  sideEffects: [{
    type: String,
    trim: true
  }],
  reminders: {
    enabled: {
      type: Boolean,
      default: true
    },
    times: [String],
    days: [{
      type: Number,
      min: 0,
      max: 6
    }]
  },
  completionHistory: [{
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot be more than 200 characters']
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
MedicineSchema.index({ userId: 1, isActive: 1 });
MedicineSchema.index({ userId: 1, startDate: -1 });
MedicineSchema.index({ 'completionHistory.date': 1 });

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
