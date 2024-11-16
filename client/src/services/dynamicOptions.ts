import { ConfigField, Options } from "@/types/configurationTypes";
import axios from "axios";

export const fetchDynamicFieldOptions = async (
  field: ConfigField,
  accountId: string,
  params?: { [key: string]: any }
): Promise<Options[]> => {
  if (!field.dynamicOptions?.url) {
    return [];
  }

  const response = await axios.post(
    field.dynamicOptions.url,
    {
      accountId,
      ...field.dynamicOptions.body,
      ...params,
    },
    { withCredentials: true }
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch options for ${field.name}`);
  }

  return response.data.options;
};
