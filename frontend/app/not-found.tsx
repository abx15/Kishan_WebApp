'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const farmerVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [-10, 0, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-20, -5, -20],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="text-center overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            {/* Animated Farmer Illustration */}
            <motion.div
              variants={farmerVariants}
              initial="initial"
              animate="animate"
              className="relative w-32 h-32 mx-auto"
            >
              {/* Farmer Head */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-amber-200 rounded-full border-4 border-amber-300 relative">
                  {/* Eyes */}
                  <div className="absolute top-6 left-5 w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="absolute top-6 right-5 w-2 h-2 bg-gray-800 rounded-full"></div>
                  {/* Confused mouth */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-800 rounded-b-full"></div>
                  {/* Hat */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-yellow-600 rounded-t-full border-2 border-yellow-700"></div>
                </div>
              </div>
              
              {/* Question marks */}
              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                className="absolute -top-2 -right-2 text-3xl font-bold text-gray-600"
              >
                ?
              </motion.div>
              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
                className="absolute -top-4 -left-2 text-2xl font-bold text-gray-500"
              >
                ?
              </motion.div>
            </motion.div>

            {/* Error Message */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-gray-900"
              >
                404
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold text-green-700"
              >
                Yeh page nahi mila {String.fromCodePoint(0x1F33E)}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 leading-relaxed"
              >
                Arre bhai! Is field mein kuch bhi ugg nahi raha hai.<br />
                Let's go back to your farm dashboard.
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full border-green-200 text-green-700 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </motion.div>

            {/* Fun Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Sprout className="w-4 h-4 text-green-500" />
                <span>Even the best farmers get lost sometimes</span>
                <Sprout className="w-4 h-4 text-green-500" />
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 opacity-20">
              <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-8 right-8 w-6 h-6 opacity-20">
              <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse delay-75"></div>
            </div>
            <div className="absolute bottom-12 left-12 w-4 h-4 opacity-20">
              <div className="w-full h-full bg-green-300 rounded-full animate-pulse delay-150"></div>
            </div>
          </CardContent>
        </Card>

        {/* Background Decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-300 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-emerald-300 rounded-full opacity-20 blur-xl"></div>
        </div>
      </motion.div>
    </div>
  );
}
