import { useState } from "react";
import mainLogo from "../../assets/main-logo.png";
import defpfp from "../../assets/defpfp.webp";
import MoreOption from "../LeftBar/MoreOption";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const SmallLeftBar = () => {
  const [openMore , setOpenMore ] = useState(false);
  const navigate = useNavigate()
  const {userData} = useSelector(state=>state.user);
  
  
  return (
    <div className="bg-black hidden md:flex lg:hidden min-w-[80px] h-screen border-r border-gray-800 flex-col gap-2 justify-start items-center box-border pt-8">
      {/* main logo */}
      <div className="flex items-center justify-center cursor-pointer">
        <img src={mainLogo} alt="main-logo" className="h-[35px] w-[35px] " />
      </div>

      <div className="flex flex-col gap-7 sm:gap-8 md:gap9 mt-9 items-center justify-between">
        {/* Home */}
        {/* ! */}
        <div onClick={()=>navigate('/')} className="cursor-pointer">
          <svg
            aria-label="Home"
            className="text-white"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>Home</title>
            <path
              d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        </div>
        {/* Search */}
        <div onClick={()=>navigate('/search')} className="cursor-pointer">
          <svg
            aria-label="Search"
            className="text-white"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>Search</title>
            <path
              d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="16.511"
              x2="22"
              y1="16.511"
              y2="22"
            ></line>
          </svg>
        </div>
        {/* Explore */}
        <div className="cursor-pointer">
          <svg
            aria-label="Explore"
            className="text-white"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>Explore</title>
            <polygon
              fill="none"
              points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></polygon>
            <polygon
              fillRule="evenodd"
              points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"
            ></polygon>
            <circle
              cx="12.001"
              cy="12.005"
              fill="none"
              r="10.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></circle>
          </svg>
        </div>
        {/* Reels */}
        <div onClick={()=>navigate('/reels')} className="cursor-pointer">
          <svg
            aria-label="Reels"
            className="text-white"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>Reels</title>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="2.049"
              x2="21.95"
              y1="7.002"
              y2="7.002"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="13.504"
              x2="16.362"
              y1="2.001"
              y2="7.002"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="7.207"
              x2="10.002"
              y1="2.11"
              y2="7.002"
            ></line>
            <path
              d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
            <path
              d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        {/* Messages */}
        <div onClick={()=>navigate('/message')} className="cursor-pointer">
          <svg
            aria-label="Messenger"
            className="text-white"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>Messenger</title>
            <path
              d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="1.739"
            ></path>
            <path
              d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        {/* Notifications */}
        <div onClick={()=>navigate('/notification')} className="cursor-pointer">
          <svg
            aria-label="Notifications"
            className="text-white"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>Notifications</title>
            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
          </svg>
        </div>
        {/* CReate */}
        <div onClick={()=>navigate('/create')} className="cursor-pointer">
          <svg
            aria-label="New post"
            className="text-white"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>New post</title>
            <path
              d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="6.545"
              x2="17.455"
              y1="12.001"
              y2="12.001"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="12.003"
              x2="12.003"
              y1="6.545"
              y2="17.455"
            ></line>
          </svg>
        </div>
        {/* Profile */}
        <div onClick={()=>navigate(`/profile/${userData?.userName}`)} className="cursor-pointer">
          <div className="h-[30px] w-[30px] rounded-full border-2 border-white flex justify-center items-center overflow-hidden ">
            {/* if no profile picture is available then we put this one */}
            <img
              src={userData?.profileImage || defpfp}
              alt="default profile image "
              className="w-full object-cover  rounded-full"
            />
          </div>
        </div>
      </div>
      {/* More options button */}
      <div onClick={()=>setOpenMore(prev=>!prev)} className="relative  w-full mt-auto mb-5 flex justify-center items-center">
        {openMore && 
        (<MoreOption/>)}
        <div className="w-full  rounded-xl flex gap-3 items-center py-3 hover:bg-gray-900 pl-6 cursor-pointer mt-auto">
          <svg
            aria-label="Settings"
            className="text-white"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30"
          >
            <title>Settings</title>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="3"
              x2="21"
              y1="4"
              y2="4"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="3"
              x2="21"
              y1="12"
              y2="12"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="3"
              x2="21"
              y1="20"
              y2="20"
            ></line>
          </svg>
          
        </div>
      </div>
    </div>
  );
};

export default SmallLeftBar;
