import React, { useContext, useState, useEffect } from "react";
import { firebaseAuth } from "../../firebase";
import {
  // createUserWithEmailAndPassword,
  onAuthStateChanged,
  // sendPasswordResetEmail,
  // signInWithEmailAndPassword,
  // signOut,
  User as FirebaseUser,
} from "firebase/auth";

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = React.createContext({
  currentUser: {} as FirebaseUser | null,
  setCurrentUser: (_user: FirebaseUser) => {},
  // signup: () => {},
  // login: () => {},
  // logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // const signup = (email: string, password: string) => {
  //   return createUserWithEmailAndPassword(firebaseAuth, email, password);
  // };

  // const login = (email: string, password: string) => {
  //   return signInWithEmailAndPassword(firebaseAuth, email, password);
  // };

  // const logout = () => {
  //   return signOut(firebaseAuth);
  // };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user: FirebaseUser | null) => {
        setCurrentUser(user);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    // login,
    // signup,
    // logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
