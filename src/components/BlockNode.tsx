import React, { useState } from 'react';

interface Block {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  config?: any;
}

interface BlockNodeProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
}

const BlockNode: React.FC<BlockNodeProps> = ({ block, isSelected, onSelect, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const getBlockStyles = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-green-50 border-green-300';
      case 'action': return 'bg-blue-50 border-blue-300';
      case 'condition': return 'bg-yellow-50 border-yellow-300';
      case 'delay': return 'bg-purple-50 border-purple-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'trigger': return '⚡';
      case 'action': return '🔧';
      case 'condition': return '❓';
      case 'delay': return '⏱️';
      default: return '📦';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - block.x,
      y: e.clientY - block.y
    });
    onSelect();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onMove(newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        onMove(newX, newY);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, onMove]);

  return (
    <div
      className={`absolute w-52 h-20 rounded-xl border shadow-sm cursor-move transition-all ${
        getBlockStyles(block.type)
      } ${
        isSelected ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-102'
      }`}
      style={{
        left: block.x,
        top: block.y,
        transform: isDragging ? 'scale(1.05)' : undefined
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center h-full p-4 text-center font-medium">
        <span className="text-2xl mr-3">{getBlockIcon(block.type)}</span>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-700">{block.name || block.type}</div>
          <div className="text-xs text-gray-500 capitalize">{block.type}</div>
        </div>
      </div>
      
      {/* Connection points */}
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-400 opacity-0 hover:opacity-100 transition-opacity shadow-sm" />
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-400 opacity-0 hover:opacity-100 transition-opacity shadow-sm" />
    </div>
  );
};

export default BlockNode;
