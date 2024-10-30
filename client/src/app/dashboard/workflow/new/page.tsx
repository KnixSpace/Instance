"use client";
import SidePanel from "@/components/workflow/SidePanel";
import Workflow from "@/components/workflow/Workflow";
import { useEffect, useState } from "react";

type Props = {};
const page = (props: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  const [small, setSmall] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSmall(true);
    } else {
      setSmall(false);
    }
  });

  return (
    <>
      <section className="h-full flex divide-x divide-darkSecondary">
        <div className="flex-1 flex flex-col divide-y divide-darkSecondary">
          <div className="flex justify-between items-center p-4 text-lg">
            <div>Workflow</div>
            <div
              className="p-1 flex justify-center items-center hover:bg-lightbackground rounded-md cursor-pointer"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontWeight: 300, fontSize: "20px" }}
              >
                dock_to_left
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <Workflow />
          </div>
        </div>
        <div
          className={`${
            open ? (small ? "w-80" : "w-0 lg:w-80") : "w-0"
          } transition-all overflow-hidden duration-500 ease-in-out`}
        >
          <SidePanel />
        </div>
      </section>
    </>
  );
};
export default page;
