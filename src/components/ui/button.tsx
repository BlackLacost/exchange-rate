import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export const Button: FC<Props> = ({ children, className, ...props }) => {
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
