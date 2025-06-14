import { initializeApp, getApps, getApp, FirebaseError } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : undefined;

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { app, auth, googleAuthProvider, analytics };

// Handle Firebase Error
export const handleFirebaseError = (firebaseError: FirebaseError): string => {
    switch (firebaseError.code) {
        case 'auth/invalid-email':
            return 'AuthError.invalidEmail';
        case 'auth/user-disabled':
            return 'AuthError.userDisabled';
        case 'auth/user-not-found':
            return 'AuthError.userNotFound';
        case 'auth/wrong-password':
            return 'AuthError.wrongPassword';
        case 'auth/missing-password':
            return 'AuthError.wrongPassword';
        // https://zenn.dev/mekk/articles/4b563dc3813cd7
        case 'auth/invalid-credential':
            return 'AuthError.invalidCredential';
        case 'auth/email-already-in-use':
            return 'AuthError.emailAlreadyInUse';
        case 'auth/weak-password':
            return 'AuthError.weakPassword';
        case 'auth/too-many-requests':
            return 'AuthError.tooManyRequests';
        case 'auth/network-request-failed':
            return 'AuthError.networkError';
        default:
            console.error(firebaseError.code);
            return 'AuthError.unknownError';
    }
};
