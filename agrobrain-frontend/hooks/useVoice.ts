import { useState, useEffect, useRef } from 'react';
import { VoiceCommand } from '@/types';

interface UseVoiceReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  command: VoiceCommand | null;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
}

export const useVoice = (): UseVoiceReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [command, setCommand] = useState<VoiceCommand | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        // Process final transcript as command
        if (finalTranscript.trim()) {
          processVoiceCommand(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        let errorMessage = 'Voice recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not available';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied';
            break;
          case 'network':
            errorMessage = 'Network error';
            break;
          case 'service-not-allowed':
            errorMessage = 'Voice recognition service not allowed';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }

        setError(errorMessage);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const processVoiceCommand = (text: string): void => {
    const lowerText = text.toLowerCase();
    let intent = 'general';
    let entities: Record<string, any> = {};
    let confidence = 0.8;

    // Weather commands
    if (lowerText.includes('weather') || lowerText.includes('temperature')) {
      intent = 'weather';
      confidence = 0.9;
      
      if (lowerText.includes('today')) {
        entities.timeframe = 'today';
      } else if (lowerText.includes('tomorrow')) {
        entities.timeframe = 'tomorrow';
      } else if (lowerText.includes('week')) {
        entities.timeframe = 'week';
      }
    }

    // Crop commands
    if (lowerText.includes('crop') || lowerText.includes('plant') || lowerText.includes('grow')) {
      intent = 'crops';
      confidence = 0.85;
      
      // Extract crop names
      const crops = ['wheat', 'rice', 'corn', 'tomato', 'potato', 'onion'];
      for (const crop of crops) {
        if (lowerText.includes(crop)) {
          entities.crop = crop;
          break;
        }
      }
    }

    // Alert commands
    if (lowerText.includes('alert') || lowerText.includes('warning')) {
      intent = 'alerts';
      confidence = 0.9;
    }

    // Recommendation commands
    if (lowerText.includes('recommend') || lowerText.includes('suggest')) {
      intent = 'recommendations';
      confidence = 0.85;
    }

    // Navigation commands
    if (lowerText.includes('dashboard') || lowerText.includes('home')) {
      intent = 'navigation';
      entities.page = 'dashboard';
      confidence = 0.95;
    } else if (lowerText.includes('weather page')) {
      intent = 'navigation';
      entities.page = 'weather';
      confidence = 0.95;
    } else if (lowerText.includes('chat')) {
      intent = 'navigation';
      entities.page = 'chat';
      confidence = 0.95;
    }

    const voiceCommand: VoiceCommand = {
      id: Date.now().toString(),
      command: text,
      intent,
      entities,
      confidence,
      timestamp: new Date().toISOString(),
    };

    setCommand(voiceCommand);
  };

  const startListening = (): void => {
    if (!isSupported || !recognitionRef.current) {
      setError('Voice recognition not supported');
      return;
    }

    try {
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds of silence
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          stopListening();
        }
      }, 10000);
    } catch (err: any) {
      setError(err.message || 'Failed to start voice recognition');
    }
  };

  const stopListening = (): void => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const clearTranscript = (): void => {
    setTranscript('');
    setCommand(null);
    setError(null);
  };

  return {
    isListening,
    isSupported,
    transcript,
    command,
    error,
    startListening,
    stopListening,
    clearTranscript,
  };
};
