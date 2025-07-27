import { Outlet, useNavigate } from "react-router";
import { useAllReels } from "../../hooks/useAllReels";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Reelcard from "./Reelcard";

const ReelPage = () => {
  const navigate = useNavigate();
  const { data: reels, isPending: reelsPending } = useAllReels();
  // console.log(reels);
  
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center relative">
      
      {/* back arrow button */}
      <div
        onClick={() => navigate(-1)}
        className="fixed h-[40px] w-[40px] top-5 left-3 rounded-full z-20 "
      >
        <IoArrowBackCircleOutline className="h-[38px] w-[38px] text-white  hover:bg-white hover:text-black rounded-full" />
      </div>

      {/* main reels section */}
      <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        {reels &&
          reels.map((reel) =>(
            <div key={reel._id} className="h-screen snap-start">
             <Reelcard  reel={reel}  />
            </div> 
             ))}
      </div>
      <Outlet/>
    </div>
  );
};

export default ReelPage;
