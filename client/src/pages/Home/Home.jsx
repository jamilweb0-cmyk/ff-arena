import Hero from "../../components/Hero";
import FeaturedRooms from "../../components/FeaturedRooms";
import Statistics from "../../components/Statistics";
import WhyChooseUs from "../../components/WhyChooseUs";
import LiveCounter from "../../components/LiveCounter";

const Home = () => {
  return (
    <div>

      {/* Hero Section */}
      <Hero />

      {/* Featured Rooms */}
      <FeaturedRooms />

      <LiveCounter />

      {/* Statistics */}
      <Statistics />

      {/* Why Choose Us */}
      <WhyChooseUs />

    </div>
  );
};

export default Home;