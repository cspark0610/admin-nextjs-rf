import React, { useEffect, useState } from "react";
import InputContainer from "components/UI/Molecules/InputContainer";
import { RadioButton } from "primereact/radiobutton";

interface RadioProps {
  label: string
  name: string
  options?: Array<string>
  handleChage: any
}

export const RadioOption: React.FC<RadioProps> = ({ label, name, options, handleChage }) => {
  const [values, setValues] = useState(["Yes", "No"]);
  useEffect(() => {
    if (options?.length === 2) {
      setValues(options);
    }
  }, []);
  
  const [selectedValue, setSelectedValue] = useState('');
  useEffect(() => {
    handleChage(selectedValue);
  }, [selectedValue]);

  return (
    <InputContainer label={label}>
      <div className="p-field-radiobutton" style={{ marginBottom: "8px" }}>
        <RadioButton
          inputId={values[0]}
          name={name}
          value={values[0]}
          onChange={(e) => {
            setSelectedValue(e.value);
          }}
          checked={selectedValue === values[0]}
        />
        <label
          style={{ marginLeft: "8px", textTransform: "capitalize" }}
          htmlFor={values[0]}
        >
          {values[0]}
        </label>
      </div>
      <div className="p-field-radiobutton">
        <RadioButton
          inputId={values[1]}
          name={name}
          value={values[1]}
          onChange={(e) => {
            setSelectedValue(e.value);
          }}
          checked={selectedValue === values[1]}
        />
        <label
          style={{ marginLeft: "8px", textTransform: "capitalize" }}
          htmlFor={values[1]}
        >
          {values[1]}
        </label>
      </div>
    </InputContainer>
  );
}
