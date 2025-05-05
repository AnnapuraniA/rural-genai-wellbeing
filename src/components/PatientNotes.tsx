import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { HealthSakhi, Customer } from '@/lib/database';

interface PatientNotesProps {
  healthSakhi: HealthSakhi;
  customers: Customer[];
  language: 'english' | 'tamil';
}

interface Note {
  id: string;
  customerId: string;
  type: 'observation' | 'followup' | 'test_result';
  content: string;
  timestamp: Date;
}

const PatientNotes: React.FC<PatientNotesProps> = ({
  healthSakhi,
  customers,
  language
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [noteType, setNoteType] = useState<'observation' | 'followup' | 'test_result'>('observation');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCustomer) return;

    const note: Note = {
      id: Date.now().toString(),
      customerId: selectedCustomer,
      type: noteType,
      content: newNote,
      timestamp: new Date()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const getNoteTypeLabel = (type: Note['type']) => {
    const labels = {
      observation: {
        english: 'Observation',
        tamil: 'கவனிப்பு'
      },
      followup: {
        english: 'Follow-up',
        tamil: 'தொடர்தல்'
      },
      test_result: {
        english: 'Test Result',
        tamil: 'சோதனை முடிவு'
      }
    };
    return labels[type][language];
  };

  const getCustomerNotes = (customerId: string) => {
    return notes.filter(note => note.customerId === customerId);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'english' ? 'Select Patient' : 'நோயாளியைத் தேர்வு செய்க'} />
          </SelectTrigger>
          <SelectContent>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={noteType} onValueChange={(value: Note['type']) => setNoteType(value)}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'english' ? 'Select Note Type' : 'குறிப்பு வகையைத் தேர்வு செய்க'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="observation">
              {language === 'english' ? 'Observation' : 'கவனிப்பு'}
            </SelectItem>
            <SelectItem value="followup">
              {language === 'english' ? 'Follow-up' : 'தொடர்தல்'}
            </SelectItem>
            <SelectItem value="test_result">
              {language === 'english' ? 'Test Result' : 'சோதனை முடிவு'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {selectedCustomer ? (
                getCustomerNotes(selectedCustomer).map(note => (
                  <div key={note.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">
                        {getNoteTypeLabel(note.type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {note.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {language === 'english' 
                    ? 'Select a patient to view their notes' 
                    : 'நோயாளியின் குறிப்புகளைக் காண ஒரு நோயாளியைத் தேர்வு செய்க'}
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={language === 'english' 
            ? 'Add a new note...' 
            : 'புதிய குறிப்பைச் சேர்க்கவும்...'}
          onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
        />
        <Button 
          onClick={handleAddNote}
          disabled={!selectedCustomer || !newNote.trim()}
        >
          {language === 'english' ? 'Add Note' : 'குறிப்பைச் சேர்க்க'}
        </Button>
      </div>
    </div>
  );
};

export default PatientNotes; 