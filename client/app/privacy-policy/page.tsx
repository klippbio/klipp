"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PrivacyPolicy from "@/components/privacy-policy";

const Home = () => {
  return (
    <div className="bg-white">
      <Navbar />

      <PrivacyPolicy />

      <Footer />
    </div>
  );
};

export default Home;
