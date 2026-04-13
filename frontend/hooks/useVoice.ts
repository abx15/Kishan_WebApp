import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/store/useAppStore';
import { apiPost } from '@/lib/api';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

interface UseVoiceReturn {
  state: VoiceState;
  transcript: string;
  response: string;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  speakResponse: (text: string) => void;
}

export const useVoice = (): UseVoiceReturn => {
  const language = useLanguage();
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;
    
    setIsSupported(!!SpeechRecognition && !!SpeechSynthesis);
    synthesisRef.current = SpeechSynthesis;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionRef.current.onstart = () => {
        setState('listening');
        setError(null);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        // Auto-send final transcript
        if (finalTranscript.trim()) {
          handleVoiceInput(finalTranscript.trim());
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
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }

        setError(errorMessage);
        setState('error');
      };

      recognitionRef.current.onend = () => {
        if (state === 'listening') {
          setState('idle');
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language, state]);

  const handleVoiceInput = async (text: string): Promise<void> => {
    setState('processing');
    
    try {
      const response = await apiPost('/api/v1/voice/query', {
        query: text,
        language: language
      });
      
      if (response.success && response.data) {
        const responseData = response.data as { response: string };
        setResponse(responseData.response);
        setState('speaking');
        speakResponse(responseData.response);
      } else {
        throw new Error(response.error || 'Failed to process voice query');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process voice query');
      setState('error');
    }
  };

  const startListening = (): void => {
    if (!isSupported || !recognitionRef.current) {
      setError('Voice recognition not supported');
      setState('error');
      return;
    }

    try {
      // Cancel any ongoing speech
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (state === 'listening') {
          stopListening();
        }
      }, 10000);
    } catch (err: any) {
      setError(err.message || 'Failed to start voice recognition');
      setState('error');
    }
  };

  const stopListening = (): void => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (state === 'listening') {
      setState('idle');
    }
  };

  const speakResponse = (text: string): void => {
    if (!synthesisRef.current) return;
    
    // Cancel any previous speech
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select voice based on language
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes(language === 'hi' ? 'hi' : 'en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else {
      // Fallback to default voice
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setState('speaking');
    };
    
    utterance.onend = () => {
      setState('idle');
    };
    
    utterance.onerror = () => {
      setState('idle');
    };
    
    synthesisRef.current.speak(utterance);
  };

  return {
    state,
    transcript,
    response,
    isSupported,
    error,
    startListening,
    stopListening,
    speakResponse,
  };
};
