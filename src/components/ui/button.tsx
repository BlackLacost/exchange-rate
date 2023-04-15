import clsx from "clsx";
import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export const Button: FC<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ children, className, ...props }) => {
  return (
    <button
      className={clsx(
        "rounded-md bg-primary-500 px-4 py-2 font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
