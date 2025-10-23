import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import { clsx } from 'clsx';
import { Settings, AlertCircle } from 'lucide-react';
import { blockTypes } from '../data/blockTypes';
import { hasValidationErrors } from '../utils/validation';
import ValidationIndicator from './ValidationIndicator';
import { useMemo } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from 'motion/react';
import 'reactflow/dist/style.css';

interface CustomNodeProps {
  data: {
    label: string;
    type: string;
    config?: Record<string, unknown>;
    status?: string;
    errorMessage?: string;
    errorTimestamp?: string;
    errorDetails?: string;
    id?: string;
  };
  selected: boolean;
  onCogClick?: (event: React.MouseEvent, node: { data: CustomNodeProps['data']; selected: boolean }) => void;
}

const CustomNode = ({ data, selected, onCogClick }: CustomNodeProps) => {
  const status = data.status || 'idle';
  const blockType = blockTypes[data.type];
  const isImageIcon = blockType?.icon && typeof blockType.icon === 'string';
  
  // Check for validation errors
  const hasErrors = hasValidationErrors(data.type, data.config || {});
  const isError = status === 'error' || hasErrors;
  
  
  return (
    <motion.div
      className={clsx(
        "rounded-xl border p-4 w-52 text-center relative",
        "hover:shadow-lg",
        selected && "ring-2 ring-primary"
      )}
      animate={{
        scale: status === 'running' ? 1.02 : 1,
        backgroundColor: status === 'running' ? "hsl(var(--primary) / 0.1)" : 
                        status === 'success' ? "hsl(142 76% 36% / 0.1)" :
                        status === 'error' ? "hsl(0 84% 60% / 0.1)" : "hsl(var(--card))",
        borderColor: status === 'running' ? "hsl(var(--primary))" :
                    status === 'success' ? "hsl(142 76% 36%)" :
                    status === 'error' ? "hsl(0 84% 60%)" : "hsl(var(--border))"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      style={{ willChange: "transform" }}
    >
      {/* Shake animation for errors */}
      {isError && (
        <motion.div
          animate={{ x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 rounded-xl"
          style={{ pointerEvents: "none" }}
        />
      )}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="target"
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ left: -6 }}
      />
      
      {/* Pulsing overlay for running state */}
      {status === 'running' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ pointerEvents: "none" }}
        />
      )}
      
          <div className="flex items-center justify-center space-x-2 mb-2 relative z-10">
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
          
          {/* Error message display */}
          {isError && (
            <Popover>
              <PopoverTrigger asChild>
                <motion.button 
                  className="flex items-center justify-center space-x-1 text-xs text-red-600 mt-1 hover:bg-red-50 rounded px-2 py-1 transition-colors w-full relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <span>{status === 'error' ? 'Execution failed' : 'Configuration error'}</span>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <AlertCircle className="h-3 w-3" />
                  </motion.div>
                </motion.button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Execution Failed</h4>
                  <div className="text-sm text-muted-foreground">
                    {status === 'error' ? (
                      <div className="space-y-2">
                        <p><strong>Error:</strong> {data.errorMessage || 'Unknown error occurred'}</p>
                        <p><strong>Timestamp:</strong> {data.errorTimestamp || new Date().toLocaleString()}</p>
                        <p><strong>Node ID:</strong> {data.id}</p>
                        {data.errorDetails && (
                          <div>
                            <p><strong>Details:</strong></p>
                            <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                              {data.errorDetails}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p><strong>Configuration Error:</strong> Invalid block configuration</p>
                        <p><strong>Node ID:</strong> {data.id}</p>
                        <p>Please check the block configuration and fix any validation errors.</p>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          {/* Validation indicator - only show if no execution errors */}
          {!isError && (
            <motion.div 
              className="mt-2 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ValidationIndicator 
                blockType={data.type} 
                config={data.config} 
                className="justify-center"
              />
            </motion.div>
          )}
      
      {/* Config icon */}
      <motion.button
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Cog clicked, onCogClick:', !!onCogClick);
          if (onCogClick) {
            onCogClick(e, { data, selected });
          }
        }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Settings className="h-4 w-4" />
      </motion.button>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="source"
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ right: -6 }}
      />
    </motion.div>
  );
};

// Create nodeTypes inside the component to pass onCogClick
const createNodeTypes = (onCogClick: (event: React.MouseEvent, node: Node) => void) => ({
  custom: (props: CustomNodeProps) => <CustomNode {...props} onCogClick={(e, node) => onCogClick(e, node as Node)} />
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
