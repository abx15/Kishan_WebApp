'use client';

import { motion } from 'framer-motion';
import { Sprout, Users, Earth, Target, Zap, Heart, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stats = [
  { label: 'Fields Monitored', value: '150K+' },
  { label: 'AI Decisions/Day', value: '1.2M' },
  { label: 'States Reached', value: '22+' },
  { label: 'Yield Increase', value: '25%' },
];

const team = [
  { name: 'Dr. Ramesh Sharma', role: 'Head AI Agronomist', bio: '20+ years in agricultural research and soil science.', image: 'RS' },
  { name: 'Ananya Iyer', role: 'CTO / Data Science', bio: 'Former satellite data engineer specializing in remote sensing.', image: 'AI' },
  { name: 'Kushal Patel', role: 'Operations Director', bio: 'Expert in rural deployment and farmer community building.', image: 'KP' },
  { name: 'Meera Deshmukh', role: 'UX Designer', bio: 'Crafting interfaces that resonate with regional Indian farmers.', image: 'MD' },
];

export default function AboutPage() {
  const router = useRouter();

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

      {/* Hero Section */}
      <section className="relative py-24 px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-200/20 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div {...fadeIn}>
            <Badge className="bg-green-100 text-[#006b2c] border-0 py-2 px-4 rounded-full font-bold mb-6">Our Mission</Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
              Bridging the Gap Between<br />
              <span className="text-[#006b2c]">Tech and the Soil.</span>
            </h1>
            <p className="text-xl text-[#3e4a3d] max-w-3xl mx-auto leading-relaxed mb-12">
              AgroBrain AI was born in the heart of Indian fields. We believe that 
              the future of food security lies in empowering the individual farmer 
              with the same data intelligence used by global scientists.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/50 backdrop-blur p-8 rounded-3xl border border-white/20 shadow-sm"
              >
                <div className="text-4xl font-extrabold text-[#006b2c] mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-[#6e7b6c] uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square bg-green-100 rounded-[3rem] overflow-hidden shadow-2xl">
               {/* Image Placeholder */}
               <div className="w-full h-full bg-gradient-to-br from-[#006b2c]/20 to-[#00873a]/40 flex items-center justify-center p-20">
                 <Earth className="w-full h-full text-[#006b2c]/40" />
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#fff9eb] border-8 border-white p-6 rounded-[2.5rem] shadow-xl text-center flex flex-col justify-center">
              <Award className="h-10 w-10 text-[#006b2c] mx-auto mb-2" />
              <p className="text-sm font-bold">10+ Global Innovation Awards</p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-[#1e1c12]">The Living Laboratory Story</h2>
            <div className="space-y-6 text-lg text-[#3e4a3d] leading-relaxed">
              <p>
                In 2021, we noticed a critical disconnect: while satellite data and AI were revolutionizing 
                commercial agriculture, the average Indian farmer remained excluded due to cost and complexity.
              </p>
              <p>
                We spent 18 months living in villages across Punjab, Maharashtra, and Karnataka, 
                building our AI models not and in just labs, but in the actual soil. This "Living Laboratory" 
                approach ensured our technology speaks the farmer's language—literally and metaphorically.
              </p>
              <p>
                Today, AgroBrain AI serves as a 24/7 digital agronomist for over 50,000 families, 
                protecting their livelihoods and the planet's health simultaneously.
              </p>
            </div>
            <Button className="h-14 bg-[#006b2c] text-white px-10 rounded-2xl font-bold hover:opacity-90">
              Read Our Full Roadmap
            </Button>
          </div>
        </div>
      </section>

      {/* Core Technology */}
      <section className="py-24 px-6 lg:px-8 bg-[#f4edde]/50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Precision Pillars</h2>
          <div className="w-20 h-1.5 bg-[#006b2c] mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Zap, title: 'Neural Agriculture', desc: 'Custom ML models trained on 100+ years of regional soil data.' },
            { icon: Target, title: 'Satellite Precision', desc: 'Hyper-resolution field mapping using sub-meter multispectral imaging.' },
            { icon: Heart, title: 'Human Centric', desc: 'Interface designed for maximum accessibility with full voice support.' },
          ].map((tech, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] bg-white p-10 group">
              <CardContent className="p-0 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <tech.icon className="h-8 w-8 text-[#006b2c]" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{tech.title}</h3>
                <p className="text-[#6e7b6c] leading-relaxed">{tech.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-[#1e1c12]">The Minds Behind the Soil</h2>
              <p className="text-[#6e7b6c] mt-2 font-medium">A diverse collective of agronomists, engineers, and designers.</p>
            </div>
            <Button variant="outline" className="h-12 border-[#006b2c]/20 text-[#006b2c] rounded-xl font-bold">
              Join Our Team
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] mb-6 overflow-hidden relative border border-gray-100">
                  <div className="w-full h-full bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center text-4xl font-bold text-[#006b2c]/20">
                    {member.image}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1c12]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-white text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#1e1c12]">{member.name}</h3>
                <p className="text-[#006b2c] font-bold text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e1c12] text-white pt-20 pb-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-3xl font-bold mb-8">Ready to transform your farm?</h2>
           <Button 
              size="lg"
              onClick={() => router.push('/register')}
              className="bg-[#006b2c] text-white px-12 py-7 h-auto text-xl font-bold rounded-2xl shadow-xl transition-all active:scale-95"
            >
              Get Started Free
            </Button>
            <p className="mt-20 text-gray-500 text-sm">&copy; 2026 AgroBrain AI. Digital Agriculture for Bharat.</p>
        </div>
      </footer>
    </div>
  );
}
