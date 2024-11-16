import * as Yup from "yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNodeConfiguration } from "./useNodeConfiguration";
import ConfigurationField from "./ConfigurationField";
import { Node } from "@/types/workflowTypes";
import { setSidePanelMode } from "@/lib/features/workflow/workflowSlice";
import { useAppDispatch } from "@/lib/hooks";
import { ActionConfig } from "@/types/configurationTypes";
import { actionConfig } from "../../constant";

const Configuration = ({ selectedNode }: { selectedNode: Node }) => {
  const dispatch = useAppDispatch();

  const nodeConfig: ActionConfig | undefined = actionConfig.find(
    (config: ActionConfig) => config.action === selectedNode.data.action
  );

  if (!nodeConfig) return { nodeConfig: null, dynamicOptions: {} };

  const schema = Yup.object().shape(
    nodeConfig.configFields.reduce((acc, field) => {
      acc[field.name] = field.validation;
      return acc;
    }, {} as Record<string, Yup.AnySchema>)
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const { dynamicOptions } = useNodeConfiguration(
    selectedNode,
    nodeConfig,
    watch
  );

  const account = selectedNode.data.authAccountInfo;
  if (!nodeConfig) {
    return null;
  }

  useEffect(() => {
    //WIP: reset form with initial values or previously saved values in redux node.data.config
    reset();
  }, [selectedNode, reset, nodeConfig]);

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-auto">
      <div className="mb-2">
        <div
          className="text-sm mb-2 text-gray-400 cursor-pointer"
          onClick={() => {
            dispatch(setSidePanelMode("account"));
          }}
        >
          Change Account
        </div>
        <div className="flex gap-4">
          <div className="size-8 rounded bg-lightbackground overflow-hidden">
            <img
              src={account.avatar}
              alt={account.name}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-sm">{account.name}</h2>
            <p className="text-xs text-gray-400 text-wrap">{account.email}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <form
          className="flex flex-col h-full gap-4"
          onSubmit={handleSubmit((data) => {
            console.log(data);
          })}
        >
          {nodeConfig.configFields.map((field) => (
            <ConfigurationField
              key={field.name}
              field={field}
              control={control}
              errors={errors}
              dynamicOptions={dynamicOptions[field.name]}
            />
          ))}
          <button
            type="submit"
            className="bg-cta text-sm w-full text-white px-4 py-2 rounded focus:outline-none"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
export default Configuration;
