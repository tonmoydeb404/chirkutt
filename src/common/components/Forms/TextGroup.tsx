import { ComponentProps, ReactNode } from "react";
import { BiErrorAlt } from "react-icons/bi";

type TextGroupProps = {
  label?: string;
  id: string;
  errorText?: string;
  containerClass?: string;
  inputClass?: string;
  children?: ReactNode;
} & Omit<ComponentProps<"textarea">, "className" | "id" | "type">;

const TextGroup = ({
  label,
  id,
  errorText,
  containerClass = "",
  inputClass = "",
  children,
  ...props
}: TextGroupProps) => {
  return (
    <div className={`input-group ${containerClass}`} data-invalid={!!errorText}>
      {label || children ? (
        <div className="input-group_header">
          {label ? <label htmlFor={id}>{label}</label> : null}
          {children}
        </div>
      ) : null}
      <textarea id={id} className={inputClass} {...props}></textarea>
      {errorText && errorText.length ? (
        <div className="input-group_error">
          <BiErrorAlt />
          <p>{errorText}</p>
        </div>
      ) : null}
    </div>
  );
};

export default TextGroup;
