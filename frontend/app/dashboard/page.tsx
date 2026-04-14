'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Sprout, BookOpen, Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Redirect based on user role
    if (user?.role) {
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'farmer':
          router.push('/dashboard/farmer');
          break;
        case 'agronomist':
          router.push('/dashboard/agronomist');
          break;
        default:
          router.push('/dashboard/farmer'); // Default to farmer
          break;
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Loading state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
          <p className="text-green-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // This should not show as user will be redirected
  return null;
}
