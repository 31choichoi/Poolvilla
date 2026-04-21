import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore helpers
export const reservationsRef = collection(db, 'reservations');

export const createReservation = async (data: {
  name: string;
  phone: string;
  date: string;
  room: string;
  message: string;
}) => {
  return addDoc(reservationsRef, {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp()
  });
};

export const updateReservationStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
  const docRef = doc(db, 'reservations', id);
  return updateDoc(docRef, { status });
};

export const deleteReservation = async (id: string) => {
  const docRef = doc(db, 'reservations', id);
  return deleteDoc(docRef);
};

export const logout = () => signOut(auth);
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
