import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api'; // axios instance

const commentPost = async ({ postId, message }) => {
  const res = await api.post(`/api/post/comment/${postId}`, { message }); // Assuming this is comment route, not like
  return res.data;
};

const useCommentPost = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, message }) => commentPost({ postId, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};

export default useCommentPost;
