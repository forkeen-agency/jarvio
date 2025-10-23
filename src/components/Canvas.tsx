import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import { clsx } from 'clsx';
import { Settings } from 'lucide-react';
import { blockTypes } from '../data/blockTypes';
import { useMemo } from 'react';
import 'reactflow/dist/style.css';

interface CustomNodeProps {
  data: any;
  selected: boolean;
  onCogClick?: (event: React.MouseEvent, node: any) => void;
}

const CustomNode = ({ data, selected, onCogClick }: CustomNodeProps) => {
  const status = data.status || 'idle';
  const blockType = blockTypes[data.type];
  const isImageIcon = blockType?.icon && typeof blockType.icon === 'string';
  
  return (
    <div
      className={clsx(
        "rounded-xl border p-4 w-52 text-center transition-all duration-300 relative",
        "hover:shadow-lg hover:scale-105",
        status === "running" && "bg-primary/10 border-primary animate-pulse",
        status === "success" && "bg-green-100 border-green-400",
        status === "idle" && "bg-card border-border",
        selected && "ring-2 ring-primary"
      )}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        id="target"
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ left: -6 }}
      />
      
      <div className="flex items-center justify-center space-x-2 mb-2">
        {blockType?.icon && (
          isImageIcon ? (
            <img 
              src={blockType.icon as string} 
              alt={data.label}
              className="h-5 w-5 object-contain"
            />
          ) : (
            <blockType.icon className="h-5 w-5" />
          )
        )}
        <div className="font-medium text-foreground">{data.label}</div>
      </div>
      
      {/* Config icon */}
      <button
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Cog clicked, onCogClick:', !!onCogClick);
          if (onCogClick) {
            onCogClick(e, { data, selected });
          }
        }}
      >
        <Settings className="h-4 w-4" />
      </button>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="source"
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ right: -6 }}
      />
    </div>
  );
};

// Create nodeTypes inside the component to pass onCogClick
const createNodeTypes = (onCogClick: (event: React.MouseEvent, node: any) => void) => ({
  custom: (props: any) => <CustomNode {...props} onCogClick={onCogClick} />
});

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  status: Record<string, string>;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onNodeDoubleClick: (event: React.MouseEvent, node: Node) => void;
  onCogClick: (event: React.MouseEvent, node: Node) => void;
}

export default function Canvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, status, onNodeClick, onNodeDoubleClick, onCogClick }: CanvasProps) {
  // Atualizar os nós com o status atual
  const nodesWithStatus = nodes.map((node: Node) => ({
    ...node,
    data: {
      ...node.data,
      status: status[node.id] || 'idle'
    }
  }));

  const nodeTypes = useMemo(() => createNodeTypes(onCogClick), [onCogClick]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodesWithStatus}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
