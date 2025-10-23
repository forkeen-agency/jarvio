import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
// import { Badge } from "@/components/ui/badge";
import { blockTypes } from '../data/blockTypes';
import { Separator } from "@/components/ui/separator"

interface BlockLibrarySidebarProps {
  onBlockSelect: (blockType: string) => void;
}

const BlockLibrarySidebar: React.FC<BlockLibrarySidebarProps> = ({ onBlockSelect }) => {
  // Custom blocks (our created blocks)
  const customBlocks = [
    'amazonSales',
    'aiAgent', 
    'gmail',
    'slack'
  ];

  // Native blocks (generic blocks)
  const nativeBlocks = [
    'trigger',
    'action',
    'condition',
    'delay'
  ];

  // const getCategoryColor = (category: string) => {
  //   switch (category) {
  //     case 'trigger': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  //     case 'action': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  //     case 'condition': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  //     case 'utility': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  //     default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  //     }
  // };

  const renderBlockGroup = (blocks: string[], title: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {blocks.map((blockId) => {
            const blockType = blockTypes[blockId];
            if (!blockType) return null;
            
            const isImageIcon = typeof blockType.icon === 'string';
            
            return (
              <SidebarMenuItem key={blockId}>
                <SidebarMenuButton 
                  onClick={() => onBlockSelect(blockId)}
                  className="w-full justify-start h-auto p-2 hover:bg-accent"
                >
                  <div className="flex items-center space-x-2 w-full">
                    {isImageIcon ? (
                      <img 
                        src={blockType.icon as string} 
                        alt={blockType.name}
                        className="h-4 w-4 object-contain flex-shrink-0"
                      />
                    ) : (
                      <blockType.icon className="h-4 w-4 flex-shrink-0" />
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm truncate">{blockType.name}</div>
                      {/* <div className="text-xs text-muted-foreground mt-0.5">
                        {blockType.category}
                      </div> */}
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="w-56">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <img 
            src="/jarvio.png" 
            alt="Jarvio" 
            className="h-6 w-6 object-contain"
          />
          <span className="font-semibold text-lg">Jarvio</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {renderBlockGroup(customBlocks, "Custom Blocks")}
        <Separator className="" />
        {renderBlockGroup(nativeBlocks, "Native Blocks")}
      </SidebarContent>
    </Sidebar>
  );
};

export default BlockLibrarySidebar;
