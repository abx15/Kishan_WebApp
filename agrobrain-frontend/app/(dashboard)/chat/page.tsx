'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { useLanguage } from '@/store/useAppStore';
import { 
  MessageCircle, 
  Plus, 
  Trash2, 
  Bot,
  Send,
  Mic,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const language = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  const {
    sessions,
    currentSession,
    messages,
    isLoading,
    sendMessage,
    createNewSession,
    deleteSession
  } = useChat(selectedSession);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    if (!currentSession) {
      const newSession = await createNewSession();
      setSelectedSession(newSession.id);
    }
    
    await sendMessage(content);
  };

  const handleNewChat = async () => {
    const newSession = await createNewSession();
    setSelectedSession(newSession.id);
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    if (selectedSession === sessionId) {
      setSelectedSession(null);
    }
  };

  const suggestedQuestions = [
    language === 'hi' ? 'meri fasal ke liye sahi khad kaun si hai?' : 'What fertilizer is best for my crop?',
    language === 'hi' ? 'kal baarish hogi kya?' : 'Will it rain tomorrow?',
    language === 'hi' ? 'kisan credit card kaise milega?' : 'How to get Kisan Credit Card?'
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* LEFT PANEL - Conversations (Desktop Only) */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'hi' ? 'baatche' : 'Conversations'}
            </h2>
            <Button onClick={handleNewChat} size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'naya chat' : 'New Chat'}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">
                {language === 'hi' ? 'koi baatche nahi' : 'No conversations yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${
                    selectedSession === session.id
                      ? 'bg-green-50 border-green-600'
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {session.title || (language === 'hi' ? 'nai baatch' : 'New Chat')}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(session.createdAt).toLocaleDateString()} · {session.messageCount} {language === 'hi' ? 'sandesh' : 'messages'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Chat Area */}
      <div className="flex-1 flex flex-col">
        {!currentSession ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center max-w-md p-8">
              <div className="text-6xl mb-4">ð¤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'hi' ? 'baatch shuru karein' : 'Start a conversation'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'hi' 
                  ? 'kisanon ke liye banaya gaya AI assistant. poochiye kuch bhi farming ke baare mein!'
                  : 'AI assistant made for farmers. Ask anything about farming!'
                }
              </p>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-4">
                  {language === 'hi' ? 'yah try karein:' : 'Try these:'}
                </p>
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(question)}
                    className="block w-full text-left justify-start h-auto py-3 px-4"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat */
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">ð¤ AgroBrain AI</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">
                        {language === 'hi' ? 'online' : 'Online'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {language === 'hi' ? 'à¤¹à¤¿' : 'EN'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVoiceMode(!isVoiceMode)}
                    className={isVoiceMode ? 'bg-green-100' : ''}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-green-600 text-white rounded-tl-2xl'
                              : 'bg-white border border-gray-200 rounded-tr-2xl'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tr-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <ChatInput
                onSend={handleSendMessage}
                disabled={isLoading}
                placeholder={language === 'hi' 
                  ? 'farming ke baare mein poochiye...' 
                  : 'Ask anything about farming...'
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
