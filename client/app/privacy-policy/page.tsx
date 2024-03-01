"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PrivacyPolicy from "@/components/privacy-policy";

const Home = () => {
  return (
    <div className="bg-white selection:bg-teal-300">
      <Navbar />

      <PrivacyPolicy />

      <Footer />
    </div>
  );
};

export default Home;
