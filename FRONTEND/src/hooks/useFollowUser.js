import api from "../utils/api";// your Axios instance

export const toggleFollow = async (userId) => {
  const res = await api.put(`/api/user/follow/${userId}`);
  return res.data;
};

import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useFollowUser = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleFollow(userId),
    onSuccess: (data) => {
      
      queryClient.invalidateQueries(["all-posts"]); 
      queryClient.invalidateQueries(["profileUser"]); 
      queryClient.invalidateQueries(['suggestedUsers'])
    },
  });
};

