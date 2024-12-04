"use client";
import { AnimatedShinyText } from "@/components/ui/AnimatedShinyText";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { appIcons } from "@/lib/constants";
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
      if (response.status === 200) {
        console.log(response.data);
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
        <div className="flex items-center p-4 text-lg px-4">Dashboard</div>
        <div className="py-4 px-4 flex-1 overflow-y-auto overflow-x-hidden">
          {workflows.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center overflow-auto">
              <div className="mb-8 flex items-center flex-col">
                <div className="mb-1">
                  <TextGenerateEffect
                    words="Welcome to Instance"
                    className="font-semibold text-6xl text-gray-200"
                  />
                </div>
                <AnimatedShinyText className="w-full" shimmerWidth={200}>
                  <span className="text-lg font-semibold">
                    Effortlessly Build and Automate Your Workflows!
                  </span>
                </AnimatedShinyText>
              </div>
              <Link
                href={"/dashboard/workflow/new"}
                className="relative flex justify-center items-center overflow-hidden rounded-full p-px mb-12"
              >
                <div className="z-10 flex items-center justify-center px-8 py-2 bg-background rounded-full h-full w-full">
                  Let's Automate
                </div>
                <span className="absolute inset-[-1000%] animate-[spin_1s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7441FE_0%,#E3D9FE_50%,#7441FE_100%)]" />
              </Link>
              <div className="flex flex-col items-center">
                <p className="mb-6 text-gray-300">
                  Wide range of applictions to automate your works
                </p>
                <div className="flex justify-center">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="size-8 object-contain">
                      <img src={appIcons.google} alt="" />
                    </div>
                    <div className="size-8 object-contain">
                      <img src={appIcons.github} alt="" />
                    </div>
                    <div className="size-8 object-contain">
                      <img src={appIcons.linkedin} alt="" />
                    </div>
                    <div className="size-8 object-contain">
                      <img src={appIcons.notion} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </>
  );
};
export default Dashboard;
