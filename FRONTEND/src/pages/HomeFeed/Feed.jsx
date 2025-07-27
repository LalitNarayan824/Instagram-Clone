
import {useQuery} from '@tanstack/react-query'
import PostCard from "../../components/PostCard/PostCard";
import api from "../../utils/api";

const fetchAllPosts = async () => {
  const res = await api.get("/api/post/all");
  return res.data;
};



const Feed = () => {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["all-posts"],
    queryFn: fetchAllPosts,
  });

  // console.log("posts:", posts); // 🔍 Log what you're getting

  if (isLoading) return <div className="text-center py-4"><b>Loading...</b></div>;
  if (isError) return <div className="text-center py-4 text-red-500"><b>Error loading posts</b></div>;

  if (!Array.isArray(posts)) return <div>No posts available</div>; // 👈 Guard check

  return (
    <div className="w-full bg-black flex flex-col items-center gap-2 scroll-smooth pt-5 ">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};


export default Feed;
