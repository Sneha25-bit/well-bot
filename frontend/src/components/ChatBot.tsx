import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Stethoscope, ShieldAlert, Heart, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  messageType?: string;
  metadata?: Record<string, unknown>;
}

const ChatBot = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Debug authentication status
  useEffect(() => {
    console.log('ChatBot - User authenticated:', isAuthenticated);
    console.log('ChatBot - User:', user);
  }, [isAuthenticated, user]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Smart Health Companion. I can help you with symptom checking, health advice, and emergency guidance. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    const createSession = async () => {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping session creation');
        return;
      }
      
      try {
        console.log('Creating chat session...');
        const response = await apiService.createChatSession({
          title: 'Health Chat Session',
          sessionType: 'general'
        });
        console.log('Chat session response:', response);
        if (response.success && response.session) {
          setCurrentSessionId(response.session._id);
          console.log('Chat session created successfully:', response.session._id);
        } else {
          console.error('Failed to create chat session - invalid response:', response);
        }
      } catch (error) {
        console.error('Failed to create chat session:', error);
      }
    };

    createSession();
  }, [isAuthenticated]);

  const quickActions = [
    { text: "Check my symptoms", icon: Stethoscope },
    { text: "First aid help", icon: ShieldAlert },
    { text: "Show my health plan", icon: Heart }
  ];

  const handleSendMessage = async () => {
    console.log('handleSendMessage called with:', inputMessage);
    if (!inputMessage.trim()) {
      console.log('Message is empty, returning');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('User not authenticated, cannot send message');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Try to create session if it doesn't exist
      let sessionId = currentSessionId;
      if (!sessionId) {
        try {
          const response = await apiService.createChatSession({
            title: 'Health Chat Session',
            sessionType: 'general'
          });
          if (response.success && response.session) {
            sessionId = response.session._id;
            setCurrentSessionId(sessionId);
          }
        } catch (sessionError) {
          console.error('Failed to create chat session:', sessionError);
        }
      }

      // Save user message to backend if we have a session
      if (sessionId) {
        try {
          await apiService.addMessage(sessionId, {
            text: currentMessage,
            sender: 'user',
            messageType: 'text'
          });
        } catch (messageError) {
          console.error('Failed to save user message:', messageError);
        }
      }

      // Get AI response
      const botResponseText = getBotResponse(currentMessage);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

      // Save bot response to backend if we have a session
      if (sessionId) {
        try {
          await apiService.addMessage(sessionId, {
            text: botResponseText,
            sender: 'bot',
            messageType: 'text'
          });
        } catch (messageError) {
          console.error('Failed to save bot message:', messageError);
        }
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      // Still show the bot response even if backend fails
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(currentMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('headache') || input.includes('head')) {
      return "I understand you're experiencing a headache. Here are some general suggestions:\n\n• Stay hydrated - drink plenty of water\n• Rest in a quiet, dark room\n• Apply a cold or warm compress\n• Consider over-the-counter pain relief\n\nIf your headache is severe, sudden, or accompanied by fever, vision changes, or neck stiffness, please consult a healthcare professional immediately.";
    }
    
    if (input.includes('fever') || input.includes('temperature')) {
      return "Fever can be concerning. Here's what I recommend:\n\n• Monitor your temperature regularly\n• Stay hydrated with water and clear fluids\n• Rest and avoid strenuous activity\n• Use fever reducers as directed\n\nSeek immediate medical attention if fever exceeds 103°F (39.4°C), or if you experience difficulty breathing, chest pain, or severe symptoms.";
    }
    
    if (input.includes('first aid') || input.includes('emergency')) {
      return "I can guide you through various first aid scenarios:\n\n• Cuts and wounds\n• Burns\n• Choking\n• Fainting\n\nFor life-threatening emergencies, call emergency services immediately. Which type of first aid guidance do you need?";
    }
    
    return "Thank you for sharing that with me. While I can provide general health information, I recommend consulting with a healthcare professional for personalized medical advice. Is there anything specific you'd like to know about your symptoms or general health practices?";
  };

  const handleQuickAction = (actionText: string) => {
    setInputMessage(actionText);
    // Don't call handleSendMessage here as it will be called when user presses enter or send
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Bot className="w-8 h-8 text-primary animate-pulse-soft" />
            AI Health Assistant
          </h1>
          <p className="text-muted-foreground">
            Chat with our AI for health guidance, symptom checking, and personalized advice
          </p>
        </div>

        {/* Chat Area */}
        <Card className="medical-card h-[600px] flex flex-col">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="hero-gradient w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'chat-bubble-user'
                        : 'chat-bubble-bot'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {message.text}
                    </p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>

                  {message.sender === 'user' && (
                    <div className="wellness-gradient w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-border">
            <div className="flex gap-2 mb-4 flex-wrap">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.text)}
                    className="medical-card"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {action.text}
                  </Button>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isAuthenticated ? "Describe your symptoms or ask a health question..." : "Please log in to use the chatbot"}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 medical-card"
                disabled={!isAuthenticated}
              />
              <Button 
                onClick={handleSendMessage}
                variant="hero"
                size="icon"
                disabled={!inputMessage.trim() || isLoading || !isAuthenticated}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ChatBot;