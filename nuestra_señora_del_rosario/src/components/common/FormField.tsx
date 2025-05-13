import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  options?: { value: string | number; label: string }[];
  disabled?: boolean;
  as?: 'input' | 'select' | 'textarea';
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error,
  required = false,
  className = "",
  options = [],
  disabled = false,
  as = "input",
  rows = 3,
}) => {
  const inputClasses = `w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
    error
      ? "border-red-500 bg-red-50"
      : "border-gray-300 bg-white"
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`;

  const renderField = () => {
    if (as === "select") {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <option value="">{placeholder || `Seleccione ${label.toLowerCase()}`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (as === "textarea") {
      return (
        <textarea
          name={name}
          value={value}
          onChange={onChange as any}
          className={inputClasses}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      );
    } else {
      return (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      );
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && (
        <p
          className="mt-1 text-sm text-red-600"
          id={`${name}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
