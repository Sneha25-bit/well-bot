import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Stethoscope, ShieldAlert, Heart } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Smart Health Companion. I can help you with symptom checking, health advice, and emergency guidance. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const quickActions = [
    { text: "Check my symptoms", icon: Stethoscope },
    { text: "First aid help", icon: ShieldAlert },
    { text: "Show my health plan", icon: Heart }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
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
    handleSendMessage();
  };

  return (
    <div className="min-h-screen soft-gradient p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="hero-gradient w-12 h-12 rounded-2xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Health Assistant</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Get instant health advice and symptom guidance
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
                placeholder="Describe your symptoms or ask a health question..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 medical-card"
              />
              <Button 
                onClick={handleSendMessage}
                variant="hero"
                size="icon"
                disabled={!inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;