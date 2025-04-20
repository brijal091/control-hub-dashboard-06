
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonComponentProps {
  value: boolean;
  onChange: (value: boolean) => void;
  variant?: 'circle' | 'rectangle';
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ 
  value, 
  onChange,
  variant = 'circle'
}) => {
  const handleClick = () => {
    onChange(!value);
  };

  if (variant === 'rectangle') {
    return (
      <div className="flex flex-col items-center p-2 w-full h-full">
        <button
          onClick={handleClick}
          className={cn(
            "w-full h-full flex items-center justify-center rounded-md border-2",
            value 
              ? "bg-green-500/20 border-green-500 text-green-500" 
              : "bg-gray-800 border-green-500 text-green-500"
          )}
        >
          <span className="text-xl font-bold">{value ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-2 min-w-36">
      <button
        onClick={handleClick}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center border-2",
          value 
            ? "bg-green-500/20 border-green-500 text-green-500" 
            : "bg-gray-800 border-green-500 text-green-500"
        )}
      >
        <span className="text-xl font-bold">{value ? 'ON' : 'OFF'}</span>
      </button>
    </div>
  );
};

export default ButtonComponent;
