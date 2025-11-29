import * as React from "react";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ min, max, step = 1, value, onChange, className = "", ...props }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className={
        "w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer " + className
      }
      {...props}
    />
  );
};
