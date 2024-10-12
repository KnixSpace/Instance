"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TextGenerateEffect } from "../ui/text-generate-effect";

type Props = {};
const Navbar = (props: Props) => {
  const path = usePathname();
  return (
    <header className="w-full fixed top-0 left-0 right-0 py-6 px-12 flex  items-center justify-between z-30">
      <aside className="flex-1 flex gap-2 items-center">
        <img src="/logo.webp" alt="" className="size-10" />
        <div>
          <h1 className="font-semibold">Instance</h1>
          <TextGenerateEffect
            words="Automation Flow Builder"
            className="text-xs"
          />
        </div>
      </aside>
      <div className="">
        <div
          className={`rounded-full w-5 h-1 bg-white shadow-[0px_2px_25px_2px_#ffffff] -mb-[2.2px] transition-all ease-in-out duration-500 ${
            path === "/" ? "ml-7" : "ml-[104px]"
          }`}
        ></div>
        <nav className="flex gap-1 items-center rounded-full p-1 text-sm border border-[#f2f2f21a] bg-[#f2f2f20d] backdrop-filter backdrop-blur-md">
          <Link href={"/"} className="py-1 px-4 rounded-full">
            Home
          </Link>
          <Link href={"/about"} className="py-1 px-4 rounded-full">
            About
          </Link>
        </nav>
      </div>
      <aside className="flex-1 flex items-center justify-end gap-4 text-sm">
        <span className="cursor-pointer">Login</span>
        <Link href={"/register"}>Register</Link>
      </aside>
    </header>
  );
};
export default Navbar;