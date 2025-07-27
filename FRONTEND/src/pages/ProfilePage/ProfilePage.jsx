import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "../LoadingPage";
import defpfp from "../../assets/defpfp.webp";
import { setProfileData } from "../../redux/userSlice";
import { useState } from "react";
import EditProfile from "./EditProfile";
import BottomContent from "./BottomContent";
import { useFollowUser } from "../../hooks/useFollowUser";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const ProfilePage = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [openEditProfile , setOpenEditProfile] = useState(false)
  const navigate = useNavigate()

  


  // ^ use query to get profile data of the user through username feom the params
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profileUser"],
    queryFn: async () => {
      const res = await api.get(`/api/user/getProfile/${userName}`);
      return res.data;
    },
    onSuccess: (data) => {
      // console.log("User fetched:", data);
      dispatch(setProfileData(data));
    },
    onError: (error) => {
      console.error("Error fetching user:", error);
    },
  });

  // ^ logic to follow the user
 const { mutate, isPending:followPending } = useFollowUser(profileData?._id);
 
   const handleFollow = () => {
     mutate(); // no args needed — userId is already passed into hook
   }; 
  // console.log('userdata')
  // console.log(userData);
  // console.log('profile')
  // console.log(profileData);
  if (isLoading) return <LoadingPage />;
  if (isError) return <h1>Some error happended</h1>;

  return (
    <div className="w-full h-full bg-black flex flex-col overflow-y-auto hide-scrollbar relative">
      <div
              onClick={() => navigate(-1)}
              className="absolute h-[32px] w-[32px] top-7 left-3 rounded-full "
            >
              <IoArrowBackCircleOutline className="h-[30px] w-[30px] text-white  hover:bg-white hover:text-black rounded-full" />
            </div>
      {/* center content of the user  */}
      <div className="bg-black w-full min-w-[300px] sm:w-2/3  lg:w-1/2 mx-auto h-1/2 min-h-[200px] flex flex-col justify-center items-center">
        {/* user info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10 lg:mt-20 mb-3">
          {/* profile pic */}
          <div className="w-[100px] h-[100px] border-2 border-amber-50 rounded-full p-2">
            <img
              src={profileData?.profileImage || defpfp}
              alt="profile image"
              className="h-full w-full  object-cover rounded-full"
            />
          </div>
          {/* username , name , count */}
          {/* bio profession baki hia */}
          <div className="flex flex-col">
            <p className="text-2xl font-medium text-white">
              {profileData?.userName}
            </p>
            <p className="text-xl font-mono text-white">{profileData?.name}</p>
            <p className=" text-gray-400 ">
              {profileData?.profession || "profession"}
            </p>
            <p className="text-xs text-gray-400 max-w-[200px]">
              {profileData?.bio ||
                "bio will be somewhat long so it will be like this"}
            </p>
            <div className="flex gap-4 mt-4">
              <p className="text-sm text-white">
                {profileData?.followers?.length || 0} followers
              </p>
              <p className="text-sm text-white">
                {profileData?.following?.length || 0} followings
              </p>
              <p className="text-sm text-white">
                {profileData?.posts?.length || 0} posts
              </p>
            </div>
          </div>
        </div>
        {/* edit and other buttons */}
        <div className="flex justify-around mt-auto gap-10 mb-10">
          {profileData._id === userData._id && (<>
            {openEditProfile && <EditProfile setOpenEditProfile={setOpenEditProfile}/>}
            <button onClick={()=>setOpenEditProfile(prev=>!prev)} className="px-5 py-3 text-white  bg-gray-700 hover:bg-gray-800 rounded-xl cursor-pointer font-medium font-mono">
              Edit Profile
            </button>
            </>
          )}
          {/* mesage for the current user || follow/unfollow for the others */}
          {profileData._id !== userData._id && (
            <>
              { profileData.isFollow ? <button onClick={handleFollow} className="px-5 py-3 text-white  bg-gray-700 hover:bg-gray-800 rounded-xl cursor-pointer font-medium font-mono">
                {followPending ? 'Unfollowing..' : 'Unfollow'}
              </button> : <button onClick={handleFollow} className="px-5 py-3 text-white  bg-gray-700 hover:bg-gray-800 rounded-xl cursor-pointer font-medium font-mono">
                {followPending ? 'Following..' : 'Follow'}
              </button>}
              <button onClick={()=>navigate(`/message/conv/${profileData.userName}`)} className="px-5 py-3 text-white  bg-gray-700 hover:bg-gray-800 rounded-xl cursor-pointer font-medium font-mono">
                Message
              </button>
            </>
          )}
        </div>
      </div>
      <BottomContent userId={profileData._id}/>
    </div>
  );
};

export default ProfilePage;
