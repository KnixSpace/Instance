// import Features from "@/components/Home/Features";
// import { Hero } from "@/components/Home/Hero";
// import Interactive from "@/components/Home/Interactive";
// import Footer from "@/components/Layout/Footer";
// import { Navbar } from "@/components/Layout/Navbar";
// import React from "react";

// const page = () => {
//   return <section className="outerContainer flex-col">
//     <div className="innerContainer">
//       <Navbar/>
//       <Hero/>
//       <Interactive/>
//       <Features/>
//       <Footer/>
//     </div>
//   </section>;
// };

// export default page;

"use client"; // Ensures this component runs on the client side

import { Features } from "@/components/Home/Features";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="text-white min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
        <div className="flex items-center">
          <Image src="/logo.webp" alt="Logo" width={40} height={40} />
        </div>
        <nav className="px-4 py-1 hidden md:flex space-x-6 bg-lightbackground border-2 border-gray-500 rounded-full">
          <Link href="/" className="relative group">
            <span className="px-4 py-2 text-sm sm:text-base">Home</span>
            <span className="absolute inset-0 bg-gray-600 rounded-full opacity-0"></span>
          </Link>
          <Link href="/about" className="relative group">
            <span className="px-4 py-2 text-sm sm:text-base">About</span>
            <span className="absolute inset-0 bg-gray-600 rounded-full opacity-0"></span>
          </Link>
          <Link href="/contact" className="relative group">
            <span className="px-4 py-2 text-sm sm:text-base">Contact</span>
            <span className="absolute inset-0 bg-gray-600 rounded-full opacity-0"></span>
          </Link>
        </nav>
        <div className="hidden md:flex space-x-4">
          <Link href="/login" className="hover:text-gray-400">
            Login
          </Link>
          <Link href="/register" className="hover:text-gray-400">
            Register
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 sm:px-8 h-[50vh] md:h-[60vh]">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">INSTANCE</h1>
        <p className="text-lg sm:text-xl text-gray-400 mt-4">
          Automate. Simplify. Succeed.
        </p>
        <button className="mt-6 py-2 sm:py-3 px-6 sm:px-8 bg-purple-800 text-white rounded-lg text-lg hover:bg-purple-900">
          Let's Automate
        </button>
      </main>

      {/* Flow Section */}
      <section className="bg-[#4a4a58] w-full py-16 sm:py-32 text-center px-4">
        <p className="text-xl sm:text-2xl text-white">
          React flow example of connected nodes of apps
        </p>
      </section>

      {/* Feature Cards Section */}
      <Features/>
      {/* <section className="flex flex-col md:flex-row justify-around items-center w-full max-w-6xl py-12 sm:py-20 gap-6 px-4 sm:px-8">
        <div className="bg-[#1f1f2a] p-6 rounded-lg w-full sm:w-3/4 md:w-1/3 text-center">
          <h3 className="text-lg sm:text-xl mb-4">Drag-and-Drop Interface</h3>
          <p className="text-gray-400">
            Create complex workflows in minutes with our intuitive drag-and-drop
            functionality.
          </p>
        </div>
        <div className="bg-[#1f1f2a] p-6 rounded-lg w-full sm:w-3/4 md:w-1/3 text-center">
          <h3 className="text-lg sm:text-xl mb-4">Custom Triggers & Actions</h3>
          <p className="text-gray-400">
            Choose from a wide array of triggers and actions to personalize your
            workflows.
          </p>
        </div>
        <div className="bg-[#1f1f2a] p-6 rounded-lg w-full sm:w-3/4 md:w-1/3 text-center">
          <h3 className="text-lg sm:text-xl mb-4">
            Real-Time Analytics Dashboard
          </h3>
          <p className="text-gray-400">
            Gain insights into your workflows with real-time analytics.
          </p>
        </div>
      </section> */}

      {/* Footer Section */}
      <footer className="flex justify-center items-center  bg-[#0F1318]">
        <div className="flex justify-center items-center flex-col">
          <Image
            src="/logo.webp" // Path to your image in the public folder
            alt="Logo"
            width={60} // Set the width
            height={60} // Set the height
          />
          <h1 className="py-3   text-3xl"> INSTANCE</h1>
          <h2 className="text-gray-700 text-2xl">
            Automation Workflow Builder
          </h2>
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-sm">2024 Copyright Instance</h1>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default page;
