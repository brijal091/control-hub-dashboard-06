
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SliderComponentProps {
  value: number;
  onChange: (value: number) => void;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col p-2 w-full min-w-36">
      <Label className="text-white mb-2">Temperature: {value}°C</Label>
      <Slider
        value={[value]}
        min={0}
        max={100}
        step={1}
        onValueChange={(values) => onChange(values[0])}
        className="my-2"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>0°C</span>
        <span>50°C</span>
        <span>100°C</span>
      </div>
    </div>
  );
};

export default SliderComponent;
