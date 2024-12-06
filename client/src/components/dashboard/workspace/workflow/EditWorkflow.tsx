"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateWorkflowMetadata } from "@/redux/features/workflow/workflowSlice";

type Props = {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

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

const EditWorkflow = (props: Props) => {
  const { workflowId } = useParams();
  const { name, description } = useAppSelector((state) => state.workflow);
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    setValue("name", name as string);
    setValue("description", description as string);
  }, [name, description]);

  const onSubmit = async (data: any) => {
    console.log(data);
    // Handle your form submission logic here
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/updateMetaData`,
      {
        name: data.name,
        description: data.description,
        workflowId,
      }
    );

    if (response.status === 200) {
      console.log(response.data);
      dispatch(
        updateWorkflowMetadata({
          name: response.data.name,
          description: response.data.description,
        })
      );
      props.setEdit(false);
      reset();
    }
  };

  return (
    <div className="top-0 left-0 w-full h-dvh fixed z-10 bg-background/5 backdrop-filter backdrop-blur-[1px] flex justify-center items-center">
      <div className="w-96 bg-lightbackground rounded-md p-4">
        <h1 className="text-xl font-medium text-center mb-8">Edit Workflow</h1>
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
                    className={`w-full bg-background focus:outline-none rounded-md px-4 py-2 text-sm`}
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
                    className={`w-full bg-background focus:outline-none rounded-md px-4 py-2 text-sm h-24 overflow-auto resize-none`}
                    placeholder="Enter Workflow Description"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex gap-4 justify-end text-xs">
              <button
                type="button"
                className="hover:bg-darkSecondary  px-6 py-2 rounded-md transition-all duration-500 ease-in-out"
                onClick={() => props.setEdit(false)}
              >
                Cancel
              </button>
              <button type="submit" className="bg-cta px-6 py-2 rounded-md">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkflow;
