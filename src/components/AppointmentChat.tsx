import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { HealthSakhi, Customer } from '@/lib/database';

interface AppointmentChatProps {
  healthSakhi: HealthSakhi;
  customers: Customer[];
  language: 'english' | 'tamil';
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AppointmentChat: React.FC<AppointmentChatProps> = ({
  healthSakhi,
  customers,
  language
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'doctor' | 'lab'>('doctor');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateAIResponse = (message: string): string => {
    // This is a simple response generator. In a real app, this would call an AI API
    const responses = {
      english: {
        greeting: "Hello! I can help you schedule an appointment. Please select a customer and appointment type.",
        doctor: "I'll help you schedule a doctor's appointment. What date and time would you prefer?",
        lab: "I'll help you schedule a lab test. What type of test does the patient need?",
        default: "I understand. How can I help you further?"
      },
      tamil: {
        greeting: "வணக்கம்! நான் நேரம் பதிவு செய்ய உதவுகிறேன். தயவுசெய்து ஒரு வாடிக்கையாளரையும் நேரம் வகையையும் தேர்வு செய்யவும்.",
        doctor: "நான் மருத்துவர் நேரம் பதிவு செய்ய உதவுகிறேன். எந்த தேதி மற்றும் நேரத்தை விரும்புகிறீர்கள்?",
        lab: "நான் ஆய்வக சோதனைக்கான நேரம் பதிவு செய்ய உதவுகிறேன். நோயாளிக்கு என்ன வகையான சோதனை தேவை?",
        default: "புரிந்துகொண்டேன். மேலும் எப்படி உதவ முடியும்?"
      }
    };

    const lang = language === 'english' ? 'english' : 'tamil';
    
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      return responses[lang].greeting;
    } else if (message.toLowerCase().includes('doctor')) {
      return responses[lang].doctor;
    } else if (message.toLowerCase().includes('lab')) {
      return responses[lang].lab;
    }
    
    return responses[lang].default;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'english' ? 'Select Customer' : 'வாடிக்கையாளரைத் தேர்வு செய்க'} />
          </SelectTrigger>
          <SelectContent>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={appointmentType} onValueChange={(value: 'doctor' | 'lab') => setAppointmentType(value)}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'english' ? 'Select Type' : 'வகையைத் தேர்வு செய்க'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">
              {language === 'english' ? 'Doctor Appointment' : 'மருத்துவர் நேரம்'}
            </SelectItem>
            <SelectItem value="lab">
              {language === 'english' ? 'Lab Test' : 'ஆய்வக சோதனை'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={language === 'english' ? 'Type your message...' : 'உங்கள் செய்தியை உள்ளிடவும்...'}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>
          {language === 'english' ? 'Send' : 'அனுப்பு'}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentChat; 