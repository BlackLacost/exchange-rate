import clsx from "clsx";
import {
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import { type FieldError } from "react-hook-form";

export interface SelectOption {
  name: string;
  value: string;
}

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (value: string | undefined) => void;
  resetField: () => void;
  error?: FieldError;
}

export const Select = ({
  value,
  options,
  error,
  onChange,
  resetField,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const valueName = useMemo(() => {
    return options.find((option) => option.value === value)?.name;
  }, [value, options]);

  const clearOption = (e: MouseEvent) => {
    e.stopPropagation();
    resetField();
  };

  const selectOption = (option: string) => {
    if (option !== value) onChange(option);
  };

  const isOptionSelected = (option: SelectOption) => option.value === value;

  return (
    <div>
      <div
        tabIndex={0}
        onClick={() => setIsOpen((v) => !v)}
        onBlur={() => setIsOpen(false)}
        className="relative flex items-center rounded-md border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        <span className="flex-grow">{valueName}</span>
        <TimesButton onClick={clearOption} />
        <Divider className="mx-2" />
        <Arrow isOpen={isOpen} />
        <ul
          className={clsx(
            "absolute top-[calc(100%+.5rem)] z-10 ml-[-12px] h-96 w-full overflow-y-auto rounded-md border border-primary-600 bg-white",
            { hidden: !isOpen }
          )}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => selectOption(option.value)}
              className={clsx(
                "cursor-pointer px-3 py-2 hover:bg-primary-600 hover:text-white",
                { "bg-primary-500 text-white": isOptionSelected(option) }
              )}
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>
      {error && (
        <p className="text-xs font-semibold text-error-500">{error.message}</p>
      )}
    </div>
  );
};

const TimesButton = ({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className="relative flex h-3 w-3 items-center justify-center rounded-sm before:absolute before:h-full before:w-[0.15rem] before:-rotate-45 before:bg-secondary-700 after:absolute after:h-full after:w-[0.15rem] after:rotate-45 after:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-4"
    />
  );
};

const Divider = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={clsx(
        "h-5 w-[0.11rem] bg-secondary-700 bg-opacity-80",
        className
      )}
      {...props}
    />
  );
};

interface ArrowProps {
  isOpen: boolean;
}

const Arrow = ({ isOpen = false }: ArrowProps) => {
  return (
    <>
      <div
        className={clsx(
          "relative h-2 w-[7px] before:absolute before:left-0 before:h-full before:w-[0.15rem] before:bg-secondary-700 before:transition-all after:absolute after:right-0 after:h-full after:w-[0.15rem] after:bg-secondary-700 after:transition-all",
          {
            "before:-rotate-45 after:rotate-45": !isOpen,
            "before:rotate-45 after:-rotate-45": isOpen,
          }
        )}
      />
    </>
  );
};
