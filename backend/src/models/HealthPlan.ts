import mongoose, { Document, Schema } from 'mongoose';

export interface ITask {
  id: string;
  task: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  timeOfDay: 'morning' | 'afternoon' | 'night';
  category: 'medication' | 'exercise' | 'diet' | 'rest' | 'monitoring' | 'other';
  estimatedDuration?: number; // in minutes
  completedAt?: Date;
  notes?: string;
}

export interface IHealthPlan extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  planType: 'recovery' | 'maintenance' | 'prevention' | 'emergency';
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  tasks: ITask[];
  symptoms: string[];
  aiGenerated: boolean;
  progress: {
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: true,
    maxlength: [200, 'Task cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
    required: true
  },
  category: {
    type: String,
    enum: ['medication', 'exercise', 'diet', 'rest', 'monitoring', 'other'],
    required: true
  },
  estimatedDuration: {
    type: Number,
    min: [1, 'Duration cannot be less than 1 minute']
  },
  completedAt: Date,
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot be more than 300 characters']
  }
});

const HealthPlanSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Plan title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  planType: {
    type: String,
    enum: ['recovery', 'maintenance', 'prevention', 'emergency'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration cannot be less than 1 day'],
    max: [365, 'Duration cannot be more than 365 days']
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  tasks: [TaskSchema],
  symptoms: [{
    type: String,
    trim: true
  }],
  aiGenerated: {
    type: Boolean,
    default: false
  },
  progress: {
    totalTasks: {
      type: Number,
      default: 0
    },
    completedTasks: {
      type: Number,
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
HealthPlanSchema.index({ userId: 1, status: 1 });
HealthPlanSchema.index({ userId: 1, startDate: -1 });
HealthPlanSchema.index({ planType: 1 });

// Calculate progress before saving
HealthPlanSchema.pre('save', function(next) {
  (this.progress as any).totalTasks = (this.tasks as any).length;
  (this.progress as any).completedTasks = (this.tasks as any).filter((task: any) => task.completed).length;
  (this.progress as any).completionPercentage = (this.progress as any).totalTasks > 0
    ? Math.round(((this.progress as any).completedTasks / (this.progress as any).totalTasks) * 100)
    : 0;
  next();
});

export default mongoose.model<IHealthPlan>('HealthPlan', HealthPlanSchema);
