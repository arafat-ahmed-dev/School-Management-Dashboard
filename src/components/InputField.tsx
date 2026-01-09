import React, { useState } from "react";
import { FieldError } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  readOnly?: boolean;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  className,
  readOnly,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex w-full flex-col gap-2 md:w-1/4 ${className}`}>
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          {...register(name)}
          className="w-full rounded-md p-2 pr-10 text-sm ring-[1.5px] ring-gray-300"
          {...inputProps}
          defaultValue={defaultValue}
          readOnly={readOnly || false}
          autoComplete="on"
        />
        {isPasswordField && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
