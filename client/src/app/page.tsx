import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import Interactive from "@/components/Home/Interactive";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import React from "react";

const page = () => {
  return <section className="outerContainer flex-col">
    <div className="innerContainer">
      <Navbar />
      <Hero/>
      <Interactive/>
      <Features/>
      <Footer/>
    </div>
  </section>;
};

export default page;
