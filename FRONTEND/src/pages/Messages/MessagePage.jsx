import { useQuery } from "@tanstack/react-query";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router";
import api from "../../utils/api";
import defpfp from '../../assets/defpfp.webp'

const MessagePage = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const {onlineUsers} =useSelector(state=>state.socket)

  // ^ previos chats ko fetch karne ke liye
  const {
    data: prevChats = [],
    isLoading: chatLoading,
    isError: chatError,
  } = useQuery({
    queryKey: ["prev-chats"],
    queryFn: async () => {
      const res = await api.get(`/api/message/prevChats`);
      return res.data;
    },
    onSuccess: (data) => {},
    onError: (error) => {
      console.error("Error fetching user:", error);
    },
  });

  console.log(prevChats);

  return (
    <div className="h-screen w-screen bg-black flex ">
      {/* here all the previous chats will be shown + a search feature */}
      <div className="h-screen bg-black w-screen sm:max-w-[300px] lg:max-w-[400px] relative flex flex-col justify-start border-0  md:border-r-1 border-gray-500">
        {/* back button */}
        <div
          onClick={() => navigate('/')}
          className="absolute h-[32px] w-[32px] top-7 left-3 rounded-full "
        >
          <IoArrowBackCircleOutline className="h-[30px] w-[30px] text-white  hover:bg-white hover:text-black rounded-full" />
        </div>

        {/* current user info */}
        <div className="w-full h-[80px] bg-gray-900 pl-15">
          <div
            onClick={() => navigate(`/profile/${userData?.userName}`)}
            className="flex gap-4 justify-start items-center mt-4 my-4 cursor-pointer border-b-1 border-gray-800 pb-4"
          >
            <div className="border-2 border-white rounded-full">
              <img
                src={userData?.profileImage || defpfp}
                alt="user profile image"
                className="h-[50px] w-[50px] rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-0 p-0">
              {/* username */}
              <p className="text-lg font-bold text-white">
                {userData?.userName}
              </p>
              {/* name */}
              <p className="text-white ml-1 truncate">{userData?.name}</p>
            </div>
          </div>
        </div>
        {/* prev chats yahan dikhega */}
        <div className="w-full flex-1 bg-black flex flex-col">
          {prevChats?.map((last, index) => (
            <div
              key={index}
              onClick={()=>navigate(`/message/conv/${last?.user?.userName}`)}
              className="w-full h-fit py-3 px-3 flex items-center gap-3 bg-black border-b border-gray-700 hover:bg-gray-800 transition-all cursor-pointer"
            >
              <div className="size-[44px] relative rounded-full  border border-white flex items-center justify-center">
                <img
                  src={last?.user?.profileImage || defpfp}
                  alt="pfp"
                  className="w-full h-full object-cover rounded-full"
                />

                {onlineUsers?.includes(last?.user?._id) && <div className="absolute top-1 right-0 size-3 rounded-full bg-green-300"></div>}
              </div>

              <div className="flex flex-col overflow-hidden">
                <span className="text-white font-semibold truncate">
                  {last?.user?.userName}
                </span>
                <span className="text-gray-400 text-sm truncate max-w-[200px]">
                  {last?.lastMessage?.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* outlet to show the chats  */}

      <Outlet />
    </div>
  );
};

export default MessagePage;
