import ReactFlow, { Background, Controls, Handle, Position, getSmoothStepPath } from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection, EdgeProps } from 'reactflow';
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

// Custom Edge Component with dynamic styling and animations
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data }: EdgeProps) => {
  const borderRadius = data?.pathOptions?.borderRadius || 20;
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius,
  });
  
  // Determine edge color and animation based on status
  const getEdgeStyle = () => {
    const status = data?.status || 'idle';
    const isRunning = status === 'running';
    
    switch (status) {
      case 'running':
        return {
          stroke: '#3b82f6',
          strokeWidth: 2,
          strokeDasharray: isRunning ? '5,5' : 'none',
          animation: isRunning ? 'dash 1s linear infinite' : 'none',
          filter: 'drop-shadow(0 1px 2px rgba(59, 130, 246, 0.3))',
        };
      case 'error':
        return {
          stroke: '#ef4444',
          strokeWidth: 2,
          filter: 'drop-shadow(0 1px 2px rgba(239, 68, 68, 0.2))',
        };
      case 'success':
        return {
          stroke: '#22c55e',
          strokeWidth: 2,
          filter: 'drop-shadow(0 1px 2px rgba(34, 197, 94, 0.2))',
        };
      default:
        return {
          stroke: '#64748b',
          strokeWidth: 2,
          filter: 'drop-shadow(0 1px 2px rgba(100, 116, 139, 0.15))',
        };
    }
  };

  const edgeStyle = getEdgeStyle();
  
  return (
    <>
      {/* Invisible path for larger click area */}
      <path
        id={id}
        style={{
          ...style,
          fill: 'none',
          strokeWidth: 20,
          stroke: 'transparent',
          cursor: 'pointer',
        }}
        d={edgePath}
      />
      {/* Visible path with dynamic styling */}
      <path
        id={`${id}-visible`}
        style={{
          fill: 'none',
          cursor: 'pointer',
          ...edgeStyle,
        }}
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* Hover effect path */}
      <path
        id={`${id}-hover`}
        style={{
          fill: 'none',
          stroke: edgeStyle.stroke === '#64748b' ? '#475569' : edgeStyle.stroke,
          strokeWidth: 3,
          opacity: 0,
          cursor: 'pointer',
          transition: 'opacity 0.2s ease',
        }}
        d={edgePath}
        markerEnd={markerEnd}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0';
        }}
      />
      
      {/* Add CSS animation keyframes */}
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -10;
            }
          }
        `}
      </style>
    </>
  );
};

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
        "rounded-xl border p-4 w-64 text-center relative",
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
        className="w-6 h-6 bg-blue-500 border-4 border-white shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200"
        style={{ 
          left: -12,
          borderRadius: '50%',
          cursor: 'crosshair'
        }}
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="source"
        className="w-6 h-6 bg-blue-500 border-4 border-white shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200"
        style={{ 
          right: -12,
          borderRadius: '50%',
          cursor: 'crosshair'
        }}
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
      
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center space-x-3">
              {blockType?.icon && (
                isImageIcon ? (
                  <img 
                    src={blockType.icon as string} 
                    alt={data.label}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <blockType.icon className="h-6 w-6" />
                )
              )}
              <div className="font-medium text-xs text-foreground text-left">{data.label}</div>
            </div>
          </div>
          
          {/* Error message display */}
          {isError && (
            <Popover>
              <PopoverTrigger asChild>
                <motion.button 
                  className="flex items-center justify-start space-x-1 text-xs text-red-600 mt-3 hover:bg-red-50 rounded px-2 py-1 transition-colors w-full relative z-10"
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
                  <h4 className="font-medium text-xs">Execution Failed</h4>
                  <div className="text-xs text-muted-foreground">
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
              className="flex justify-start mt-3 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ValidationIndicator 
                blockType={data.type} 
                config={data.config} 
                className="justify-start"
              />
            </motion.div>
          )}
      
      {/* Config icon */}
      <motion.button
        className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
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

// Create nodeTypes and edgeTypes inside the component to pass onCogClick
const createNodeTypes = (onCogClick: (event: React.MouseEvent, node: Node) => void) => ({
  custom: (props: CustomNodeProps) => <CustomNode {...props} onCogClick={(e, node) => onCogClick(e, node as Node)} />
});

const createEdgeTypes = () => ({
  default: CustomEdge,
  straight: CustomEdge,
  step: CustomEdge,
  smoothstep: CustomEdge,
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
  activeNode?: Node | null;
}

export default function Canvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, status, onNodeClick, onNodeDoubleClick, onCogClick, activeNode }: CanvasProps) {
  // Atualizar os nós com o status atual e seleção
  const nodesWithStatus = nodes.map((node: Node) => ({
    ...node,
    selected: activeNode?.id === node.id,
    data: {
      ...node.data,
      status: status[node.id] || 'idle'
    }
  }));

  // Add dynamic arrow markers to edges based on status
  const edgesWithMarkers = edges.map((edge) => {
    // Determine edge status based on source and target node statuses
    const getEdgeStatus = () => {
      const sourceStatus = status[edge.source] || 'idle';
      const targetStatus = status[edge.target] || 'idle';
      
      // If target is running, edge should show running
      if (targetStatus === 'running') return 'running';
      // If target has error, edge should show error
      if (targetStatus === 'error') return 'error';
      // If target is success and source is success, edge should show success
      if (targetStatus === 'success' && sourceStatus === 'success') return 'success';
      // Default to idle
      return 'idle';
    };

    const edgeStatus = getEdgeStatus();
    
    // Get color based on status
    const getEdgeColor = () => {
      switch (edgeStatus) {
        case 'running': return '#3b82f6';
        case 'error': return '#ef4444';
        case 'success': return '#22c55e';
        default: return '#64748b';
      }
    };

    const edgeColor = getEdgeColor();
    
    // Get marker ID based on status
    const getMarkerId = () => {
      switch (edgeStatus) {
        case 'running': return 'arrow-running';
        case 'error': return 'arrow-error';
        case 'success': return 'arrow-success';
        default: return 'arrow-idle';
      }
    };
    
    return {
      ...edge,
      type: 'smoothstep',
      data: { status: edgeStatus },
      markerEnd: {
        type: getMarkerId() as any,
        color: edgeColor,
        width: 10,
        height: 10,
      },
      style: {
        strokeWidth: 2,
        stroke: edgeColor,
      },
      pathOptions: {
        borderRadius: 20,
      },
    };
  });

  const nodeTypes = useMemo(() => createNodeTypes(onCogClick), [onCogClick]);
  const edgeTypes = useMemo(() => createEdgeTypes(), []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodesWithStatus}
        edges={edgesWithMarkers}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          markerEnd: {
            type: 'arrow-idle' as any,
            color: '#64748b',
            width: 10,
            height: 10,
          },
          pathOptions: {
            borderRadius: 20,
          },
        }}
      >
        <Background />
        <Controls />
        
        {/* Define dynamic chevron markers for edges */}
        <svg>
          <defs>
            {/* Idle/Slate marker */}
            <marker
              id="arrow-idle"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M0,0 L0,6 L7,3 z"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
            
            {/* Running/Blue marker */}
            <marker
              id="arrow-running"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M0,0 L0,6 L7,3 z"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
            
            {/* Error/Red marker */}
            <marker
              id="arrow-error"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M0,0 L0,6 L7,3 z"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
            
            {/* Success/Green marker */}
            <marker
              id="arrow-success"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M0,0 L0,6 L7,3 z"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
    </div>
  );
}
