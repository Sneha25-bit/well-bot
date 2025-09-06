export interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  messageType: 'text' | 'quick_action' | 'suggestion';
  metadata?: {
    quickActions?: QuickAction[];
    suggestions?: string[];
  };
  createdAt: string;
}

export interface ChatSession {
  _id: string;
  userId: string;
  title: string;
  messages: Message[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuickAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
}

export interface CreateChatSessionRequest {
  title?: string;
}

export interface AddMessageRequest {
  content: string;
  role: 'user' | 'assistant';
  messageType?: 'text' | 'quick_action' | 'suggestion';
  metadata?: {
    quickActions?: QuickAction[];
    suggestions?: string[];
  };
}
