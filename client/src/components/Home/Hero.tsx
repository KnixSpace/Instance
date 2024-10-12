"use client";
import Link from "next/link";
import { SparklesCore } from "../ui/sparkles";

type Props = {};
const Hero = (props: Props) => {
  return (
    <section className="h-dvh flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center overflow-hidden mb-8">
        <h1 className="md:text-7xl text-3xl lg:text-9xl font-medium text-center relative">
          Instance
        </h1>
        <div className="w-[40rem] h-40 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[#7441fe] to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[#7441fe] to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
      <Link
        href={"/register"}
        className="relative inline-flex overflow-hidden rounded-full p-px"
      >
        <span className="absolute inset-[-1000%] animate-[spin_1s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7441FE_0%,#E3D9FE_50%,#7441FE_100%)]" />
        <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-background px-6 py-2 text-sm font-medium backdrop-blur-3xl">
          Let's Automate
        </span>
      </Link>
    </section>
  );
};
export default Hero;
