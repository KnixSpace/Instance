'use client'; // Ensures this component runs on the client side

import Image from 'next/image';
import Link from 'next/link';

const Login = () => {
  const handleGoogleLogin = () => {
    // Implement your Google Auth logic here
    console.log("Google Auth initiated");
  };

  return (
    <div className="bg-[#0f0f14] text-white min-h-screen flex flex-col items-center justify-center">
      Google Auth initiated
    </div>
  );
};

export default Login;
