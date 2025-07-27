import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const useAllStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await api.get("/api/story/get-all-stories");
      return res.data;
    },
  });
};

export default useAllStories;
