import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase.init";
import axios from "axios";

const googleProvider = new GoogleAuthProvider();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // contains combined Firebase + DB user info
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await axios.get(
            `https://sports-server-brown.vercel.app/users/${firebaseUser.email}`
          );
          const dbUser = res.data;

          // Combine both Firebase and DB user info
          setUser({
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: dbUser.name || firebaseUser.displayName,
            photoURL: dbUser.photo || firebaseUser.photoURL,
            role: dbUser.role || "user",
            ...dbUser,
          });
        } catch (error) {
          console.error("Failed to fetch DB user:", error);
          setUser(firebaseUser); // fallback to Firebase info
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    createUser,
    signIn,
    logOut,
    googleLogin,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
