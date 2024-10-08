"use client"; // Ensures this component runs on the client side

import Image from "next/image";
import Link from "next/link";

const Register = () => {
  const handleGoogleRegister = () => {
    // Implement your Google Auth logic here
    console.log("Google Auth initiated for registration");
  };

  return (
    <div className="bg-[#0f0f14] text-white min-h-screen flex flex-col items-center justify-center">
      <Image
        src="/logo.webp"
        alt="Logo"
        width={100}
        height={100}
        className="mb-8"
      />
      <h1 className="text-3xl md:text-4xl font-bold">Automate your success - Sign Up Today!</h1>
      <button
        onClick={handleGoogleRegister}
        className="mt-6 py-2 sm:py-3 px-6 sm:px-8 bg-purple-800 text-white rounded-lg text-lg hover:bg-purple-800"
      >
        Continue with Google
      </button>
      <Link href="/" className="mt-4 text-gray-400 hover:text-gray-300">
        Back to Home
      </Link>
    </div>
  );
};

export default Register;
