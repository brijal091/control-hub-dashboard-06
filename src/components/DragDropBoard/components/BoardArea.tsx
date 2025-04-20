
import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';
import BoardItem from '../BoardItem';
import { BoardComponent } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';

interface BoardAreaProps {
  components: BoardComponent[];
  onDrop: (item: any, monitor: any) => void;
  onComponentChange: (id: string, value: boolean | number) => void;
  onDeleteComponent: (id: string) => void;
  onResizeComponent: (id: string, width: number, height: number) => void;
  onComponentClick: (id: string) => void;
}

const BoardArea: React.FC<BoardAreaProps> = ({
  components,
  onDrop,
  onComponentChange,
  onDeleteComponent,
  onResizeComponent,
  onComponentClick,
}) => {
  const isMobile = useIsMobile();

  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.TOOLBAR_ITEM, ItemTypes.BOARD_ITEM],
    drop: onDrop,
  }));

  return (
    <div 
      id="board"
      ref={drop} 
      className="flex-1 relative overflow-auto border-l border-gray-700/30
        bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800/90"
      style={{ minHeight: '500px' }}
    >
      {components.map((comp) => (
        <div key={comp.id} onClick={() => onComponentClick(comp.id)}>
          <BoardItem
            id={comp.id}
            type={comp.type}
            left={comp.left}
            top={comp.top}
            width={comp.width}
            height={comp.height}
            zIndex={comp.zIndex}
            value={comp.value}
            onChange={onComponentChange}
            onDelete={onDeleteComponent}
            onResize={onResizeComponent}
            isMobile={isMobile}
          />
        </div>
      ))}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center 
          text-gray-400 text-center p-4 animate-pulse">
          {isMobile 
            ? "Tap the menu icon and drag components to the board" 
            : "Drag components from the toolbar to the board"}
        </div>
      )}
    </div>
  );
};

export default BoardArea;
