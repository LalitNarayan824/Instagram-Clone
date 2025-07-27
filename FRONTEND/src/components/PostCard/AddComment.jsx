import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import useCommentPost from "../../hooks/useCommentPost";

const AddComment = ({ postId }) => {
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData, event) => {
    setComment((prev) => prev + emojiData.emoji);
  };

  const { mutate: postComment , isPending} = useCommentPost(postId);

  const handleComment = () => {
    postComment({ postId: postId, message: comment });
  };

  return (
    <div className="w-full relative h-13 flex items-center mb-2">
      {showPicker && (
        <div className="absolute bottom-12 z-50 w-[100px]">
          <EmojiPicker onEmojiClick={handleEmojiClick} className="w-[100px]" />
        </div>
      )}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-[30px] cursor-pointer"
      >
        😊
      </button>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a Comment..."
        className="w-full outline-none text-white ml-3"
      />
      {comment === "" ? (
        <div className="ml-auto mr-3">
          <span className="text-gray-500">Post</span>
        </div>
      ) : (
        <div onClick={handleComment} className="ml-auto mr-3">
          <span className="text-blue-500 hover:text-blue-400 cursor-pointer">
            {isPending ? 'Posting...' : 'Post'}
          </span>
        </div>
      )}
    </div>
  );
};

export default AddComment;
