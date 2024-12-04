import { Features } from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
// import Interactive from "@/components/home/Interactive";
import Footer from "@/components/Layout/Footer";
import React from "react";

const page = () => {
  return (
    <section className="outerContainer flex-col">
      <Hero />
      {/* <Interactive /> */}
      <Features />
      <Footer />
    </section>
  );
};

export default page;
