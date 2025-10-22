export interface BlockType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'trigger' | 'action' | 'condition' | 'utility';
  defaultConfig: any;
  inputs: string[];
  outputs: string[];
}

export const blockTypes: Record<string, BlockType> = {
  trigger: {
    id: 'trigger',
    name: 'Trigger',
    description: 'Starts the workflow execution',
    icon: '⚡',
    color: 'green',
    category: 'trigger',
    defaultConfig: {
      event: 'webhook',
      name: 'New Trigger',
      description: 'Workflow trigger point'
    },
    inputs: [],
    outputs: ['success']
  },
  
  action: {
    id: 'action',
    name: 'Action',
    description: 'Performs a specific action',
    icon: '🔧',
    color: 'blue',
    category: 'action',
    defaultConfig: {
      actionType: 'email',
      name: 'New Action',
      description: 'Action to be performed'
    },
    inputs: ['success'],
    outputs: ['success', 'error']
  },
  
  condition: {
    id: 'condition',
    name: 'Condition',
    description: 'Evaluates a condition and branches the flow',
    icon: '❓',
    color: 'yellow',
    category: 'condition',
    defaultConfig: {
      condition: 'equals',
      value1: '',
      value2: '',
      name: 'New Condition',
      description: 'Conditional logic'
    },
    inputs: ['success'],
    outputs: ['true', 'false']
  },
  
  delay: {
    id: 'delay',
    name: 'Delay',
    description: 'Pauses execution for a specified time',
    icon: '⏱️',
    color: 'purple',
    category: 'utility',
    defaultConfig: {
      duration: 1000,
      unit: 'milliseconds',
      name: 'New Delay',
      description: 'Wait before continuing'
    },
    inputs: ['success'],
    outputs: ['success']
  },
  
  webhook: {
    id: 'webhook',
    name: 'Webhook',
    description: 'Receives HTTP requests',
    icon: '🌐',
    color: 'green',
    category: 'trigger',
    defaultConfig: {
      method: 'POST',
      path: '/webhook',
      name: 'New Webhook',
      description: 'HTTP webhook endpoint'
    },
    inputs: [],
    outputs: ['success']
  },
  
  email: {
    id: 'email',
    name: 'Send Email',
    description: 'Sends an email message',
    icon: '📧',
    color: 'blue',
    category: 'action',
    defaultConfig: {
      to: '',
      subject: '',
      body: '',
      name: 'New Email',
      description: 'Send email action'
    },
    inputs: ['success'],
    outputs: ['success', 'error']
  },
  
  api: {
    id: 'api',
    name: 'API Call',
    description: 'Makes an HTTP API request',
    icon: '🔗',
    color: 'blue',
    category: 'action',
    defaultConfig: {
      method: 'GET',
      url: '',
      headers: {},
      body: '',
      name: 'New API Call',
      description: 'HTTP API request'
    },
    inputs: ['success'],
    outputs: ['success', 'error']
  },
  
  database: {
    id: 'database',
    name: 'Database',
    description: 'Performs database operations',
    icon: '🗄️',
    color: 'blue',
    category: 'action',
    defaultConfig: {
      operation: 'select',
      table: '',
      query: '',
      name: 'New Database',
      description: 'Database operation'
    },
    inputs: ['success'],
    outputs: ['success', 'error']
  }
};

export const getBlockTypeById = (id: string): BlockType | undefined => {
  return blockTypes[id];
};

export const getBlockTypesByCategory = (category: string): BlockType[] => {
  return Object.values(blockTypes).filter(block => block.category === category);
};

export const getAllBlockTypes = (): BlockType[] => {
  return Object.values(blockTypes);
};
