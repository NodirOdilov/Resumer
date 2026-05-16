"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue = min,
      onChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : uncontrolledValue;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    const updateValue = React.useCallback(
      (clientX: number) => {
        if (!trackRef.current || disabled) return;

        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        const rawValue = min + ratio * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.min(Math.max(steppedValue, min), max);

        if (!isControlled) {
          setUncontrolledValue(clampedValue);
        }
        onChange?.(clampedValue);
      },
      [min, max, step, disabled, isControlled, onChange]
    );

    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
          updateValue(e.clientX);
        }
      };

      const handleMouseUp = () => {
        isDragging.current = false;
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [updateValue]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <div
          ref={trackRef}
          className="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-gray-200"
          onMouseDown={(e) => {
            if (disabled) return;
            isDragging.current = true;
            updateValue(e.clientX);
          }}
          onTouchStart={(e) => {
            if (disabled) return;
            updateValue(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            if (disabled) return;
            updateValue(e.touches[0].clientX);
          }}
        >
          <div
            className="absolute h-full bg-[#0D47A1]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="absolute h-5 w-5 rounded-full border-2 border-[#0D47A1] bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D47A1]/50 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${percentage}% - 10px)` }}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          tabIndex={disabled ? -1 : 0}
          onMouseDown={() => {
            if (!disabled) isDragging.current = true;
          }}
          onKeyDown={(e) => {
            if (disabled) return;
            let newValue = currentValue;
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              newValue = Math.min(currentValue + step, max);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              newValue = Math.max(currentValue - step, min);
            } else if (e.key === "Home") {
              newValue = min;
            } else if (e.key === "End") {
              newValue = max;
            } else {
              return;
            }
            e.preventDefault();
            if (!isControlled) setUncontrolledValue(newValue);
            onChange?.(newValue);
          }}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
