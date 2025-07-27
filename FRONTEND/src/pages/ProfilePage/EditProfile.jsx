import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import {  setUserData } from "../../redux/userSlice";
import { useNavigate } from "react-router";

const EditProfile = ({ setOpenEditProfile }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // * this is the initial form state
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    bio: '',
    profession: '',
    gender: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  // * this is for previweing image in the form before submitting
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result); // <== preview image as base64
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const queryClient = useQueryClient();
  // * the mutation to update the users info
  const {
    mutate: updateProfile,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (formData) => {
      // console.log(formData)
      const res = await api.post("/api/user/editProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["profileUser"]);
      queryClient.invalidateQueries(["currentUser"]);
      dispatch(setUserData(data))
      const { userData : newUserData } = useSelector((state) => state.user);
      navigate(`/profile/${newUserData.userName}`)
      
    },
    onError: (error) => {
      console.log("error in the update user info : " + error);
    },
  });

  // * this is the primary function that will invoke the mutation
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    if (formData.name) form.append("name", formData.name);
    if (formData.userName) form.append("userName", formData.userName);
    if (formData.bio) form.append("bio", formData.bio);
    if (formData.profession) form.append("profession", formData.profession);
    if (formData.gender) form.append("gender", formData.gender);
    if (formData.image) form.append("profileImage", formData.image);

    updateProfile(form);
    
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50">
      <RxCross2
        onClick={() => setOpenEditProfile(false)}
        className="absolute h-8 w-8 text-white top-5 right-5 cursor-pointer hover:bg-white rounded-full hover:text-black transition-all"
      />

      <div className="bg-neutral-950 border border-amber-100 rounded-2xl w-[400px] sm:w-3/4 md:w-2/3 lg:w-1/2 h-4/5 p-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 justify-around text-white text-sm h-full overflow-y-auto font-mono"
        >
          <div className="flex justify-around items-center">
            <label className="flex flex-col items-center cursor-pointer">
              <div className="w-[100px] h-[100px] rounded-full border border-amber-50">
                <img
                  src={previewImage || userData.profileImage}
                  alt="profile"
                  className="w-full h-full  object-cover rounded-full"
                />
              </div>
              <input type="file" name="image" onChange={handleChange} hidden />
              <span className="text-xs mt-1 text-amber-200">Change Photo</span>
            </label>
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:opacity-90 transition text-black font-semibold py-3 cursor-pointer px-2 rounded"
            >
              Save Changes
            </button>
          </div>

          <label className="flex flex-col">
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={userData.name}
              className="bg-neutral-800 px-2 py-1 rounded"
            />
          </label>

          <label className="flex flex-col">
            Username
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder={userData.userName}
              className="bg-neutral-800 px-2 py-1 rounded"
            />
          </label>

          <label className="flex flex-col">
            Bio
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
              maxLength={100}
              placeholder={userData.bio}
              className="bg-neutral-800 px-2 py-1 rounded resize-none"
            />
          </label>

          <label className="flex flex-col">
            Profession
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder={userData.profession}
              className="bg-neutral-800 px-2 py-1 rounded"
            />
          </label>

          <div className="flex flex-col">
            Gender
            <div className="flex gap-3 mt-1 text-sm">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                />{" "}
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="others"
                  onChange={handleChange}
                />{" "}
                Others
              </label>
            </div>
            {isPending && <p className="text-blue-500">Saving...</p>}
            {isSuccess && <p className="text-green-500">Profile updated!</p>}
            {isError && <p className="text-red-500">Something went wrong.</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
