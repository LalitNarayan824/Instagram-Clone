
import defpfp from '../../assets/defpfp.webp'
import { useNavigate } from "react-router";
import { useFollowUser } from '../../hooks/useFollowUser';
import useSuggestedUsers from '../../hooks/useSuggestedUsers';
const SuggestedUserCard = ({user}) => {

  // * follow/unfollow karne ka logic START
    const { mutate, isPending:followPending } = useFollowUser(user._id);
  
    const handleFollow = () => {
      console.log('done')
      mutate();
      console.log('done2')
       // no args needed — userId is already passed into hook
    };


  const navigate = useNavigate();
  return (
    <div className="w-full flex gap-4 justify-around items-center mt-4 my-4 pr-7">
      <div onClick={()=>navigate(`/profile/${user?.userName}`)} className="cursor-pointer">
        <img
          src={user?.profileImage || defpfp}
          alt="user profile image"
          className="h-[45px] w-[45px] rounded-full border-1 border-white object-cover"
        />
      </div>
      <div className="flex flex-col gap-0 p-0">
        {/* username */}
        <p className="text-white font-medium cursor-pointer">{user?.userName}</p>
        {/* name */}
        <p className="text-white text-sm ml-1 opacity-80">{user?.name}</p>
      </div>
      <div className="ml-auto">
        <p onClick={handleFollow} className="text-blue-400 text-sm hover:text-white hover:cursor-pointer">Follow</p>
      

      </div>

    </div>
  );
};

export default SuggestedUserCard;
