import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Exact Firebase configuration provided by the client
export const firebaseConfig = {
  apiKey: "AIzaSyDI9zg3U3pxjB0v0WmkyVCKCuG-6nM2ZJY",
  authDomain: "seth-sanwariya-collection.firebaseapp.com",
  databaseURL: "https://seth-sanwariya-collection-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "seth-sanwariya-collection",
  storageBucket: "seth-sanwariya-collection.firebasestorage.app",
  messagingSenderId: "307784862375",
  appId: "1:307784862375:web:4b4039e296b4217a5a2982",
  measurementId: "G-1KRR436WYS"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Safe Analytics Initialization for browser environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics unsupported in some iframe sandboxes
  });
}

/**
 * Upload an image directly to Firebase Storage bucket (seth-sanwariya-collection.firebasestorage.app)
 */
export async function uploadImageToFirebase(file: File, folder = "products"): Promise<string> {
  if (!file) throw new Error("कोई फ़ाइल नहीं चुनी गई");
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("फ़ोटो का आकार 10MB से कम होना चाहिए।");
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const uniqueName = `${Date.now()}_${cleanName}`;
  const storageRef = ref(storage, `${folder}/${uniqueName}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type
  });

  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
