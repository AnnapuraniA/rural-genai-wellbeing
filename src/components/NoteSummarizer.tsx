import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeNotes } from '@/lib/aiServices';
import { useToast } from '@/components/ui/use-toast';

interface NoteSummarizerProps {
  language: 'english' | 'tamil';
}

const NoteSummarizer: React.FC<NoteSummarizerProps> = ({ language }) => {
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!note.trim()) {
      toast({
        title: language === 'english' ? 'Empty Note' : 'காலியான குறிப்பு',
        description: language === 'english'
          ? 'Please enter some text to summarize.'
          : 'சுருக்க வேண்டிய உரையை உள்ளிடவும்.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await summarizeNotes(note, language);
      setSummary(result);
    } catch (error) {
      console.error('Error summarizing notes:', error);
      toast({
        title: 'Error',
        description: language === 'english'
          ? 'Failed to summarize the note. Please try again.'
          : 'குறிப்பை சுருக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: language === 'english' ? 'Copied!' : 'நகலெடுக்கப்பட்டது!',
      description: language === 'english'
        ? 'Summary copied to clipboard.'
        : 'சுருக்கம் கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது.',
    });
  };

  const handleClear = () => {
    setNote('');
    setSummary('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'english' ? 'Note Summarizer' : 'குறிப்பு சுருக்கி'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'english' ? 'Enter Notes' : 'குறிப்புகளை உள்ளிடவும்'}
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={language === 'english'
                  ? 'Enter your notes here...'
                  : 'உங்கள் குறிப்புகளை இங்கே உள்ளிடவும்...'}
                className="min-h-[150px]"
              />
            </div>
            
            {summary && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'english' ? 'Summary' : 'சுருக்கம்'}
                </label>
                <div className="p-3 bg-muted rounded-md">
                  <p>{summary}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="space-x-2">
            <Button 
              onClick={handleSummarize} 
              disabled={isLoading || !note.trim()}
              className="bg-wellnet-green hover:bg-wellnet-green/90"
            >
              {isLoading
                ? (language === 'english' ? 'Summarizing...' : 'சுருக்குகிறது...')
                : (language === 'english' ? 'Summarize' : 'சுருக்கு')}
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
            >
              {language === 'english' ? 'Clear' : 'அழி'}
            </Button>
          </div>
          
          {summary && (
            <Button
              variant="outline"
              onClick={handleCopy}
            >
              {language === 'english' ? 'Copy' : 'நகலெடு'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoteSummarizer;
