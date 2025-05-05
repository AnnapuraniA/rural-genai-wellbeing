import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { type HealthSakhi } from '@/lib/database';

interface InboxProps {
  healthSakhi: HealthSakhi;
  language: 'english' | 'tamil';
}

interface Message {
  id: string;
  type: 'appointment' | 'test_result' | 'notification';
  title: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

const Inbox: React.FC<InboxProps> = ({
  healthSakhi,
  language
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'appointment',
      title: language === 'english' ? 'New Appointment Request' : 'புதிய நேரம் பதிவு கோரிக்கை',
      content: language === 'english' 
        ? 'Ravi Kumar requested an appointment for tomorrow at 2 PM' 
        : 'ரவி குமார் நாளை மதியம் 2 மணிக்கு நேரம் பதிவு கோரியுள்ளார்',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false
    },
    {
      id: '2',
      type: 'test_result',
      title: language === 'english' ? 'Lab Test Results Available' : 'ஆய்வக சோதனை முடிவுகள் கிடைக்கின்றன',
      content: language === 'english'
        ? 'Blood test results for Priya are now available'
        : 'பிரியாவின் இரத்த சோதனை முடிவுகள் இப்போது கிடைக்கின்றன',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true
    },
    {
      id: '3',
      type: 'notification',
      title: language === 'english' ? 'System Update' : 'கணினி புதுப்பித்தல்',
      content: language === 'english'
        ? 'New features have been added to the dashboard'
        : 'டாஷ்போர்டில் புதிய அம்சங்கள் சேர்க்கப்பட்டுள்ளன',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: false
    }
  ]);

  const handleMessageClick = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const getUnreadCount = (type: Message['type'] | 'all') => {
    return messages.filter(msg => !msg.isRead && (type === 'all' || msg.type === type)).length;
  };

  const getFilteredMessages = (type: Message['type'] | 'all') => {
    return type === 'all'
      ? messages
      : messages.filter(msg => msg.type === type);
  };

  const getMessageTypeLabel = (type: Message['type']) => {
    const labels = {
      appointment: {
        english: 'Appointment',
        tamil: 'நேரம் பதிவு'
      },
      test_result: {
        english: 'Test Result',
        tamil: 'சோதனை முடிவு'
      },
      notification: {
        english: 'Notification',
        tamil: 'அறிவிப்பு'
      }
    };
    return labels[type][language];
  };

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all" className="relative">
          {language === 'english' ? 'All' : 'அனைத்தும்'}
          {getUnreadCount('all') > 0 && (
            <Badge variant="secondary" className="absolute -top-2 -right-2">
              {getUnreadCount('all')}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="appointment" className="relative">
          {language === 'english' ? 'Appointments' : 'நேரம் பதிவுகள்'}
          {getUnreadCount('appointment') > 0 && (
            <Badge variant="secondary" className="absolute -top-2 -right-2">
              {getUnreadCount('appointment')}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="test_result" className="relative">
          {language === 'english' ? 'Test Results' : 'சோதனை முடிவுகள்'}
          {getUnreadCount('test_result') > 0 && (
            <Badge variant="secondary" className="absolute -top-2 -right-2">
              {getUnreadCount('test_result')}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="notification" className="relative">
          {language === 'english' ? 'Notifications' : 'அறிவிப்புகள்'}
          {getUnreadCount('notification') > 0 && (
            <Badge variant="secondary" className="absolute -top-2 -right-2">
              {getUnreadCount('notification')}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      {(['all', 'appointment', 'test_result', 'notification'] as const).map(tab => (
        <TabsContent key={tab} value={tab}>
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {getFilteredMessages(tab).map(message => (
                    <div
                      key={message.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        message.isRead ? 'bg-background' : 'bg-muted/50'
                      }`}
                      onClick={() => handleMessageClick(message.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.title}</span>
                            {!message.isRead && (
                              <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {getMessageTypeLabel(message.type)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {message.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Inbox; 