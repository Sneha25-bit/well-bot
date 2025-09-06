import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  messageType?: 'text' | 'symptom' | 'emergency' | 'medication' | 'period';
  metadata?: {
    symptoms?: string[];
    severity?: 'low' | 'medium' | 'high';
    suggestedActions?: string[];
    medicationSuggestions?: string[];
    generatedBy?: string;
    sessionType?: string;
    [key: string]: any; // Allow additional properties
  };
}

export interface IChatSession extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  sessionType: 'general' | 'symptom_check' | 'emergency' | 'medication' | 'period_tracking';
  status: 'active' | 'completed' | 'archived';
  summary?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  messageType: {
    type: String,
    enum: ['text', 'symptom', 'emergency', 'medication', 'period'],
    default: 'text'
  },
  metadata: {
    symptoms: [String],
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    suggestedActions: [String],
    medicationSuggestions: [String]
  }
});

const ChatSessionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  messages: [MessageSchema],
  sessionType: {
    type: String,
    enum: ['general', 'symptom_check', 'emergency', 'medication', 'period_tracking'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  summary: {
    type: String,
    maxlength: [500, 'Summary cannot be more than 500 characters']
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
ChatSessionSchema.index({ userId: 1, createdAt: -1 });
ChatSessionSchema.index({ status: 1 });
ChatSessionSchema.index({ sessionType: 1 });
ChatSessionSchema.index({ tags: 1 });

export default mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
