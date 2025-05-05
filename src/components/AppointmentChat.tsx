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
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AppointmentChat: React.FC<AppointmentChatProps> = ({
  healthSakhi,
  customers,
  language
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'doctor' | 'lab'>('doctor');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    const response = await simulateAIResponse(input, appointmentType, language);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const simulateAIResponse = async (
    input: string,
    type: 'doctor' | 'lab',
    language: 'english' | 'tamil'
  ): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses = {
      doctor: {
        english: [
          "I've checked the doctor's availability. They are available on Monday at 2 PM. Would you like to schedule this appointment?",
          "The doctor is fully booked for tomorrow. The next available slot is on Wednesday at 10 AM.",
          "I've scheduled your appointment with Dr. Kumar for Friday at 3 PM. You'll receive a confirmation message shortly."
        ],
        tamil: [
          "மருத்துவர் கிடைக்கும் நேரத்தை சரிபார்த்தேன். திங்கட்கிழமை மதியம் 2 மணிக்கு கிடைக்கிறார்கள். இந்த நேரத்தை பதிவு செய்ய விரும்புகிறீர்களா?",
          "நாளை மருத்துவர் முழுவதும் பதிவு செய்யப்பட்டுள்ளது. அடுத்த கிடைக்கும் நேரம் புதன்கிழமை காலை 10 மணி.",
          "உங்கள் நேரம் பதிவு செய்யப்பட்டுள்ளது. வெள்ளிக்கிழமை மாலை 3 மணிக்கு டாக்டர் குமாரை சந்திக்கலாம். உறுதிப்படுத்தும் செய்தி விரைவில் கிடைக்கும்."
        ]
      },
      lab: {
        english: [
          "The lab is available for blood tests tomorrow between 9 AM and 12 PM. Would you like to schedule this?",
          "The lab is currently processing a high volume of tests. The next available slot is on Thursday at 11 AM.",
          "I've scheduled your lab test for Tuesday at 10 AM. Please bring your health card and any previous test results."
        ],
        tamil: [
          "நாளை காலை 9 மணி முதல் மதியம் 12 மணி வரை ஆய்வகம் கிடைக்கிறது. இந்த நேரத்தை பதிவு செய்ய விரும்புகிறீர்களா?",
          "தற்போது ஆய்வகத்தில் அதிக அளவு சோதனைகள் நடைபெற்று வருகின்றன. அடுத்த கிடைக்கும் நேரம் வியாழக்கிழமை காலை 11 மணி.",
          "உங்கள் ஆய்வக சோதனை செவ்வாய்க்கிழமை காலை 10 மணிக்கு பதிவு செய்யப்பட்டுள்ளது. உங்கள் சுகாதார அட்டை மற்றும் முந்தைய சோதனை முடிவுகளை கொண்டு வாருங்கள்."
        ]
      }
    };

    const typeResponses = responses[type][language];
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'english' ? 'Select Customer' : 'வாடிக்கையாளரை தேர்வு செய்க'} />
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
            <SelectValue placeholder={language === 'english' ? 'Select Type' : 'வகையை தேர்வு செய்க'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">
              {language === 'english' ? 'Doctor' : 'மருத்துவர்'}
            </SelectItem>
            <SelectItem value="lab">
              {language === 'english' ? 'Lab' : 'ஆய்வகம்'}
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
                    <p className="text-sm">{message.content}</p>
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
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === 'english' ? 'Type your message...' : 'உங்கள் செய்தியை உள்ளிடவும்...'}
          className="flex-1"
        />
        <Button onClick={handleSend}>
          {language === 'english' ? 'Send' : 'அனுப்பு'}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentChat; 