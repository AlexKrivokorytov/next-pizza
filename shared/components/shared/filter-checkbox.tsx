import React from 'react';
import { Checkbox } from '../ui/checkbox';

export interface FilterCheckboxProps {
  text: string;
  value: string;
  endAdornment?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  name?: string;
}

/**
 * Checkbox component for filtering with optional adornment and controlled state.
 *
 * @param text - Label text for the checkbox.
 * @param value - Value of the checkbox.
 * @param checked - Whether the checkbox is checked.
 * @param onCheckedChange - Handler for checked state change.
 * @param endAdornment - Optional node displayed at the end.
 * @param name - Name attribute for the checkbox.
 *
 * @returns A styled checkbox with label and optional adornment.
 */
export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  text,
  value,
  endAdornment,
  onCheckedChange,
  checked,
  name,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        onCheckedChange={onCheckedChange}
        checked={checked}
        value={value}
        className="rounded-[8px] w-6 h-6"
        id={`checkbox-${String(name)}-${String(value)}`}
      />
      <label
        htmlFor={`checkbox-${String(name)}-${String(value)}`}
        className="leading-none cursor-pointer flex-1"
      >
        {text}
      </label>
      {endAdornment}
    </div>
  );
};
