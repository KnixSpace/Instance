import { ConfigurationFieldProps } from "@/types/configurationTypes";
import { Controller } from "react-hook-form";
import { MultiSelect, SelectCreatable, SingleSelect } from "./SelectForm";

const ConfigurationField = ({
  field,
  control,
  errors,
  dynamicOptions,
}: ConfigurationFieldProps) => {
  const renderFiled = () => {
    switch (field.type) {
      case "select":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: selectField }) =>
              field.allowedCustomInput ? (
                <SelectCreatable
                  dynamicOptions={dynamicOptions}
                  selectField={selectField}
                  placeholder={field.placeholder}
                />
              ) : (
                <SingleSelect
                  dynamicOptions={dynamicOptions}
                  selectField={selectField}
                  placeholder={field.placeholder}
                />
              )
            }
          />
        );
      case "multiselect":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: selectField }) => (
              <MultiSelect
                dynamicOptions={dynamicOptions}
                selectField={selectField}
                placeholder={field.placeholder}
              />
            )}
          />
        );
      case "text":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: selectField }) => (
              <input
                type="text"
                id={field.name}
                {...selectField}
                placeholder={field.placeholder}
                className="bg-lightbackground rounded w-full px-3 py-2 focus:outline-none text-sm focus:border focus:border-secondary"
              />
            )}
          />
        );
    }
  };
  return (
    <div>
      <label htmlFor={field.name} className="text-sm">
        {field.label}
      </label>
      {renderFiled()}
      {errors[field.name] && (
        <p className="text-red-500 text-xs">
          {errors[field.name]?.message as string}
        </p>
      )}
    </div>
  );
};
export default ConfigurationField;
