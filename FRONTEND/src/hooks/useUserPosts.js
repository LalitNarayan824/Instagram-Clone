import api from "../utils/api";// your axios instance

const fetchUserPosts = async (userId) => {
  const res = await api.get(`/api/user/get-user-posts/${userId}`);
  return res.data;
};

import { useQuery } from "@tanstack/react-query";

export const useUserPosts = (userId) => {
  return useQuery({
    queryKey: ["user-posts", userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId, // prevent auto-fetching if userId is undefined
  });
};
