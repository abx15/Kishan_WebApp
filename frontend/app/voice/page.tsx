'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Languages, 
  Volume2, 
  Settings2, 
  History, 
  Smartphone,
  Sparkles,
  Command,
  Sprout,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function VoicePage() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscript('');
      setResponse('');
      // Simulate voice processing
      setTimeout(() => {
        setTranscript("How much urea should I add to my wheat field?");
      }, 1500);
      setTimeout(() => {
        setIsListening(false);
        setResponse("Based on your soil nitrogen level of 85%, you should add 45kg of urea per acre. I've sent the detailed breakdown to your dashboard.");
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9eb] flex selection:bg-green-100">
      <DashboardSidebar />
      
      <main className="flex-1 min-w-0 flex flex-col items-center justify-center p-10 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#006b2c]/5 blur-[120px] rounded-full -z-10" />
        
        {/* Top Back Button */}
        <div className="absolute top-10 left-10">
           <button onClick={() => router.back()} className="p-3 bg-white hover:bg-green-50 rounded-2xl border border-gray-100 transition-all shadow-sm">
             <ArrowLeft className="h-6 w-6 text-[#006b2c]" />
           </button>
        </div>

        {/* Center UI */}
        <div className="max-w-xl w-full text-center space-y-12">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-4"
          >
             <Badge className="bg-green-100 text-[#006b2c] border-0 py-2 px-6 rounded-full font-bold text-sm tracking-widest">VOICE LAB V2.0</Badge>
             <h1 className="text-5xl font-extrabold text-[#1e1c12] tracking-tight">Speak to Bharat AI</h1>
             <p className="text-[#6e7b6c] font-medium text-lg leading-relaxed px-10">
               Get instant agricultural advice in your mother tongue using our state-of-the-art neural voice recognition.
             </p>
          </motion.div>

          {/* Voice Circle Visualizer */}
          <div className="relative flex justify-center items-center py-20">
             <AnimatePresence>
               {isListening && (
                 <>
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1.5, opacity: 0.1 }}
                     exit={{ scale: 2, opacity: 0 }}
                     transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                     className="absolute w-40 h-40 bg-[#006b2c] rounded-full"
                   />
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1.2, opacity: 0.2 }}
                     exit={{ scale: 1.8, opacity: 0 }}
                     transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                     className="absolute w-40 h-40 bg-[#006b2c] rounded-full"
                   />
                 </>
               )}
             </AnimatePresence>
             
             <button 
                onClick={toggleListening}
                className={cn(
                  "relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-90",
                  isListening 
                    ? "bg-[#006b2c] text-white rotate-0" 
                    : "bg-white text-[#006b2c] hover:bg-green-50 shadow-green-900/5"
                )}
             >
                {isListening ? <Mic className="h-12 w-12 animate-pulse" /> : <MicOff className="h-12 w-12" />}
             </button>

             {/* Orbital Language Icons */}
             {!isListening && (
               <div className="absolute inset-0 pointer-events-none">
                  {[
                    { label: 'हिन्दी', pos: 'top-0 left-1/2 -translate-x-1/2' },
                    { label: 'मराठी', pos: 'bottom-0 left-1/2 -translate-x-1/2' },
                    { label: 'తెలుగు', pos: 'left-0 top-1/2 -translate-y-1/2' },
                    { label: 'ਪੰਜਾਬੀ', pos: 'right-0 top-1/2 -translate-y-1/2' },
                  ].map((lang, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.4 }}
                      className={cn("absolute text-xs font-black text-[#6e7b6c]", lang.pos)}
                    >
                      {lang.label}
                    </motion.div>
                  ))}
               </div>
             )}
          </div>

          {/* Transcript & Response Area */}
          <div className="min-h-[140px] space-y-6">
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/50 backdrop-blur px-8 py-5 rounded-3xl border border-[#006b2c]/5 shadow-sm inline-block"
                >
                  <p className="text-[#1e1c12] font-bold text-lg italic">"{transcript}"</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {response && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white shadow-3xl shadow-green-900/10 p-10 rounded-[3rem] border border-[#006b2c]/10 text-left relative"
                >
                  <div className="absolute -top-4 -right-4 bg-[#006b2c] text-white p-3 rounded-2xl shadow-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <Volume2 className="h-4 w-4 text-[#006b2c]" />
                    </div>
                    <span className="text-sm font-black text-[#006b2c] tracking-widest uppercase">AI Recommendation</span>
                  </div>
                  <p className="text-xl font-bold leading-relaxed text-[#1e1c12]">
                    {response}
                  </p>
                  <div className="mt-8 flex gap-4">
                     <Button className="flex-1 h-14 bg-[#006b2c] text-white rounded-2xl font-bold">Apply Plan</Button>
                     <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl flex items-center justify-center">
                        <X className="h-6 w-6" />
                     </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Prompt Suggestions */}
          {!isListening && !response && (
            <div className="space-y-4 pt-10">
               <p className="text-[10px] font-black text-[#bdcaba] uppercase tracking-[0.2em] mb-4">Try asking</p>
               <div className="flex flex-wrap justify-center gap-3">
                 {[
                   "Fertilizer dosage for rice",
                   "Wheat sowing time in Punjab",
                   "Market price of Cotton",
                   "Is rain expected tomorrow?"
                 ].map((tip, i) => (
                   <button 
                     key={i}
                     className="px-6 py-3 bg-white/50 hover:bg-[#006b2c] hover:text-white rounded-full text-xs font-bold text-[#6e7b6c] border border-transparent hover:border-[#006b2c]/20 transition-all duration-300 shadow-sm"
                   >
                     {tip}
                   </button>
                 ))}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
