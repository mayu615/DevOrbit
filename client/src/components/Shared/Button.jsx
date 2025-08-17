import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled = false,
}) {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200";

  const variants = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500",
    secondary:
      "bg-slate-200 text-slate-800 hover:bg-slate-300 focus-visible:ring-slate-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
