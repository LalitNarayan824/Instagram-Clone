import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../utils/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [errorMessage , setErrorMessage ] = useState('')
  const [successMessage , setSuccessMessage ] = useState('')
  const [loading , setLoading ] = useState(false)

  // form states

  const [email , setEmail] = useState('');
  const [otp , setOtp] = useState('');
  const [newPassword , setNewPassword] = useState('');
  const [confirmPassword , setConfirmPassword] = useState('');

  
  

  // api calls 
  // console.log(step)
  // step1
  const handleSubmitEmail = async (e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const res = await api.post('/api/auth/send-otp' , {email});
      setSuccessMessage(res.data.message);
      setErrorMessage('')
      // console.log(res)
      setStep(2);
    } catch (error) {
      // console.log(error);
      setSuccessMessage('')
      setErrorMessage(error.response.data.message)
      // console.error("error in sending email : " + error);
    }finally{
      setLoading(false)
    }
  }

  // step2
  const handleSubmitOtp = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/verify-otp' , {email , otp});
      setErrorMessage('')
      setSuccessMessage(res.data.message);
      setStep(3);
    } catch (error) {
      setSuccessMessage('')
      setErrorMessage(error.response.data.message)
      // console.error("error in sending/verifying otp  : " + error);
    } finally{
      setLoading(false);
    }
  }

  const handleResetPassword = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password' , {email , newPassword , confirmPassword});
      setErrorMessage('')
      setSuccessMessage(res.data.message);

    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response.data.message)
      // console.error("error in sending/verifying otp  : " + error);
    } finally {
      setLoading(false);
    }
  }




  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {step === 1 && (
        // entering a valid email that user have registered with in signup
        <div className="w-[350px] border border-gray-800 flex flex-col gap-2 p-4 box-border mt-3 rounded-sm">
          {/* lock icon and some text */}
          <div className="flex flex-col gap-2 items-center justify-center px-2">
            {/* icon */}
            <div>
              <svg
                aria-label="Trouble logging in?"
                className="text-white"
                height="96"
                role="img"
                viewBox="0 0 96 96"
                width="96"
              >
                <title>Trouble logging in?</title>
                <circle
                  cx="48"
                  cy="48"
                  fill="none"
                  r="47"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></circle>
                <path
                  d="M60.931 70.001H35.065a5.036 5.036 0 0 1-5.068-5.004V46.005A5.036 5.036 0 0 1 35.065 41H60.93a5.035 5.035 0 0 1 5.066 5.004v18.992A5.035 5.035 0 0 1 60.93 70ZM37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </div>

            <p className="text-white">Trouble logging in?</p>
            <p className="text-white text-center text-sm font-light opacity-70">
              Enter your email and we'll send you an otp to reset your password
            </p>
          </div>

          {/* main input here */}
          <form onSubmit={handleSubmitEmail}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2.5 rounded-lg"
            />
            <button
              type="submit"
              className="w-full text-white py-2 mt-2 px-2 bg-blue-500 rounded-md hover:bg-blue-600"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {successMessage && <p className="text-green-300 opacity-80 text-sm text-center mt-3">{successMessage}</p>}
            {errorMessage && <p className="text-red-300 opacity-80 text-sm text-center mt-3">{errorMessage}</p>}
          </form>

          {/* form ends */}

          <div className="flex gap-2 items-center justify-center">
            <div className="flex-1 border-b border-gray-500 opacity-45"></div>
            <div className="text-white text-md opacity-45">OR</div>
            <div className="flex-1 border-b border-gray-500 opacity-45"></div>
          </div>

          <span
            onClick={() => navigate("/signup")}
            className="text-white text-center opacity-80 cursor-pointer"
          >
            Create new Account
          </span>

          <button
            onClick={() => navigate("/signin")}
            className="w-full bg-gray-600 mt-10 py-3 rounded-md text-gray-400 cursor-pointer hover:text-gray-200 hover:bg-gray-700"
          >
            Back to Login
          </button>
        </div>
      )}

      {step === 2 && (
        // user enters the otp they received on their email
        <div className="w-[350px] border border-gray-800 flex flex-col gap-2 p-4 box-border mt-3 rounded-sm">
          {/* lock icon and some text */}
          <div className="flex flex-col gap-2 items-center justify-center px-2">
            {/* icon */}
            <div>
              <svg
                aria-label="Trouble logging in?"
                className="text-white"
                height="96"
                role="img"
                viewBox="0 0 96 96"
                width="96"
              >
                <title>Trouble logging in?</title>
                <circle
                  cx="48"
                  cy="48"
                  fill="none"
                  r="47"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></circle>
                <path
                  d="M60.931 70.001H35.065a5.036 5.036 0 0 1-5.068-5.004V46.005A5.036 5.036 0 0 1 35.065 41H60.93a5.035 5.035 0 0 1 5.066 5.004v18.992A5.035 5.035 0 0 1 60.93 70ZM37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </div>

            <p className="text-white">Enter OTP</p>
            <p className="text-white text-center text-sm font-light opacity-70">
              We’ve sent a OTP to your email. Please enter
              it below to continue resetting your password.
            </p>
          </div>

          {/* main input here */}
          <form onSubmit={handleSubmitOtp} className="mt-2">
            <input
              type="text"
              placeholder="OTP"
              required
              name="OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2.5 rounded-lg"
            />
            <button
              type="submit"
              className="w-full text-white py-2 mt-2 px-2 bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
            >
              { loading ? "Verifying..." :"Submit"}
            </button>

            {successMessage && <p className="text-green-300 opacity-80 text-sm text-center mt-3">{successMessage}</p>}
            {errorMessage && <p className="text-red-300 opacity-80 text-sm text-center mt-3">{errorMessage}</p>}
          </form>

          {/* form ends */}

          <div className="flex gap-2 items-center justify-center">
            <div className="flex-1 border-b border-gray-500 opacity-45"></div>
            <div className="text-white text-md opacity-45">OR</div>
            <div className="flex-1 border-b border-gray-500 opacity-45"></div>
          </div>

          <span
            
            className="text-white text-center opacity-80 text-sm"
          >
            Didn't received OTP? <span 
            onClick={()=>{setStep(1) ; setErrorMessage('') ; setSuccessMessage('')}}
            className="font-bold cursor-pointer underline underline-offset-4">Send Again</span>
          </span>

          <button
            onClick={() => navigate("/signin")}
            className="w-full bg-gray-600 mt-10 py-3 rounded-md text-gray-400 cursor-pointer hover:text-gray-200 hover:bg-gray-700"
          >
            Back to Login
          </button>
        </div>
      )}

      {step === 3 && (
        // user enters a new password and confirms it
        <div className="w-[350px] border border-gray-800 flex flex-col gap-2 p-4 box-border mt-3 rounded-sm">
          {/* lock icon and some text */}
          <div className="flex flex-col gap-2 items-center justify-center px-2">
            {/* icon */}
            <div>
              <svg
                aria-label="Trouble logging in?"
                className="text-white"
                height="96"
                role="img"
                viewBox="0 0 96 96"
                width="96"
              >
                <title>Trouble logging in?</title>
                <circle
                  cx="48"
                  cy="48"
                  fill="none"
                  r="47"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></circle>
                <path
                  d="M60.931 70.001H35.065a5.036 5.036 0 0 1-5.068-5.004V46.005A5.036 5.036 0 0 1 35.065 41H60.93a5.035 5.035 0 0 1 5.066 5.004v18.992A5.035 5.035 0 0 1 60.93 70ZM37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </div>

            <p className="text-white">Reset Your Password</p>
<p className="text-white text-center text-sm font-light opacity-70">
  Enter a new password and confirm it below to complete resetting your account.
</p>

          </div>

          {/* main input here */}
          <form onSubmit={handleResetPassword} className="mt-2">
            <input
              type="text"
              placeholder="Enter new Password"
              required
              name="newPassword"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
              className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2.5 rounded-lg "
            />
            <input
              type="text"
              placeholder="Confirm Password"
              required
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2.5 rounded-lg mt-2"
            />
            <button
              type="submit"
              className="w-full text-white py-2 mt-2 px-2 bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
            >
               { loading ? "Recovering..." : "Reset Password"}
            </button>

            {successMessage && <p className="text-green-300 opacity-80 text-sm text-center mt-3">{successMessage}</p>}
            {errorMessage && <p className="text-red-300 opacity-80 text-sm text-center mt-3">{errorMessage}</p>}
          </form>

          {/* form ends */}

          <div className="flex gap-2 items-center justify-center">
            <div className="flex-1 border-b border-gray-500 opacity-45"></div>
            <div className="text-white text-md opacity-45">OR</div>
            <div className="flex-1 border-b border-gray-500 opacity-45"></div>
          </div>

          <span
            onClick={()=>navigate('/signin')}
            className="text-white text-center cursor-pointer "
          >
            Create new Account
          </span>

          <button
            onClick={() => navigate("/signin")}
            className="w-full bg-gray-600 mt-10 py-3 rounded-md text-gray-400 cursor-pointer hover:text-gray-200 hover:bg-gray-700"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
