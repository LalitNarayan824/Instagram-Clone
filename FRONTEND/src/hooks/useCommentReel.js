import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api'; // axios instance

const commentReel = async ({ reelId, message }) => {
  const res = await api.post(`/api/reel/comment/${reelId}`, { message }); // Assuming this is comment route, not like
  return res.data;
};

const useCommentReel = (reelId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reelId, message }) => commentReel({ reelId, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reel-comments', reelId] });
    },
  });
};

export default useCommentReel;
