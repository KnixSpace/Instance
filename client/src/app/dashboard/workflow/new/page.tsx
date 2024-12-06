"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { createNewWorkflow } from "@/redux/features/workflow/workflowSlice";
import axios from "axios";

interface FormData {
  name: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Workflow Name is required")
    .min(3, "Min 3 letter name is required"),
  description: yup
    .string()
    .trim()
    .required("Workflow Description is required")
    .min(10, "Minimum 10 letter description is required")
    .max(100, "Maximum 100 letter description is required"),
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

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      const body: {
        name: string;
        description: string;
      } = {
        ...data,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/create`,
        body,
        { withCredentials: true }
      );

      const workflowId = response.data._id;
      dispatch(
        createNewWorkflow({
          name: response.data.name,
          description: response.data.description,
        })
      );
      push(`/dashboard/workflow/${workflowId}`);
    } catch (error) {
      console.error(error);
    }
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
