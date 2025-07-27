import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import api from "../../utils/api";
import LoadingPage from "../LoadingPage";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";

const signupUser = async (formData) => {
  const res = await api.post("/api/auth/signup", formData);
  return res.data;
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [responseError , setResponseError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      dispatch(setUserData(data));
      console.log("User created:", data);
      navigate("/");
      // redirect or show success
    },
    onError: (err) => {
      setResponseError(err.response.data.message);
      console.error("Signup failed:", err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponseError(null)
    mutate(formState); // triggers signup
  };

  if (isPending) return <LoadingPage />;

  return (
    <div className="h-full w-[100vw] bg-black flex flex-col items-center justify-center">
      {/* center content will be here*/}

      {/* logo and form content */}
      <div className="w-[350px] border border-gray-800 flex flex-col gap-2 p-4 box-border mt-3 rounded-sm">
        {/* main logo and some text */}
        <div className="flex flex-col gap-3 items-center">
          {/*  main logo */}
          <i
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
          {/* text */}
          <p className="text-gray-400 font-medium text-center text-md">
            Sign up to see photos and videos from your friends.
          </p>
        </div>
        /* main form start */
        <form
          onSubmit={handleSubmit}
          className="mt-2 flex flex-col gap-2 justify-center items-center py-2 px-4"
        >
          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2.5 rounded-lg"
          />
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              minLength={6}
              name="password"
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
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2.5 rounded-lg"
          />
          <input
            type="text"
            placeholder="@...Username"
            name="userName"
            required
            value={formState.userName}
            onChange={(e) =>
              setFormState({ ...formState, userName: e.target.value })
            }
            className="w-full border-2 border-gray-600 bg-gray-950 text-gray-50 px-1.5 py-2.5 rounded-lg"
          />

          <p className="text-center text-gray-400 font-[400] text-sm mt-2 font">
            People who use our service may have uploaded your contact
            information to Instagram.{" "}
            <span className="text-blue-500">Learn More</span>
          </p>

          <p className="text-center text-gray-400 font-[400] text-sm mt-2 font">
            By signing up, you agree to our{" "}
            <span className="text-blue-500">Terms</span>,{" "}
            <span className="text-blue-500">Privacy Policy</span> and{" "}
            <span className="text-blue-500">Cookies Policy</span>
          </p>

          <button
            type="submit"
            className="w-full mx-5 px-auto py-2 mt-3 bg-blue-400 text-white font-bold text-xl rounded-xl cursor-pointer"
          >
            Submit
          </button>

          {responseError && <p className="text-red-500 font-medium text-sm">{responseError}</p>}

          
        </form>
        {/* main form end */}
      </div>

      {/* link to log in */}
      <div className="w-[350px] border border-gray-800 flex flex-col items-center justify-center p-4 box-border mt-3  rounded-sm">
        <p className="text-gray-400 ">Have an account ?</p>
        <Link to={"/signin"} className="text-blue-400 font-semibold">
          Log in
        </Link>
      </div>
      {/* appstore links */}
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

export default SignUp;
