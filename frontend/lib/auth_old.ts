import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth';
import { User } from '@/types';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: any = null;
let auth: any = null;

export const initFirebase = (): void => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
};

// Convert Firebase user to app user
const firebaseUserToAppUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  phone: firebaseUser.phoneNumber || '',
  name: firebaseUser.displayName || '',
  language: 'hi', // Default to Hindi for Indian farmers
  avatarUrl: firebaseUser.photoURL || undefined,
  defaultLocation: {
    lat: 0,
    lng: 0,
  },
  farmProfile: {
    totalAreaAcres: 0,
    soilType: '',
    primaryCrops: [],
    irrigationType: '',
    hasSoilSensor: false,
  },
  isVerified: false,
  role: 'farmer',
});

// Phone authentication functions
export const sendOTP = async (phone: string): Promise<ConfirmationResult> => {
  initFirebase();
  
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button');
    
    // Wait for reCAPTCHA to be ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    return confirmationResult;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send OTP');
  }
};

export const verifyOTP = async (confirmationResult: ConfirmationResult, code: string): Promise<{ user: User; idToken: string }> => {
  try {
    const result = await confirmationResult.confirm(code);
    const user = firebaseUserToAppUser(result.user);
    
    const idToken = await result.user.getIdToken();
    
    return { user, idToken };
  } catch (error: any) {
    throw new Error(error.message || 'OTP verification failed');
  }
};

export const getIdToken = async (): Promise<string> => {
  initFirebase();
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    return await currentUser.getIdToken();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get ID token');
  }
};

export const signOut = async (): Promise<void> => {
  initFirebase();
  
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Sign out failed');
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  initFirebase();
  
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        resolve(firebaseUserToAppUser(firebaseUser));
      } else {
        resolve(null);
      }
    });
  });
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  initFirebase();
  
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUserToAppUser(firebaseUser));
    } else {
      callback(null);
    }
  });
};
