import React, { createContext, useEffect, useState } from 'react';
export const AuthContext = createContext(null)
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { app } from '@/FireBase/firebase.config';
import useAxiosPublic from '@/Hook/useAxiosPublic';

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const axiosPublic = useAxiosPublic()

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
  setLoading(true);
  localStorage.removeItem('access-token'); // Remove token
  return signOut(auth);
};

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
          //get jwt token & store  client site
          const userInfo ={ email: currentUser.email}
          axiosPublic.post('/jwt', userInfo)
          .then(res =>{
            if(res.data.token){
              localStorage.setItem('access-token', res.data.token);
                            setLoading(false)

            }
            else{
              localStorage.removeItem('access-token')
              setLoading(false)
            }
          })

          // console.log('CurrentUser-->', currentUser)
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
        updateUserProfile,
        loading


    } 

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;