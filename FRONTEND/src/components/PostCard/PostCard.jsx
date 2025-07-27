import { useState } from "react";
import defpfp from "../../assets/defpfp.webp";
import redheart from "../../assets/red-heart-icon.svg";
import filledsaved from "../../assets/bookmark-color-icon.svg";
import ExtraModal from "./ExtraModal";
import AddComment from "./AddComment";
import useLikePost from "../../hooks/useLikePost";
import useSavePost from "../../hooks/useSavePost";
import CommentModal from "./CommentModal";
import { useFollowUser } from "../../hooks/useFollowUser";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const PostCard = ({ post }) => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [extraModal, setExtraModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const {socket} = useSelector(state=>state.socket)
  const [likesCount , setLikesCount] = useState(post.likes.length)
  // ^ three states will come from backend isfollowed , issaved , isliked , usemutate krke update karna hai and usequery karke isko get karna hai taaki instant updates reflect ho

  // * follow/unfollow karne ka logic START
  const { mutate, isPending: followPending } = useFollowUser(post.author._id);

  const handleFollow = () => {
    mutate(); // no args needed — userId is already passed into hook
  };

  // * like/unlike karne ka logic START
  const { mutate: likePost, isPending: likePending } = useLikePost();
  const handleLike = () => {
    // console.log('clicked')
    likePost(post._id);
  };

  // * save / unsave karne ka logic START
  const { mutate: savePost, isPending: savePending } = useSavePost();
  const handleSave = () => {
    // console.log('clicked')
    savePost(post._id);
  };

  useEffect(() => {
  const handleLikedPost = (load) => {
    if (load.postId === post._id) {
      setLikesCount(load.likes);
    }
  };

  socket?.on("likedPost", handleLikedPost);

  return () => {
    socket?.off("likedPost", handleLikedPost); // Proper cleanup
  };
}, [post._id, likePost]);






  return (
    <div className="w-full sm:w-9/10 md:w-9/10 lg:8rem max-w-[470px] h-fit bg-black border-b-1 border-gray-600 overflow-hidden ">
      {/* Header section : pfp + username + name */}
      <div className="w-full bg-black h-13 flex justify-between ">
        {/* pfp username name */}
        <div className="flex">
          {/* pfp */}
          <div
            onClick={() => navigate(`/profile/${post.author.userName}`)}
            className="h-full py-2 px-2 bg-black cursor-pointer "
          >
            <img
              src={post.author.profileImage || defpfp}
              alt="pfp"
              className="h-full aspect-square rounded-full object-cover border-2 border-white"
              loading="lazy"
            />
          </div>
          {/* username +name */}
          <div className="flex items-center">
            <span
              onClick={() => navigate(`/profile/${post.author.userName}`)}
              className="text-white text-sm font-medium hover:font-bold cursor-pointer"
            >
              {post.author.userName}
            </span>
            {/* <span className="text-white font-bold mx-1">&middot;</span>
            <span className="text-white text-sm">1d</span> */}
            {userData?._id !== post?.author?._id &&
              (!post.isFollowed ? (
                <>
                  <span className="text-white font-bold mx-1">&middot;</span>
                  <span
                    onClick={handleFollow}
                    className="text-blue-400 font-semibold text-sm hover:text-white cursor-pointer"
                  >
                    {followPending ? "Following..." : "Follow"}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-white font-bold mx-1">&middot;</span>
                  <span
                    onClick={handleFollow}
                    className="text-blue-400 font-semibold text-sm hover:text-white cursor-pointer"
                  >
                    {followPending ? "Unfollowing..." : "Unfollow"}
                  </span>
                </>
              ))}
          </div>
        </div>
        {/* three dot icon */}
        {/* it will open/close modal */}
        <div className="flex items-center ml-auto mr-3 mb-3 cursor-pointer">
          {extraModal && (
            <ExtraModal close={setExtraModal} isFollow={post.isFollow} />
          )}
          <span
            onClick={() => setExtraModal((prev) => !prev)}
            className="text-white text-2xl"
          >
            &hellip;
          </span>
        </div>
      </div>
      {/* main image content */}
      <div className="w-full border-1 border-gray-600 min-h-10">
        <img
          src={post.media}
          alt="content-image"
          className="w-full object-cover"
          loading="lazy"
        />
      </div>
      {/* banner = likes comment save share button */}
      <div className="w-full h-13 flex items-center">
        {/* like comment share */}
        <div className="flex px-3 gap-2">
          {/* like */}
          <div className="h-[27px] w-[27px]">
            {!post.isLiked && !likePending ? (
              <svg
                onClick={handleLike}
                aria-label="Like"
                className="text-white cursor-pointer hover:text-red-500 hover:h-[27px] hover:w-[27px]"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Like</title>
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
              </svg>
            ) : (
              <img
                onClick={handleLike}
                src={redheart}
                alt="redheart"
                className="cursor-pointer"
              />
            )}
          </div>

          {/* comment */}
          {commentModal && (
            <CommentModal
              close={setCommentModal}
              media={post.media}
              postId={post._id}
            />
          )}
          <svg
            onClick={() => setCommentModal((prev) => !prev)}
            aria-label="Comment"
            className="text-white cursor-pointer hover:text-green-500"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
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
          {/* share */}
          <svg
            aria-label="Share"
            className="text-white cursor-pointer hover:text-blue-500"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
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
        </div>
        {/* save */}
        <div className="ml-auto px-2">
          {!post.isSaved ? (
            <svg
              onClick={handleSave}
              aria-label="Save"
              className="text-white cursor-pointer hover:text-purple-500"
              fill="currentColor"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
            >
              <title>Save</title>
              <polygon
                fill="none"
                points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></polygon>
            </svg>
          ) : (
            <img
              onClick={handleSave}
              src={filledsaved}
              alt="saeved"
              className=" text-purple-400 h-[24px] w-[24px] cursor-pointer"
            />
          )}
        </div>
      </div>
      {/* no of likes */}
      <div className="w-full h-5 pl-3">
        <span className="text-white text-sm font-medium">
          {" "}
          <span>{likesCount}</span> likes
        </span>
      </div>
      {/* caption section : username + caption */}
      <div className="w-full h-fit text-white px-3 mt-2 mb-1 leading-none ">
        <span className="font-bold text-sm">{post.author.userName}</span>
        <span> </span>
        <span className="text-sm">{post.caption}</span>
      </div>
      {/* comments section */}
      <AddComment postId={post._id} />
    </div>
  );
};

export default PostCard;
