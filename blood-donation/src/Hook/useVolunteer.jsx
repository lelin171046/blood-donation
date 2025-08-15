import React from 'react';
import useAuth from './useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useVolunteer = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: isVolunteer ,
    isPending: isAdminLoading,
  } = useQuery({
    queryKey: [user?.email, 'isVolunteer'],
    enabled: !!user?.email, // ✅ Don't run query if email is undefined
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/volunteer/${user?.email}`);
      // console.log(res.data);
      return res.data?.volunteer;
    },
  });

  return [isVolunteer, isAdminLoading];
};

export default useVolunteer;
