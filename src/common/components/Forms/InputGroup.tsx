import { ComponentProps, HTMLInputTypeAttribute, ReactNode } from "react";
import { BiErrorAlt } from "react-icons/bi";

type inputGroupPropsType = {
  label: string;
  id: string;
  type?: HTMLInputTypeAttribute;
  errorText?: string;
  containerClass?: string;
  inputClass?: string;
  children?: ReactNode;
} & Omit<ComponentProps<"input">, "className" | "id" | "type">;

const InputGroup = ({
  label,
  id,
  type = "text",
  errorText,
  containerClass = "",
  inputClass = "",
  children,
  ...props
}: inputGroupPropsType) => {
  return (
    <div className={`input-group ${containerClass}`}>
      <div className="input-group_header">
        <label htmlFor={id}>{label}</label>
        {children}
      </div>
      <input id={id} type={type} className={inputClass} {...props} />
      <div className="input-group_error">
        <BiErrorAlt />
        {errorText ? <p>{errorText}</p> : null}
      </div>
    </div>
  );
};

export default InputGroup;
