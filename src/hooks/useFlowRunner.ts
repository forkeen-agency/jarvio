import { useState } from 'react';

export function useFlowRunner(nodes) {
  const [status, setStatus] = useState({});

  async function runFlow() {
    for (const node of nodes) {
      setStatus((s) => ({ ...s, [node.id]: 'running' }));
      await new Promise((r) => setTimeout(r, 800));
      setStatus((s) => ({ ...s, [node.id]: 'success' }));
    }
  }

  return { status, runFlow };
}
