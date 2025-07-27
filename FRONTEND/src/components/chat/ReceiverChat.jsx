import { useEffect } from "react";
import { useRef } from "react";


const ReceiverChat = ({ chat }) => {

  const chatRef = useRef(null)

  useEffect(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);


  return (
    <div ref={chatRef} className="w-full h-fit flex justify-start pl-3 py-1">
      <div className="bg-white text-black px-4 py-2 rounded-2xl rounded-tl-none max-w-[70%] shadow-sm">
        { chat?.image && <img src={chat?.image} alt="chat=image" className="w-[100px] object-cover rounded-md" />}
        <span className="font-medium break-words">{chat?.message}</span>
      </div>
    </div>
  );
};


export default ReceiverChat
