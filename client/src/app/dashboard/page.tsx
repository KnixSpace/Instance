"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {};

const Dashboard = (props: Props) => {
  const [workflows, setWorkflows] = useState<
    {
      workflowId: string;
      name: string;
      description: string;
      status: string;
    }[]
  >([]);
  const getAllWorkflows = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/getAllWorkflows`,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status === 200) {
        setWorkflows(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllWorkflows();
  }, []);

  return (
    <>
      <section className="flex flex-col h-dvh w-full divide-y divide-darkSecondary">
        <div className="flex items-center p-4 text-lg px-4">Workflows</div>
        <div className="py-4 px-4 flex-1 overflow-y-auto overflow-x-hidden">
          <div>
            <div className="w-full grid grid-cols-3 gap-4">
              {workflows.map((workflow) => (
                <Link
                  key={workflow.workflowId}
                  href={`/dashboard/workflow/${workflow.workflowId}`}
                  className="border border-lightbackground hover:border-secondary rounded-md p-4"
                >
                  <div className="flex gap-4 items-center mb-2">
                    <h1 className="text-base flex-1">{workflow.name}</h1>
                    <span
                      className={`text-xs p-1 px-2 rounded-md ${
                        workflow.status === "active"
                          ? "bg-green-500"
                          : workflow.status === "inactive"
                          ? "bg-secondary"
                          : "bg-lightbackground"
                      }`}
                    >
                      {workflow.status === "active"
                        ? "Active"
                        : workflow.status === "inactive"
                        ? "Inactive"
                        : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-secondary">
                    {workflow.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Dashboard;
