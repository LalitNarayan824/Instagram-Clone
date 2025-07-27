import { format } from "timeago.js";
import defpfp from "../../assets/defpfp.webp";
import { useNavigate } from "react-router";
import api from "../../utils/api";

  const markRead = async (notificationId) =>{
    try {
      const result = await api.get(`/api/user/markAsRead/${notificationId}`);
    } catch (error) {
      console.log(error);
    }
  }

const NotificationCard = ({ noti }) => {
  const navigate = useNavigate()

  

  if(!noti?.isRead){
    markRead(noti._id);
  }


  return (
    <div onClick={()=>navigate(`/profile/${noti?.sender?.userName}`)} className="relative flex items-start justify-between gap-3 mt-2 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer">
      {/* Profile Image */}
      <img
        src={noti?.sender?.profileImage || defpfp}
        alt="profile"
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
      />

      {/* Main Content */}
      <div className="flex-1">
        <p className="text-sm text-zinc-800 dark:text-zinc-100">
          <span className="font-semibold">{noti?.sender?.userName}</span>{" "}
          {noti?.message}
        </p>
        <span
          className="text-xs text-zinc-500"
          title={new Date(noti?.createdAt).toLocaleString()}
        >
          {format(noti?.createdAt)}
        </span>
      </div>

      {/* Optional Post Thumbnail */}
      {noti?.post && (
        <img
          src={noti?.post?.media}
          alt="post"
          className="w-12 h-12 rounded-lg object-cover ml-2"
          loading="lazy"
        />
      )}

      {/* Unread Indicator */}
      {!noti?.isRead && (
        <span className="absolute top-2 left-2 size-3 bg-blue-500 rounded-full" />
      )}
    </div>
  );
};

export default NotificationCard;
