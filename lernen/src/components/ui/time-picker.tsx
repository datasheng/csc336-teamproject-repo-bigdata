"use client"

import React from 'react';
import { Input } from './input';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className }) => {
  return (
    <Input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
};

export default TimePicker; 