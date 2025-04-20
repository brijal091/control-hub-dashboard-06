
import React, { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, ComponentTypes } from './ItemTypes';
import SwitchComponent from './components/SwitchComponent';
import SliderComponent from './components/SliderComponent';
import ButtonComponent from './components/ButtonComponent';
import StepperComponent from './components/StepperComponent';
import { Trash2 } from 'lucide-react';

interface BoardItemProps {
  id: string;
  type: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  zIndex?: number;
  value?: boolean | number;
  onChange: (id: string, value: boolean | number) => void;
  onDelete: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  isMobile?: boolean;
}

const BoardItem: React.FC<BoardItemProps> = ({ 
  id, 
  type, 
  left, 
  top,
  width = 180,
  height = 100,
  zIndex = 1,
  value, 
  onChange,
  onDelete,
  onResize,
  isMobile = false
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const resizeStartDimensions = useRef({ width, height });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOARD_ITEM,
    item: { id, type, left, top, zIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    resizeStartDimensions.current = { width, height };
    
    const onMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.current.x;
        const deltaY = e.clientY - resizeStartPos.current.y;
        
        const newWidth = Math.max(100, resizeStartDimensions.current.width + deltaX);
        const newHeight = Math.max(60, resizeStartDimensions.current.height + deltaY);
        
        onResize(id, newWidth, newHeight);
      }
    };
    
    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Touch events for mobile resize
  const handleTouchResizeStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    if (e.touches && e.touches[0]) {
      resizeStartPos.current = { 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      };
      resizeStartDimensions.current = { width, height };
    }
    
    const onTouchMove = (e: TouchEvent) => {
      if (isResizing && e.touches && e.touches[0]) {
        const deltaX = e.touches[0].clientX - resizeStartPos.current.x;
        const deltaY = e.touches[0].clientY - resizeStartPos.current.y;
        
        const newWidth = Math.max(100, resizeStartDimensions.current.width + deltaX);
        const newHeight = Math.max(60, resizeStartDimensions.current.height + deltaY);
        
        onResize(id, newWidth, newHeight);
      }
    };
    
    const onTouchEnd = () => {
      setIsResizing(false);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
    
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  };

  const renderComponent = () => {
    switch (type) {
      case ComponentTypes.SWITCH:
        return (
          <SwitchComponent 
            value={value as boolean} 
            onChange={(newValue) => onChange(id, newValue)} 
          />
        );
      case ComponentTypes.SLIDER:
        return (
          <SliderComponent 
            value={value as number} 
            onChange={(newValue) => onChange(id, newValue)} 
          />
        );
      case ComponentTypes.BUTTON:
        return (
          <ButtonComponent
            value={value as boolean}
            onChange={(newValue) => onChange(id, newValue)}
            variant="circle"
          />
        );
      case ComponentTypes.RECTANGLE_BUTTON:
        return (
          <ButtonComponent
            value={value as boolean}
            onChange={(newValue) => onChange(id, newValue)}
            variant="rectangle"
          />
        );
      case ComponentTypes.STEPPER_H:
        return (
          <StepperComponent
            value={value as number}
            onChange={(newValue) => onChange(id, newValue)}
            orientation="horizontal"
          />
        );
      case ComponentTypes.STEPPER_V:
        return (
          <StepperComponent
            value={value as number}
            onChange={(newValue) => onChange(id, newValue)}
            orientation="vertical"
          />
        );
      default:
        return <div>Unknown component type</div>;
    }
  };

  // Use different interaction approaches for mobile vs desktop
  const interactionProps = isMobile
    ? {
        onTouchStart: () => setShowControls(true),
        onTouchEnd: () => setTimeout(() => setShowControls(false), 3000),
      }
    : {
        onMouseEnter: () => setShowControls(true),
        onMouseLeave: () => setShowControls(false),
      };

  return (
    <div
      ref={drag}
      className={`absolute border-2 rounded-lg overflow-hidden transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-105' : 'opacity-100'
      } ${showControls ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent'}`}
      style={{
        left,
        top,
        width: `${width}px`,
        height: `${height}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        padding: isMobile ? '6px' : '10px',
        background: 'rgba(17, 17, 17, 0.8)',
        backdropFilter: 'blur(8px)',
        touchAction: 'none',
        zIndex,
      }}
      {...interactionProps}
    >
      {showControls && (
        <div className="absolute right-1 top-1 md:right-2 md:top-2 flex space-x-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors duration-300"
          >
            <Trash2 size={isMobile ? 12 : 14} className="text-white" />
          </button>
        </div>
      )}
      <div className="flex items-center justify-center h-full">
        {renderComponent()}
      </div>
      
      {showControls && (
        <div
          className="absolute bottom-0 right-0 bg-primary hover:bg-primary/80 cursor-se-resize transition-colors duration-300"
          onMouseDown={handleResizeStart}
          onTouchStart={handleTouchResizeStart}
          style={{
            borderTopLeftRadius: '6px',
            width: isMobile ? '16px' : '16px',
            height: isMobile ? '16px' : '16px',
          }}
        />
      )}
    </div>
  );
};

export default BoardItem;
