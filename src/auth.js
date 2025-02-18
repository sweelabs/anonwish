import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc
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
    return docRef.id;
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

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Загружаем никнейм из Firestore, если он не установлен в профиле
    if (!user.displayName) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const nickname = userDoc.data().nickname;

        // Обновляем профиль пользователя в Firebase Authentication
        await updateProfile(user, { displayName: nickname });

        console.log("Ник загружен из Firestore:", nickname);
      }
    }

    console.log("Пользователь вошел:", user);
  } catch (error) {
    console.error("Ошибка при входе:", error.message);
  }
};

// Сохранение состояния пользователя в локальном хранилище
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
});

export {
  auth,
  googleProvider,
  db,
  fetchData,
  addData,
  deleteData,
  loginUser,
  updateProfile
};
