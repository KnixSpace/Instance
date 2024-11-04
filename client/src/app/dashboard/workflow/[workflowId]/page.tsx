"use client";
import SidePanel from "@/components/workflow/SidePanel";
import Workflow from "@/components/workflow/Workflow";
import {
  setWarning,
} from "@/lib/features/workflow/workflowSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {};
const page = (props: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  const [small, setSmall] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const warnings = useAppSelector((state) => state.workflow.warning);
  const { push } = useRouter();

  if (warnings.isWarning) {
    setTimeout(() => {
      dispatch(setWarning({ isWarning: false, message: null }));
    }, 3000);
  }

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSmall(true);
    } else {
      setSmall(false);
    }
  });

  //call to api to get the workflow with id from url and set the redux state for this.
  //if id workflow not found then redirect to /dashboard
  //if workflow is found then set the redux state and render the workflow
  const getWorkfow = async () => {
    try {
      const response = await axios.post(
        "",
        { userId: "", workflowId: "" },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // dispatch(initializedExistingWorkflow(response.data));
      } else {
        push("/dashboard");
      }

      // dispatch(initializedExistingWorkflow(response.data));
    } catch (error) {
      console.log("workflow not found", error);
    }
  };

  useEffect(() => {
    // getWorkfow();
  }, []);

  return (
    <>
      <section className="h-full flex divide-x divide-darkSecondary">
        <div className="flex-1 flex flex-col divide-y divide-darkSecondary">
          <div className="flex justify-between items-center p-4 text-lg">
            <div>Workflow</div>
            <div className="flex-1 flex justify-center items-center text-xs">
              {warnings.isWarning && (
                <div className="flex items-center text-red-500 py-1 px-2 rounded-full bg-red-950">
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: "16px", fontWeight: 300 }}
                  >
                    warning
                  </span>
                  <span className="ml-1">{warnings.message}</span>
                </div>
              )}
            </div>
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
