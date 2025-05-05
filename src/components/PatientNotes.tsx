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
  content: string;
  timestamp: Date;
  type: 'observation' | 'followup' | 'test_result';
}

const PatientNotes: React.FC<PatientNotesProps> = ({
  healthSakhi,
  customers,
  language
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'observation' | 'followup' | 'test_result'>('observation');

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCustomer) return;

    const note: Note = {
      id: Date.now().toString(),
      customerId: selectedCustomer,
      content: newNote,
      timestamp: new Date(),
      type: noteType
    };

    setNotes(prev => [...prev, note]);
    setNewNote('');
  };

  const getNoteTypeLabel = (type: Note['type']) => {
    if (language === 'english') {
      switch (type) {
        case 'observation': return 'Observation';
        case 'followup': return 'Follow-up';
        case 'test_result': return 'Test Result';
      }
    } else {
      switch (type) {
        case 'observation': return 'கவனிப்பு';
        case 'followup': return 'தொடர்தல்';
        case 'test_result': return 'சோதனை முடிவு';
      }
    }
  };

  const getCustomerNotes = (customerId: string) => {
    return notes.filter(note => note.customerId === customerId);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'english' ? 'Select Patient' : 'நோயாளியை தேர்வு செய்க'} />
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
            <SelectValue placeholder={language === 'english' ? 'Note Type' : 'குறிப்பு வகை'} />
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

      {selectedCustomer && (
        <>
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {getCustomerNotes(selectedCustomer).map(note => (
                    <div key={note.id} className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">
                          {getNoteTypeLabel(note.type)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {note.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={language === 'english' ? 'Add a new note...' : 'புதிய குறிப்பை சேர்க்க...'}
              className="flex-1"
            />
            <Button onClick={handleAddNote}>
              {language === 'english' ? 'Add Note' : 'குறிப்பை சேர்க்க'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientNotes; 