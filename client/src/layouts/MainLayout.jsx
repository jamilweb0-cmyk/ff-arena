import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0f0a1a] text-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;