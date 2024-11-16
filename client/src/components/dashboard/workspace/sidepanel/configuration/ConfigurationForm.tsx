import {
  ActionConfig,
  ConfigField,
  DynamicOptionsState,
} from "@/types/configurationTypes";
import { UseFormReturn } from "react-hook-form";
import ConfigurationField from "./ConfigurationField";
import { memo } from "react";

type Props = {
  nodeConfig: ActionConfig;
  control: UseFormReturn<any>["control"];
  errors: UseFormReturn<any>["formState"]["errors"];
  dynamicOptions: DynamicOptionsState;
  onSubmit: () => void;
};
const ConfigurationForm = ({
  nodeConfig,
  control,
  errors,
  dynamicOptions,
  onSubmit,
}: Props) => {
  return (
    <form className="flex flex-col h-full gap-4" onSubmit={onSubmit}>
      {nodeConfig.configFields.map((field: ConfigField) => (
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
  );
};
export default memo(ConfigurationForm);
