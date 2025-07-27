import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { TbUserSearch } from "react-icons/tb";
import api from "../../utils/api";
import { useSelector } from "react-redux";
import defpfp from '../../assets/defpfp.webp'

const SearchPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [search, setSearch] = useState([]);
  const {onlineUsers} = useSelector(state=>state.socket)

  const handleSearch = async () => {
    
    try {
      const result = await api.get(`/api/user/search?keyWord=${input}`);
      console.log(result.data);
      setSearch(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  const delay = 500; // debounce delay in ms

  const timer = setTimeout(() => {
    if (input !== '') {
      handleSearch(); // make your API call or search here
    } else {
      setSearch([]);
    }
  }, delay);

  // Cleanup function to clear timeout if input changes before delay
  return () => clearTimeout(timer);
}, [input]);


  return (
    <div className="w-full h-full relative bg-black flex justify-center items-center flex-col">
      {/* backarrow */}
      <div
        onClick={() => navigate(-1)}
        className="absolute h-[32px] w-[32px] top-7 left-3 rounded-full "
      >
        <IoArrowBackCircleOutline className="h-[30px] w-[30px] text-white  hover:bg-white hover:text-black rounded-full" />
      </div>

      {/* search bar */}
      <div className="">
        <form className="flex gap-2 items-center justify-center">
          <TbUserSearch className="size-[30px] text-white mt-15" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-[300px] sm:w-[500px] md:w-[600px] lg:w-[700px]
          py-3  rounded-xl bg-gray-800 outline-none text-white pl-3 mt-15"
            placeholder="Search here ..."
          />
        </form>
      </div>

      <div className="w-[400px] sm:w-[500px] md:w-[600px] lg:w-[700px] h-full my-3 overflow-y-auto hide-scrollbar">
        {search?.map((user, index) => (
          <div
            key={index}
            onClick={()=>navigate(`/profile/${user?.userName}`)}
            className="w-full h-fit py-3 px-3 flex items-center gap-3 bg-black border-b border-gray-700 hover:bg-gray-800 transition-all cursor-pointer rounded-2xl"
          >
            <div className="size-[44px] relative rounded-full  border border-white flex items-center justify-center">
              <img
                src={user?.profileImage || defpfp}
                alt="pfp"
                className="w-full h-full object-cover rounded-full"
              />

              {onlineUsers?.includes(user?._id) && (
                <div className="absolute top-1 right-0 size-3 rounded-full bg-green-300"></div>
              )}
            </div>

            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-semibold truncate">
                {user?.userName}
              </span>
              <span className="text-gray-400 text-sm truncate max-w-[200px]">
                {user?.name}
              </span>
            </div>
          </div>
        ))}

        {!input && <div className="text-gray-400 w-full h-[200px] flex items-center justify-center flex-col ">
          <TbUserSearch className="size-[100px] text-gray-500 mt-15" />
          <span className="text-gray-500">Search a User</span>
          </div>}
      </div>
    </div>
  );
};

export default SearchPage;
