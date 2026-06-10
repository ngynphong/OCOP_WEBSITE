import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import Cookies from 'js-cookie';
import { authApi } from '../api/authApi';
import { setCredentials, setForcedLogout } from '@/store/features/authSlice';
import { useEffect } from 'react';

export const useAuthProfile = () => {
  const { isAuthenticated, roles: reduxRoles } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (profileQuery.isSuccess && profileQuery.data?.data?.roles) {
      const serverRoles = profileQuery.data.data.roles;
      const serverRolesStr = JSON.stringify(serverRoles);
      const reduxRolesStr = JSON.stringify(reduxRoles);

      if (serverRolesStr !== reduxRolesStr) {
        console.warn('Local roles do not match server roles. Overwriting...');
        localStorage.setItem('user_roles', serverRolesStr);
        Cookies.set('user_roles', serverRolesStr, { expires: 7 });

        const token = localStorage.getItem('access_token');
        if (token) {
          dispatch(setCredentials({ token, roles: serverRoles }));
        }
      }

      const hasSellerOnServer = serverRoles.includes('SELLER');
      const hasSellerOnClient = reduxRoles.includes('SELLER');

      if (hasSellerOnServer && !hasSellerOnClient) {
        dispatch(setForcedLogout(true));
      }
    }
  }, [profileQuery.isSuccess, profileQuery.data, reduxRoles, dispatch]);

  return {
    profile: profileQuery.data?.data,
    isLoadingProfile: profileQuery.isLoading,
    isErrorProfile: profileQuery.isError,
    refetchProfile: profileQuery.refetch,
  };
};
