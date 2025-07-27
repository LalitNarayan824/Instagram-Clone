import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';// axios instance or fetch wrapper

const likeReel = async (reelId) => {
  const res = await api.post(`/api/reel/like/${reelId}` ,{});
  return res.data;
};

const useLikeReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reelId) => likeReel(reelId),
    onSuccess: () => {
      // Invalidate the feed so it refetches
      queryClient.invalidateQueries({ queryKey: ['all-reels'] });
    },
  });
};

export default useLikeReel;
