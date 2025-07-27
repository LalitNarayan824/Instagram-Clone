
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import api from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../LoadingPage";
import NotificationCard from "./NotficationCard";


const Notification = () => {
  const navigate = useNavigate();
  
  // ^notifications fecth karne wala query
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get(`/api/user/getAllNotifications`);
      return res.data;
    },

    onError: (error) => {
      console.error("Error fetching notifications: ", error);
    },
  });
  // console.log(notifications);

  


  if (isLoading) return <LoadingPage />;

  return (
    <div className="w-full h-full relative bg-black flex flex-col items-center">
      {/* back arrow */}
      <div
        onClick={() => navigate(-1)}
        className="absolute h-[32px] w-[32px] top-5 left-3 rounded-full "
      >
        <IoArrowBackCircleOutline className="h-[30px] w-[30px] text-white  hover:bg-white hover:text-black rounded-full" />
      </div>

      <div className="w-full h-[70px] flex justify-center items-center mt-3">
        <span className="text-white text-lg md:text-xl">Notifications</span>
      </div>
      <div className="w-[400px] sm:w-[500px] md:w-[600px] lg:w-[700px]  h-full my-3 overflow-y-auto hide-scrollbar scroll-smooth">
        {notifications.length >0 &&  [...notifications].reverse().map((noti) => (
          <NotificationCard key={noti?._id} noti={noti} />
        ))}
        {notifications.length ===0 && <span className="text-white mt-6 "> No Notifications for now </span>}
      </div>
    </div>
  );
};

export default Notification;
