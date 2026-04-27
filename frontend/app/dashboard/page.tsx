'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Sprout, BookOpen, Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication from localStorage
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Redirect based on user role
        switch (userData.role) {
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
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
    
    setIsLoading(false);
  }, [router]);

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
