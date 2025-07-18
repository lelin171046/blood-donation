import { AuthContext } from '@/Provider/AuthProvider';
import React, { useContext } from 'react';

const useAuth = () => {
    const all = useContext(AuthContext)

    return all
};

export default useAuth;