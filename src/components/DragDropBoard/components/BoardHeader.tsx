
import React from 'react';
import { Menu } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface BoardHeaderProps {
  onSave: () => void;
  onLoad: () => void;
  toggleToolbar: () => void;
  showToolbar: boolean;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
  onSave,
  onLoad,
  toggleToolbar,
  showToolbar,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center p-3 
      bg-gradient-to-r from-gray-900/95 to-gray-800/95 
      border-b border-gray-700/30 backdrop-blur-md">
      <div className="flex items-center gap-2">
        {isMobile && (
          <button
            onClick={toggleToolbar}
            className="p-2 text-primary/90 hover:text-primary 
              hover:bg-white/5 rounded-lg transition-all duration-300"
            aria-label="Toggle toolbar"
          >
            <Menu size={18} />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-bold 
          bg-gradient-to-r from-primary via-primary/80 to-primary/60 
          bg-clip-text text-transparent">
          IoT Control Board
        </h1>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={onSave}
          className="px-3 py-1.5 text-sm rounded-lg transition-all duration-300
            bg-green-600/20 hover:bg-green-600/30 text-green-400
            border border-green-500/20 hover:border-green-500/30
            shadow-lg shadow-green-500/5 hover:shadow-green-500/10"
        >
          Save
        </button>
        <button 
          onClick={onLoad}
          className="px-3 py-1.5 text-sm rounded-lg transition-all duration-300
            bg-gray-600/20 hover:bg-gray-600/30 text-gray-300
            border border-gray-500/20 hover:border-gray-500/30
            shadow-lg shadow-gray-500/5 hover:shadow-gray-500/10"
        >
          Load
        </button>
      </div>
    </div>
  );
};

export default BoardHeader;
