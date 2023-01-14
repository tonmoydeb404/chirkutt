import { ComponentProps, HTMLInputTypeAttribute, ReactNode } from "react";
import { BiErrorAlt } from "react-icons/bi";

type InputGroupProps = {
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
}: InputGroupProps) => {
  return (
    <div className={`input-group ${containerClass}`} data-invalid={!!errorText}>
      <div className="input-group_header">
        <label htmlFor={id}>{label}</label>
        {children}
      </div>
      <input id={id} type={type} className={inputClass} {...props} />
      {errorText && errorText.length ? (
        <div className="input-group_error">
          <BiErrorAlt />
          <p>{errorText}</p>
        </div>
      ) : null}
    </div>
  );
};

export default InputGroup;
