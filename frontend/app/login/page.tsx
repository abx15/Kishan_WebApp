'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Sprout, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  ChevronLeft 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowOtp(true);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPhone', phone);
      
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9eb] flex items-center justify-center p-6 relative overflow-hidden selection:bg-green-100">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-200/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-orange-100/30 blur-[100px] rounded-full" />
      
      <div className="w-full max-w-[440px] relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center mb-10">
            <div 
              onClick={() => router.push('/')}
              className="p-3 bg-gradient-to-br from-[#006b2c] to-[#00873a] rounded-2xl shadow-xl shadow-green-900/20 mb-4 cursor-pointer hover:scale-110 transition-transform"
            >
              <Sprout className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1e1c12]">Welcome Back</h1>
            <p className="text-[#3e4a3d] mt-2 font-medium">Access your intelligent farm dashboard.</p>
          </div>

          <Card className="border-0 shadow-3xl shadow-green-900/10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {!showOtp ? (
                  <motion.div
                    key="phone-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {error && (
                      <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 rounded-2xl">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-semibold text-[#6e7b6c] ml-1">Mobile Number</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-gray-200 pr-3 mr-3">
                          <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-[#006b2c] transition-colors" />
                          <span className="text-sm font-bold text-gray-500">+91</span>
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="bg-white/50 border-gray-100 h-16 pl-[104px] rounded-2xl focus:ring-2 focus:ring-[#006b2c]/20 transition-all font-bold text-lg tracking-wide"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSendOtp} 
                      disabled={loading || phone.length !== 10}
                      className="w-full h-16 bg-gradient-to-br from-[#006b2c] to-[#00873a] hover:opacity-90 text-white rounded-2xl shadow-xl shadow-green-900/20 text-lg font-bold transition-all active:scale-95 group"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending One-Time Code...
                        </>
                      ) : (
                        <>
                          Secure Login
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp-input"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck className="h-8 w-8 text-[#006b2c]" />
                      </div>
                      <h2 className="text-xl font-bold text-[#1e1c12]">Verify Device</h2>
                      <p className="text-sm text-[#6e7b6c] mt-2">
                        Code sent to +91 {phone}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <input 
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-full aspect-square text-center text-2xl font-bold bg-white/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#006b2c]/20 outline-none transition-all"
                            placeholder="•"
                            autoFocus={i === 1}
                            onChange={(e) => {
                              if (e.target.value && i < 6) {
                                (e.target.nextSibling as HTMLInputElement)?.focus();
                              }
                              // Simplified for demo - just collect all values
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-center text-[#6e7b6c] bg-[#f4edde]/50 py-2 rounded-lg">Demo: Use 123456</p>
                    </div>

                    <Button 
                      onClick={handleVerifyOtp} 
                      disabled={loading}
                      className="w-full h-16 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-2xl shadow-lg shadow-green-900/10 text-lg font-bold"
                    >
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Confirm & Dashboard'}
                    </Button>

                    <button 
                      onClick={() => setShowOtp(false)}
                      className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#6e7b6c] hover:text-[#006b2c] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Use different number
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-10 text-center pt-8 border-t border-gray-100">
                <p className="text-[#3e4a3d] font-medium">
                  New to AgroBrain?{' '}
                  <button 
                    onClick={() => router.push('/register')}
                    className="text-[#006b2c] hover:underline font-bold"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="text-center mt-12 text-xs text-[#6e7b6c] font-medium opacity-60">
          <p>Protected by AgroBrain Security Lab. &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}
