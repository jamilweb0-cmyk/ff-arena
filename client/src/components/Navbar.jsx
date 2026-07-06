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
} from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } =
    useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 50
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const activeStyle = ({
    isActive,
  }) =>
    isActive
      ? `
        text-purple-400
        font-semibold
        relative
        after:absolute
        after:left-0
        after:-bottom-2
        after:w-full
        after:h-[2px]
        after:bg-purple-500
      `
      : `
        text-gray-300
        hover:text-purple-300
        transition
      `;

  const closeMenu = () => {
    setOpen(false);
  };

  const handleLogout =
    async () => {
      const result =
        await Swal.fire({
          title: "Logout?",
          text: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor:
            "#9333ea",
          confirmButtonText:
            "Logout",
        });

      if (
        result.isConfirmed
      ) {
        logout();

        Swal.fire({
          icon: "success",
          title:
            "Logged Out",
          timer: 1500,
          showConfirmButton:
            false,
        });

        closeMenu();
      }
    };

  return (
    <nav
      className={`
      sticky
      top-0
      z-50
      transition-all
      duration-300

      ${
        scrolled
          ? `
          bg-[#120c1f]/80
          backdrop-blur-lg
          border-b
          border-purple-900
          shadow-lg
          shadow-purple-900/20
        `
          : `
          bg-[#120c1f]
          border-b
          border-purple-900
        `
      }
    `}
    >
      <div className="w-11/12 mx-auto flex justify-between items-center py-5">

        {/* LOGO */}

        <NavLink
          to="/"
          className="text-3xl md:text-4xl font-extrabold"
        >
          <span className="text-purple-400">
            FF
          </span>

          <span className="text-white">
            Arena
          </span>
        </NavLink>

        {/* DESKTOP */}

        <div className="hidden md:flex items-center gap-7">

          <NavLink
            to="/"
            end
            className={
              activeStyle
            }
          >
            <div className="flex items-center gap-2">
              <FaHome />
              Home
            </div>
          </NavLink>

          <NavLink
            to="/rooms"
            className={
              activeStyle
            }
          >
            <div className="flex items-center gap-2">
              <FaGamepad />
              Rooms
            </div>
          </NavLink>

          <NavLink
            to="/my-rooms"
            className={
              activeStyle
            }
          >
            <div className="flex items-center gap-2">
              <FaBook />
              My Rooms
            </div>
          </NavLink>

          <NavLink
            to="/add-room"
            className={
              activeStyle
            }
          >
            <div className="flex items-center gap-2">
              <FaPlusCircle />
              Add Room
            </div>
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/my-bookings"
                className={
                  activeStyle
                }
              >
                <div className="flex items-center gap-2">
                  <FaBook />
                  My Bookings
                </div>
              </NavLink>

              {/* USER */}

              <div
                className="
                flex
                items-center
                gap-3
                bg-[#1b1330]
                px-4
                py-2
                rounded-full
                border
                border-purple-700
              "
              >
                <div
                  className="
                  w-10
                  h-10
                  rounded-full
                  bg-gradient-to-r
                  from-purple-500
                  to-pink-500
                  flex
                  items-center
                  justify-center
                  font-bold
                "
                >
                  {user?.email
                    ?.charAt(
                      0
                    )
                    ?.toUpperCase()}
                </div>

                <span
                  className="
                  hidden
                  lg:block
                  text-purple-300
                  text-sm
                "
                >
                  {
                    user?.email
                  }
                </span>
              </div>

              <button
                onClick={
                  handleLogout
                }
                className="
                flex
                items-center
                gap-2
                text-red-400
                hover:text-red-300
              "
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={
                  activeStyle
                }
              >
                <div className="flex items-center gap-2">
                  <FaSignInAlt />
                  Login
                </div>
              </NavLink>

              <NavLink
                to="/register"
                className="
                bg-purple-600
                hover:bg-purple-700
                px-5
                py-2
                rounded-lg
                transition
              "
              >
                <div className="flex items-center gap-2">
                  <FaUserPlus />
                  Register
                </div>
              </NavLink>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="md:hidden text-3xl"
        >
          {open ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}

      {open && (
        <div
          className="
          md:hidden
          bg-[#120c1f]
          border-t
          border-purple-900
        "
        >
          <div className="w-11/12 mx-auto py-5 flex flex-col gap-5">

            <NavLink
              to="/"
              onClick={
                closeMenu
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/rooms"
              onClick={
                closeMenu
              }
            >
              Rooms
            </NavLink>

            <NavLink
              to="/my-rooms"
              onClick={
                closeMenu
              }
            >
              My Rooms
            </NavLink>

            <NavLink
              to="/add-room"
              onClick={
                closeMenu
              }
            >
              Add Room
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/my-bookings"
                  onClick={
                    closeMenu
                  }
                >
                  My Bookings
                </NavLink>

                <button
                  onClick={
                    handleLogout
                  }
                  className="
                  text-left
                  text-red-400
                "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={
                    closeMenu
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={
                    closeMenu
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;