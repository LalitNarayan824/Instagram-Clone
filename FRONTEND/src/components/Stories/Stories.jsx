import { useSelector } from "react-redux";
import StoryCard from "./StoryCard";
import { useRef, useState } from "react";
import defpfp from "../../assets/defpfp.webp";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useNavigate } from "react-router";
import useAllStories from "../../hooks/useAllStories";

const Stories = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  console.log(userData);

  const handleOnClick = () => {
    if (!userData?.story) {
      navigate("/create");
    } else {
      navigate(`/story/${userData.userName}`);
    }
  };

  // todo : even tho story kuch der baad , stories model mein se hat jata hai , but woh fir bhi user ke story mein rahte hai , jisse misinfo hota hai
  // ! is thik karna important hai

  const { data: stories, isPending } = useAllStories();
  // console.log(stories)

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.6; // Feel free to tune speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <div className="w-full bg-black h-[100px] mt-6">
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="max-w-[710px] h-full bg-black mx-auto overflow-x-auto overflow-y-hidden element flex gap-8 items-center px-5  cursor-grab select-none snap-x snap-mandatory"
      >
        <div className="h-full w-[80px] flex flex-col justify-center items-center snap-start">
          {/* users story ko show karne ke liye */}
          <div
            onClick={handleOnClick}
            className={`w-[60px] box-border ${
              userData?.story &&
              "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
            }   p-[3px] rounded-full relative`}
          >
            <div className="bg-black p-1 rounded-full cursor-pointer">
              <img
                src={userData?.profileImage || defpfp}
                alt="Profile picture"
                className="w-[60px] aspect-square rounded-full object-cover"
              />
            </div>
            {!userData?.story && (
              <HiOutlinePlusCircle className="absolute text-white h-[30px] w-[30px] bottom-0 right-0" />
            )}
          </div>

          <span className="text-white">Your Story</span>
        </div>

        {/* stories ko yahan pe map karna hai jo use query se aayega */}
        {stories?.map((story) => {
          const viewerIds = story?.viewers?.map((viewer) => viewer._id); // convert to array of IDs
          const isSeen = viewerIds?.includes(userData._id);

          return (
            <StoryCard
              key={story?._id}
              pfp={story?.author?.profileImage}
              username={story?.author?.userName}
              seen={isSeen}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Stories;
