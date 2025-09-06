import { Response } from 'express';
import ChatSession, { IMessage } from '../models/ChatSession';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { generateChatResponse } from '../utils/aiService';

// @desc    Get all chat sessions for user
// @route   GET /api/chat/sessions
// @access  Private
export const getChatSessions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { page = 1, limit = 10, status, sessionType } = req.query;

  const query: any = { userId };
  
  if (status) {
    query.status = status;
  }
  
  if (sessionType) {
    query.sessionType = sessionType;
  }

  const sessions = await ChatSession.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit))
    .select('title sessionType status createdAt updatedAt messages');

  const total = await ChatSession.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      sessions,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }
  });
});

// @desc    Get single chat session
// @route   GET /api/chat/sessions/:id
// @access  Private
export const getChatSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const session = await ChatSession.findOne({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Chat session not found'
    });
  }

  res.status(200).json({
    success: true,
    session
  });
});

// @desc    Create new chat session
// @route   POST /api/chat/sessions
// @access  Private
export const createChatSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, sessionType = 'general' } = req.body;

  const session = await ChatSession.create({
    userId: req.user!._id,
    title: title || 'New Chat Session',
    sessionType,
    messages: []
  });

  res.status(201).json({
    success: true,
    session
  });
});

// @desc    Add message to chat session
// @route   POST /api/chat/sessions/:id/messages
// @access  Private
export const addMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { text, sender, messageType = 'text', metadata } = req.body;

  const session = await ChatSession.findOne({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Chat session not found'
    });
  }

  const message: IMessage = {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    messageType,
    metadata
  };

  session.messages.push(message);
  await session.save();

  // If it's a user message, generate AI response
  if (sender === 'user') {
    try {
      const aiResponse = await generateChatResponse(text, session.sessionType, {
        userId: req.user!._id,
        sessionId: session._id,
        previousMessages: session.messages.slice(-5) // Last 5 messages for context
      });

      const botMessage: IMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
        messageType: 'text',
        metadata: {
          generatedBy: 'gemini-ai',
          sessionType: session.sessionType
        }
      };

      session.messages.push(botMessage);
      await session.save();

      return res.status(201).json({
        success: true,
        data: {
          userMessage: message,
          botMessage: botMessage
        }
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Still return the user message even if AI fails
    }
  }

  res.status(201).json({
    success: true,
    data: {
      message
    }
  });
});

// @desc    Update chat session
// @route   PUT /api/chat/sessions/:id
// @access  Private
export const updateChatSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, status, summary, tags } = req.body;

  const session = await ChatSession.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    { title, status, summary, tags },
    { new: true, runValidators: true }
  );

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Chat session not found'
    });
  }

  res.status(200).json({
    success: true,
    session
  });
});

// @desc    Delete chat session
// @route   DELETE /api/chat/sessions/:id
// @access  Private
export const deleteChatSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const session = await ChatSession.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Chat session not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Chat session deleted successfully'
  });
});

// @desc    Get chat session analytics
// @route   GET /api/chat/analytics
// @access  Private
export const getChatAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { period = '30' } = req.query; // days

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(period));

  const [
    totalSessions,
    sessionsByType,
    recentSessions,
    averageMessagesPerSession
  ] = await Promise.all([
    ChatSession.countDocuments({ userId }),
    ChatSession.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$sessionType', count: { $sum: 1 } } }
    ]),
    ChatSession.find({ userId, createdAt: { $gte: startDate } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title sessionType createdAt'),
    ChatSession.aggregate([
      { $match: { userId: userId } },
      { $project: { messageCount: { $size: '$messages' } } },
      { $group: { _id: null, avgMessages: { $avg: '$messageCount' } } }
    ])
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalSessions,
      sessionsByType,
      recentSessions,
      averageMessagesPerSession: averageMessagesPerSession[0]?.avgMessages || 0
    }
  });
});
