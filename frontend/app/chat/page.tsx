'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  Paperclip, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowLeft, 
  Bot, 
  User, 
  MoreHorizontal,
  Plus,
  Trash2,
  Sprout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const initialMessages = [
  { 
    id: 1, 
    role: 'assistant', 
    text: "नमस्ते! (Namaste!) I am your AgroBrain AI. How can I assist you with your fields today? You can ask about soil health, pest control, or market prices.",
    time: '12:00 PM'
  }
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: "Analyzing your recent soil scan for Sector 4B... Based on my data, there's a slight increase in humidity. If you seeing small yellow spots on wheat leaves, it could be the start of leaf rust. Would you like me to recommend a treatment plan?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#fff9eb] flex selection:bg-green-100">
      <DashboardSidebar />
      
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-20 bg-white/50 backdrop-blur-xl border-b border-[#006b2c]/10 flex items-center justify-between px-10 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => router.back()} className="p-2 hover:bg-green-50 rounded-xl transition-colors">
               <ArrowLeft className="h-5 w-5 text-[#006b2c]" />
             </button>
             <div>
               <h1 className="text-xl font-bold flex items-center gap-2">
                 AgroBrain Assist
                 <Badge className="bg-green-100 text-[#006b2c] border-0 text-[10px] font-bold py-0 h-5">V3.5</Badge>
               </h1>
               <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Active Consultation</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="ghost" className="rounded-xl h-12 w-12 p-0 text-[#6e7b6c] hover:bg-white">
               <Plus className="h-5 w-5" />
             </Button>
             <Button variant="ghost" className="rounded-xl h-12 w-12 p-0 text-[#6e7b6c] hover:bg-white text-red-500 hover:text-red-600">
               <Trash2 className="h-5 w-5" />
             </Button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-10">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-5",
                  msg.role === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-white text-[#006b2c]" : "bg-[#006b2c] text-white"
                )}>
                  {msg.role === 'user' ? <User className="h-6 w-6" /> : <Sprout className="h-6 w-6" />}
                </div>

                <div className={cn(
                  "max-w-[70%] p-6 rounded-[2rem] shadow-sm",
                  msg.role === 'user' 
                    ? "bg-white text-[#1e1c12] rounded-tr-none" 
                    : "bg-white border border-[#006b2c]/10 text-[#1e1c12] rounded-tl-none"
                )}>
                  <p className="text-lg leading-relaxed font-medium">{msg.text}</p>
                  <p className="text-[10px] font-bold text-[#bdcaba] uppercase mt-4 tracking-widest">{msg.time}</p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#006b2c] text-white flex items-center justify-center shrink-0">
                  <Sprout className="h-6 w-6" />
                </div>
                <div className="bg-white/50 backdrop-blur px-6 py-4 rounded-[2rem] flex items-center gap-2">
                   <div className="w-2 h-2 bg-[#006b2c] rounded-full animate-bounce" />
                   <div className="w-2 h-2 bg-[#006b2c] rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-2 h-2 bg-[#006b2c] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-10 shrink-0">
           <div className="max-w-4xl mx-auto relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#006b2c] to-[#00873a] opacity-5 blur-2xl group-focus-within:opacity-20 transition-opacity" />
              
              <div className="relative bg-white/70 backdrop-blur-2xl border border-[#006b2c]/10 rounded-[2.5rem] p-4 flex items-center gap-4 shadow-2xl shadow-green-900/5">
                <Button variant="ghost" className="rounded-2xl h-14 w-14 p-0 text-[#6e7b6c] hover:bg-green-50 hover:text-[#006b2c]">
                   <Paperclip className="h-6 w-6" />
                </Button>
                <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Ask me anything: 'Is it safe to sow wheat today?'" 
                   className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-[#1e1c12] placeholder:text-[#bdcaba]"
                />
                <div className="flex items-center gap-2">
                   <Button variant="ghost" className="rounded-2xl h-14 w-14 p-0 text-[#6e7b6c] hover:bg-green-50 hover:text-[#006b2c]">
                      <Mic className="h-6 w-6" />
                   </Button>
                   <Button 
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="h-14 px-8 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-2xl font-bold shadow-xl shadow-green-900/10 transition-all active:scale-95 disabled:opacity-50"
                   >
                      <Send className="h-6 w-6" />
                   </Button>
                </div>
              </div>
              <p className="text-center text-[10px] font-bold text-[#bdcaba] mt-4 uppercase tracking-[0.2em]">AgroBrain AI can make mistakes. Verify critical farming decisions.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
