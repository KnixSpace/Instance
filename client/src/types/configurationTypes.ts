import { UseFormReturn } from "react-hook-form";
import * as Yup from "yup";

export interface ConfigField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  isDynamic: boolean;
  options?: { value: string; label: string }[];
  dynamicOptions?: {
    url: string;
    body?: Record<string, string>;
  };
  dependentOn?: string[];
  allowedCustomInput: boolean;
  validation: Yup.AnySchema;
}

export interface ActionConfig {
  action: string;
  service: string;
  icon: string;
  configFields: ConfigField[];
  outputFields: string[];
}

export interface ConfigurationFieldProps {
  field: ConfigField;
  control: UseFormReturn<any>["control"];
  errors: UseFormReturn<any>["formState"]["errors"];
  dynamicOptions: { label: string; value: string }[] | undefined;
}

export interface Options {
  label: string;
  value: string;
}

export interface DynamicOptionsState {
  [key: string]: Options[] | undefined;
}
