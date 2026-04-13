'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/store/useAppStore';
import { Send, Mic, Volume2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder }: ChatInputProps) {
  const language = useLanguage();
  const [message, setMessage] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 500;

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceMode(!isVoiceMode);
    // TODO: Integrate with voice hook
  };

  return (
    <div className="flex items-end space-x-2">
      {/* Language Badge */}
      <Badge variant="outline" className="text-xs">
        {language === 'hi' ? 'à¤¹à¤¿' : 'EN'}
      </Badge>

      {/* Text Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          style={{ maxHeight: '120px' }}
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {message.length}/{maxLength}
        </div>
      </div>

      {/* Voice Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleVoiceToggle}
        className={isVoiceMode ? 'bg-green-100 border-green-600' : ''}
        disabled={disabled}
      >
        {isVoiceMode ? <Volume2 className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>

      {/* Send Button */}
      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="bg-green-600 hover:bg-green-700"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
