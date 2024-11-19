import { ConfigField } from "@/types/configurationTypes";
import { useMemo } from "react";

export const useDefalutValues = (configFields: ConfigField[]) => {
  return useMemo(() => {
    return configFields.reduce((acc, field) => {
      switch (field.type) {
        case "multi-select":
          acc[field.name] = [];
          break;
        case "select":
          acc[field.name] = null;
          break;
        case "text":
          acc[field.name] = "";
          break;
        case "number":
          acc[field.name] = 0;
          break;
        default:
          acc[field.name] = "";
          break;
      }
      return acc;
    }, {} as Record<string, any>);
  }, [configFields]);
};
