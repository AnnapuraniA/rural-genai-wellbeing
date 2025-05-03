
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getRecommendedVideos } from '@/lib/aiServices';
import { useToast } from '@/components/ui/use-toast';

interface Video {
  title: string;
  url: string;
  thumbnailUrl: string;
  description: string;
}

interface EducationalVideosProps {
  language: 'tamil' | 'english';
}

const EducationalVideos: React.FC<EducationalVideosProps> = ({ language }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial videos
    loadVideos();
  }, [language]);

  const loadVideos = async (query?: string) => {
    setIsLoading(true);
    try {
      const results = await getRecommendedVideos(query || '', language);
      setVideos(results);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        title: 'Error',
        description: language === 'english' 
          ? 'Failed to load videos. Please try again.' 
          : 'வீடியோக்களை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadVideos(searchQuery);
  };

  const handleShare = (video: Video) => {
    // In a real app, this would use the Web Share API or create a shareable WhatsApp link
    const whatsappText = encodeURIComponent(`${video.title}: ${video.url}`);
    const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: language === 'english' ? 'Share via WhatsApp' : 'வாட்ஸ்அப் மூலம் பகிரவும்',
      description: language === 'english' ? 'Opening WhatsApp share' : 'வாட்ஸ்அப் பகிர்வு திறக்கிறது',
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'english' ? 'Search for health topics...' : 'ஆரோக்கிய தலைப்புகளைத் தேடுங்கள்...'}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-wellnet-green hover:bg-wellnet-green/90"
        >
          {language === 'english' ? 'Search' : 'தேடு'}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-pulse-slow">
              {language === 'english' ? 'Loading videos...' : 'வீடியோக்கள் ஏற்றப்படுகின்றன...'}
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="col-span-full text-center py-8">
            {language === 'english' 
              ? 'No videos found. Try a different search term.' 
              : 'வீடியோக்கள் எதுவும் கிடைக்கவில்லை. வேறு தேடல் சொல்லை முயற்சிக்கவும்.'}
          </div>
        ) : (
          videos.map((video, index) => (
            <Card key={index} className="overflow-hidden flex flex-col">
              <CardHeader className="p-0">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-40 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4 flex-1">
                <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{video.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  {language === 'english' ? 'Watch' : 'பார்'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShare(video)}
                >
                  {language === 'english' ? 'Share' : 'பகிர்'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EducationalVideos;
