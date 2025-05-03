
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { chatWithAIAssistant, translateText } from '@/lib/aiServices';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  language: 'tamil' | 'english';
  className?: string;
}

const AIChat: React.FC<AIChatProps> = ({ language, className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Add initial welcome message
  useEffect(() => {
    const welcomeMessage = language === 'english'
      ? "Hello! I'm your health assistant. How can I help you today?"
      : "வணக்கம்! நான் உங்கள் ஆரோக்கிய உதவியாளர். நான் உங்களுக்கு எப்படி உதவ முடியும்?";
    
    setMessages([
      {
        id: 'welcome',
        content: welcomeMessage,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, [language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Convert messages to format expected by AI service
      const chatMessages = [
        {
          role: 'system',
          content: language === 'english' 
            ? 'You are a helpful health assistant providing accurate information.' 
            : 'நீங்கள் துல்லியமான தகவல்களை வழங்கும் ஒரு பயனுள்ள ஆரோக்கிய உதவியாளர்.'
        },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: input
        }
      ];
      
      const response = await chatWithAIAssistant(
        chatMessages as { role: 'user' | 'assistant' | 'system'; content: string }[],
        language
      );
      
      // Add AI response
      const aiMessage: Message = {
        id: response.id,
        content: response.message.content,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: language === 'english' 
          ? 'Failed to get response. Please try again.' 
          : 'பதில் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslateMessage = async (messageId: string) => {
    const messageToTranslate = messages.find(msg => msg.id === messageId);
    if (!messageToTranslate) return;
    
    try {
      const targetLanguage = language === 'english' ? 'tamil' : 'english';
      const translated = await translateText(messageToTranslate.content, targetLanguage);
      
      toast({
        title: language === 'english' ? 'Translation' : 'மொழிபெயர்ப்பு',
        description: translated,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Error',
        description: language === 'english' 
          ? 'Translation failed. Please try again.' 
          : 'மொழிபெயர்ப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className={`flex flex-col h-full overflow-hidden p-0 ${className}`}>
      <div className="bg-wellnet-green text-white p-3">
        <h3 className="font-semibold">
          {language === 'english' ? 'Health Assistant' : 'ஆரோக்கிய உதவியாளர்'}
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-wellnet-green text-white'
                  : 'bg-muted'
              }`}
            >
              <p>{message.content}</p>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.sender === 'ai' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 py-0"
                    onClick={() => handleTranslateMessage(message.id)}
                  >
                    {language === 'english' ? 'Translate' : 'மொழிபெயர்'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'english' ? 'Type your message...' : 'உங்கள் செய்தியை உள்ளிடுங்கள்...'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
            className="bg-wellnet-green hover:bg-wellnet-green/90"
          >
            {isLoading ? (
              language === 'english' ? 'Sending...' : 'அனுப்புகிறது...'
            ) : (
              language === 'english' ? 'Send' : 'அனுப்பு'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
