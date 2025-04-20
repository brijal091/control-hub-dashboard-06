
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface StepperComponentProps {
  value: number;
  onChange: (value: number) => void;
  orientation: 'horizontal' | 'vertical';
  min?: number;
  max?: number;
  step?: number;
}

const StepperComponent: React.FC<StepperComponentProps> = ({ 
  value, 
  onChange, 
  orientation,
  min = 0,
  max = 100,
  step = 1
}) => {
  const increment = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  const decrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className="flex flex-col items-center p-2 w-full">
        <div className="text-white text-sm mb-2">STEP H: {value}</div>
        <div className="flex items-center justify-between w-full">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decrement}
            className="border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-500 h-12 w-12"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={increment}
            className="border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-500 h-12 w-12"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-2 h-full">
      <div className="text-white text-sm mb-2">STEP V: {value}</div>
      <div className="flex flex-col items-center justify-between h-full gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={increment}
          className="border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-500 h-12 w-12"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={decrement}
          className="border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-500 h-12 w-12"
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default StepperComponent;
