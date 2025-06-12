import { initializeApp, cert, getApps, getApp, FirebaseError } from 'firebase-admin/app';

const firebaseAdminConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
};

// Initialize Firebase
const adminApp = !getApps().length ? initializeApp(firebaseAdminConfig) : getApp();

export { adminApp };
