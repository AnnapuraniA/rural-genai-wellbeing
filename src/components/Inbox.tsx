import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { HealthSakhi } from '@/lib/database';

interface InboxProps {
  healthSakhi: HealthSakhi;
  language: 'english' | 'tamil';
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'appointment' | 'test_result' | 'notification';
  read: boolean;
}

const Inbox: React.FC<InboxProps> = ({
  healthSakhi,
  language
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Dr. Kumar',
      content: 'Your appointment with Mrs. Lakshmi has been confirmed for tomorrow at 2 PM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'appointment',
      read: false
    },
    {
      id: '2',
      sender: 'City Lab',
      content: 'Blood test results for Mr. Rajan are now available. Please check the patient portal.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'test_result',
      read: true
    },
    {
      id: '3',
      sender: 'System',
      content: 'New health guidelines for diabetes management have been published. Click to view.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'notification',
      read: false
    }
  ]);

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const getMessageTypeLabel = (type: Message['type']) => {
    if (language === 'english') {
      switch (type) {
        case 'appointment': return 'Appointment';
        case 'test_result': return 'Test Result';
        case 'notification': return 'Notification';
      }
    } else {
      switch (type) {
        case 'appointment': return 'நேரம் பதிவு';
        case 'test_result': return 'சோதனை முடிவு';
        case 'notification': return 'அறிவிப்பு';
      }
    }
  };

  const getUnreadCount = (type: Message['type']) => {
    return messages.filter(msg => msg.type === type && !msg.read).length;
  };

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
        !message.read ? 'bg-muted/30' : ''
      }`}
      onClick={() => markAsRead(message.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-medium">{message.sender}</span>
          <span className="text-sm text-muted-foreground ml-2">
            {getMessageTypeLabel(message.type)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleString()}
        </span>
      </div>
      <p className="text-sm">{message.content}</p>
    </div>
  );

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">
          {language === 'english' ? 'All' : 'அனைத்தும்'}
        </TabsTrigger>
        <TabsTrigger value="appointment">
          {language === 'english' ? 'Appointments' : 'நேரம் பதிவு'}
          {getUnreadCount('appointment') > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {getUnreadCount('appointment')}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="test_result">
          {language === 'english' ? 'Test Results' : 'சோதனை முடிவுகள்'}
          {getUnreadCount('test_result') > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {getUnreadCount('test_result')}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="notification">
          {language === 'english' ? 'Notifications' : 'அறிவிப்புகள்'}
          {getUnreadCount('notification') > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {getUnreadCount('notification')}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {messages.map(renderMessage)}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointment">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {messages
                .filter(msg => msg.type === 'appointment')
                .map(renderMessage)}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="test_result">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {messages
                .filter(msg => msg.type === 'test_result')
                .map(renderMessage)}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notification">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {messages
                .filter(msg => msg.type === 'notification')
                .map(renderMessage)}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Inbox; 