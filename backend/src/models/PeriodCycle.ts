import mongoose, { Document, Schema } from 'mongoose';

export interface IPeriodEntry {
  date: Date;
  flowIntensity: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  mood: 'happy' | 'sad' | 'anxious' | 'irritable' | 'normal';
  notes?: string;
}

export interface IPeriodCycle extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  cycleStartDate: Date;
  cycleEndDate?: Date;
  periodStartDate: Date;
  periodEndDate?: Date;
  cycleLength?: number; // in days
  periodLength?: number; // in days
  flowIntensity: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  mood: 'happy' | 'sad' | 'anxious' | 'irritable' | 'normal';
  notes?: string;
  isActive: boolean;
  predictions: {
    nextPeriodDate?: Date;
    nextOvulationDate?: Date;
    fertileWindowStart?: Date;
    fertileWindowEnd?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPeriodHistory extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  entries: IPeriodEntry[];
  averageCycleLength: number;
  averagePeriodLength: number;
  irregularCycles: boolean;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PeriodEntrySchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  flowIntensity: {
    type: String,
    enum: ['light', 'medium', 'heavy'],
    required: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'irritable', 'normal'],
    default: 'normal'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
});

const PeriodCycleSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cycleStartDate: {
    type: Date,
    required: true
  },
  cycleEndDate: {
    type: Date
  },
  periodStartDate: {
    type: Date,
    required: true
  },
  periodEndDate: {
    type: Date
  },
  cycleLength: {
    type: Number,
    min: [15, 'Cycle length cannot be less than 15 days'],
    max: [45, 'Cycle length cannot be more than 45 days']
  },
  periodLength: {
    type: Number,
    min: [1, 'Period length cannot be less than 1 day'],
    max: [10, 'Period length cannot be more than 10 days']
  },
  flowIntensity: {
    type: String,
    enum: ['light', 'medium', 'heavy'],
    default: 'medium'
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'irritable', 'normal'],
    default: 'normal'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  predictions: {
    nextPeriodDate: Date,
    nextOvulationDate: Date,
    fertileWindowStart: Date,
    fertileWindowEnd: Date
  }
}, {
  timestamps: true
});

const PeriodHistorySchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  entries: [PeriodEntrySchema],
  averageCycleLength: {
    type: Number,
    default: 28
  },
  averagePeriodLength: {
    type: Number,
    default: 5
  },
  irregularCycles: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PeriodCycleSchema.index({ userId: 1, cycleStartDate: -1 });
PeriodCycleSchema.index({ userId: 1, isActive: 1 });
PeriodHistorySchema.index({ userId: 1 });

export const PeriodCycle = mongoose.model<IPeriodCycle>('PeriodCycle', PeriodCycleSchema);
export const PeriodHistory = mongoose.model<IPeriodHistory>('PeriodHistory', PeriodHistorySchema);
