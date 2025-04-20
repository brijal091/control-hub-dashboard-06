
import React from 'react';
import { DndProvider } from '@/components/DragDropBoard/DndProvider';
import Board from '@/components/DragDropBoard/Board';
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <DndProvider>
        {isMobile ? (
          // Simple layout for mobile - no resizable panels
          <div className="h-full w-full">
            <Board />
          </div>
        ) : (
          // Resizable panels for desktop
          <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel defaultSize={100} minSize={15}>
              <Board />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </DndProvider>
    </div>
  );
};

export default Dashboard;
