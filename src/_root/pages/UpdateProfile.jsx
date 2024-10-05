import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserById,
  useUpdateUser,
} from "../../lib/react-query/queries.js";
import {  Loader } from "react-feather";
import ProfileUploader from "../../components/shared/ProfileUploader.jsx";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [formValues, setFormValues] = useState({
    file: [],
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
  });

  const { data: currentUser } = useGetUserById(id || "");
  const { mutateAsync: updateuser, isLoading: isLoadingUpdate } =
    useUpdateUser();

  useEffect(() => {
    if (currentUser) {
      setFormValues({
        file: [],
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updateUser = await updateuser({
      userId: currentUser.$id,
      name: formValues.name,
      bio: formValues.bio,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    });

    if (updateUser) {
      setUser({
        ...user,
        name: updateUser?.name,
        bio: updateUser?.bio,
        imageUrl: updateUser?.imageUrl,
      });
      navigate(`/profile/${id}`);
    } else {
      alert("Update user failed. Please try again.");
    }
  };

  const handleInputChange = (e) =>{
    setFormValues({...formValues,[e.target.name]:e.target.value})
  }

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="flex justify-start items-center  w-full max-w-5xl">
          <img
            src="/assets/Icon/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert brightness-0 transition"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <form className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
          <div className="fle">
            <ProfileUploader fieldChange={(files)=>setFormValues({...formValues,file:files})} mediaUrl={currentUser.imageUrl} />
          </div>
          <div>
            <label>Name</label>
            <input type="text"
             name="name" value={formValues.name}
             onChange={handleInputChange} />
          </div>

          <div>
            <label>Email</label>
            <input type="email"
             name="email"
             value={formValues.email}
             disabled />
          </div>

          <div>
            <label>Bio</label>
            <textarea name="bio"
            value={formValues.bio}
            onChange={handleInputChange}
            className="cusotm-scrollbar"></textarea>
          </div>

          <div className="flex gap-4 items-center justify-end">
            <button type="button" onClick={()=>navigate(-1)}>Cancel</button>
            <button type="submit" disabled={isLoadingUpdate}
            >{isLoadingUpdate && <Loader/>}Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
