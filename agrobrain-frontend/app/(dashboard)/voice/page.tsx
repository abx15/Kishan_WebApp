'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useVoice } from '@/hooks/useVoice';
import { useLanguage } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Globe,
  Loader2,
  AlertCircle,
  Settings
} from 'lucide-react';

export default function VoicePage() {
  const language = useLanguage();
  const transcriptRef = useRef<HTMLDivElement>(null);
  
  const {
    state,
    transcript,
    response,
    isSupported,
    error,
    startListening,
    stopListening,
    speakResponse
  } = useVoice();

  const quickCommands = [
    { hi: 'mausam batao', en: 'tell weather', icon: 'â' },
    { hi: 'fasal sujhao', en: 'suggest crop', icon: 'ð' },
    { hi: 'sinchai kab karun', en: 'when to irrigate', icon: 'ð§' },
    { hi: 'khad kaun si', en: 'which fertilizer', icon: 'ðª' }
  ];

  const handleQuickCommand = (command: { hi: string; en: string }) => {
    const text = language === 'hi' ? command.hi : command.en;
    // Simulate voice input
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'idle':
        return language === 'hi' ? 'tap to speak' : 'Tap to speak';
      case 'listening':
        return language === 'hi' ? 'listening... à¤¬à¥à¤²à¤¿à¤' : 'Listening...';
      case 'processing':
        return language === 'hi' ? 'processing...' : 'Processing...';
      case 'speaking':
        return language === 'hi' ? 'playing response...' : 'Playing response...';
      case 'error':
        return language === 'hi' ? 'error occurred' : 'Error occurred';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'idle':
        return 'bg-green-600';
      case 'listening':
        return 'bg-green-600 animate-pulse';
      case 'processing':
        return 'bg-yellow-600';
      case 'speaking':
        return 'bg-blue-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  useEffect(() => {
    // Auto-scroll transcript to bottom
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript, response]);

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'hi' ? 'browser not supported' : 'Browser Not Supported'}
            </h2>
            <p className="text-gray-600 mb-4">
              {language === 'hi'
                ? 'Voice assistant works only in Chrome or Edge browser'
                : 'Voice assistant works only in Chrome or Edge browsers'
              }
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {language === 'hi' ? 'solution:' : 'Solution:'}
                </span>
              </div>
              <p className="text-sm text-blue-800">
                {language === 'hi'
                  ? 'Chrome ya Edge browser download karein'
                  : 'Download Chrome or Edge browser'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'hi' ? 'voice assistant' : 'Voice Assistant'}
            </h1>
            <p className="text-gray-600">
              {language === 'hi' 
                ? 'farming ke liye voice commands'
                : 'Voice commands for farming'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {language === 'hi' ? 'language:' : 'Language:'}
              </span>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
                {language === 'hi' ? 'à¤¹à¤¿à¤à¤¦à¥' : 'English'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-8">
          {/* Voice Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={state === 'idle' ? startListening : stopListening}
              disabled={state === 'processing' || state === 'speaking'}
              className={`w-32 h-32 rounded-full ${getStatusColor()} text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {state === 'processing' ? (
                <Loader2 className="w-12 h-12 animate-spin" />
              ) : state === 'listening' ? (
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  />
                </div>
              ) : state === 'speaking' ? (
                <Volume2 className="w-12 h-12" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </motion.button>
            
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-900">
                {getStatusText()}
              </p>
              {error && (
                <p className="text-sm text-red-600 mt-2">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Quick Commands */}
          <div className="flex flex-wrap justify-center gap-2">
            {quickCommands.map((command, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickCommand(command)}
                className="flex items-center space-x-2"
              >
                <span>{command.icon}</span>
                <span>{language === 'hi' ? command.hi : command.en}</span>
              </Button>
            ))}
          </div>

          {/* Transcript Area */}
          <Card className="max-h-96">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  {language === 'hi' ? 'conversation history' : 'Conversation History'}
                </h3>
                
                <div 
                  ref={transcriptRef}
                  className="space-y-4 max-h-64 overflow-y-auto"
                >
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-green-600 text-white rounded-2xl rounded-tl-2xl px-4 py-2 max-w-xs">
                        <p className="text-sm">{transcript}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {response && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tr-2xl px-4 py-2 max-w-xs">
                        <p className="text-sm">{response}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {!transcript && !response && (
                    <div className="text-center text-gray-500 py-8">
                      <Mic className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">
                        {language === 'hi' 
                          ? 'tap the button and speak'
                          : 'Tap the button and speak'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-600">
            <p>
              {language === 'hi'
                ? 'Speak clearly in Hindi or English. Works best in quiet environment.'
                : 'Speak clearly in Hindi or English. Works best in quiet environment.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
