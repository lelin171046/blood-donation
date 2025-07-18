import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import Error from '../Component/Error';
import About from '../Component/About';
import Register from '@/Pages/Register';


const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error></Error>,
    element: <Layout></Layout>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
    {
      path: 'about',
      element: <About></About>

    },
    {
      path: 'register',
      element: <Register></Register>
    }
    ]
  },
]);

export default router;