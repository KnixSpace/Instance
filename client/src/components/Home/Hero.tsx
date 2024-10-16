"use client";
import Link from "next/link";
import { SparklesCore } from "../ui/sparkles";
import { AnimatedShinyText } from "../ui/AnimatedShinyText";

type Props = {};
const Hero = (props: Props) => {
  return (
    <section className="h-dvh w-full flex flex-col items-center justify-center">
      <AnimatedShinyText className="w-full mb-8" shimmerWidth={200}>
        <span className="text-xl font-semibold">
          Accelerate Your Workflow: Build Tailored Automation Solutions
          Effortlessly!
        </span>
      </AnimatedShinyText>
      <div className="w-full flex flex-col items-center justify-center overflow-hidden mb-8">
        <h1 className="md:text-7xl text-5xl lg:text-9xl font-medium text-center relative">
          Instance
        </h1>
        <div className=" w-full sm:w-[40rem] h-24 sm:h-40 relative">
          {/* Gradients */}
          <div className="flex flex-col items-center">
            <div className="absolute top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute top-0 bg-gradient-to-r from-transparent via-[#7441fe] to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute top-0 bg-gradient-to-r from-transparent via-[#7441fe] to-transparent h-px w-1/4" />
          </div>

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
          <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(150px_at_top,transparent_20%,white)] md:[mask-image:radial-gradient(250px_150px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
      <Link
        href={"/dashboard"}
        className="relative flex justify-center items-center overflow-hidden rounded-full p-px"
      >
        <span className="z-10 flex items-center justify-center px-8 py-2 bg-background rounded-full h-full w-full">
          Let's Automate
        </span>
        <span className="absolute inset-[-1000%] animate-[spin_1s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7441FE_0%,#E3D9FE_50%,#7441FE_100%)]" />
      </Link>
    </section>
  );
};
export default Hero;
