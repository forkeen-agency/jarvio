import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import type { Node, Connection } from 'reactflow';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Layout, Trash2, RotateCcw, Save } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { motion } from 'motion/react';
import BlockLibrarySidebar from '../components/BlockLibrarySidebar';
import Canvas from '../components/Canvas';
import BlockModal from '../components/BlockModal';
import ValidationLogsDrawer from '../components/ValidationLogsDrawer';
import { useFlowRunner } from '../hooks/useFlowRunner';
import { blockTypes } from '../data/blockTypes';
import { getLayoutedElements } from '../utils/autoLayout';
import { validateBlockConfig, hasValidationErrors, getAllValidationErrors } from '../utils/validation';

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // selectedNode is no longer needed since we use Drawer modal
  // const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nextId, setNextId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isValidationLogsOpen, setIsValidationLogsOpen] = useState(false);

  const flowRunner = useFlowRunner(nodes);
  
  // Custom run function that tracks running state
  const handleRunFlow = async () => {
    setIsRunning(true);
    try {
      await flowRunner.runFlow();
    } finally {
      setIsRunning(false);
    }
  };
  
  // Add error details to nodes when they fail
  const nodesWithErrorDetails = nodes.map(node => {
    if ((flowRunner.status as Record<string, string>)[node.id] === 'error') {
      return {
        ...node,
        data: {
          ...node.data,
          errorMessage: `Execution failed for ${node.data.label}`,
          errorTimestamp: new Date().toLocaleString(),
          errorDetails: `Error Code: EXEC_001\nError Type: Runtime Exception\nNode: ${node.data.label}\nTimestamp: ${new Date().toISOString()}\nStack Trace:\n  at executeNode()\n  at processFlow()\n  at runFlow()`
        }
      };
    }
    return node;
  });
  
  // Calculate validation status
  const nodesWithConfigErrors = nodes.filter(node => hasValidationErrors(node.data.type, node.data.config || {}));
  const nodesWithExecutionErrors = nodes.filter(node => (flowRunner.status as Record<string, string>)[node.id] === 'error');
  const nodesWithErrors = [...new Set([...nodesWithConfigErrors, ...nodesWithExecutionErrors])]; // Remove duplicates
  const validationStatus = nodesWithErrors.length > 0 ? 'error' : 'valid';
  
  // Get detailed validation errors for tooltips
  const getValidationErrorSummary = () => {
    if (nodesWithErrors.length === 0) return '';
    
    const errorSummary = nodesWithErrors.map(node => {
      const hasConfigErrors = hasValidationErrors(node.data.type, node.data.config || {});
      const hasExecutionErrors = (flowRunner.status as Record<string, string>)[node.id] === 'error';
      
      if (hasConfigErrors && hasExecutionErrors) {
        const configErrors = getAllValidationErrors(node.data.type, node.data.config || {});
        const configErrorCount = Object.values(configErrors).flat().length;
        return `${node.data.label} (${configErrorCount} config error${configErrorCount > 1 ? 's' : ''}, execution failed)`;
      } else if (hasConfigErrors) {
        const configErrors = getAllValidationErrors(node.data.type, node.data.config || {});
        const configErrorCount = Object.values(configErrors).flat().length;
        return `${node.data.label} (${configErrorCount} config error${configErrorCount > 1 ? 's' : ''})`;
      } else if (hasExecutionErrors) {
        return `${node.data.label} (execution failed)`;
      }
      return node.data.label;
    }).join(', ');
    
    return `Errors found: ${errorSummary}`;
  };
  
  // Calculate progress for running flow
  const completedNodes = Object.values(flowRunner.status).filter(status => status === 'success').length;
  const totalNodes = nodes.length;
  const progress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

  const loadTemplateFlow = useCallback(() => {
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
      }, [setNodes, setEdges]);

  // Persistência local - salvar automaticamente
  useEffect(() => {
    localStorage.setItem("flowState", JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  const handleDeleteNode = useCallback((id: string) => {
    const nodeToDelete = nodes.find(n => n.id === id);
    if (!nodeToDelete) return;

    setNodes((nds) => {
      const updatedNodes = nds.filter(node => node.id !== id);
      
      // Save to localStorage for session persistence
      localStorage.setItem("flowState", JSON.stringify({ 
        nodes: updatedNodes, 
        edges 
      }));
      
      return updatedNodes;
    });

    // Remove any edges connected to this node
    setEdges((eds) => {
      const updatedEdges = eds.filter(edge => edge.source !== id && edge.target !== id);
      
      // Save to localStorage for session persistence
      localStorage.setItem("flowState", JSON.stringify({ 
        nodes: nodes.filter(n => n.id !== id), 
        edges: updatedEdges 
      }));
      
      return updatedEdges;
    });

    // Close modal if the deleted node was active
    if (activeNode && activeNode.id === id) {
      setIsModalOpen(false);
      setActiveNode(null);
    }

    toast.success('Block deleted', {
      description: `${nodeToDelete.data.label} has been removed from your flow.`,
    });
  }, [nodes, edges, activeNode, setNodes, setEdges]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Delete key for selected nodes
      if (event.key === 'Delete' && activeNode) {
        event.preventDefault();
        handleDeleteNode(activeNode.id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeNode, handleDeleteNode]);

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
  }, [setNodes, setEdges, loadTemplateFlow]);

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

  const handleNodeSelect = useCallback((_event: React.MouseEvent, node: Node) => {
    setActiveNode(node);
  }, []);

  const handleSaveModal = (id: string, data: Record<string, unknown>) => {
    // Validate the configuration before saving
    const node = nodes.find(n => n.id === id);
    if (node) {
      const validationResult = validateBlockConfig(node.data.type, data);
      
      if (!validationResult.isValid) {
        toast.error('Validation failed', {
          description: 'Please fix the configuration errors before saving.',
        });
        return;
      }
    }
    
    setNodes((nds) => {
      const updatedNodes = nds.map((node) =>
        node.id === id ? { 
          ...node, 
          data: { 
            ...node.data, 
            config: { 
              ...node.data.config, 
              ...data 
            } 
          } 
        } : node
      );
      
      // Update activeNode if it's the same node being saved
      if (activeNode && activeNode.id === id) {
        const updatedActiveNode = updatedNodes.find(node => node.id === id);
        if (updatedActiveNode) {
          setActiveNode(updatedActiveNode);
        }
      }
      
      // Save to localStorage for session persistence
      localStorage.setItem("flowState", JSON.stringify({ 
        nodes: updatedNodes, 
        edges 
      }));
      
      return updatedNodes;
    });
    
    // Show success toast
    toast.success('Configuration saved', {
      description: `Configuration for ${node?.data.label || 'node'} has been saved.`,
    });
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
                    
                    <TooltipProvider>
                      {validationStatus === 'error' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="destructive" 
                              className="text-xs cursor-pointer hover:bg-destructive/80"
                              onClick={() => setIsValidationLogsOpen(true)}
                            >
                              {nodesWithErrors.length} error{nodesWithErrors.length > 1 ? 's' : ''}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{getValidationErrorSummary()}</p>
                            <p className="text-xs text-muted-foreground mt-1">Click to view details</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {validationStatus === 'valid' && nodes.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="secondary" 
                              className="text-xs text-green-600 cursor-pointer hover:bg-secondary/80"
                              onClick={() => setIsValidationLogsOpen(true)}
                            >
                              All valid
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>All nodes are properly configured</p>
                            <p className="text-xs text-muted-foreground mt-1">Click to view validation logs</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
                    
                    {/* Progress indicator */}
                    {isRunning && totalNodes > 0 && (
                      <motion.div
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {completedNodes}/{totalNodes}
                        </span>
                      </motion.div>
                    )}
                  </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Run Flow Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleRunFlow}
                  disabled={nodes.length === 0 || isRunning}
                  size="sm"
                  className="flex items-center space-x-2 relative overflow-hidden bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm"
                >
                  <motion.div
                    className="flex items-center space-x-2"
                    animate={isRunning ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{
                      duration: 0.8,
                      repeat: isRunning ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      animate={isRunning ? {
                        rotate: 360,
                      } : {}}
                      transition={{
                        duration: 1,
                        repeat: isRunning ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </motion.div>
                    <span className="text-sm font-medium">
                      {isRunning ? 'Running...' : 'Run Flow'}
                    </span>
                  </motion.div>
                  
                  {/* Pulsing background for running state */}
                  {isRunning && (
                    <motion.div
                      className="absolute inset-0 bg-green-500/20"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </Button>
              </motion.div>
              
              {/* Template Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={loadTemplateFlow}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-blue-300 hover:bg-blue-50 text-blue-700"
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm font-medium">Load Template</span>
                </Button>
              </motion.div>
              
              {/* Auto Arrange Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleAutoArrange}
                  disabled={nodes.length === 0}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-purple-300 hover:bg-purple-50 text-purple-700 disabled:opacity-50"
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Layout className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm font-medium">Auto Arrange</span>
                </Button>
              </motion.div>
              
              {/* Save Flow Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => {
                    toast.success('Flow saved', {
                      description: 'Your flow has been saved to localStorage.',
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm font-medium">Save</span>
                </Button>
              </motion.div>
              
              {/* Clear Canvas Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleClearCanvas}
                  variant="destructive"
                  size="sm"
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm"
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm font-medium">Clear All</span>
                </Button>
              </motion.div>
            </div>
          </header>

          {/* Canvas */}
              <main className="flex-1 w-full min-h-0">
                <Canvas
                  nodes={nodesWithErrorDetails}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={handleNodeSelect}
                  onNodeDoubleClick={openModal}
                  onCogClick={openModal}
                  status={flowRunner.status}
                  activeNode={activeNode}
                />
              </main>
        </div>

        {/* Modal */}
        <BlockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          node={activeNode}
          onSave={handleSaveModal}
          onDelete={handleDeleteNode}
        />
        
        {/* Validation Logs Drawer */}
        <ValidationLogsDrawer
          isOpen={isValidationLogsOpen}
          onClose={() => setIsValidationLogsOpen(false)}
          nodes={nodes}
          validationErrors={nodesWithConfigErrors}
          executionErrors={flowRunner.status as Record<string, string>}
        />
      </div>
    </SidebarProvider>
  );
};

export default FlowBuilder;
