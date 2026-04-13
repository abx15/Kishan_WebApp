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
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Basic info, 2: OTP verification

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.phone || formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2); 
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userName', formData.name);
      
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
      
      <div className="w-full max-w-[480px] relative z-10">
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
            <h1 className="text-3xl font-bold tracking-tight text-[#1e1c12]">Join AgroBrain AI</h1>
            <p className="text-[#3e4a3d] mt-2 font-medium">Smart farming starts with a single step.</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-3xl shadow-green-900/10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="pt-10 pb-4 px-8">
                    <CardTitle className="text-xl font-bold text-[#1e1c12]">Farmer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 rounded-2xl">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-[#6e7b6c] ml-1">Full Name</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#006b2c] transition-colors" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g., Kishan Kumar"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-white/50 border-gray-100 h-14 pl-12 rounded-2xl focus:ring-2 focus:ring-[#006b2c]/20 transition-all font-medium"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold text-[#6e7b6c] ml-1">Mobile Number</Label>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-gray-200 pr-3 mr-3">
                              <span className="text-sm font-bold text-gray-500">+91</span>
                            </div>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="98765 43210"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="bg-white/50 border-gray-100 h-14 pl-16 rounded-2xl focus:ring-2 focus:ring-[#006b2c]/20 transition-all font-medium"
                              maxLength={10}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-[#6e7b6c] ml-1">Email (Optional)</Label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="name@email.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="bg-white/50 border-gray-100 h-14 pl-12 rounded-2xl focus:ring-2 focus:ring-[#006b2c]/20 transition-all font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-[#6e7b6c] ml-1">Security Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="bg-white/50 border-gray-100 h-14 pl-12 pr-12 rounded-2xl focus:ring-2 focus:ring-[#006b2c]/20 transition-all font-medium"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#6e7b6c] ml-1">Confirm Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Type password again"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="bg-white/50 border-gray-100 h-14 pl-12 pr-12 rounded-2xl focus:ring-2 focus:ring-[#006b2c]/20 transition-all font-medium"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-16 bg-gradient-to-br from-[#006b2c] to-[#00873a] hover:opacity-90 text-white rounded-2xl shadow-xl shadow-green-900/20 text-lg font-bold transition-all active:scale-95 group"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Continue to Verification
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-8 text-center">
                      <p className="text-[#3e4a3d] font-medium">
                        Already have an account?{' '}
                        <button 
                          onClick={() => router.push('/login')}
                          className="text-[#006b2c] hover:underline font-bold"
                        >
                          Login here
                        </button>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-3xl shadow-green-900/10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="pt-10 pb-4 px-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                      <ShieldCheck className="h-8 w-8 text-[#006b2c]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-[#1e1c12]">Verify Your Device</CardTitle>
                    <p className="text-sm text-[#6e7b6c] mt-2">
                      Enter the 6-digit code sent to<br />
                      <span className="font-bold text-[#1e1c12]">+91 {formData.phone}</span>
                    </p>
                  </CardHeader>
                  <CardContent className="px-8 pb-10">
                    <div className="space-y-6">
                      {error && (
                        <Alert variant="destructive" className="rounded-2xl">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-between gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <input 
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-full aspect-square text-center text-2xl font-bold bg-white/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#006b2c]/20 outline-none transition-all"
                            placeholder="•"
                          />
                        ))}
                      </div>
                      
                      <p className="text-xs text-center text-gray-500 bg-gray-50 py-2 rounded-lg border border-dashed border-gray-200">
                        Demo: Any 6 digits will work
                      </p>

                      <Button 
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full h-16 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-2xl shadow-lg shadow-green-900/10 text-lg font-bold"
                      >
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Complete Registration'}
                      </Button>

                      <button 
                        onClick={() => setStep(1)}
                        className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#6e7b6c] hover:text-[#006b2c] transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Edit Phone Number
                      </button>

                      <div className="text-center text-sm text-[#3e4a3d] mt-4">
                        <p>Didn't receive code? <button className="text-[#006b2c] font-bold">Resend in 30s</button></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-12 text-xs text-[#6e7b6c] font-medium opacity-60">
          <p>Protected by AgroBrain Security Lab. &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}
