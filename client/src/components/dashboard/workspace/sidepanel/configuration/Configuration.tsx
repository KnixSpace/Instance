import * as Yup from "yup";
import { Node } from "@xyflow/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNodeConfiguration } from "./useNodeConfiguration";
import ConfigurationField from "./ConfigurationField";

const Configuration = ({ selectedNode }: { selectedNode: Node }) => {
  const { nodeConfig, dynamicOptions } = useNodeConfiguration(selectedNode);

  if (!nodeConfig) {
    return null;
  }

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
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    //WIP: reset form with initial values or previously saved values in redux node.data.config
    reset();
  }, [selectedNode, reset, nodeConfig]);

  return (
    <div>
      <form
        className="flex flex-col gap-4"
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
  );
};
export default Configuration;
