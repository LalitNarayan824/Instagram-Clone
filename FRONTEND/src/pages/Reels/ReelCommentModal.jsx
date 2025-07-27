import { RxCross2 } from "react-icons/rx";

import api from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import AddReelComment from "./AddReelComment";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ReelCommentModal = () => {
  const navigate = useNavigate();
  const { reelId } = useParams();
  const {socket} = useSelector(state=>state.socket)
  const fetchComments = async (reelId) => {
    const res = await api.get(`/api/reel/get-comments/${reelId}`);
    return res.data;
  };

  const { data: comments, isLoading } = useQuery({
    queryKey: ["reel-comments", reelId],
    queryFn: ({ queryKey }) => fetchComments(queryKey[1]),
    enabled: !!reelId, // optional: only run if postId is truthy
  });

  const [allComments , setAllComments] = useState(comments);

  useEffect(() => {
      const handleCommentReel = (data) => {
        if (data.reelId === reelId) {
          setAllComments(data.comments);
        }
      };
  
      socket?.on("commentReel", handleCommentReel);
  
      return () => {
        socket?.off("commentReel", handleCommentReel);
      };
    }, [reelId, comments] );

  useEffect(() => {
  if (comments) {
    setAllComments(comments);
  }
}, [comments]);


  

  return (
    <div className="h-full w-full fixed top-0 left-0 bg-black flex items-center justify-center z-100">
      <RxCross2
        onClick={() => navigate(-1)}
        className="absolute h-8 w-8 text-white top-6 right-10 cursor-pointer hover:bg-white rounded-full hover:text-black transition-all"
      />

      <div className="relative w-fit h-[400px] bg-gray-800 flex overflow-hidden rounded-md">
        {/* Comments Section */}
        <div className="w-[370px] h-full flex flex-col justify-between">
          <div className="w-full h-[350px] bg-gray-900 overflow-y-auto hide-scrollbar flex flex-col gap-3 p-3">
            {isLoading ? (
              <p className="text-white text-center">Loading comments...</p>
            ) : allComments?.length === 0 ? (
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
          <AddReelComment reelId={reelId} />
        </div>
      </div>
    </div>
  );
};

export default ReelCommentModal;
