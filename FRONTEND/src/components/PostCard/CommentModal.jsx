import { RxCross2 } from "react-icons/rx";
import AddComment from "./AddComment";
import api from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

const CommentModal = ({ close, media, postId }) => {

  const {socket} = useSelector(state=>state.socket)
  

  const fetchComments = async (postId) => {
    const res = await api.get(`/api/post/get-comments/${postId}`);
    return res.data;
  };

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: ({ queryKey }) => fetchComments(queryKey[1]),
    enabled: !!postId, // optional: only run if postId is truthy
  });

  const [allComments , setAllComments] = useState(comments);

  useEffect(() => {
    const handleCommentPost = (data) => {
      if (data.postId === postId) {
        setAllComments(data.comments);
      }
    };

    socket?.on("commentPost", handleCommentPost);

    return () => {
      socket?.off("commentPost", handleCommentPost);
    };
  }, [postId]);

  return (
    <div className="h-screen w-screen fixed top-0 left-0 bg-black z-30 flex items-center justify-center">
      <RxCross2
        onClick={() => close(false)}
        className="absolute h-8 w-8 text-white top-25 right-10 cursor-pointer hover:bg-white rounded-full hover:text-black transition-all"
      />

      <div className="w-fit h-[400px] bg-gray-800 flex overflow-hidden rounded-md">
        {/* Image */}
        <div className="w-[300px] hidden md:block">
          <img
            src={media}
            alt="content"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Comments Section */}
        <div className="w-[370px] h-full flex flex-col justify-between">
          <div className="w-full h-[350px] bg-gray-900 overflow-y-auto hide-scrollbar flex flex-col gap-3 p-3">
            {isLoading ? (
              <p className="text-white text-center">Loading comments...</p>
            ) : comments?.length === 0 ? (
              <p className="text-gray-400 text-center">No comments yet.</p>
            ) : (
              allComments?.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start gap-3 text-white border-b-1 border-gray-500 py-2"
                >
                  <img
                    src={comment.author.profileImage}
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{comment.author.username}</p>
                    <p className="text-sm text-gray-300">{comment.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <AddComment postId={postId} />
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
