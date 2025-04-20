/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ComponentTypes } from './ItemTypes';
import { ComponentToolbar } from './ComponentToolbar';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import BoardHeader from './components/BoardHeader';
import BoardArea from './components/BoardArea';
import { BoardComponent } from './types';

const Board: React.FC = () => {
  const [components, setComponents] = useState<BoardComponent[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [showToolbar, setShowToolbar] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleDrop = useCallback((item: any, monitor: any) => {
    const delta = monitor.getDifferenceFromInitialOffset();
    
    if (item.fromToolbar) {
      const left = monitor.getClientOffset()?.x ?? 0;
      const top = monitor.getClientOffset()?.y ?? 0;
      
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
  }, [nextZIndex, isMobile, toast]);

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

  const handleMobileAdd = useCallback((type: string) => {
    if (!isMobile) return;

    const boardElement = document.getElementById('board');
    const boardRect = boardElement?.getBoundingClientRect();

    if (boardRect) {
      const existingComponents = components.length;
      const columnsPerRow = 2;
      const componentWidth = isMobile ? 150 : 180;
      const componentHeight = 100;
      const gap = 20;

      const row = Math.floor(existingComponents / columnsPerRow);
      const col = existingComponents % columnsPerRow;

      let newComponentProps: Partial<BoardComponent> = {
        id: uuidv4(),
        type,
        left: col * (componentWidth + gap) + gap,
        top: row * (componentHeight + gap) + gap,
        zIndex: nextZIndex,
      };

      switch (type) {
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
      
      if (isMobile) {
        setShowToolbar(false);
      }
      
      toast({
        title: "Component Added",
        description: `Added new ${type} to the board`,
      });
    }
  }, [components, isMobile, nextZIndex, toast]);

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
      <BoardHeader 
        onSave={saveLayout}
        onLoad={loadLayout}
        toggleToolbar={toggleToolbar}
        showToolbar={showToolbar}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {isMobile ? (
          <div 
            className={`absolute top-0 left-0 z-50 h-full transition-transform duration-300 ${
              showToolbar ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <ComponentToolbar 
              onComponentAdded={() => setShowToolbar(false)}
              onMobileAdd={handleMobileAdd}
            />
          </div>
        ) : (
          <ComponentToolbar />
        )}
        
        <BoardArea
          components={components}
          onDrop={handleDrop}
          onComponentChange={handleComponentChange}
          onDeleteComponent={handleDeleteComponent}
          onResizeComponent={handleResizeComponent}
          onComponentClick={handleComponentClick}
        />
      </div>
    </div>
  );
};

export default Board;
