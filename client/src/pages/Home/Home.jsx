import Hero from "../../components/Hero";
import FeaturedRooms from "../../components/FeaturedRooms";
import Statistics from "../../components/Statistics";
import WhyChooseUs from "../../components/WhyChooseUs";
import LiveCounter from "../../components/LiveCounter";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedRooms />
      <LiveCounter />
      <Statistics />
      <WhyChooseUs />
    </div>
  );
};

export default Home;