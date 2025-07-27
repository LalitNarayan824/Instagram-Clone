import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import defpfp from "../../assets/defpfp.webp";
import { useEffect, useState } from "react";
import VideoPlayer from "../../components/VideoPlayer";
import { RiEyeLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";

const StoryPageCard = ({ story }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);

  // console.log(progress)

  console.log(story);
  return (
    <div className="w-full max-w-[500px] h-screen border-r-1 border-l-1 border-gray-600 relative">
      <div
        onClick={() => navigate(-1)}
        className="absolute h-[40px] w-[40px] top-5 left-3 rounded-full z-20 "
      >
        <IoArrowBackCircleOutline className="h-[38px] w-[38px] text-white  hover:bg-white hover:text-black rounded-full" />
      </div>

      <div className="absolute w-full left-0 top-0 h-[3px] bg-gray-900 z-20">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* author info */}
      <div className="w-full flex items-center absolute top-6 left-16 z-20">
        {/* author pfp */}
        <div
          onClick={() => navigate(`/profile/${story?.author?.userName}`)}
          className="w-[35px] h-[35px] rounded-full overflow-hidden flex items-center gap-2 justify-center border-2 border-white cursor-pointer"
        >
          <img
            src={story?.author?.profileImage || defpfp}
            alt="profile image"
            className="w-full object-cover"
          />
        </div>
        {/* author username */}
        <div
          onClick={() => navigate(`/profile/${story?.author?.userName}`)}
          className="ml-3 cursor-pointer"
        >
          <span className="text-white font-mono">
            {story?.author?.userName}
          </span>
        </div>
      </div>

      {/* image or video */}
      {story?.mediaType === "image" && (
        <div className="h-full w-full flex items-center justify-center overflow-hidden">
          <img
            src={story.media}
            alt="story image"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {story?.mediaType === "video" && (
        <div className="h-full w-full">
          <VideoPlayer media={story.media} />
        </div>
      )}

      {story?.author.userName === userData?.userName && (
        <div
          onClick={() => setShowViewers((prev) => !prev)}
          className="absolute left-3 bottom-10 flex gap-2 items-center cursor-pointer"
        >
          <RiEyeLine className="text-white h-[30px] w-[30px]" />
          <span className="text-white font-semibold">
            {story.viewers.length}
          </span>
        </div>
      )}

      {story?.author.userName === userData?.userName && showViewers && (
        <div className="w-full absolute bottom-0 left-0 h-[500px] bg-gray-800 z-100 flex flex-col justify-end ">
          <div className="w-full flex  justify-between items-center px-4">
            <span className="text-white text-lg my-4">Viewers</span>
            <RxCross2
              onClick={() => setShowViewers((prev) => !prev)}
              className="h-[30px] w-[30px] text-white rotate-180 rounded-full cursor-pointer"
            />
          </div>
          <div className="w-full h-[440px] bg-gray-900 flex flex-col gap-2 justify-start overflow-y-auto hide-scrollbar">
            {story?.viewers?.map((viewer, index) => (
              <div key={index} className="w-full flex items-center ml-3 mt-3 z-20">
                {/* author pfp */}
                <div
                  
                  className="w-[35px] h-[35px] rounded-full overflow-hidden flex items-center gap-2 justify-center border-2 border-white cursor-pointer"
                >
                  <img
                    src={viewer?.profileImage || defpfp}
                    alt="profile image"
                    className="w-full object-cover"
                  />
                </div>
                {/* author username */}
                <div
                  
                  className="ml-3 cursor-pointer"
                >
                  <span className="text-white font-mono">
                    {viewer?.userName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryPageCard;
