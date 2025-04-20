
import React from 'react';
import { ComponentToolbar } from './ComponentToolbar';
import { useBoardState } from './hooks/useBoardState';
import BoardHeader from './components/BoardHeader';
import BoardArea from './components/BoardArea';

const Board: React.FC = () => {
  const {
    components,
    showToolbar,
    isMobile,
    handleDrop,
    handleComponentChange,
    handleDeleteComponent,
    handleResizeComponent,
    handleComponentClick,
    handleMobileAdd,
    saveLayout,
    loadLayout,
    toggleToolbar
  } = useBoardState();

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
              onComponentAdded={() => toggleToolbar()}
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
