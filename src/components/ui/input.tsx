import clsx from "clsx";
import {
  forwardRef,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from "react";
import { type FieldError } from "react-hook-form";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  id: string;
  error?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, error, label, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-y-1">
      <label className="font-bold" htmlFor={props.id}>
        {label}
      </label>
      <input
        className={clsx("rounded-md border bg-white px-4 py-2", className)}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-xs font-semibold text-error-500">{error.message}</p>
      )}
    </div>
  );
});