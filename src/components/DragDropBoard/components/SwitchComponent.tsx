
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SwitchComponentProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const SwitchComponent: React.FC<SwitchComponentProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col items-center p-2 min-w-36">
      <div className="flex items-center justify-between space-x-4 w-full">
        <Label htmlFor="switch-component" className="text-white">
          {value ? 'ON' : 'OFF'}
        </Label>
        <Switch
          id="switch-component"
          checked={value}
          onCheckedChange={onChange}
          className={value ? 'bg-green-500' : 'bg-gray-500'}
        />
      </div>
      <div className={`mt-2 text-xs ${value ? 'text-green-400' : 'text-gray-400'}`}>
        Status: {value ? 'Device is running' : 'Device is stopped'}
      </div>
    </div>
  );
};

export default SwitchComponent;
