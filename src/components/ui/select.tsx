"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: { value: string; label: string }[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, onChange, onValueChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <select
        className={cn(
          "flex h-12 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground",
          "ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:border-accent/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200 hover:border-border/80",
          // Custom dropdown arrow
          "appearance-none",
          "bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2364748b%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3e%3cpolyline%20points=%226%209%2012%2015%2018%209%22/%3e%3c/svg%3e')]",
          "bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10",
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
export type { SelectProps };
