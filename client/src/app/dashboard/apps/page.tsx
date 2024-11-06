"use client";
import { connectedApps } from "@/lib/constants";
import { useState } from "react";

type Props = {};

interface AppInfo {
  appName: string;
  icon: string;
}

const page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<AppInfo>();

  return (
    <>
      <section className="h-full flex flex-col w-full divide-y divide-darkSecondary">
        <div className="flex items-center p-4 text-lg px-16">Apps</div>
        <div className="flex-1 h-full flex flex-col overflow-auto">
          <div className="w-full sticky top-0 flex items-center gap-8 py-8 px-16 mb-4 bg-background">
            <div className="flex-1">
              <input
                type="text"
                className="w-full rounded-full bg-lightbackground focus:outline-none py-3 px-8 truncate text-sm"
                placeholder="Search your connected apps"
              />
            </div>
          </div>
          <div className="w-full px-16 grid grid-cols-4 gap-6">
            {connectedApps.map((app, i) => (
              <div
                key={i}
                className="w-full flex items-center gap-4 rounded-md p-4 hover:bg-lightbackground cursor-pointer transition-all duration-500 ease-in-out"
                onClick={() => {
                  setInfo(app);
                  setOpen(true);
                }}
              >
                <div className="size-12">
                  <img src={app.icon} alt="" className="h-full w-full" />
                </div>
                <div>
                  <h4 className="capitalize font-medium">{app.appName}</h4>
                  <h6 className="text-xs text-gray-500">
                    Connected Accounts : 6
                  </h6>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="overflow-auto flex-1"></div> */}
        </div>
      </section>
      {/* WIP */}
      <aside
        className={`p-4 h-dvh min-w-64 bg-darkSecondary transition-all duration-300 ease-in-out ${
          open ? " fixed top-0 right-0" : "fixed -right-full"
        }`}
      >
        <div className="w-full flex">
          <div className="flex justify-center items-center p-1 mb-4 rounded-md hover:bg-gray-700 cursor-pointer">
            <span
              className="material-symbols-rounded text-gray-500 hover:text-gray-400 transition-all duration-500 ease-in-out"
              onClick={() => {
                setOpen(false);
              }}
            >
              dock_to_left
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center mb-4">
          <img src={info?.icon} alt="" className="size-10" />
          <span className="capitalize">{info?.appName}</span>
        </div>
        <h4 className="text-gray-500 mb-4">Connected Accounts</h4>
        <div className="overflow-auto">
          {/* map this when api */}
          <div className="flex gap-2 p-1 mb-1">
            <img src="/logo.jpg" alt="" className="size-4 rounded-sm" />
            <span className="text-xs">krupalgp2003@gmail.com</span>
          </div>
        </div>
      </aside>
    </>
  );
};
export default page;
