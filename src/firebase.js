import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDhKrEVFSd9sYKk3wn9hQZk_GFWiPmMkYg",
  authDomain: "mynewproject-ee25c.firebaseapp.com",
  projectId: "mynewproject-ee25c",
  storageBucket: "mynewproject-ee25c.appspot.com",
  messagingSenderId: "896089466928",
  appId: "1:896089466928:web:8e68533703ab6d95a6e5f5",
  measurementId: "G-GZG9MFDMHC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const fetchData = async (collectionName = 'wishes') => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Ошибка при получении данных:", e);
    return [];
  }
};

const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (e) {
    console.error("Ошибка при добавлении документа:", e);
    return null;
  }
};

const deleteData = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (e) {
    console.error("Ошибка при удалении документа:", e);
  }
};

const updateData = async (collectionName, docId, newData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, newData);
  } catch (e) {
    console.error("Ошибка при обновлении документа:", e);
  }
};

export {
  auth,
  googleProvider,
  db,
  fetchData,
  addData,
  deleteData,
  updateData,
  updateProfile
};