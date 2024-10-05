import React, { useEffect } from "react";
import {  Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { useSignOutAccount } from "../../lib/react-query/queries";



const TopBar = () => {
  const { user } = useAuth();
  const { mutate: SignOut, isSuccess } = useSignOutAccount();

  const navigate = useNavigate();

 useEffect(()=>{
    if(isSuccess) navigate(0)
 },[isSuccess])




  return (
    <div className="sticky top-0 z-50 md:hidden bg-dark-2 w-full">
      <div className="flex justify-between items-center py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/logo.svg" alt="logo" width={130} height={325} />
        </Link>

        <div className="flex gap-4">
          <button
            className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-white "
            onClick={()=>SignOut()}
          >
            <img src="/assets/Icon/logout.svg" alt="" />
          </button>
          <Link
            to={`/profile/${user.id}`}
            className="flex justify-center items-center"
          >
            <img
              src={user.imageUrl}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>

        
        </div>        
      </div>
    </div>
  );
};

export default TopBar;
