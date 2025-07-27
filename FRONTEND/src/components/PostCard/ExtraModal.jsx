

const ExtraModal = ({close, isFollow}) => {
  return (
    <div className='h-screen w-screen fixed top-0 left-0 bg-black  z-30 flex items-center justify-center'>
      <div className="max-w-[400px] w-7/10 bg-gray-800 h-fit z-31 rounded-xl overflow-hidden flex flex-col">
        <div className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          <span className="text-red-400 ">Report</span>
        </div>
        <div className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          { isFollow ? <span className="text-red-400 ">Unfollow</span> : <span className="text-blue-400 ">Follow</span>}
        </div>
        <div className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          <span className="text-white ">Add to favourites</span>
        </div>
        <div className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          <span className="text-white ">Go to post</span>
        </div>
        <div className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          <span className="text-white ">Share to..</span>
        </div>
        <div className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          <span className="text-white ">Copy link</span>
        </div>
        <div className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          <span className="text-white ">Embed</span>
        </div>
        <div className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          <span className="text-white ">About this account</span>
        </div>
        <div onClick={()=>close(prev=>!prev)} className="w-full h-12 flex items-center justify-center border-t-1 border-b-1 border-gray-600 hover:opacity-70">
          <span className="text-white ">Cancel</span>
        </div>
        
      
      </div>
    </div>
  )
}

export default ExtraModal
