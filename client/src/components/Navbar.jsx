import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { 
  FaHome, 
  FaGamepad, 
  FaPlusCircle, 
  FaBook, 
  FaUserPlus, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaUserCircle
} from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeStyle = ({ isActive }) =>
    isActive
      ? "text-purple-400 font-semibold relative after:absolute after:left-0 after:-bottom-2 after:w-full after:h-[2px] after:bg-purple-500"
      : "text-gray-300 hover:text-purple-300 transition";

  const mobileActiveStyle = ({ isActive }) =>
    isActive
      ? "text-white bg-purple-600/20 border-l-4 border-purple-500 pl-4"
      : "text-gray-300 hover:text-white hover:bg-white/5 pl-4 transition-all";

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      logout();
      Swal.fire({ 
        icon: "success", 
        title: "Logged Out Successfully", 
        timer: 1500, 
        showConfirmButton: false,
        background: "#120c1f",
        color: "#fff"
      });
      closeMenu();
    }
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#120c1f]/90 backdrop-blur-lg border-b border-purple-900/50 shadow-lg shadow-purple-900/20" 
          : "bg-[#120c1f] border-b border-purple-900"
      }`}
    >
      <div className="w-11/12 mx-auto flex justify-between items-center py-4 md:py-5">
        {/* LOGO */}
        <NavLink to="/" className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
          <span className="text-purple-400">FF</span>
          <span className="text-white">Arena</span>
        </NavLink>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={activeStyle}>
            <div className="flex items-center gap-2">
              <FaHome className="text-sm" /> Home
            </div>
          </NavLink>
          <NavLink to="/rooms" className={activeStyle}>
            <div className="flex items-center gap-2">
              <FaGamepad className="text-sm" /> Rooms
            </div>
          </NavLink>
          <NavLink to="/my-rooms" className={activeStyle}>
            <div className="flex items-center gap-2">
              <FaBook className="text-sm" /> My Rooms
            </div>
          </NavLink>
          <NavLink to="/add-room" className={activeStyle}>
            <div className="flex items-center gap-2">
              <FaPlusCircle className="text-sm" /> Add Room
            </div>
          </NavLink>

          {user ? (
            <>
              <NavLink to="/my-bookings" className={activeStyle}>
                <div className="flex items-center gap-2">
                  <FaBook className="text-sm" /> My Bookings
                </div>
              </NavLink>
              
              {/* User Profile */}
              <div className="flex items-center gap-3 bg-[#1b1330] px-4 py-2 rounded-full border border-purple-700/50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                  {user?.email?.charAt(0)?.toUpperCase()}
                </div>
                <span className="hidden lg:block text-purple-300 text-sm max-w-[150px] truncate">
                  {user?.email}
                </span>
              </div>
              
              {/* Logout */}
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
              >
                <FaSignOutAlt className="text-sm" /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={activeStyle}>
                <div className="flex items-center gap-2">
                  <FaSignInAlt className="text-sm" /> Login
                </div>
              </NavLink>
              <NavLink 
                to="/register" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 py-2 rounded-lg transition flex items-center gap-2 text-white font-semibold"
              >
                <FaUserPlus className="text-sm" /> Register
              </NavLink>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-2xl text-white hover:text-purple-400 transition"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-[#120c1f]/95 backdrop-blur-lg border-t border-purple-900/50 animate-slideDown">
          <div className="w-full py-6 flex flex-col">
            {/* User Info (if logged in) */}
            {user && (
              <div className="flex items-center justify-center gap-3 pb-6 mb-6 border-b border-purple-900/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg">
                  {user?.email?.charAt(0)?.toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-gray-400 text-xs truncate max-w-[200px]">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            {/* Menu Items - Centered */}
            <div className="flex flex-col gap-1">
              <NavLink 
                to="/" 
                onClick={closeMenu}
                className={mobileActiveStyle}
              >
                <div className="flex items-center gap-3 py-3">
                  <FaHome className="text-purple-400" />
                  <span className="font-medium">Home</span>
                </div>
              </NavLink>

              <NavLink 
                to="/rooms" 
                onClick={closeMenu}
                className={mobileActiveStyle}
              >
                <div className="flex items-center gap-3 py-3">
                  <FaGamepad className="text-purple-400" />
                  <span className="font-medium">Rooms</span>
                </div>
              </NavLink>

              <NavLink 
                to="/my-rooms" 
                onClick={closeMenu}
                className={mobileActiveStyle}
              >
                <div className="flex items-center gap-3 py-3">
                  <FaBook className="text-purple-400" />
                  <span className="font-medium">My Rooms</span>
                </div>
              </NavLink>

              <NavLink 
                to="/add-room" 
                onClick={closeMenu}
                className={mobileActiveStyle}
              >
                <div className="flex items-center gap-3 py-3">
                  <FaPlusCircle className="text-purple-400" />
                  <span className="font-medium">Add Room</span>
                </div>
              </NavLink>

              {user ? (
                <>
                  <NavLink 
                    to="/my-bookings" 
                    onClick={closeMenu}
                    className={mobileActiveStyle}
                  >
                    <div className="flex items-center gap-3 py-3">
                      <FaBook className="text-purple-400" />
                      <span className="font-medium">My Bookings</span>
                    </div>
                  </NavLink>

                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 py-3 pl-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                  >
                    <FaSignOutAlt />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/login" 
                    onClick={closeMenu}
                    className={mobileActiveStyle}
                  >
                    <div className="flex items-center gap-3 py-3">
                      <FaSignInAlt className="text-purple-400" />
                      <span className="font-medium">Login</span>
                    </div>
                  </NavLink>

                  <NavLink 
                    to="/register" 
                    onClick={closeMenu}
                    className="mx-4 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 py-3 rounded-lg transition flex items-center justify-center gap-2 text-white font-semibold"
                  >
                    <FaUserPlus />
                    <span>Register</span>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;