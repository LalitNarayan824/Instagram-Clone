import { useParams } from "react-router";
import api from "../../utils/api";
import StoryPageCard from "./StoryPageCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const StoryPage = () => {
  const { userName } = useParams();

  const { data: story, isPending } = useQuery({
    queryKey: ["follower-story", userName], // include username in key
    queryFn: async () => {
      const result = await api.get(`/api/story/getByUserName/${userName}`);
      return result.data;
    },
  });

  
  const viewStoryMutation = useMutation({
    mutationFn: (storyId) => api.put(`/api/story/view/${storyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["follower-story", userName]); // refetch updated story
    },
  });

  useEffect(() => {
    if (story?._id) {
      viewStoryMutation.mutate(story._id);
    }
  }, [story]);
  
  if (isPending) return <div>Loading...</div>;


  return (
    <div className="bg-black flex justify-center items-center">
      <StoryPageCard story={story} />
    </div>
  );
};

export default StoryPage;
