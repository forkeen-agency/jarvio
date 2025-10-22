import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
import { clsx } from 'clsx';
import 'reactflow/dist/style.css';

const CustomNode = ({ data, selected }) => {
  const status = data.status || 'idle';
  
  return (
    <div
      className={clsx(
        "rounded-xl border p-4 w-52 text-center transition-all duration-300 relative",
        "hover:shadow-lg hover:scale-105",
        status === "running" && "bg-blue-100 border-blue-400 animate-pulse",
        status === "success" && "bg-green-100 border-green-400",
        status === "idle" && "bg-white border-gray-300",
        selected && "ring-2 ring-blue-400"
      )}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        id="target"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ left: -6 }}
      />
      <div className="font-medium">{data.label}</div>
      
      {/* Config icon */}
      <button
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          // This will be handled by the parent component
        }}
      >
        ⚙️
      </button>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="source"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ right: -6 }}
      />
    </div>
  );
};

// Definir nodeTypes fora do componente para evitar recriação
const nodeTypes = { custom: CustomNode };

export default function Canvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, status, onNodeClick, onNodeDoubleClick }) {
  // Atualizar os nós com o status atual
  const nodesWithStatus = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      status: status[node.id] || 'idle'
    }
  }));

  return (
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
  );
}
