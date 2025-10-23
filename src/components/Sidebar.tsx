import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { blockTypes } from '../data/blockTypes';

interface SidebarProps {
  onBlockSelect: (blockType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onBlockSelect }) => {
  const sidebarBlocks = [
    'amazonSales',
    'aiAgent', 
    'gmail',
    'slack',
    'trigger',
    'action',
    'condition',
    'delay'
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trigger': return 'bg-green-100 text-green-800';
      case 'action': return 'bg-blue-100 text-blue-800';
      case 'condition': return 'bg-yellow-100 text-yellow-800';
      case 'utility': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-64 border-r bg-background p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Block Library</CardTitle>
          <CardDescription>Drag blocks to the canvas to build your flow</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {sidebarBlocks.map((blockId) => {
                const blockType = blockTypes[blockId];
                if (!blockType) return null;
                
                const isImageIcon = typeof blockType.icon === 'string';
                
                return (
                  <Button
                    key={blockId}
                    onClick={() => onBlockSelect(blockId)}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 hover:bg-accent"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {isImageIcon ? (
                        <img 
                          src={blockType.icon as string} 
                          alt={blockType.name}
                          className="h-5 w-5 object-contain"
                        />
                      ) : (
                        <blockType.icon className="h-5 w-5" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium">{blockType.name}</div>
                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(blockType.category)}`}>
                          {blockType.category}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
