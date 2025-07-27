import { useEffect } from "react";
import { useRef } from "react";


const SenderChat = ({ chat }) => {

  const chatRef = useRef(null)
  
    useEffect(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
      }, []);

  return (
    <div ref={chatRef} className="w-full h-fit flex justify-end pr-3 py-1">
      <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[70%] shadow-md">
        { chat?.image && <img src={chat?.image} alt="chat=image" className="w-[100px] object-cover rounded-md" />}
        <span className="font-lg break-words">{chat?.message}</span>
      </div>
    </div>
  );
};



export default SenderChat

