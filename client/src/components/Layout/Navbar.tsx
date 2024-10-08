'use client';

import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className="text-white min-h-screen flex flex-col items-center">

      {/* Header Section */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
        <div className="flex items-center">
          <Image src="/logo.webp" alt="Logo" width={40} height={40} />
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </nav>
        <div className="hidden md:flex space-x-4">
          <Link href="/login" className="hover:text-gray-400">Login</Link>
          <Link href="/register" className="hover:text-gray-400">Register</Link>
        </div>
      </header>
    </div>
  );
};
