
import React from 'react';
import { cn } from '../../utils/shared';
import { Icon } from '../icons';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  containerClassName?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  label,
  containerClassName,
  min = 0,
  max = 100,
  step = 1,
  ...props
}) => {
  const handleIncrement = () => {
    const newValue = Math.min(Number(max), value + Number(step));
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(Number(min), value - Number(step));
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === '' ? Number(min) : Number(e.target.value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(Number(min), Math.min(Number(max), numValue));
      onChange(clampedValue);
    }
  };

  const inputId = React.useId();

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleDecrement}
          className="absolute left-0 p-2 text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff0e00] rounded-l-lg h-full"
          aria-label="Decrement"
        >
          <Icon name="minus" className="w-4 h-4" />
        </button>
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 text-center font-mono py-2 px-10 focus-visible:ring-[#ff0e00] focus-visible:border-[#ff0e00] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...props}
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="absolute right-0 p-2 text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff0e00] rounded-r-lg h-full"
          aria-label="Increment"
        >
          <Icon name="plus" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};