import clsx from "clsx";
import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export const Button: FC<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ children, className, ...props }) => {
  return (
    <button
      className={clsx(
        "rounded-md bg-primary-500 px-4 py-2 font-bold text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
