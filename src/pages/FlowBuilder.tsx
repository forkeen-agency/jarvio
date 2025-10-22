import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import Sidebar from '../components/Sidebar';
import ConfigPanel from '../components/ConfigPanel';
import Canvas from '../components/Canvas';
import BlockModal from '../components/BlockModal';
import { useFlowRunner } from '../hooks/useFlowRunner';
import { blockTypes } from '../data/blockTypes';
import { getLayoutedElements } from '../utils/autoLayout';

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNode, setActiveNode] = useState(null);

  const flowRunner = useFlowRunner(nodes);

  // Persistência local - salvar automaticamente
  useEffect(() => {
    localStorage.setItem("flowState", JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  // Carregar estado salvo
  useEffect(() => {
    const saved = localStorage.getItem("flowState");
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
        setNodes(savedNodes || []);
        setEdges(savedEdges || []);
      } catch (error) {
        console.error("Erro ao carregar estado salvo:", error);
      }
    }
  }, [setNodes, setEdges]);

  const handleBlockSelect = (blockType: string) => {
    const newNode = {
      id: `node-${nextId}`,
      type: 'custom',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: blockTypes[blockType]?.name || blockType,
        type: blockType,
        config: blockTypes[blockType]?.defaultConfig || {}
      }
    };

    setNodes(prev => [...prev, newNode]);
    setNextId(prev => prev + 1);
  };

  const handleNodeConfigChange = useCallback((config: any) => {
    if (selectedNode) {
      setNodes(prev => prev.map(node => 
        node.id === selectedNode.id 
          ? { ...node, data: { ...node.data, config } }
          : node
      ));
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, config } });
    }
  }, [selectedNode, setNodes]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const handleClearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setNextId(1);
  };

  const handleAutoArrange = () => {
    const layouted = getLayoutedElements(nodes, edges);
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  };

  const handleNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  const handleUpdateNode = (id, field, value) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
    // Atualizar também o selectedNode se for o mesmo
    if (selectedNode && selectedNode.id === id) {
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, [field]: value } });
    }
  };

  const openModal = useCallback((event, node) => {
    setActiveNode(node);
    setIsModalOpen(true);
  }, []);

  const handleSaveModal = (id, data) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">Flow Builder</h1>
        <div className="space-x-3">
          <button
            onClick={flowRunner.runFlow}
            disabled={nodes.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>▶️</span>
            <span>Run Flow</span>
          </button>
          
          <button
            onClick={handleAutoArrange}
            disabled={nodes.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Auto Arrange
          </button>
          
          <button
            onClick={handleClearCanvas}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Clear Canvas
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <Sidebar onBlockSelect={handleBlockSelect} />
        
        <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={openModal}
          status={flowRunner.status}
        />
        
        <ConfigPanel
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
        />
      </div>

      {/* Modal */}
      <BlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        node={activeNode}
        onSave={handleSaveModal}
      />
    </div>
  );
};

export default FlowBuilder;
