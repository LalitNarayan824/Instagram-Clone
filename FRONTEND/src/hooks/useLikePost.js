import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';// axios instance or fetch wrapper

const likePost = async (postId) => {
  const res = await api.post(`/api/post/like/${postId}` ,{});
  return res.data;
};

const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => likePost(postId),
    onSuccess: () => {
      // Invalidate the feed so it refetches
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
    },
  });
};

export default useLikePost;
