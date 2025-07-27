
import { useNavigate } from "react-router";
import defpfp from "../../assets/defpfp.webp";
const StoryCard = ({ pfp, username, seen}) => {
  const navigate = useNavigate()


  return (
    <div onClick={()=>navigate(`/story/${username}`)} className="h-full w-[80px] flex flex-col justify-center items-center snap-start">
      <div className={`w-[60px] box-border ${seen ? 'bg-gray-500' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'} p-[3px] rounded-full`}>
        <div className="bg-black p-1 rounded-full cursor-pointer">
          <img
            src={pfp || defpfp}
            alt="Profile picture"
            className="w-[60px] aspect-square rounded-full object-cover"
          />
        </div>
      </div>

      <span className="text-white">{username}</span>
    </div>
  );
};

export default StoryCard;
