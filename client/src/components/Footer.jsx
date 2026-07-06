import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
  FaGamepad,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0f0a18] border-t border-purple-900 mt-20">

      <div className="w-11/12 mx-auto py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo Section */}

          <div>

            <h1 className="text-4xl font-extrabold">
              <span className="text-purple-400">
                FF
              </span>

              <span className="text-white">
                Arena
              </span>
            </h1>

            <p className="mt-5 text-gray-400 leading-7">
              Join Free Fire custom rooms,
              compete against skilled players,
              and win exciting rewards daily.
            </p>

            <div className="flex gap-4 mt-6">

              <a
                href="#"
                className="
                  w-10 h-10
                  rounded-full
                  bg-purple-600
                  flex
                  items-center
                  justify-center
                  hover:scale-110
                  transition
                "
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="
                  w-10 h-10
                  rounded-full
                  bg-purple-600
                  flex
                  items-center
                  justify-center
                  hover:scale-110
                  transition
                "
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="
                  w-10 h-10
                  rounded-full
                  bg-purple-600
                  flex
                  items-center
                  justify-center
                  hover:scale-110
                  transition
                "
              >
                <FaLinkedinIn />
              </a>

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h2 className="text-xl font-bold text-white mb-5">
              Quick Links
            </h2>

            <div className="flex flex-col gap-3 text-gray-400">

              <Link
                to="/"
                className="hover:text-purple-400 transition"
              >
                Home
              </Link>

              <Link
                to="/rooms"
                className="hover:text-purple-400 transition"
              >
                Rooms
              </Link>

              <Link
                to="/my-rooms"
                className="hover:text-purple-400 transition"
              >
                My Rooms
              </Link>

              <Link
                to="/my-bookings"
                className="hover:text-purple-400 transition"
              >
                My Bookings
              </Link>

            </div>

          </div>

          {/* Services */}

          <div>

            <h2 className="text-xl font-bold text-white mb-5">
              Services
            </h2>

            <div className="flex flex-col gap-3 text-gray-400">

              <p className="hover:text-purple-400 transition">
                Custom Rooms
              </p>

              <p className="hover:text-purple-400 transition">
                Daily Matches
              </p>

              <p className="hover:text-purple-400 transition">
                Tournament Booking
              </p>

              <p className="hover:text-purple-400 transition">
                Prize Pool Events
              </p>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h2 className="text-xl font-bold text-white mb-5">
              Contact
            </h2>

            <div className="space-y-4 text-gray-400">

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-purple-400" />
                <span>
                  yourmail@gmail.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaGamepad className="text-purple-400" />
                <span>
                  FF Arena Community
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-purple-900 mt-12 pt-8 text-center">

          <p className="text-gray-500">
            © 2026 FF Arena. All Rights Reserved.
          </p>

          <p className="mt-2 text-purple-400">
            Developed with ❤️ by Jamil Ahmed
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;