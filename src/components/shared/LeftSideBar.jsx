import React, { useEffect } from "react";
import { Link, NavLink, useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { sidebarLinks } from "../../constants";

const LeftSideBar = () => {

    const {pathname} = useLocation()
    const navigate = useNavigate()
  const { user, SignOut } = useAuth();

  useEffect(() => {
    if (!user) navigate("/sign-in");
  }, [user]);

  const handleSignOut = async () => {
    const success = await SignOut();
    if (success) navigate("/sign-in");
  };

  // console.log(user)

  return (
    <nav className="hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-dark-2">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/logo.svg" alt="logo" width={170} height={36} />
        </Link>

        <Link to={`/profile/${user.$id}`} className="flex gap-3 items-center">
          <img src={user.imageUrl} alt="" className="h-14 w-14 rounded-full" />
          <div
            className="flex flex-col
            "
          >
            <p className="text-[18px] font-bold leading-[140%]">{user.name}</p>
            <p className="text-[14px] font-normal leading-[140%] text-light-3">
              ${user.name}
            </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
         
            {sidebarLinks.map((link) => {
                const isActive = pathname === link.route


              return (
                <li key={link.label} className={`rounded-lg base-medium hover:bg-primary-500 transition group ${isActive && 'bg-primary-500'}`}>
                  <NavLink to={link.route}
                  className="flex gap-4 items-center p-4">
                    <img src={link.imgURL} alt={link.label} className={`group-hover:invert-0 group-hover:brightness-0 group-hover:transition ${isActive && 'invert brightness-0 transition'}`} />
                    {link.label}
                    </NavLink>
                </li>
              );
            })}
         
        </ul>
      </div>
      <button className='flex gap-4 items-center justify-start hover:bg-transparent hover:text-white ' onClick={handleSignOut}>
                    <img src="/assets/Icon/logout.svg" alt="" />
                    <p className="text-[14px] font-medium leading-[140%] lg:text-[16px] lg:font-medium lg:leading-[140%]">Logout</p>
                </button>
    </nav>
  );
};

export default LeftSideBar;
