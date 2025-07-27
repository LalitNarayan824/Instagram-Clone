import { useQuery } from "@tanstack/react-query";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import api from "../../utils/api";
import LoadingPage from "../LoadingPage";
import defpfp from "../../assets/defpfp.webp";
import { BiImageAdd } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { useRef, useState , useEffect } from "react";
import { useSendMessage } from "../../hooks/useSendMessage";
import SenderChat from "../../components/chat/SenderChat";
import ReceiverChat from "../../components/chat/ReceiverChat";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const navigate = useNavigate();
  const { receiverUserName: userName } = useParams();
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const {socket} = useSelector(state=>state.socket)
  const [realtimeMessages, setRealtimeMessages] = useState([]);

  const imageInput = useRef(null);


  // ^ use query to get profile data of the user through username feom the params
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profileData", userName],
    queryFn: async () => {
      const res = await api.get(`/api/user/getProfile/${userName}`);
      return res.data;
    },
    onSuccess: (data) => {},
    onError: (error) => {
      console.error("Error fetching user:", error);
    },
  });

  // ^ chat messages fecth karne wala query
 const {
  data: chatData = [],
  isLoading: chatLoading,
  isError: chatError,
} = useQuery({
  queryKey: ["chat-messages", profileData?._id],
  queryFn: async () => {
    const res = await api.get(`/api/message/getAll/${profileData?._id}`);
    return res.data;
  },
  enabled: !!profileData?._id, // ✅ Only run when profileData._id exists
  onSuccess: (data) => {
    // handle success
  },
  onError: (error) => {
    console.error("Error fetching user:", error);
  },
});


  // console.log(chatData);

  // ^ use mutation use karke message send karenge and invalidate karenge the message fetch karne wala use query
  const receiverId = profileData?._id;
  const sendMessageMutation = useSendMessage(receiverId);

  // inside the form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    sendMessageMutation.mutate({
      text: input,
      image: backendImage,
    });

    setInput("");
    setBackendImage(null);
    setFrontendImage(null);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  useEffect(() => {
  if (!socket || !profileData?._id) return;

  const handleNewMessage = (message) => {
    
    
      setRealtimeMessages((prev) => [...prev, message]);
    
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [socket, profileData?._id]);

const allMessages = [...chatData, ...realtimeMessages];


  

  

  if (isLoading || chatLoading) return <LoadingPage />;
  if (isError || chatError) return <h1>Some error happended</h1>;

  return (
    <div className="fixed sm:relative h-screen w-screen sm:w-full bg-black flex flex-col justify-start">
      {/* backbutton */}
      <div
        onClick={() => navigate('/message')}
        className="absolute  md:hidden h-[32px] w-[32px] top-7 left-3 rounded-full "
      >
        <IoArrowBackCircleOutline className="h-[30px] w-[30px] text-white  hover:bg-white hover:text-black rounded-full" />
      </div>
      {/* receivers info */}
      <div className="w-full h-[80px] bg-gray-900  pl-15 md:pl-3">
        <div className="flex gap-4 justify-start items-center mt-4 my-4 cursor-pointer  pb-4">
          <div className="border-2 border-white rounded-full">
            <img
              src={profileData?.profileImage || defpfp}
              alt="user profile image"
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-0 p-0">
            {/* username */}
            <p className="text-lg font-bold text-white">
              {profileData?.userName}
            </p>
            {/* name */}
            <p className="text-white ml-1">{profileData?.name}</p>
          </div>
        </div>
      </div>
      {/* chats  */}
      <div className="flex-1 bg-black w-full flex flex-col  overflow-y-auto hide-scrollbar px-1 py-2 relative"  >
        {allMessages?.map((chat)=>{
          if(chat?.sender?.userName !== profileData?.userName){
            return (
              <SenderChat key={chat._id} chat={chat} />
            )
          }else{
            return (
              <ReceiverChat key={chat._id} chat={chat} />
            )
          }
        })}
        
        
        
      
      </div>
      {/* message send karne ke liyw */}
      <form onSubmit={handleSubmit} className="w-full h-[70px] bg-gray-900 py-2 px-4 flex gap-2 items-center justify-center relative">
        {frontendImage && (
          <div className="absolute bottom-[80px] left-[100px] w-[100px] overflow-hidden rounded-md border-1 border-white">
            <img
              src={frontendImage}
              alt="selected-image"
              className="w-full object-cover"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          hidden
          onChange={handleImage}
        />
        <BiImageAdd
          onClick={() => imageInput.current.click()}
          className="text-white size-[30px] cursor-pointer"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full max-w-[800px] h-full rounded-xl bg-gray-800 outline-none text-white pl-3"
          placeholder="Message here ..."
        />
        {(input || frontendImage) && (
          <button
            type="submit"
            className="cursor-pointer p-[8px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center"
          >
            <IoSend className="text-white size-[30px]" />
          </button>
        )}
        {sendMessageMutation.isPending && <span className="text-white">wait.. </span>}
      </form>
    </div>
  );
};

export default ChatPage;
