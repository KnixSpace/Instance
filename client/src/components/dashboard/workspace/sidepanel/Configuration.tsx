import * as Yup from "yup";
import { Node } from "@xyflow/react";
import { actionConfig } from "../constant";
import { ActionConfig, ConfigField } from "@/types/configurationTypes";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const Configuration = ({ selectedNode }: { selectedNode: Node }) => {
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: {
      option: { label: string; value: string }[] | undefined;
      icon: string;
    };
  }>({});

  const nodeConfig: ActionConfig | undefined = actionConfig.find(
    (config: ActionConfig) => config.action === selectedNode.data.action
  );

  if (!nodeConfig) {
    return null;
  }

  const schema = Yup.object().shape(
    nodeConfig.configFields.reduce((acc, field) => {
      acc[field.name] = field.validation;
      return acc;
    }, {} as Record<string, Yup.AnySchema>)
  );

  // const initialValues = nodeConfig.configFields.reduce((acc, field) => {
  //   acc[field.name] = field.defaultValue;
  //   return acc;
  // }, {} as Record<string, any>);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    nodeConfig.configFields.forEach(async (field) => {
      if (field.isDynamic) {
        try {
          const response = await axios.post(
            field.dynamicOptions?.url || "",
            {}
          );
          setDynamicOptions((prev) => ({
            ...prev,
            [field.name]: {
              option: response.data,
              icon: nodeConfig.icon,
            },
          }));
        } catch (error) {
          console.error(
            `Error fetching dynamic options for ${field.name}`,
            error
          );
        }
      } else if (!field.isDynamic && field.options) {
        setDynamicOptions((prev) => ({
          ...prev,
          [field.name]: {
            option: field.options,
            icon: nodeConfig.icon,
          },
        }));
      } else if (!field.isDynamic && !field.options) {
        setDynamicOptions((prev) => ({
          ...prev,
          [field.name]: {
            option: [
              { label: "sadalable", value: "asdfaushf" },
              { label: "kjdfhkae", value: "sdfkaj" },
            ],
            icon: nodeConfig.icon,
          },
        }));
      }
    });
  }, [selectedNode]);

  const renderFiled = (field: ConfigField) => {
    switch (field.type) {
      case "select":
        return (
          <>
            <label htmlFor={field.name} className="text-sm">
              {field.label}
            </label>
            <Controller
              control={control}
              name={field.name}
              render={({ field: selectField }) => {
                return (
                  <select
                    {...selectField}
                    id={field.name}
                    className="bg-lightbackground rounded w-full px-3 py-2 focus:outline-none text-sm focus:border focus:border-secondary"
                  >
                    {dynamicOptions[field.name]?.option?.map((opt) => (
                      <option
                        className="text-xs"
                        key={opt.value}
                        value={opt.label}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                );
              }}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs">
                {errors[field.name]?.message as string}
              </p>
            )}
          </>
        );
      case "text":
        return (
          <>
            <label htmlFor={field.name} className="text-sm">
              {field.label}
            </label>
            <Controller
              control={control}
              name={field.name}
              render={({ field: selectField }) => {
                return (
                  <input
                    type="text"
                    id={field.name}
                    {...selectField}
                    placeholder={field.placeholder}
                    className="bg-lightbackground rounded w-full px-3 py-2 focus:outline-none text-sm focus:border focus:border-secondary"
                  />
                );
              }}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs">
                {errors[field.name]?.message as string}
              </p>
            )}
          </>
        );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        {nodeConfig.configFields.map((field) => (
          <div key={field.name} className="mb-4">
            {renderFiled(field)}
          </div>
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
