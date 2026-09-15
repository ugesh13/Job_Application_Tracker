import * as adminNamespace from 'firebase-admin';

const admin = (adminNamespace as any).default || adminNamespace;

// Initialize only if not already initialized
if (!(admin.apps && admin.apps.length)) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "job-tracker-db3f6",
  });
}

export const auth = admin.auth();

