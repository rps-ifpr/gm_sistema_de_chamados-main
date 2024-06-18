import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRuP5bPplS10GbyGct3fx44n-H-F1pLZ4",
  authDomain: "gmsolutions-c9626.firebaseapp.com",
  projectId: "gmsolutions-c9626",
  storageBucket: "gmsolutions-c9626.appspot.com",
  messagingSenderId: "51383351473",
  appId: "1:51383351473:web:fb2f9cb8ff2b2da8c34a90",
  measurementId: "G-SKGLZT5C8Y",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
