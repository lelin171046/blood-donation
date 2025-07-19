import React, { createContext, useEffect, useState } from 'react';
export const AuthContext = createContext(null)
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { app } from '@/FireBase/firebase.config';

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    //createUser

    const createUser = (email, password) =>{
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    //signIn
    
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
      }

//signInWithGoogle
      const signInWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
      }



//logOut

      const logOut = async () => {
        setLoading(true)
        
        return signOut(auth)
      }

//updateUserProfile

      const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photo,
        })
      }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
          setUser(currentUser)
          // console.log('CurrentUser-->', currentUser)
          setLoading(false)
        })
        return () => {
          return unsubscribe()
        }
      }, [])
    const authInfo = {
        createUser,
        user,
        signIn,
        signInWithGoogle,
        logOut,
        updateUserProfile


    } 

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;