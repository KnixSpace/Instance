"use client"; // Ensures this component runs on the client side

import React from "react";

export const Hero = () => {
  return (
    <main className="flex flex-col items-center justify-center text-center px-6 sm:px-8 h-[50vh] md:h-[60vh]">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">INSTANCE</h1>
      <p className="text-lg sm:text-xl text-gray-400 mt-4">
        Automate. Simplify. Succeed.
      </p>
      <button className="mt-6 py-2 sm:py-3 px-6 sm:px-8 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700">
        Let's Automate
      </button>
    </main>
  );
};