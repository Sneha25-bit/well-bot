import express from 'express';
import {
  getChatSessions,
  getChatSession,
  createChatSession,
  addMessage,
  updateChatSession,
  deleteChatSession,
  getChatAnalytics
} from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import {
  validateChatMessage,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/sessions', getChatSessions);
router.get('/sessions/:id', getChatSession);
router.post('/sessions', createChatSession);
router.post('/sessions/:id/messages', validateChatMessage, handleValidationErrors, addMessage);
router.put('/sessions/:id', updateChatSession);
router.delete('/sessions/:id', deleteChatSession);
router.get('/analytics', getChatAnalytics);

export default router;
