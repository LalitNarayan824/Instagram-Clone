import { useState } from "react";
import Posts from "./Posts";
import Saved from "./Saved";

const BottomContent = ({userId}) => {
  const [type, setType] = useState("posts");

  return (
    // this is the bottom contennt section
    <div className="w-full  border-t-1  border-gray-800 h-[70px] ">
      {/* it shows the content type */}
      <div className="w-full h-[40px]  flex justify-center gap-10">
        <div
        onClick={()=>setType('posts')}
          className={`h-full w-fit  mx-3 text-gray-400  flex items-center uppercase cursor-pointer gap-3 ${
            type === "posts" && "border-t-3 border-gray-200 text-white"
          } `}
        >
          <svg aria-label="posts" className="text-white" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><rect fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
          <span>Posts</span>
        </div>
        <div
        onClick={()=>setType('saved')}
          className={`h-full w-fit  mx-3 text-gray-400  flex items-center uppercase cursor-pointer gap-3 ${
            type === "saved" && "border-t-3 border-gray-200  text-white"
          } `}
        >
          <svg aria-label="saved" className="text-white" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
          <span>Saved</span>
        </div>
        
      </div>
      {type === 'posts' && <Posts userId={userId}/>}
      {type === 'saved' && <Saved userId={userId}/>}
    </div>
  );
};

export default BottomContent;
