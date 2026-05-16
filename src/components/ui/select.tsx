"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function Select({
  options,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  placeholder = "Select an option...",
  label,
  error,
  disabled = false,
  className,
  id,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const selectId = id || React.useId();

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;
  const selectedOption = options.find((opt) => opt.value === currentValue);

  const handleSelect = React.useCallback(
    (optionValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(optionValue);
      }
      onValueChange?.(optionValue);
      setIsOpen(false);
    },
    [isControlled, onValueChange]
  );

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className={cn("w-full space-y-1.5", className)} ref={selectRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error ? "true" : undefined}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/50 focus:border-[#0D47A1] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
            !selectedOption && "text-gray-400"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-50 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={currentValue === option.value}
                aria-disabled={option.disabled}
                className={cn(
                  "relative flex cursor-pointer select-none items-center px-3 py-2 text-sm transition-colors hover:bg-gray-100",
                  currentValue === option.value && "bg-[#0D47A1]/5 text-[#0D47A1]",
                  option.disabled && "pointer-events-none opacity-50"
                )}
                onClick={() => {
                  if (!option.disabled) {
                    handleSelect(option.value);
                  }
                }}
              >
                <span className="flex-1 truncate">{option.label}</span>
                {currentValue === option.value && (
                  <Check className="h-4 w-4 text-[#0D47A1]" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export { Select };
