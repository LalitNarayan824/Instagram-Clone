import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { setSuggestedUsers } from '../redux/userSlice';

const fetchSuggestedUsers = async () => {
  const { data } = await api.get('/api/user/suggested');
  return data;
};

const useSuggestedUsers = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: fetchSuggestedUsers,
    onSuccess: (data) => {
      dispatch(setSuggestedUsers(data));
    },
    onError: (err) => {
      console.log(`Error in get suggested users: ${err}`);
    },
    staleTime: 1000 * 60 * 5, // optional: 5 min cache
  });

  return query; // includes: { data, isLoading, isError, refetch, etc. }
};

export default useSuggestedUsers;
