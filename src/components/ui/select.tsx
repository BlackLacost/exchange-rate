import clsx from "clsx";
import {
  forwardRef,
  type DetailedHTMLProps,
  type SelectHTMLAttributes,
} from "react";
import { type FieldError } from "react-hook-form";

interface Props
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label: string;
  id: string;
  error?: FieldError;
  options: {
    value: string;
    name: string;
  }[];
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className, error, label, options, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-y-1">
      <label className="font-bold" htmlFor={props.id}>
        {label}
      </label>
      <select
        ref={ref}
        className={clsx(
          "rounded-md border bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
          className
        )}
        {...props}
      >
        {options.map(({ value, name }) => (
          <option
            key={value}
            value={value}
          >{`${value.toUpperCase()} ${name}`}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs font-semibold text-error-500">{error.message}</p>
      )}
    </div>
  );
});
