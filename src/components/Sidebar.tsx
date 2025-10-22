import React from 'react';

interface SidebarProps {
  onBlockSelect: (blockType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onBlockSelect }) => {
  const blockTypes = [
    { id: 'trigger', name: 'Trigger', icon: '⚡' },
    { id: 'action', name: 'Action', icon: '🔧' },
    { id: 'condition', name: 'Condition', icon: '❓' },
    { id: 'delay', name: 'Delay', icon: '⏱️' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Block Library</h2>
      <div className="space-y-2">
        {blockTypes.map((block) => (
          <button
            key={block.id}
            onClick={() => onBlockSelect(block.id)}
            className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left flex items-center space-x-3 transition-colors"
          >
            <span className="text-2xl">{block.icon}</span>
            <span>{block.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
