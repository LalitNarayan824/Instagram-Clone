import { useRef, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import VideoPlayer from "../../components/VideoPlayer";
import api from "../../utils/api";
import useCurrentUser from '../../hooks/useCurrentUser'
const Create = () => {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState("Post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption , setCaption] = useState('')
  const [loading , setLoading] = useState(false);
  const mediaInput = useRef();

  const uploadPost = async ()=>{
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("caption" , caption)
      formData.append("mediaType" , mediaType)
      formData.append("media" , backendMedia)
      const result = await api.post('/api/post/upload', formData)
      setCaption('')
      setBackendMedia(null)
      setFrontendMedia(null)
      
      setLoading(false);

      // console.log(result)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const uploadStory = async ()=>{
    try {
      setLoading(true)
      const formData = new FormData()
     
      formData.append("mediaType" , mediaType)
      formData.append("media" , backendMedia)
      const result = await api.post('/api/story/upload', formData)
      
      setBackendMedia(null)
      setFrontendMedia(null)
      setLoading(false)
      useCurrentUser()
      // console.log(result)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const uploadReel = async ()=>{
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("caption" , caption)
      
      formData.append("media" , backendMedia)
      const result = await api.post('/api/reel/upload', formData)
      setCaption('')
      setBackendMedia(null)
      setFrontendMedia(null)
      setLoading(false)
      // console.log(result)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setMediaType("image");
    } else {
      setMediaType("video");
    }

    setFrontendMedia(URL.createObjectURL(file));
    setBackendMedia(file);
  };

  const handleUpload = ()=>{
    if(!frontendMedia) return

    if(uploadType === 'Post'){
      uploadPost();
    }
    else if(uploadType === 'Story'){
      uploadStory();
    }
    else if(uploadType==='Reel' && mediaType=='video'){
      uploadReel();
    }
  }




  return (
    <div className="w-full h-full relative bg-black">
      {/* backarrow */}
      <div
        onClick={() => navigate(-1)}
        className="absolute h-[32px] w-[32px] top-5 left-3 rounded-full "
      >
        <IoArrowBackCircleOutline className="h-[30px] w-[30px] text-white  hover:bg-white hover:text-black rounded-full" />
      </div>

      {/* heading  */}
      <div className="w-full text-center mt-6 border-b-2 border-gray-800 pb-3">
        <h2 className="text-2xl  md:text-3xl  text-white font-mono  ">
          Create {uploadType}
        </h2>
      </div>
      {/* content type */}
      <div className="w-full h-[40px]  flex justify-center gap-10 mb-3">
        <div
          onClick={() => setUploadType("Post")}
          className={`h-full w-fit  mx-3 text-gray-400  flex items-center uppercase cursor-pointer gap-3 ${
            uploadType === "Post" && "border-t-3 border-gray-200 text-white"
          } `}
        >
          <span>Post</span>
        </div>
        <div
          onClick={() => setUploadType("Story")}
          className={`h-full w-fit  mx-3 text-gray-400  flex items-center uppercase cursor-pointer gap-3 ${
            uploadType === "Story" && "border-t-3 border-gray-200 text-white"
          } `}
        >
          <span>Story</span>
        </div>
        <div
          onClick={() => setUploadType("Reel")}
          className={`h-full w-fit  mx-3 text-gray-400  flex items-center uppercase cursor-pointer gap-3 ${
            uploadType === "Reel" && "border-t-3 border-gray-200 text-white"
          } `}
        >
          <span>Reel</span>
        </div>
      </div>
      <div className="w-full max-h-full bg-black flex items-center justify-center">
        <div className="min-h-[500px] w-[275px]  px-3 py-6 flex flex-col justify-center items-center">
          {/* image or  video here */}
          <div
            
            onClick={() => mediaInput.current.click()}
            className="w-full h-full relative rounded-3xl bg-gray-700 border-2 border-gray-600  hover:bg-gray-800 flex flex-col items-center justify-center cursor-pointer p-2"
          >
            <input type="file" hidden ref={mediaInput} accept={uploadType === 'Reel' ? "video/*" : ""} onChange={handleMedia} />
            {!frontendMedia && (
              <>
                <p className="text-white">Click to Upload Media</p>
                <p className="text-white text-xs text-center opacity-50">
                  Photo or Video *file size should be less than 5mb{" "}
                </p>{" "}
              </>
            )}
            {
              frontendMedia && mediaType === 'image' && (<>
                <img src={frontendMedia} alt="some image" className="w-full h-full object-cover rounded-3xl"/>
                <p className="text-white font-bold absolute top-[50%] left-[42%]">Change</p>
                </>
              )
            }
            {
              frontendMedia && mediaType === 'video' && (<>
                <VideoPlayer  media={frontendMedia}/>
                <p  className="text-white absolute top-[50%] left-[42%]">Change</p>
                </>
              )
            }
            
            

          </div>
          
          {/* input */}
          {
              frontendMedia && uploadType != "Story" && (
                <input onChange={(e)=>setCaption(e.target.value)} value={caption} type="text" className="text-white px-3 py-2 border-b-2 mt-5 outline-none" placeholder="write a caption..."></input>
              ) 
            }
            {/* upload button */}
            {
              frontendMedia && (
                <button onClick={handleUpload} className="px-3 py-2 w-fit text-white border-2 border-gray-500 rounded-2xl font-semibold mt-4 cursor-pointer hover:bg-white hover:text-black"> Upload {uploadType} </button>
              )
            }
            {loading && <p className="text-blue-500">Please Wait Uploading ...</p>}
        </div>
      </div>
    </div>
  );
};

export default Create;
