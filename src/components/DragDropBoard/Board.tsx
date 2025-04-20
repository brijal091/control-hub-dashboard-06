/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import BoardItem from './BoardItem';
import { ItemTypes, ComponentTypes } from './ItemTypes';
import { ComponentToolbar } from './ComponentToolbar';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

export interface BoardComponent {
  id: string;
  type: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  zIndex?: number;
  value?: boolean | number;
}

const Board: React.FC = () => {
  const [components, setComponents] = useState<BoardComponent[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [showToolbar, setShowToolbar] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.TOOLBAR_ITEM, ItemTypes.BOARD_ITEM],
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      
      if (item.fromToolbar) {
        // Add new component from toolbar
        const left = monitor.getClientOffset()?.x ?? 0;
        const top = monitor.getClientOffset()?.y ?? 0;
        
        // Get board element position to calculate relative position
        const boardElement = document.getElementById('board');
        const boardRect = boardElement?.getBoundingClientRect();
        
        if (boardRect) {
          let newComponentProps: Partial<BoardComponent> = {
            id: uuidv4(),
            type: item.type,
            left: Math.round(left - boardRect.left),
            top: Math.round(top - boardRect.top),
            zIndex: nextZIndex,
          };
          
          // Set default properties based on component type
          switch (item.type) {
            case ComponentTypes.SWITCH:
              newComponentProps = {
                ...newComponentProps,
                width: isMobile ? 150 : 180,
                height: 100,
                value: false,
              };
              break;
            case ComponentTypes.SLIDER:
              newComponentProps = {
                ...newComponentProps,
                width: isMobile ? 160 : 200,
                height: 120,
                value: 50,
              };
              break;
            case ComponentTypes.BUTTON:
              newComponentProps = {
                ...newComponentProps,
                width: isMobile ? 100 : 120,
                height: isMobile ? 100 : 120,
                value: false,
              };
              break;
            case ComponentTypes.RECTANGLE_BUTTON:
              newComponentProps = {
                ...newComponentProps,
                width: isMobile ? 150 : 180,
                height: 100,
                value: false,
              };
              break;
            case ComponentTypes.STEPPER_H:
              newComponentProps = {
                ...newComponentProps,
                width: isMobile ? 160 : 200,
                height: 100,
                value: 0,
              };
              break;
            case ComponentTypes.STEPPER_V:
              newComponentProps = {
                ...newComponentProps,
                width: isMobile ? 100 : 120,
                height: isMobile ? 150 : 180,
                value: 0,
              };
              break;
            default:
              break;
          }
          
          setNextZIndex(prev => prev + 1);
          setComponents((prev) => [...prev, newComponentProps as BoardComponent]);
          
          // Auto-hide toolbar on mobile after component is added
          if (isMobile) {
            setShowToolbar(false);
          }
          
          toast({
            title: "Component Added",
            description: `Added new ${item.type} to the board`,
          });
        }
        return;
      }
      
      if (!delta || !item.id) {
        return;
      }
      
      // Bring the component to the front when dragging
      setComponents((prevComponents) =>
        prevComponents.map((comp) => {
          if (comp.id === item.id) {
            return {
              ...comp,
              left: Math.round(comp.left + delta.x),
              top: Math.round(comp.top + delta.y),
              zIndex: nextZIndex,
            };
          }
          return comp;
        })
      );
      setNextZIndex(prev => prev + 1);
    },
  }));

  const handleComponentChange = useCallback((id: string, value: boolean | number) => {
    setComponents((prevComponents) =>
      prevComponents.map((comp) => {
        if (comp.id === id) {
          return { ...comp, value };
        }
        return comp;
      })
    );
  }, []);

  const handleDeleteComponent = useCallback((id: string) => {
    setComponents((prevComponents) => 
      prevComponents.filter((comp) => comp.id !== id)
    );
    toast({
      title: "Component Removed",
      description: "Component has been removed from the board",
    });
  }, [toast]);

  const handleResizeComponent = useCallback((id: string, width: number, height: number) => {
    setComponents((prevComponents) =>
      prevComponents.map((comp) => {
        if (comp.id === id) {
          return { ...comp, width, height };
        }
        return comp;
      })
    );
  }, []);

  const handleComponentClick = useCallback((id: string) => {
    // Bring the clicked component to the front
    setComponents((prevComponents) =>
      prevComponents.map((comp) => {
        if (comp.id === id) {
          return { ...comp, zIndex: nextZIndex };
        }
        return comp;
      })
    );
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const saveLayout = () => {
    const layout = JSON.stringify(components);
    localStorage.setItem('boardLayout', layout);
    toast({
      title: "Layout Saved",
      description: "Your board layout has been saved",
    });
  };

  const loadLayout = () => {
    const savedLayout = localStorage.getItem('boardLayout');
    if (savedLayout) {
      const loadedComponents = JSON.parse(savedLayout);
      setComponents(loadedComponents);
      
      // Find the highest zIndex and update nextZIndex
      const highestZIndex = loadedComponents.reduce(
        (max: number, comp: BoardComponent) => Math.max(max, comp.zIndex || 0), 
        0
      );
      setNextZIndex(highestZIndex + 1);
      
      toast({
        title: "Layout Loaded",
        description: "Your board layout has been loaded",
      });
    } else {
      toast({
        title: "No Layout Found",
        description: "There is no saved layout to load",
        variant: "destructive",
      });
    }
  };

  const toggleToolbar = () => {
    setShowToolbar(!showToolbar);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={toggleToolbar}
              className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
              aria-label="Toggle toolbar"
            >
              <Menu size={18} />
            </button>
          )}
          <h1 className="text-lg md:text-xl font-bold">IoT Control Board</h1>
        </div>
        <div className="flex space-x-1 md:space-x-2">
          <button 
            onClick={saveLayout}
            className="px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm bg-green-600 rounded hover:bg-green-700 transition-colors"
          >
            Save
          </button>
          <button 
            onClick={loadLayout}
            className="px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm bg-gray-600 rounded hover:bg-gray-700 transition-colors"
          >
            Load
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile toolbar (hidden by default) */}
        {isMobile && (
          <div 
            className={`absolute top-0 left-0 z-50 h-full transition-transform duration-300 ${
              showToolbar ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <ComponentToolbar onComponentAdded={() => setShowToolbar(false)} />
          </div>
        )}
        
        {/* Desktop toolbar (always visible) */}
        {!isMobile && <ComponentToolbar />}
        
        <div 
          id="board"
          ref={drop} 
          className="flex-1 relative bg-gray-900 overflow-auto border-l border-gray-700"
          style={{ minHeight: '500px' }}
        >
          {components.map((comp) => (
            <div key={comp.id} onClick={() => handleComponentClick(comp.id)}>
              <BoardItem
                id={comp.id}
                type={comp.type}
                left={comp.left}
                top={comp.top}
                width={comp.width}
                height={comp.height}
                zIndex={comp.zIndex}
                value={comp.value}
                onChange={handleComponentChange}
                onDelete={handleDeleteComponent}
                onResize={handleResizeComponent}
                isMobile={isMobile}
              />
            </div>
          ))}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-center p-4">
              {isMobile 
                ? "Tap the menu icon and drag components to the board" 
                : "Drag components from the toolbar to the board"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
