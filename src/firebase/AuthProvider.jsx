import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken,
} from "firebase/auth";
import { auth } from "./firebase.init";
import axios from "axios";

const googleProvider = new GoogleAuthProvider();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // contains Firebase + DB user info
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
          // ✅ Get Firebase ID token
          const token = await getIdToken(firebaseUser);

          // ✅ Set token in axios default headers (for protected routes)
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // ✅ Fetch DB user info
          const res = await axios.get(
            `https://sports-server-brown.vercel.app/users/${firebaseUser.email}`
          );
          const dbUser = res.data;

          // ✅ Combine Firebase and DB user data
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
          // Set user with Firebase info only
          const token = await getIdToken(firebaseUser);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          setUser({
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: "user", // default role if DB fails
          });
        }
      } else {
        // ✅ Remove token if logged out
        delete axios.defaults.headers.common["Authorization"];
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
