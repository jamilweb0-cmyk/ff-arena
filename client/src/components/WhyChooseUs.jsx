import { motion } from "framer-motion";

import {
  FaBolt,
  FaShieldAlt,
  FaTrophy,
  FaGift,
} from "react-icons/fa";

const WhyChooseUs = () => {

  const features = [
    {
      id: 1,
      icon: <FaBolt />,
      title: "Fast Booking",
      description:
        "Join Free Fire custom rooms instantly with one click booking system.",
      color: "text-yellow-400",
    },

    {
      id: 2,
      icon: <FaShieldAlt />,
      title: "Secure Platform",
      description:
        "Protected authentication and secure player data management.",
      color: "text-cyan-400",
    },

    {
      id: 3,
      icon: <FaTrophy />,
      title: "Daily Tournaments",
      description:
        "Compete against top players and win exciting rewards every day.",
      color: "text-purple-400",
    },

    {
      id: 4,
      icon: <FaGift />,
      title: "Huge Rewards",
      description:
        "Earn prize pools, exclusive rewards, and leaderboard recognition.",
      color: "text-green-400",
    },
  ];

  return (
    <section className="w-11/12 mx-auto py-20">

      {/* Heading */}

      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        viewport={{
          once: true,
        }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl font-extrabold text-purple-400">
          Why Choose FF Arena?
        </h1>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Experience the ultimate Free Fire custom room
          platform built for competitive players.
        </p>
      </motion.div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {features.map((feature, index) => (

          <motion.div
            key={feature.id}

            initial={{
              opacity: 0,
              y: 50,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.6,
              delay: index * 0.2,
            }}

            viewport={{
              once: true,
            }}

            whileHover={{
              scale: 1.05,
              y: -10,
            }}

            className="
              relative
              overflow-hidden
              bg-white/5
              backdrop-blur-lg
              border
              border-purple-800
              rounded-3xl
              p-8
              text-center
              shadow-xl
              shadow-purple-900/20
              transition-all
              duration-500
            "
          >

            {/* Glow */}

            <div
              className="
                absolute
                -top-10
                -right-10
                w-28
                h-28
                bg-purple-600/20
                blur-3xl
                rounded-full
              "
            ></div>

            {/* Icon */}

            <div
              className={`
                text-5xl
                mb-6
                flex
                justify-center
                ${feature.color}
              `}
            >
              {feature.icon}
            </div>

            {/* Title */}

            <h2 className="text-2xl font-bold text-white mb-4">
              {feature.title}
            </h2>

            {/* Description */}

            <p className="text-gray-400 leading-7">
              {feature.description}
            </p>

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default WhyChooseUs;