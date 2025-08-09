import React from 'react';
import { Users, Heart, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/Hook/useAxiosSecure';

const DashboardHome = () => {
  // Sample data - you can replace these with actual data from your state/props
  const stats = {
    totalDonors: 1247,
    totalFunding: 45280,
    totalBloodRequests: 89
  };
  const axiosSecure = useAxiosSecure();

    const { refetch, data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users', 
        // { headers: {
        //   authorization : `Bearer ${localStorage.getItem('access-token')}`
        // }}
      );
     
      return res.data;
    }
  });
  const { data: donationRequests = [] } = useQuery({
  queryKey: ['donationRequests'],
  queryFn: async () => {
    const res = await axiosSecure.get('/api/donation-requests/all');
    return res.data;
  }
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome Back! 👋
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Thank you for being part of our life-saving community
              </p>
              <p className="text-gray-500">
                Together, we're making a difference one donation at a time. 
                Your generosity helps save lives and support those in need.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Donors Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {users?.length}
                </h3>
                <p className="text-gray-600 font-medium">Total Donors</p>
                <p className="text-sm text-gray-500 mt-2">
                  Registered community members
                </p>
              </div>
            </div>
          </div>

          {/* Total Funding Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  ${stats.totalFunding.toLocaleString()}
                </h3>
                <p className="text-gray-600 font-medium">Total Funding</p>
                <p className="text-sm text-gray-500 mt-2">
                  Community contributions raised
                </p>
              </div>
            </div>
          </div>

          {/* Total Blood Donation Requests Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-t-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {donationRequests.length}
                </h3>
                <p className="text-gray-600 font-medium">Blood Requests</p>
                <p className="text-sm text-gray-500 mt-2">
                  Active donation requests
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Every Drop Counts</h2>
            <p className="text-red-100">
              Your donations and contributions make a real difference in saving lives. 
              Thank you for being a hero in our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;