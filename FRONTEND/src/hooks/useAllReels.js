import api from "../utils/api";// your axios instance

const fetchAllReels = async () => {
  const res = await api.get(`/api/reel/getAll`);
  return res.data;
};

import { useQuery } from "@tanstack/react-query";

export const useAllReels = () => {
  return useQuery({
    queryKey: ["all-reels"],
    queryFn: () => fetchAllReels(),
    
  });
};
