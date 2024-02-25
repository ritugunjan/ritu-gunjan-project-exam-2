import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  isVenueManager,
  logOutUser,
} from "../../services/api";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { MdOutlineAddBusiness } from "react-icons/md";
import { IoHome } from "react-icons/io5";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logOutUser();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : "Unknown error");
    }
  };

  


  const isRootPath = location.pathname === "/";

  return (
    <nav className="bg-[#90d8b2]">
      <div className="w-[90%] mx-auto flex justify-between items-center h-[10vh]">
        <Link to="/" className="hover:no-underline hover:text-gray-900">
          <p className="text-3xl font-bold ">Holidaze</p>
        </Link>
        

        {!isAuthenticated() && (
          <div>
            <div>
              <CgProfile className="mx-auto" />
            </div>
            <div>
              <Link to="/login" className="hover:no-underline hover:text-gray-900 font-medium">Login</Link>
              /
              <Link to="/register" className="hover:no-underline hover:text-gray-900 font-medium">Register</Link>
            </div>
          </div>
        )}

        {isAuthenticated() && (
          <div className=" flex justify-between text-2xl gap-3">
            {!isVenueManager() && (
              <IoHome
              className="cursor-pointer" onClick={() => navigate('/')} />
            )}
            <CgProfile onClick={() => navigate('/profile')} className="cursor-pointer" />
            
            {isAuthenticated() && <button onClick={handleLogout}><MdLogout /></button>}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
