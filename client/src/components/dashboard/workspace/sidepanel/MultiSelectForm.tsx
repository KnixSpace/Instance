import CreatableSelect from "react-select/creatable";

interface MultiSelectFormProps {
    dynamicOptions: { label: string; value: string }[] | undefined;
    selectField: any; 
}
const MultiSelectForm: React.FC<MultiSelectFormProps> = ({ dynamicOptions, selectField }) => {
  return (
    <CreatableSelect
      {...selectField}
      isMulti
      options={dynamicOptions}
      styles={{
        control: (provided) => ({
          ...provided,
          border: "none",
          background: "#242424",
          borderRadius: "2px",
          boxShadow: "none",
          fontSize: "12px",
          paddingLeft: "6px",
          '&:hover': { borderColor: '#0056b3' },
        }),
        option: (provided, state) => ({
          ...provided,
          background: state.isSelected ? "#7441FD99" : "#242424",
          color: state.isSelected ? "white" : "#A0A0A5",
          '&:hover': { background: '#7441FD99',
            color:"whitesmoke",
           },
        }),
        menu: (provided) => ({
          ...provided,
          background: "#242424",
          borderRadius: "6px",
          padding: "6px",
          fontSize: "12px",
        }),
        multiValue: (provided) => ({
          ...provided,
          background: "#101010",
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          color: "whitesmoke",
        }),
        multiValueRemove: (provided, state) => ({
          ...provided,
          color:"#7441FD",
          marginLeft: "8px",
          background: "#101010",
          '&:hover': { background: '#7441FD4d' ,
            color: "white",
          },
        })
      }}
    />
  );
};

export default MultiSelectForm;