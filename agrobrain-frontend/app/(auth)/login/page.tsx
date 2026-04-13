'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  Leaf, 
  Shield, 
  Users, 
  CheckCircle,
  Globe
} from 'lucide-react';
import { sendOTP, verifyOTP } from '@/lib/auth';
import { authAPI } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations();
  const { language, setLanguage, setUser, setToken } = useAppStore();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend OTP
  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, step]);

  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    setError('');
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedData.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      
      // Focus on the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      otpInputRefs.current[focusIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
      
      // Auto-submit when 6th digit is entered
      if (index === 5 && value) {
        setTimeout(() => handleVerifyOtp(), 100);
      }
    }
    setError('');
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, use Firebase
      // const result = await sendOTP(`+91${phoneNumber}`);
      // setConfirmationResult(result);
      
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      toast.success('OTP sent successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, use Firebase
      // const { user, idToken } = await verifyOTP(confirmationResult, otpValue);
      
      // Mock user data for demo
      const mockUser = {
        id: 'demo-user-id',
        phone: `+91${phoneNumber}`,
        name: 'Ramesh Kumar',
        language: language,
        avatarUrl: undefined,
        defaultLocation: {
          lat: 26.8467,
          lng: 80.9462,
          village: 'Demo Village',
          district: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226001'
        },
        farmProfile: {
          totalAreaAcres: 5,
          soilType: 'Alluvial',
          primaryCrops: ['Wheat', 'Rice'],
          irrigationType: 'Canal',
          hasSoilSensor: false
        },
        isVerified: true,
        role: 'farmer' as const
      };

      const mockToken = 'demo-access-token';
      
      // Store in Zustand
      setUser(mockUser);
      setToken(mockToken);
      
      // Show success toast
      toast.success(`Welcome, ${mockUser.name}! ???`);
      
      // Check if new user (for demo, assume existing user)
      const isNewUser = false;
      
      if (isNewUser) {
        router.push('/profile/setup');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtp(['', '', '', '', '', '']);
      setResendTimer(30);
      setCanResend(false);
      toast.success('OTP resent successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to phone input
  const handleBackToPhone = () => {
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 800" fill="none">
            <path d="M200 100 Q100 200 200 300 T200 500 Q100 600 200 700" 
                  stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="100" cy="200" r="50" fill="white" opacity="0.1"/>
            <circle cx="300" cy="400" r="80" fill="white" opacity="0.1"/>
            <circle cx="150" cy="600" r="60" fill="white" opacity="0.1"/>
          </svg>
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-10 h-10" />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold mb-4 font-display"
          >
            AgroBrain AI
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl lg:text-2xl mb-12 text-green-100"
          >
            Smarter farming starts here ???
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">10,000+ Farmers</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">99% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Hindi Support</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'hi' ? 'EN' : '???'}
            </Button>
          </div>

          {/* Phone Step */}
          {step === 'phone' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">
                      {language === 'hi' ? '???? ?? ??' : 'Welcome Back'} ???
                    </h2>
                    <p className="text-gray-600">
                      {language === 'hi' ? '????? ???? ?????? ????????? ?? ???' : 'Enter your phone number to continue'}
                    </p>
                  </div>

                  {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        {language === 'hi' ? '???? ??????' : 'Phone Number'}
                      </Label>
                      <div className="flex mt-2">
                        <div className="flex items-center px-4 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                          <span className="text-gray-600">???</span>
                          <span className="ml-2 font-medium">+91</span>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="9876543210"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          className="rounded-l-none text-lg"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSendOtp}
                      disabled={isLoading || phoneNumber.length !== 10}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {language === 'hi' ? '??? ?????...' : 'Sending OTP...'}
                        </div>
                      ) : (
                        language === 'hi' ? 'OTP ?????' : 'Send OTP'
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-gray-600">
                        {language === 'hi' ? '??? ?? ??? ?? ??????' : 'New here? It\'s free to join'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  {/* Back Button */}
                  <Button
                    variant="ghost"
                    onClick={handleBackToPhone}
                    className="mb-6 -ml-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {language === 'hi' ? '?????' : 'Back'}
                  </Button>

                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">
                      {language === 'hi' ? 'OTP ?????' : 'Enter OTP'}
                    </h2>
                    <p className="text-gray-600">
                      {language === 'hi' 
                        ? `+91 XXXXXX${phoneNumber.slice(-4)} ?? ??????? ???`
                        : `Sent to +91 XXXXXX${phoneNumber.slice(-4)}`
                      }
                    </p>
                  </div>

                  {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-6">
                    {/* OTP Input */}
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => {
  otpInputRefs.current[index] = el;
}}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-0"
                        />
                      ))}
                    </div>

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.join('').length !== 6}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {language === 'hi' ? '????? ?????...' : 'Verifying...'}
                        </div>
                      ) : (
                        <>
                          {language === 'hi' ? '???? ????' : 'Verify & Continue'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    {/* Resend OTP */}
                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={handleResendOtp}
                        disabled={!canResend}
                        className="text-green-600 hover:text-green-700"
                      >
                        {canResend ? (
                          language === 'hi' ? 'OTP ????? ??????' : 'Resend OTP'
                        ) : (
                          language === 'hi' 
                            ? `OTP ????? ????? (${resendTimer}s)`
                            : `Resend OTP in (${resendTimer}s)`
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
