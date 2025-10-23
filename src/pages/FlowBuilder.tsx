import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import type { Node, Connection } from 'reactflow';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Layout, Trash2, RotateCcw } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from 'sonner';
import BlockLibrarySidebar from '../components/BlockLibrarySidebar';
import Canvas from '../components/Canvas';
import BlockModal from '../components/BlockModal';
import { useFlowRunner } from '../hooks/useFlowRunner';
import { blockTypes } from '../data/blockTypes';
import { getLayoutedElements } from '../utils/autoLayout';

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // selectedNode is no longer needed since we use Drawer modal
  // const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nextId, setNextId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNode, setActiveNode] = useState<Node | null>(null);

  const flowRunner = useFlowRunner(nodes);

  // Persistência local - salvar automaticamente
  useEffect(() => {
    localStorage.setItem("flowState", JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  // Carregar estado salvo ou template inicial
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
    } else {
      // Load template flow if no saved state
      loadTemplateFlow();
    }
  }, [setNodes, setEdges]);

  const loadTemplateFlow = () => {
    const templateNodes = [
      {
        id: 'node-1',
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          label: 'Amazon Sales Report',
          type: 'amazonSales',
          config: {
            metric: 'Revenue',
            timeframe: 'Last 30 days',
            name: 'Amazon Sales Report',
            description: 'Pull sales data from Amazon'
          }
        }
      },
      {
        id: 'node-2',
        type: 'custom',
        position: { x: 400, y: 100 },
        data: {
          label: 'AI Agent',
          type: 'aiAgent',
          config: {
            systemPrompt: 'You are a helpful business analyst. Analyze the provided data and provide clear insights and actionable recommendations.',
            name: 'AI Agent',
            description: 'AI-powered data analysis'
          }
        }
      },
      {
        id: 'node-3',
        type: 'custom',
        position: { x: 700, y: 50 },
        data: {
          label: 'Gmail',
          type: 'gmail',
          config: {
            recipient: 'manager@company.com',
            subject: 'Weekly Sales Report',
            message: 'Please find the weekly sales analysis attached.',
            name: 'Gmail',
            description: 'Send email via Gmail'
          }
        }
      },
      {
        id: 'node-4',
        type: 'custom',
        position: { x: 700, y: 200 },
        data: {
          label: 'Slack',
          type: 'slack',
          config: {
            channel: '#sales-updates',
            message: 'Weekly sales report is ready! Check your email for details.',
            name: 'Slack',
            description: 'Send message to Slack'
          }
        }
      }
    ];

    const templateEdges = [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        type: 'default'
      },
      {
        id: 'edge-2',
        source: 'node-2',
        target: 'node-3',
        type: 'default'
      },
      {
        id: 'edge-3',
        source: 'node-2',
        target: 'node-4',
        type: 'default'
      }
    ];

        setNodes(templateNodes);
        setEdges(templateEdges);
        setNextId(5);
        
        toast.success('Template loaded', {
          description: 'Amazon Sales Report → AI Agent → Gmail/Slack template has been loaded.',
        });
      };

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
    
    toast.success('Block added', {
      description: `${blockTypes[blockType]?.name || blockType} has been added to your flow.`,
    });
  };


  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const handleClearCanvas = () => {
    setNodes([]);
    setEdges([]);
    // setSelectedNode(null); // No longer needed
    setNextId(1);
    
    toast.success('Canvas cleared', {
      description: 'All blocks and connections have been removed.',
    });
  };

  const handleAutoArrange = () => {
    if (nodes.length === 0) {
      toast.error('No nodes to arrange', {
        description: 'Add some blocks to your flow before arranging.',
      });
      return;
    }
    
    const layouted = getLayoutedElements(nodes, edges);
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
    
    toast.success('Layout arranged', {
      description: `${nodes.length} node${nodes.length > 1 ? 's' : ''} have been automatically arranged.`,
    });
  };

  // handleNodeClick is no longer needed since we use Drawer modal
  // const handleNodeClick = (_: React.MouseEvent, node: Node) => {
  //   setSelectedNode(node);
  // };

  // handleUpdateNode is now handled by the Drawer modal
  // const handleUpdateNode = (id: string, field: string, value: any) => {
  //   setNodes((nds) =>
  //     nds.map((node) =>
  //       node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
  //     )
  //   );
  //   // Atualizar também o selectedNode se for o mesmo
  //   if (selectedNode && selectedNode.id === id) {
  //     setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, [field]: value } });
  //   }
  // };

  const openModal = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('openModal called with node:', node);
    setActiveNode(node);
    setIsModalOpen(true);
  }, []);

  const handleSaveModal = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  };

  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex bg-background">
        <BlockLibrarySidebar onBlockSelect={handleBlockSelect} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3.5 border-b bg-background shadow-sm w-full flex-shrink-0">
            <div className="flex items-center space-x-3">
              <SidebarTrigger className="h-8 w-8" />
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold">Flow Builder</h1>
                <Badge variant="outline" className="text-xs">{nodes.length} nodes</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={flowRunner.runFlow}
                disabled={nodes.length === 0}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Play className="h-3 w-3" />
                <span className="text-xs">Run</span>
              </Button>
              
              <Button
                onClick={loadTemplateFlow}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="text-xs">Template</span>
              </Button>
              
              <Button
                onClick={handleAutoArrange}
                disabled={nodes.length === 0}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Layout className="h-3 w-3" />
                <span className="text-xs">Arrange</span>
              </Button>
              
              <Button
                onClick={handleClearCanvas}
                variant="destructive"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-3 w-3" />
                <span className="text-xs">Clear</span>
              </Button>
            </div>
          </header>

          {/* Canvas */}
          <main className="flex-1 w-full min-h-0">
            <Canvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={() => {}} // No longer needed
              onNodeDoubleClick={openModal}
              onCogClick={openModal}
              status={flowRunner.status}
            />
          </main>
        </div>

        {/* Modal */}
        <BlockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          node={activeNode}
          onSave={handleSaveModal}
        />
      </div>
    </SidebarProvider>
  );
};

export default FlowBuilder;
