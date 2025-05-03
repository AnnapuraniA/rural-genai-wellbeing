
// This file contains mock AI services that simulate the functionality
// In a real application, these would connect to actual AI APIs

// Simulate AI response delay
const simulateDelay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  id: string;
  message: ChatMessage;
}

// Tamil translations for common health responses
const tamilHealthResponses = {
  'fever': 'காய்ச்சல் பொதுவாக ஒரு அறிகுறியாகும், பல்வேறு தொற்றுகளால் ஏற்படலாம். நிறைய தண்ணீர் குடிக்கவும், ஓய்வெடுக்கவும்.',
  'headache': 'தலைவலி பற்றாக்குறை, மன அழுத்தம் அல்லது கண் பிரச்சனைகள் காரணமாக ஏற்படலாம். நிலைமை மோசமானால் மருத்துவரை அணுகவும்.',
  'cold': 'சளி பொதுவாக வைரஸ்களால் ஏற்படும். ஓய்வெடுத்து, நிறைய தண்ணீர் குடிக்கவும்.',
  'cough': 'இருமல் பொதுவாக தொற்று அல்லது எரிச்சலின் அறிகுறியாகும். விடாப்பிடியான இருமலுக்கு மருத்துவ ஆலோசனை பெறவும்.',
  'pregnancy': 'கர்ப்பம் முறையான மருத்துவ கவனிப்பை தேவைப்படுகிறது. அருகிலுள்ள ஆரோக்கிய சகி அல்லது மருத்துவரை தொடர்பு கொள்ளவும்.',
  'diabetes': 'நீரிழிவு நோய் சரியான மேலாண்மை மற்றும் வழக்கமான சோதனைகளை தேவைப்படுகிறது. உங்கள் மருந்து மற்றும் உணவை கட்டுப்படுத்தவும்.',
  'blood pressure': 'உயர் இரத்த அழுத்தம் வழக்கமான கண்காணிப்பு மற்றும் வாழ்க்கை முறை மாற்றங்கள் தேவைப்படுகிறது. உப்பு உட்கொள்ளும் அளவை குறைக்கவும்.',
  'vaccination': 'தடுப்பூசிகள் நோய்களில் இருந்து பாதுகாக்க உதவுகின்றன. பரிந்துரைக்கப்பட்ட அட்டவணையின்படி அனைத்து தடுப்பூசிகளையும் பெறவும்.',
  'nutrition': 'ஊட்டச்சத்து ஆரோக்கியமான உடலுக்கு முக்கியமானது. பழங்கள், காய்கறிகள் மற்றும் முழு தானியங்களை உட்கொள்ளவும்.'
};

// Function to detect language (simplified for demo)
const detectLanguage = (text: string): 'tamil' | 'english' => {
  // Basic check - if text contains Tamil Unicode range characters
  // Tamil Unicode range: \u0B80-\u0BFF
  const tamilPattern = /[\u0B80-\u0BFF]/;
  return tamilPattern.test(text) ? 'tamil' : 'english';
};

// Translate text between Tamil and English (mock implementation)
export const translateText = async (text: string, targetLanguage: 'tamil' | 'english'): Promise<string> => {
  await simulateDelay(500); // Simulate API delay
  
  const sourceLanguage = detectLanguage(text);
  
  if (sourceLanguage === targetLanguage) {
    return text; // No translation needed
  }
  
  // Basic mock translation (would use a real API in production)
  if (targetLanguage === 'tamil') {
    // English to Tamil
    for (const [key, value] of Object.entries(tamilHealthResponses)) {
      if (text.toLowerCase().includes(key)) {
        return value;
      }
    }
    return 'தமிழில் மொழிபெயர்க்கப்பட்ட உரை இங்கே தோன்றும்.'; // "Translated text will appear here in Tamil"
  } else {
    // Tamil to English
    // Simplified reverse lookup
    for (const [key, value] of Object.entries(tamilHealthResponses)) {
      if (text.includes(value.substring(0, 10))) {
        return `Information about ${key}: If you have ${key}, please consult with your Health Sakhi or doctor.`;
      }
    }
    return 'Translated text from Tamil will appear here.';
  }
};

// Chat with AI health assistant
export const chatWithAIAssistant = async (messages: ChatMessage[], language: 'tamil' | 'english' = 'english'): Promise<ChatResponse> => {
  await simulateDelay(1000); // Simulate API delay
  
  const userMessage = messages[messages.length - 1].content.toLowerCase();
  let response = '';
  
  // Basic pattern matching for health queries
  if (userMessage.includes('fever') || userMessage.includes('காய்ச்சல்')) {
    response = language === 'english' 
      ? "Fever is a common symptom that could be caused by various infections. Stay hydrated and get plenty of rest. If it persists for more than 3 days or is very high (above 103°F/39.4°C), please consult a doctor."
      : tamilHealthResponses['fever'];
  } else if (userMessage.includes('headache') || userMessage.includes('தலைவலி')) {
    response = language === 'english'
      ? "Headaches can be caused by dehydration, stress, or eye strain. Make sure you're drinking enough water and taking breaks from screens. If it's severe or persistent, please consult a doctor."
      : tamilHealthResponses['headache'];
  } else if (userMessage.includes('cold') || userMessage.includes('flu') || userMessage.includes('சளி')) {
    response = language === 'english'
      ? "Common colds are usually caused by viruses. Rest, drink plenty of fluids, and consider over-the-counter medications for symptom relief. If symptoms worsen or last longer than a week, please consult a health professional."
      : tamilHealthResponses['cold'];
  } else if (userMessage.includes('cough') || userMessage.includes('இருமல்')) {
    response = language === 'english'
      ? "Cough is usually a symptom of infection or irritation. Stay hydrated and consider honey for soothing (if not diabetic). For persistent cough, seek medical advice."
      : tamilHealthResponses['cough'];
  } else if (userMessage.includes('pregnancy') || userMessage.includes('கர்ப்பம்')) {
    response = language === 'english'
      ? "Pregnancy requires proper medical care. Please contact your nearest Health Sakhi or healthcare provider for prenatal care and guidance."
      : tamilHealthResponses['pregnancy'];
  } else if (userMessage.includes('diet') || userMessage.includes('nutrition') || userMessage.includes('ஊட்டச்சத்து')) {
    response = language === 'english'
      ? "A balanced diet should include fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, sugar, and salt. For specific dietary advice, consult your Health Sakhi."
      : tamilHealthResponses['nutrition'];
  } else {
    response = language === 'english'
      ? "I'm your health assistant. I can provide basic health information, but for any serious concerns, please consult your Health Sakhi or a medical professional."
      : "நான் உங்கள் ஆரோக்கிய உதவியாளர். நான் அடிப்படை ஆரோக்கிய தகவல்களை வழங்க முடியும், ஆனால் ஏதேனும் கடுமையான கவலைகள் இருந்தால், உங்கள் ஆரோக்கிய சகி அல்லது மருத்துவ நிபுணரை அணுகவும்.";
  }
  
  return {
    id: `resp-${Date.now()}`,
    message: {
      role: 'assistant',
      content: response
    }
  };
};

// Summarize notes (mock)
export const summarizeNotes = async (text: string, language: 'tamil' | 'english' = 'english'): Promise<string> => {
  await simulateDelay(1500); // Simulate API delay
  
  const sourceLanguage = detectLanguage(text);
  let summary = '';
  
  // Very basic summarization - just takes first few words and adds summary text
  if (text.length > 100) {
    summary = text.substring(0, 100) + '...';
  } else {
    summary = text;
  }
  
  const result = language === 'english'
    ? `Summary: ${summary}`
    : `சுருக்கம்: ${summary}`;
    
  return result;
};

// Text to speech (mock)
export const textToSpeech = async (text: string, language: 'tamil' | 'english' = 'english'): Promise<string> => {
  await simulateDelay(800); // Simulate API delay
  
  // In a real implementation, this would return an audio URL or blob
  // For this mock, we'll return a message indicating success
  return `Text-to-speech processing complete for "${text}" in ${language}`;
};

// Get recommended educational videos
export const getRecommendedVideos = async (query: string, language: 'tamil' | 'english' = 'english'): Promise<{ title: string; url: string; thumbnailUrl: string; description: string }[]> => {
  await simulateDelay(1200); // Simulate API delay
  
  // Mock video data
  const tamilVideos = [
    {
      title: 'கர்ப்பகால பராமரிப்பு குறிப்புகள்',
      url: 'https://www.youtube.com/watch?v=example1',
      thumbnailUrl: 'https://placehold.co/300x200?text=Pregnancy+Care',
      description: 'கர்ப்பகால பராமரிப்பு பற்றிய முக்கிய தகவல்கள்'
    },
    {
      title: 'குழந்தைகளுக்கான ஊட்டச்சத்து வழிகாட்டுதல்',
      url: 'https://www.youtube.com/watch?v=example2',
      thumbnailUrl: 'https://placehold.co/300x200?text=Child+Nutrition',
      description: 'குழந்தைகளுக்கான சத்தான உணவுகள் பற்றி'
    },
    {
      title: 'உயர் இரத்த அழுத்தம் மேலாண்மை',
      url: 'https://www.youtube.com/watch?v=example3',
      thumbnailUrl: 'https://placehold.co/300x200?text=Blood+Pressure',
      description: 'உயர் இரத்த அழுத்தத்தை கட்டுப்படுத்துவது எப்படி'
    }
  ];
  
  const englishVideos = [
    {
      title: 'Pregnancy Care Tips',
      url: 'https://www.youtube.com/watch?v=example1',
      thumbnailUrl: 'https://placehold.co/300x200?text=Pregnancy+Care',
      description: 'Essential information about pregnancy care'
    },
    {
      title: 'Child Nutrition Guide',
      url: 'https://www.youtube.com/watch?v=example2',
      thumbnailUrl: 'https://placehold.co/300x200?text=Child+Nutrition',
      description: 'Learn about nutritious foods for children'
    },
    {
      title: 'Managing High Blood Pressure',
      url: 'https://www.youtube.com/watch?v=example3',
      thumbnailUrl: 'https://placehold.co/300x200?text=Blood+Pressure',
      description: 'How to control high blood pressure'
    }
  ];
  
  // Filter videos based on query
  const videos = language === 'tamil' ? tamilVideos : englishVideos;
  
  if (query) {
    return videos.filter(video => 
      video.title.toLowerCase().includes(query.toLowerCase()) || 
      video.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  return videos;
};
