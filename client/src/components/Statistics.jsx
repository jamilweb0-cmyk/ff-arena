import CountUpModule from "react-countup";

const CountUp = CountUpModule.default;

import {
  FaUsers,
  FaGamepad,
  FaTrophy,
  FaCoins,
} from "react-icons/fa";

import { motion } from "framer-motion";

const Statistics = () => {

  const stats = [
    {
      id: 1,
      icon: <FaUsers />,
      value: 500,
      suffix: "+",
      title: "Active Players",
      color: "text-purple-400",
    },

    {
      id: 2,
      icon: <FaGamepad />,
      value: 120,
      suffix: "+",
      title: "Rooms Created",
      color: "text-cyan-400",
    },

    {
      id: 3,
      icon: <FaTrophy />,
      value: 50,
      suffix: "+",
      title: "Daily Matches",
      color: "text-yellow-400",
    },

    {
      id: 4,
      icon: <FaCoins />,
      value: 10000,
      suffix: "+",
      title: "Prize Pool",
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
          📊 FF Arena Statistics
        </h1>

        <p className="text-gray-400 mt-4">
          Live Free Fire community performance
        </p>
      </motion.div>

      {/* Cards */}

      <div className="grid md:grid-cols-4 gap-8">

        {stats.map((stat, index) => (

          <motion.div
            key={stat.id}

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
              y: -10,
              scale: 1.05,
            }}

            className="
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

            {/* Icon */}

            <div
              className={`
                text-5xl
                mb-5
                flex
                justify-center
                ${stat.color}
              `}
            >
              {stat.icon}
            </div>

            {/* Number */}

            <h2
  className={`
    text-5xl
    font-extrabold
    ${stat.color}
  `}
>
  <CountUp
  end={stat.value}
  duration={3}
/>
  {stat.suffix}
</h2>

            {/* Title */}

            <p className="mt-4 text-gray-300 text-lg">
              {stat.title}
            </p>

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default Statistics;