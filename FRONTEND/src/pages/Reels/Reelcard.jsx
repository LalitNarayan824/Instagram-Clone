import { useEffect, useRef, useState } from "react";
import { VscUnmute } from "react-icons/vsc";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import useLikeReel from "../../hooks/useLikeReel";
import redheart from "../../assets/red-heart-icon.svg";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { useSelector } from "react-redux";
// import ReelCommentModal from "./ReelCommentModal";
const Reelcard = ({ reel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [likesCount , setLikesCount] = useState(reel?.likes.length)
  const navigate = useNavigate();
  const {socket} = useSelector(state=>state.socket)

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMuteUnmute = () => {
    setIsMute(!isMute);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  // * reel like unlike
  const { mutate: likeReel, isPending: likePending } = useLikeReel();
  const handleLike = () => {
    // console.log('clicked')
    likeReel(reel._id);
  };

  const handleDoubleClick = () => {
    setShowHeart(true);

    setTimeout(() => {
      setShowHeart(false);
    }, 600); // 600ms feels better than 6000ms

    if (!reel.isLiked) {
      likeReel(reel._id);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((err) => console.log("Play error:", err));
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
  const handleLikedReel = (load) => {
    if (load.reelId === reel._id) {
      setLikesCount(load.likes);
    }
  };

  socket?.on("likedReel", handleLikedReel);

  return () => {
    socket?.off("likedReel", handleLikedReel); // Proper cleanup
  };
}, [reel._id, likeReel]);

  return (
    <div className="w-full bg-black lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative">
      {/* main video player */}
      <video
        ref={videoRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        loop
        muted={isMute}
        playsInline
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        src={reel?.media}
        className="w-full max-h-full"
      />

      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <img src={redheart} alt="heart" className="w-24 h-24 heart-pop" />
        </div>
      )}

      {/* mute unmute button */}
      {isMute ? (
        <IoVolumeMuteOutline
          onClick={handleMuteUnmute}
          className="text-white absolute top-5 right-5 z-10 text-2xl cursor-pointer"
        />
      ) : (
        <VscUnmute
          onClick={handleMuteUnmute}
          className="text-white absolute top-5 right-5 z-10 text-2xl cursor-pointer"
        />
      )}
      {/* progress bar placeholder */}
      <div className="absolute w-full left-0 bottom-0 h-[3px] bg-gray-900">
        {/* progress bar dynamic */}
        <div
          className="w-[200px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>

        {/* author info + caption */}
        <div className="w-full absolute flex flex-col justify-start bottom-[10px] h-[60px] pl-3">
          {/* author info */}
          <div className="w-full flex">
            {/* author pfp */}
            <div
              onClick={() => navigate(`/profile/${reel.author.userName}`)}
              className="w-[35px] h-[35px] rounded-full overflow-hidden flex items-center gap-2 justify-center border-2 border-white cursor-pointer"
            >
              <img
                src={reel?.author?.profileImage}
                alt="profile image"
                className="w-full object-cover"
              />
            </div>
            {/* author username */}
            <div
              onClick={() => navigate(`/profile/${reel.author.userName}`)}
              className="ml-3 cursor-pointer"
            >
              <span className="text-white font-mono">
                {reel.author.userName}
              </span>
            </div>
          </div>
          {/* caption */}
          <div className="">
            <span className="text-white text-sm opacity-80">
              {reel.caption}
            </span>
          </div>
        </div>

        {/* like comment share */}

        <div className="absolute right-0 bottom-[10px] w-[60px] h-[250px]  flex flex-col items-center justify-between gap-1 py-3 z-30">
          {/* like */}
          <div className=" flex flex-col items-center">
            {!reel.isLiked && !likePending ? (
              <svg
                onClick={handleLike}
                aria-label="Like"
                className="text-white cursor-pointer hover:text-red-500 "
                fill="currentColor"
                height="30"
                role="img"
                viewBox="0 0 24 24"
                width="30"
              >
                <title>Like</title>
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
              </svg>
            ) : (
              <img
                onClick={handleLike}
                src={redheart}
                alt="redheart"
                className="cursor-pointer w-[30px]"
              />
            )}
            <span className="text-white">{likesCount}</span>
          </div>
          {/* comment */}
          <div
            onClick={() => navigate(`/reels/comments/${reel._id}`)}
            className="flex flex-col items-center"
          >
            <svg
              aria-label="Comment"
              className=" text-white cursor-pointer "
              fill="currentColor"
              height="30"
              role="img"
              viewBox="0 0 24 24"
              width="30"
            >
              <title>Comment</title>
              <path
                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            <span className="text-white">{reel.comments.length}</span>
          </div>

          {/* share */}
          <svg
            aria-label="Share"
            className="text-white cursor-pointer"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>Share</title>
            <line
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              x1="22"
              x2="9.218"
              y1="3"
              y2="10.083"
            ></line>
            <polygon
              fill="none"
              points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
            ></polygon>
          </svg>
          {/* three dot */}
          <PiDotsThreeOutlineVertical className="text-white h-[20px] w-[20px] cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Reelcard;
