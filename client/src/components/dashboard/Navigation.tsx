"use client";

import Link from "next/link";
import { navList } from "@/lib/constants";

type Props = {};

const Navigation = (props: Props) => {
  return (
    <div className="w-64 h-dvh sticky top-0 flex flex-col divide-y divide-secondary">
      <div className="flex items-center p-4 justify-between select-none">
        <div className="flex gap-2 items-center">
          <img src="/logo.jpg" alt="" className="size-6" />
          <h1 className="font-medium text-xl text-gray-200">Instance</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {navList.map((nav, i) => (
          <Link
            href={nav.href}
            className={`flex gap-2 items-center p-1 rounded-md mb-1 ${
              nav.label === "Create Workflow"
                ? "hover:bg-[#8f66fe] bg-cta"
                : "hover:bg-lightbackground"
            }`}
            key={i}
          >
            <span
              className="material-symbols-rounded"
              style={{ fontWeight: "300" }}
            >
              {nav.icon}
            </span>
            <span className="text-sm">{nav.label}</span>
          </Link>
        ))}
      </div>
      <div className="p-4">
        <div className="flex gap-2 items-center justify-between">
          <Link
            href={"dashboard/profile"}
            className="flex gap-2 items-center hover:bg-lightbackground w-full rounded-md"
          >
            <div className="rounded-sm flex justify-center items-center size-8 bg-lightbackground">
              {/* <img
              src="/logo.jpg"
              alt=""
              className="h-full w-full object-contain"
            /> */}
              K
            </div>
            <span className="text-sm">Krupal Patel</span>
          </Link>
          <div className="min-h-8 min-w-8 flex justify-center items-center rounded-md hover:bg-lightbackground cursor-pointer">
            <span
              className="material-symbols-rounded"
              style={{ fontSize: "20px" }}
            >
              logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navigation;
