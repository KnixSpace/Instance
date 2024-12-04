"use client";
import EditWorkflow from "@/components/dashboard/workspace/workflow/EditWorkflow";
import SidePanel from "@/components/dashboard/workspace/sidepanel/SidePanel";
import Warning from "@/components/dashboard/workspace/workflow/Warning";
import Workflow from "@/components/dashboard/workspace/workflow/Workflow";
import {
  loadExistingWorkflow,
  rebuildAdjacencyLists,
  setWorkflowWarning,
} from "@/redux/features/workflow/workflowSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {};
const page = (props: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  const [small, setSmall] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [active, setAcive] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const flow = useAppSelector((state) => state.workflow);
  const { workflowId } = useParams();

  if (flow.warning.isWarning) {
    setTimeout(() => {
      dispatch(setWorkflowWarning({ isWarning: false, message: null }));
    }, 3000);
  }

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSmall(true);
    } else {
      setSmall(false);
    }
  });

  const getWorkfow = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/getWorkflow`,
        { workflowId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(loadExistingWorkflow(response.data));
        dispatch(rebuildAdjacencyLists());
      }
    } catch (error) {
      console.log("Workflow initialization failed", error);
    }
  };

  useEffect(() => {
    getWorkfow();
  }, []);

  const handleWorkflowSave = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/updateWorkflow`,
        {
          workflowId,
          nodes: flow.nodes.map((node) => {
            return {
              ...node,
              selected: false,
            };
          }),
          edges: flow.edges,
          adjacencyList: flow.forwardList,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Workflow saved successfully");
        // dispatch(initializedExistingWorkflow(response.data));
      }
    } catch (error) {
      console.log("Workflow initialization failed", error);
    }
  };

  return (
    <>
      {flow.warning.isWarning && <Warning message={flow.warning.message} />}
      {edit && <EditWorkflow setEdit={setEdit} />}
      <section className="h-full flex divide-x divide-darkSecondary">
        <div className="flex-1 flex flex-col divide-y divide-darkSecondary">
          <div className="flex justify-between items-center p-4 text-lg select-none">
            <div className="flex gap-4 items-center">
              <span className="truncate max-w-36">{flow.name}</span>
              <div className="p-1 flex justify-center items-center hover:bg-lightbackground rounded-md cursor-pointer">
                <span
                  className="material-symbols-rounded"
                  style={{ fontWeight: 300, fontSize: "20px" }}
                  onClick={() => {
                    setEdit(!edit);
                  }}
                >
                  edit
                </span>
              </div>
              <div
                className="text-xs py-1 px-4 rounded border border-darkSecondary hover:border-cta transition-all duration-300 ease-in-out cursor-pointer"
                onClick={handleWorkflowSave}
              >
                Save
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">{active ? "Active" : "Deactive"}</span>
              <div
                className={`rounded-full p-1 w-11 flex items-center bg-lightbackground transition-all duration-1000 ease-in-out cursor-pointer`}
                onClick={() => {
                  setAcive(!active);
                }}
              >
                <div
                  className={`size-4 rounded-full transition-all duration-500 ease-in-out  ${
                    active ? "translate-x-5 bg-cta" : "bg-background"
                  }`}
                />
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
