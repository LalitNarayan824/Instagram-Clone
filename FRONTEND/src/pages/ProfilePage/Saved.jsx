import { useUserSavedPosts } from "../../hooks/useUserSavedPosts";

const Saved = ({ userId }) => {
  const { data: posts, isLoading } = useUserSavedPosts(userId);

  if (isLoading) return <div>Loading...</div>;
  if(posts?.length === 0 ) return <span className="text-white " > No posts yet </span>
  return (
    <div className="max-w-[1000px] mx-auto columns-3 gap-4 p-2">
      {posts?.map((post) => (
        <div
          key={post._id}
          className="mb-4 break-inside-avoid rounded overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src={post.media}
            alt="post"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default Saved;
