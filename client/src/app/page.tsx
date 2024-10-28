import { Features } from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Interactive from "@/components/home/Interactive";
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
