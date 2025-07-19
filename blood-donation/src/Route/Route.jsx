import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import Error from '../Component/Error';
import About from '../Component/About';
import Register from '@/Pages/Register';
import Login from '@/Pages/Login';
import DashboardPage from '@/Dashboard/DashboardPage';
import DonationRequestsPage from '@/Pages/DonationRequest';
import DonationRequestDetailsPage from '@/Pages/DonationRequestDetails';
import Blog from '@/Pages/Blog';


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
  },
  {
    path: 'donation-requests',
    element: <DonationRequestsPage></DonationRequestsPage>
  },{
    path: 'donation-request/:requestId',
    element: <DonationRequestDetailsPage></DonationRequestDetailsPage>
  },
  {
    path: 'blog',
    element: <Blog></Blog>
  }
    ]
  },
]);

export default router;