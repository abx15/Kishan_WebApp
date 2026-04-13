'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  LifeBuoy, 
  ChevronDown, 
  Send, 
  CheckCircle2,
  Sprout,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const faqs = [
  {
    question: "How accurate is the soil intelligence?",
    answer: "Our AI models achieve 95% accuracy by combining hyperlocal sensor data with sub-meter resolution multi-spectral satellite imagery updated every 48 hours."
  },
  {
    question: "Do I need a continuous internet connection?",
    answer: "No, AgroBrain AI is designed to work in low-connectivity areas. You can sync your field data when you have a connection, and the AI tips are cached for offline use."
  },
  {
    question: "Which Indian languages are supported?",
    answer: "We currently support Hindi, English, Punjabi, Marathi, Kannada, Tamil, Telugu, and Bengali. Voice support is available in 5 of these languages."
  },
  {
    question: "Is my field data kept private?",
    answer: "Absolutely. We follow strict data encryption standards and your field intelligence is only used to provide personalized recommendations for your farm."
  }
];

export default function ContactPage() {
  const router = useRouter();
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-[#fff9eb] text-[#1e1c12] selection:bg-green-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-[#006b2c]/10 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex justify-between items-center">
          <div 
             onClick={() => router.push('/')}
             className="flex items-center gap-3 cursor-pointer"
          >
            <div className="p-2.5 bg-[#006b2c] rounded-xl">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AgroBrain AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/login')} className="text-[#1e1c12]">Sign In</Button>
            <Button onClick={() => router.push('/register')} className="bg-[#006b2c] text-white rounded-xl">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6 lg:px-8 text-center bg-gradient-to-b from-white to-transparent">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Expert Support for<br /><span className="text-[#006b2c]">Your Growing Ambitions.</span></h1>
          <p className="text-xl text-[#6e7b6c] max-w-2xl mx-auto font-medium">
            Whether you need a lab walkthrough or have technical questions, our team of agronomists is here to help.
          </p>
        </motion.div>
      </section>

      {/* Main Grid */}
      <section className="py-12 px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Left: Contact Info */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <Card className="border-0 shadow-sm bg-white p-8 rounded-3xl">
               <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                 <Mail className="h-6 w-6 text-[#006b2c]" />
               </div>
               <h3 className="font-bold text-lg mb-2">Email Support</h3>
               <p className="text-[#6e7b6c] text-sm font-medium">support@agrobrain.ai</p>
               <p className="text-[#bdcaba] text-xs mt-1">24 Hour Response Time</p>
             </Card>
             <Card className="border-0 shadow-sm bg-white p-8 rounded-3xl">
               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                 <Phone className="h-6 w-6 text-blue-600" />
               </div>
               <h3 className="font-bold text-lg mb-2">Direct Line</h3>
               <p className="text-[#6e7b6c] text-sm font-medium">+91-1800-AGRO-AI</p>
               <p className="text-[#bdcaba] text-xs mt-1">Mon-Sat, 9am - 7pm IST</p>
             </Card>
          </div>

          <div className="bg-white/50 backdrop-blur rounded-[2.5rem] p-10 border border-white/20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-[#006b2c]" />
              Our Hubs
            </h3>
            <div className="space-y-8">
              <div>
                <p className="font-bold text-[#1e1c12]">Primary Innovation Lab</p>
                <p className="text-[#6e7b6c] text-sm mt-1">
                  Plot 42, Ag-Tech Park, Whitefield,<br />
                  Bengaluru, Karnataka 560066
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1e1c12]">Field Operations Center</p>
                <p className="text-[#6e7b6c] text-sm mt-1">
                  12th Street, Knowledge Valley,<br />
                  Pune, Maharashtra 411007
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <Card className="border-0 shadow-3xl shadow-green-900/10 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
            
            {formSent ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="py-20 text-center space-y-4"
               >
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="h-10 w-10 text-[#006b2c]" />
                 </div>
                 <h3 className="text-2xl font-bold text-[#1e1c12]">Message Delivered</h3>
                 <p className="text-[#6e7b6c] font-medium">An expert from Bharat Lab will reach out to you within 4 business hours.</p>
                 <Button variant="outline" onClick={() => setFormSent(false)} className="mt-8 rounded-xl font-bold">Send Another</Button>
               </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-xs font-bold uppercase tracking-widest text-[#6e7b6c] ml-1">First Name</Label>
                    <Input id="first_name" placeholder="Kishan" className="h-14 rounded-2xl bg-white border-gray-100 focus:ring-[#006b2c]/20" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-xs font-bold uppercase tracking-widest text-[#6e7b6c] ml-1">Last Name</Label>
                    <Input id="last_name" placeholder="Kumar" className="h-14 rounded-2xl bg-white border-gray-100 focus:ring-[#006b2c]/20" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-[#6e7b6c] ml-1">Email Address</Label>
                  <Input id="email" type="email" placeholder="name@domain.com" className="h-14 rounded-2xl bg-white border-gray-100 focus:ring-[#006b2c]/20" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-[#6e7b6c] ml-1">Your Inquiry</Label>
                  <Textarea id="message" placeholder="How can our AI help your farm today?" className="min-h-[150px] rounded-[1.5rem] bg-white border-gray-100 focus:ring-[#006b2c]/20 p-5" required />
                </div>

                <Button type="submit" className="w-full h-16 bg-[#006b2c] text-white hover:bg-[#00873a] text-lg font-bold rounded-2xl shadow-xl shadow-green-900/10 group transition-all active:scale-95">
                  Secure Submission
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            )}
          </div>
        </Card>
      </section>

      {/* Support Options */}
      <section className="py-24 px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#1e1c12]">Immediate Action Required?</h2>
            <p className="text-[#6e7b6c] font-medium">Direct tunnels for our premium lab members.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-10 rounded-[2.5rem] bg-green-50/50 border border-green-100 hover:shadow-xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                     <MessageSquare className="h-7 w-7 text-[#006b2c]" />
                   </div>
                   <h3 className="text-2xl font-bold mb-3">Expert Live Chat</h3>
                   <p className="text-[#6e7b6c] leading-relaxed mb-8">Chat in real-time with an AI Agronomist for immediate soil or crop analysis.</p>
                   <Button variant="link" onClick={() => router.push('/chat')} className="p-0 text-[#006b2c] font-bold text-lg group-hover:translate-x-2 transition-transform h-auto">
                     Enter Consultation
                     <ArrowRight className="ml-2 h-5 w-5" />
                   </Button>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-[#fff9eb]/50 border border-orange-100 hover:shadow-xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                     <LifeBuoy className="h-7 w-7 text-orange-600" />
                   </div>
                   <h3 className="text-2xl font-bold mb-3">Farmer Help Center</h3>
                   <p className="text-[#6e7b6c] leading-relaxed mb-8">Detailed guides on using satellite insights and neural nutrient predictors.</p>
                   <Button variant="link" className="p-0 text-orange-600 font-bold text-lg group-hover:translate-x-2 transition-transform h-auto">
                     Explore Guides
                     <ArrowRight className="ml-2 h-5 w-5" />
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked</h2>
          <div className="w-20 h-1.5 bg-[#006b2c] mx-auto rounded-full" />
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0 bg-white/50 backdrop-blur rounded-3xl px-8 py-2 shadow-sm">
              <AccordionTrigger className="text-left font-bold text-lg hover:no-underline text-[#1e1c12]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#6e7b6c] leading-relaxed pb-6 pt-2 font-medium">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e1c12] text-white pt-20 pb-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center border-t border-white/5 pt-10">
            <p className="text-gray-500 text-sm">&copy; 2026 AgroBrain AI. Digital Agriculture for Bharat.</p>
        </div>
      </footer>
    </div>
  );
}
