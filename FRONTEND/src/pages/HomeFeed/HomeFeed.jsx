import Stories from "../../components/Stories/Stories";
import RightBar from "../../components/RightBar/RightBar";
import PostCard from "../../components/PostCard/PostCard";
import Feed from "./Feed";

const HomeFeed = () => {
  return (
    <>
      <div className="w-full h-full  bg-black flex flex-col overflow-y-auto hide-scrollbar">
        {/* stories will be here too */}
        <Stories />
        {/* feed here */}
        <Feed/>
        {/* <div className="w-full bg-black flex flex-col items-center gap-2 scroll-smooth pt-5 ">
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          
        </div> */}
      </div>
      <RightBar />

    </>
  );
};

export default HomeFeed;
