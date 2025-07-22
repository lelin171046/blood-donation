import useAuth from '@/Hook/useAuth';
import React from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const PrivateRoute = ({children}) => {
   const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loader></Loader>;

    if (user) return children;

    return toast.error('Login First') && <Navigate to="/login"  state={{ from: location }} replace /> ;
};

export default PrivateRoute;