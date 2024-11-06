"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { initializedNewWorkflow } from "@/lib/features/workflow/workflowSlice";

interface FormData {
  name: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Workflow Name is required"),
  description: yup.string().required("Workflow Description is required"),
});

type Props = {};

const Page: React.FC<Props> = (props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { push } = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission (e.g., send data to API)
    // Redirect to the workflow page
    dispatch(initializedNewWorkflow());
    push("/dashboard/workflow/kkkkgjgjh");
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-96">
        <h1 className="text-xl font-medium text-center mb-8">
          Craft Your Path to Productivity
          <br />
          Create a Workflow!
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="workflow-name"
                className="text-sm font-medium text-gray-300"
              >
                Workflow Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="workflow-name"
                    className={`w-full bg-darkSecondary focus:outline-none rounded-md px-4 py-2 text-sm`}
                    placeholder="Enter Workflow Name"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="workflow-description"
                className="text-sm font-medium text-gray-300"
              >
                Workflow Description
              </label>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="workflow-description"
                    cols={30}
                    rows={5}
                    className={`w-full bg-darkSecondary focus:outline-none rounded-md px-4 py-2 text-sm`}
                    placeholder="Enter Workflow Description"
                  ></textarea>
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full text-sm bg-cta font-medium py-2 rounded-md"
              >
                Create Workflow
              </button>
            </div>
            <div>
              <button
                type="reset"
                className="w-full text-sm border border-darkSecondary font-medium py-2 rounded-md"
                onClick={() => reset()}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
