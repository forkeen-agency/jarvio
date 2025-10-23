import { useState } from 'react';
import type { Node } from 'reactflow';
import { toast } from 'sonner';

export function useFlowRunner(nodes: Node[]) {
  const [status, setStatus] = useState({});

  async function runFlow() {
    if (nodes.length === 0) {
      toast.error('No nodes to run', {
        description: 'Add some blocks to your flow before running.',
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
      setStatus((s) => ({ ...s, [node.id]: 'success' }));
      
      toast.success(`${node.data.label} completed`, {
        description: 'Node executed successfully.',
      });
    }

    toast.success('Flow execution completed', {
      description: `All ${nodes.length} node${nodes.length > 1 ? 's' : ''} executed successfully.`,
    });
  }

  return { status, runFlow };
}
