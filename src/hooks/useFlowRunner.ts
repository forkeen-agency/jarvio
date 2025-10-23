import { useState } from 'react';
import type { Node } from 'reactflow';
import { toast } from 'sonner';
import { hasValidationErrors } from '../utils/validation';

export function useFlowRunner(nodes: Node[]) {
  const [status, setStatus] = useState({});

  async function runFlow() {
    if (nodes.length === 0) {
      toast.error('No nodes to run', {
        description: 'Add some blocks to your flow before running.',
      });
      return;
    }

    // Check for validation errors before running
    const nodesWithErrors = nodes.filter(node => hasValidationErrors(node.data.type, node.data.config || {}));
    if (nodesWithErrors.length > 0) {
      toast.error('Validation errors found', {
        description: `${nodesWithErrors.length} node${nodesWithErrors.length > 1 ? 's' : ''} have configuration errors. Please fix them before running.`,
      });
      return;
    }

    toast.info('Starting flow execution', {
      description: `Running ${nodes.length} node${nodes.length > 1 ? 's' : ''}...`,
    });

    for (const node of nodes) {
      setStatus((s) => ({ ...s, [node.id]: 'running' }));
      toast.info(`Running ${node.data.label}`, {
        description: 'Processing node...',
      });
      
      await new Promise((r) => setTimeout(r, 800));
      
      // Simulate occasional failures for demonstration
      const shouldFail = Math.random() < 0.5; // 50% chance of failure for testing
      
      if (shouldFail) {
        setStatus((s) => ({ ...s, [node.id]: 'error' }));
        toast.error(`${node.data.label} failed`, {
          description: 'Node execution failed. Check configuration.',
        });
        break; // Stop execution on error
      } else {
        setStatus((s) => ({ ...s, [node.id]: 'success' }));
        toast.success(`${node.data.label} completed`, {
          description: 'Node executed successfully.',
        });
      }
    }

    // Check if all nodes completed successfully
    const finalStatus = Object.values(status);
    const hasErrors = finalStatus.includes('error');
    
    if (!hasErrors) {
      toast.success('Flow execution completed', {
        description: `All ${nodes.length} node${nodes.length > 1 ? 's' : ''} executed successfully.`,
      });
    }
  }

  return { status, runFlow };
}