import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';// axios instance or fetch wrapper

const savePost = async (postId) => {
  const res = await api.post(`/api/post/save/${postId}` ,{});
  return res.data;
};

const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => savePost(postId),
    onSuccess: () => {
      // Invalidate the feed so it refetches
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
    },
  });
};

export default useSavePost;