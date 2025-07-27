import { Link } from "react-router";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingPage from "../LoadingPage";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";

const signinUser = async (formData) => {
  const res = await api.post("/api/auth/signin", formData);
  return res.data;
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    userName: "",

    password: "",
  });
  const [responseError , setResponseError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient()

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: signinUser,
    onSuccess: (data) => {
      dispatch(setUserData(data));
      queryClient.invalidateQueries(['currentUser']);
      // console.log("User logged in:", data);
      navigate("/");
      // redirect or show success
    },
    onError: (err) => {
      setResponseError(err.response?.data?.message)
      console.error("Signin failed:", err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponseError(null);
    mutate(formState); // triggers signin
  };

  if (isPending) return <LoadingPage />;

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
      {/* form */}
      <div className="w-[350px] border border-gray-800 flex flex-col gap-2 p-4 box-border mt-3 rounded-sm">
        {/* main logo and some text */}
        <div className="flex flex-col gap-3 items-center">
          {/*  main logo */}
          <i
            className="mt-5"
            style={{
              backgroundImage:
                'url("https://static.cdninstagram.com/rsrc.php/v4/yB/r/E7m8ZCMOFDS.png")',
              backgroundPosition: "0px 0px",
              backgroundSize: "auto",
              width: "175px",
              height: "51px",
              backgroundRepeat: "no-repeat",
              display: "inline-block",
            }}
          ></i>
        </div>

        {/* main form start */}

        <form
          onSubmit={handleSubmit}
          className="mt-2  flex flex-col gap-2 justify-center items-center py-2 px-4"
        >
          <input
            type="text"
            placeholder="Username"
            name="userName"
            required
            value={formState.userName}
            onChange={(e) =>
              setFormState({ ...formState, userName: e.target.value })
            }
            className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2 rounded-lg"
          />
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              required
              value={formState.password}
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
              className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2.5 rounded-lg"
            />
            {showPassword ? (
              <IoMdEyeOff
                onClick={() => setShowPassword((prev) => !prev)}
                className="h-5 w-5 absolute top-4 right-3 text-white cursor-pointer"
              />
            ) : (
              <IoMdEye
                onClick={() => setShowPassword((prev) => !prev)}
                className="h-5 w-5 absolute top-4 right-3 text-white cursor-pointer"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full mx-5 px-auto py-1.5 mt-3 bg-blue-500 text-white font-bold text-xl rounded-xl cursor-pointer"
          >
            Login
          </button>

          {responseError && <p className="text-red-500 font-medium text-sm">{responseError}</p>}

          <p onClick={()=>navigate('/forgot-password')} className="text-white font-semibold cursor-pointer mt-3">
            Forgot password ?
          </p>
        </form>

        {/* main form end */}
      </div>

      {/* link to log in */}
      <div className="w-[350px] border border-gray-800 flex gap-2 items-center justify-center p-4 box-border mt-3  rounded-sm">
        <p className="text-white text-sm">Don't have an account ?</p>
        <Link to={"/signup"} className="text-blue-400 font-semibold">
          Sign up
        </Link>
      </div>
      <div className="w-[350px]  flex flex-col items-center justify-center p-4 box-border mt-3 gap-2 rounded-sm">
        <p className="text-gray-300 text-lg">Get the app.</p>
        <div className="flex gap-3">
          <img
            alt="Get it on Google Play"
            src="https://static.cdninstagram.com/rsrc.php/v4/yz/r/c5Rp7Ym-Klz.png"
            className="w-1/2 h-[50px] cursor-pointer"
            onClick={() =>
              window.open(
                "https://play.google.com/store/apps/details?id=com.instagram.android",
                "_blank"
              )
            }
          />

          <img
            alt="Get it from Microsoft"
            src="https://static.cdninstagram.com/rsrc.php/v4/yu/r/EHY6QnZYdNX.png"
            className="w-1/2 h-[50px] cursor-pointer"
            onClick={() =>
              window.open(
                "https://apps.microsoft.com/store/detail/instagram/9NBLGGH5L9XT",
                "_blank"
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
