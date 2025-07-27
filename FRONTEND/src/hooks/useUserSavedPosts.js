import api from "../utils/api";// your axios instance

const fetchUserSavedPosts = async (userId) => {
  const res = await api.get(`/api/user/get-user-saved-posts/${userId}`);
  return res.data;
};

import { useQuery } from "@tanstack/react-query";

export const useUserSavedPosts = (userId) => {
  return useQuery({
    queryKey: ["user-saved-posts", userId],
    queryFn: () => fetchUserSavedPosts(userId),
    enabled: !!userId, // prevent auto-fetching if userId is undefined
  });
};
