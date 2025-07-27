import React from 'react'
import defpfp from '../../assets/defpfp.webp'
import {useSelector} from 'react-redux'
import SuggestedUserCard from './SuggestedUserCard'
import { useNavigate } from 'react-router'
import useSuggestedUsers from '../../hooks/useSuggestedUsers'

const RightBar = () => {
  const {userData , suggestedUsers} = useSelector(state=>state.user)
  const navigate = useNavigate();
  const { data: users, isLoading, isError } = useSuggestedUsers();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading suggestions</p>;
  // console.log("user data :")
  // console.log(userData)
  return (
    <div  className='bg-black w-4/11 min-w-[300px] h-screen hidden md:flex flex-col px-5 pt-3'>

      {/* user profile section*/}
      <div onClick={()=>navigate(`/profile/${userData?.userName}`)} className='flex gap-4 justify-start items-center mt-4 my-4 cursor-pointer border-b-1 border-gray-800 pb-4'>
        <div className='border-2 border-white rounded-full'><img src={userData?.profileImage || defpfp} alt="user profile image" className='h-[50px] w-[50px] rounded-full object-cover'/></div>
        <div className='flex flex-col gap-0 p-0'>
          {/* username */}
          <p className='text-lg font-bold text-white'>{userData?.userName}</p>
          {/* name */}
          <p className='text-white ml-1'>{userData?.name}</p>
        </div>
      </div>

      {/* suggested users section */}
      <div className='w-full flex flex-col gap-3 mt-3'>
        {users.length !== 0 && <h3 className='text-white opacity-65'>Suggested for you</h3>}
        {/* here we map all the suggested users */}
        <div>
          {users && users.map((user , index)=>(
            <SuggestedUserCard key={index} user={user} />
          ))}
        </div>
      </div>

      {/* some info */}
      <div className='w-full mt-5'>
        <p className='text-white opacity-50 text-xs '>About . Help . Press . API . Jobs . Privacy . Terms .</p>
        <p className='text-white opacity-50 text-xs text-wrap '>Locations . Language . Meta Verified</p>

        <span className='text-white opacity-50 text-xs font-light mt-4'>INSTAGRAM FROM META</span>
      </div>

      
    </div>
  )
}

export default RightBar
