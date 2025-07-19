import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import Error from '../Component/Error';
import About from '../Component/About';
import Register from '@/Pages/Register';
import Login from '@/Pages/Login';
import DashboardPage from '@/Dashboard/DashboardPage';


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
    },
  {
    path: 'login',
    element: <Login></Login>
  },
  {
    path:'dashboard',
    element: <DashboardPage></DashboardPage>
  }
    ]
  },
]);

export default router;