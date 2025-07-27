import { Navigate, Route, Routes } from "react-router";

// pages
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import HomePage from "./pages/HomePage/HomePage";
import HomeFeed from "./pages/HomeFeed/HomeFeed";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LoadingPage from "./pages/LoadingPage";

// hooks

import api from "./utils/api";
import { useQuery } from "@tanstack/react-query";
import useCurrentUser from "./hooks/useCurrentUser";
import useSuggestedUsers from "./hooks/useSuggestedUsers";
import Create from "./pages/Create/Create";
import ReelPage from "./pages/Reels/ReelPage";
import ReelCommentModal from "./pages/Reels/ReelCommentModal";
import StoryPage from "./pages/StoryPage/StoryPage";
import MessagePage from "./pages/Messages/MessagePage";
import ChatPage from "./pages/Messages/ChatPage";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import SearchPage from "./pages/Search/SearchPage";
import Notification from "./pages/Notification/Notification";
import { useCheckStory } from "./hooks/useCheckStory";
import AboutPage from "./pages/About";

const fetchCurrentUser = async () => {
  try {
    const res = await api.get("/api/user/current");
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const App = () => {
  useCheckStory();
  useCurrentUser();
  // useSuggestedUsers();
  const backendUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  // const {onlineUsers} = useSelector(state=>state.socket)

  // ^ routing ke liye hai
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    retry: false, // optional: disable retry on 401
    refetchOnWindowFocus: false,
  });
  // console.log("userData from app :");
  // console.log(userData);

  useEffect(() => {
    if (userData) {
      const socketIo = io(backendUrl, {
        query: {
          userId: userData._id,
        },
      });
      dispatch(setSocket(socketIo));

      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

  // console.log(onlineUsers)

  if (isLoading) return <LoadingPage />;

  const currentUser = Boolean(userData);
  // Logged in
  return (
    <Routes>
      <Route
        path="/signin"
        element={!currentUser ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signup"
        element={!currentUser ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!currentUser ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={currentUser ? <HomePage /> : <Navigate to={"/signin"} />}
      >
        <Route index element={<HomeFeed />} />
        <Route path="profile/:userName" element={<ProfilePage />} />
        <Route path="create" element={<Create />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="notification" element={<Notification />} />
      </Route>
      <Route
        path="/reels"
        element={currentUser ? <ReelPage /> : <Navigate to={"/signin"} />}
      >
        <Route path="comments/:reelId" element={<ReelCommentModal />} />
      </Route>
      <Route
        path="/story/:userName"
        element={currentUser ? <StoryPage /> : <Navigate to={"/signin"} />}
      ></Route>
      <Route
        path="/message"
        element={currentUser ? <MessagePage /> : <Navigate to={"/signin"} />}
      >
        <Route path="conv/:receiverUserName" element={<ChatPage />} />
      </Route>
      <Route path="/inside" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
