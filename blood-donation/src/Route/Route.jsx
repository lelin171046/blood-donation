import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import Error from '../Component/Error';
import About from '../Component/About';
import Register from '@/Pages/Register';
import Login from '@/Pages/Login';
import DashboardPage from '@/Dashboard/DashboardPage';
import DonationRequestDetailsPage from '@/Pages/DonationRequestDetails';
import Blog from '@/Pages/Blog';
import Funding from '@/Pages/Funding';
import SearchPage from '@/Pages/SearchPage';
import MyDonationRequests from '@/Dashboard/MyDonationRequests';
import DonorDashboard from '@/Dashboard/DonorDashboard';
import CreateRequest from '@/Pages/CreateRequest';
import PrivateRoute from './PrivateRoute';
import AllUsersPage from '@/Dashboard/AllUsersPage';
import AllBloodDonationRequestPage from '@/Dashboard/AllBloodDonationRequestPage';
import DonationRequests from '@/Pages/DonationRequest';
import DashboardHome from '@/Dashboard/DashboardHome';
import UpdateRequest from '@/Pages/UpdateRequest';
import Example from '@/Dashboard/AddBlog';
import InvoicePage from '@/Component/page';
import LiveStream from '@/Component/page';
import ManageBlogs from '@/Dashboard/ManageBlogs';
import BlogDetails from '@/Pages/BlogDetails';


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
      // {
      //   path: 'dashboard',
      //   element: <DashboardPage></DashboardPage>
      // },
      {
        path: 'donation-requests',
        element: <DonationRequests></DonationRequests>
      }, {
        path: 'donation-request/:id',
        element: <DonationRequestDetailsPage></DonationRequestDetailsPage>,
        

      },
      {
        path: 'blog',
        element: <Blog></Blog>
      },
      {
        path: 'funding',
        element: <Funding></Funding>
      },
      {
        path: 'invoice',
        element: <LiveStream></LiveStream>
      },
      {
        path: 'search',
        element: <SearchPage></SearchPage>
      },
      {
        path: 'donor-dashboard',
        element: <DonorDashboard></DonorDashboard>
      },
      {
        path: 'blog/:id',
        element: <BlogDetails></BlogDetails>
      }
     

    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardPage></DashboardPage></PrivateRoute>,
    children: [
      {
        path: 'all-users',
        element: <AllUsersPage></AllUsersPage>
      },
      {
        path: 'dashboard-home',
        element: <DashboardHome></DashboardHome>

      },
      {
        path: 'my-donation-requests',
        element: <MyDonationRequests></MyDonationRequests>
      },
      {
        path: 'all-blood-donation-request',
        element: <AllBloodDonationRequestPage></AllBloodDonationRequestPage>
      },
      {
        path: 'create-request',
        element: <CreateRequest></CreateRequest>
      },
       {
        path: 'update-request/:id',
        element: <UpdateRequest></UpdateRequest>
      },
      {
        path: 'content-manage/add-blog',
        element: <Example></Example>
      },
      {
        path: 'manage-content',
        element: <ManageBlogs></ManageBlogs>
      }
    ]
  }
]);

export default router;