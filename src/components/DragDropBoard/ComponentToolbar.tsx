
import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, ComponentTypes } from './ItemTypes';
import { ToggleRight, Thermometer, CircleOff, Square, ArrowRightLeft, ArrowUpDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ToolbarItemProps {
  type: string;
  icon: React.ReactNode;
  label: string;
}

const ToolbarItem: React.FC<ToolbarItemProps> = ({ type, icon, label }) => {
  const isMobile = useIsMobile();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TOOLBAR_ITEM,
    item: { type, fromToolbar: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 m-1 md:p-4 md:m-2 rounded-lg bg-gray-800 flex flex-col items-center justify-center cursor-grab ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } hover:bg-gray-700 transition-colors`}
      style={{ 
        width: isMobile ? '70px' : '100px', 
        height: isMobile ? '70px' : '100px' 
      }}
    >
      <div className="text-green-400 mb-1 md:mb-2">{icon}</div>
      <span className="text-xs md:text-sm text-center text-white">{label}</span>
    </div>
  );
};

interface ComponentToolbarProps {
  onComponentAdded?: () => void;
}

export const ComponentToolbar: React.FC<ComponentToolbarProps> = ({ onComponentAdded }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'w-32 h-full' : 'w-36'} bg-gray-800 p-2 flex flex-col items-center overflow-y-auto`}>
      <h2 className="text-white text-xs md:text-sm font-medium mb-1 md:mb-2">Components</h2>
      <ToolbarItem 
        type={ComponentTypes.SWITCH} 
        icon={<ToggleRight size={isMobile ? 24 : 32} />} 
        label="Switch" 
      />
      <ToolbarItem 
        type={ComponentTypes.SLIDER} 
        icon={<Thermometer size={isMobile ? 24 : 32} />} 
        label="Slider" 
      />
      <ToolbarItem 
        type={ComponentTypes.BUTTON} 
        icon={<CircleOff size={isMobile ? 24 : 32} />} 
        label="Button" 
      />
      <ToolbarItem 
        type={ComponentTypes.RECTANGLE_BUTTON} 
        icon={<Square size={isMobile ? 24 : 32} />} 
        label="Rect Button" 
      />
      <ToolbarItem 
        type={ComponentTypes.STEPPER_H} 
        icon={<ArrowRightLeft size={isMobile ? 24 : 32} />} 
        label="Stepper H" 
      />
      <ToolbarItem 
        type={ComponentTypes.STEPPER_V} 
        icon={<ArrowUpDown size={isMobile ? 24 : 32} />} 
        label="Stepper V" 
      />
    </div>
  );
};
