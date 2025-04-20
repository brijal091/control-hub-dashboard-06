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
      className={`p-3 m-1 md:p-4 md:m-2 rounded-xl backdrop-blur-md flex flex-col items-center justify-center cursor-grab 
        bg-gradient-to-br from-gray-900/90 to-gray-800/90 
        border border-gray-700/30 hover:border-primary/40
        shadow-lg shadow-primary/5 hover:shadow-primary/10
        transform transition-all duration-300 
        ${isDragging ? 'opacity-50 scale-105 rotate-3' : 'opacity-100 hover:scale-105'}`}
      style={{ 
        width: isMobile ? '70px' : '100px', 
        height: isMobile ? '70px' : '100px' 
      }}
    >
      <div className="text-primary mb-1 md:mb-2 transform transition-transform group-hover:scale-110">{icon}</div>
      <span className="text-xs md:text-sm text-center bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-medium">
        {label}
      </span>
    </div>
  );
};

interface ComponentToolbarProps {
  onComponentAdded?: () => void;
}

export const ComponentToolbar: React.FC<ComponentToolbarProps> = ({ onComponentAdded }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'w-32 h-full' : 'w-36'} 
      bg-gradient-to-br from-gray-900/95 to-gray-800/95 
      border-r border-gray-700/30
      p-2 flex flex-col items-center overflow-y-auto 
      shadow-xl backdrop-blur-lg`}>
      <h2 className="text-white text-xs md:text-sm font-medium mb-3 md:mb-4 
        bg-gradient-to-r from-primary via-primary/80 to-primary/60 
        bg-clip-text text-transparent tracking-wide">
        Components
      </h2>
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
