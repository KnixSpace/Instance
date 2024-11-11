import CreatableSelect from "react-select/creatable";
import Select from "react-select";

interface FormProps {
  dynamicOptions: { label: string; value: string }[] | undefined;
  selectField: any;
  placeholder: string;
}

const MultiSelect: React.FC<FormProps> = ({
  dynamicOptions,
  selectField,
  placeholder,
}) => {
  return (
    <Select
      {...selectField}
      isMulti
      options={dynamicOptions}
      placeholder={placeholder}
      styles={{
        control: (provided) => ({
          ...provided,
          border: "none",
          background: "#20242b",
          borderRadius: "4px",
          boxShadow: "none",
          fontSize: "14px",
        }),
        input: (provided) => ({
          ...provided,
          color: "whitesmoke",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: "#7441FD",
          cursor: "pointer",
          "&:hover": {
            color: "white",
          },
        }),
        option: (provided, state) => ({
          ...provided,
          background: state.isSelected ? "#7441fe" : "#20242b",
          color: state.isSelected ? "white" : "#A0A0A5",
          borderRadius: "4px",
          "&:hover": {
            color: "#7441fe",
            background: "#0f1318",
          },
          "&:active": {
            background: "#7441fe",
            color: "white",
          },
        }),
        menu: (provided) => ({
          ...provided,
          background: "#20242b",
          borderRadius: "4px",
          padding: "4px",
          fontSize: "12px",
        }),
        multiValue: (provided) => ({
          ...provided,
          background: "#0f1318",
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          color: "whitesmoke",
        }),
        multiValueRemove: (provided, state) => ({
          ...provided,
          color: "#7441FD",
          marginLeft: "8px",
          background: "#0f1318",
          "&:hover": { background: "#7441Fe4d", color: "white" },
        }),
      }}
    />
  );
};

const SelectCreatable: React.FC<FormProps> = ({
  dynamicOptions,
  selectField,
  placeholder,
}) => {
  return (
    <CreatableSelect
      {...selectField}
      options={dynamicOptions}
      placeholder={placeholder}
      isClearable
      styles={{
        control: (provided) => ({
          ...provided,
          border: "none",
          background: "#20242b",
          borderRadius: "4px",
          boxShadow: "none",
          fontSize: "14px",
        }),
        option: (provided, state) => ({
          ...provided,
          background: state.isSelected ? "#7441fe" : "#20242b",
          color: state.isSelected ? "white" : "#A0A0A5",
          borderRadius: "4px",
          "&:hover": {
            color: "#7441fe",
            background: "#0f1318",
          },
          "&:active": {
            background: "#7441fe",
            color: "white",
          },
        }),
        input: (provided) => ({
          ...provided,
          color: "whitesmoke",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: "#7441FD",
          cursor: "pointer",
          "&:hover": {
            color: "white",
          },
        }),
        menu: (provided) => ({
          ...provided,
          background: "#20242b",
          borderRadius: "4px",
          padding: "4px",
          fontSize: "12px",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "whitesmoke",
          fontSize: "12px",
        }),
        clearIndicator: (provided) => ({
          ...provided,
          color: "#7441FD",
          cursor: "pointer",
          "&:hover": {
            color: "white",
            background: "#7441FD4d",
          },
        }),
      }}
    />
  );
};

const SingleSelect: React.FC<FormProps> = ({
  dynamicOptions,
  selectField,
  placeholder,
}) => {
  return (
    <Select
      {...selectField}
      options={dynamicOptions}
      placeholder={placeholder}
      isClearable
      styles={{
        control: (provided) => ({
          ...provided,
          border: "none",
          background: "#20242b",
          borderRadius: "4px",
          boxShadow: "none",
          fontSize: "14px",
        }),
        option: (provided, state) => ({
          ...provided,
          background: state.isSelected ? "#7441fe" : "#20242b",
          color: state.isSelected ? "white" : "#A0A0A5",
          borderRadius: "4px",
          "&:hover": {
            color: "#7441fe",
            background: "#0f1318",
          },
          "&:active": {
            background: "#7441fe",
            color: "white",
          },
        }),
        input: (provided) => ({
          ...provided,
          color: "whitesmoke",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: "#7441FD",
          cursor: "pointer",
          "&:hover": {
            color: "white",
          },
        }),
        menu: (provided) => ({
          ...provided,
          background: "#20242b",
          borderRadius: "4px",
          padding: "4px",
          fontSize: "12px",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "whitesmoke",
          fontSize: "12px",
        }),
        clearIndicator: (provided) => ({
          ...provided,
          color: "#7441FD",
          cursor: "pointer",
          "&:hover": {
            color: "white",
            background: "#7441FD4d",
          },
        }),
      }}
    />
  );
};

export { MultiSelect, SelectCreatable, SingleSelect };
