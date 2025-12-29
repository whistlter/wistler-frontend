// src/components/button/Button.tsx
import clsx from "clsx";

type ButtonType = "primary" | "secondary" | "tetiary";

type ButtonProps = {
  type?: ButtonType;
  loading?: boolean;
  children: React.ReactNode;
  leftIcon?: string | React.ReactNode;
  rightIcon?: string | React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export function Button({
  type = "primary",
  loading = false,
  disabled,
  className,
  children,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={clsx(
        "w-full rounded-[10px] py-3 text-sm font-medium transition focus:outline-none",
        "flex items-center justify-center gap-2 ",
        type === "primary" &&
        "bg-rose-500 text-white hover:bg-rose-600 min-w-fit cursor-pointer disabled:bg-rose-300",
        type === "secondary" &&
        "border border-gray-300 bg-white cursor-pointer min-w-fit text-gray-800 hover:bg-gray-100 disabled:text-gray-400 ",
        type === "tetiary" &&
        "border border-gray-300 bg-white cursor-pointer text-[#FF3932] min-w-fit hover:bg-red-100 disabled:text-gray-400 ",
        (disabled || loading) && "cursor-not-allowed",
        className
      )}
      {...rest}
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="inline-flex shrink-0 min-w-fit">
              {typeof leftIcon === "string" ? (
                <img src={leftIcon} alt="" className="h-4 w-4" />
              ) : (
                leftIcon
              )}
            </span>
          )}
          <span className=" text-[13px] font-medium ">{children}</span>
          {rightIcon && (
            <span className="inline-flex shrink-0">
              {typeof rightIcon === "string" ? (
                <img src={rightIcon} alt="" className="h-4 w-4" />
              ) : (
                rightIcon
              )}
            </span>
          )}
        </>
      )}
    </button>
  );
}