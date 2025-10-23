import type { LucideIcon } from 'lucide-react';
import { 
  Bot, 
  Zap, 
  Settings, 
  HelpCircle, 
  Clock 
} from 'lucide-react';

export interface BlockType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon | string; // Can be either Lucide icon or image path
  color: string;
  category: 'trigger' | 'action' | 'condition' | 'utility';
  defaultConfig: any;
  inputs: string[];
  outputs: string[];
}

export const blockTypes: Record<string, BlockType> = {
  // Template blocks for the initial flow
  amazonSales: {
    id: 'amazonSales',
    name: 'Amazon Sales Report',
    description: 'Pull sales data from Amazon',
    icon: '/amazon.png',
    color: 'orange',
    category: 'action',
    defaultConfig: {
      metric: 'Revenue',
      timeframe: 'Last 30 days',
      name: 'Amazon Sales Report',
      description: 'Pull sales data from Amazon'
    },
    inputs: ['success'],
    outputs: ['success', 'error']
  },
  
  aiAgent: {
    id: 'aiAgent',
    name: 'AI Agent',
    description: 'Turn data into insights and recommendations',
    icon: Bot,
    color: 'purple',
    category: 'action',
    defaultConfig: {
      systemPrompt: 'You are a helpful business analyst. Analyze the provided data and provide clear insights and actionable recommendations.',
      name: 'AI Agent',
      description: 'AI-powered data analysis'
    },
    inputs: ['success'],
    outputs: ['success', 'error']
  },
  
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send an email via Gmail',
    icon: '/gmail.png',
    color: 'red',
    category: 'action',
    defaultConfig: {
      recipient: '',
      subject: '',
      message: '',
      name: 'Gmail',
      description: 'Send email via Gmail'
    },
    inputs: ['success'],
    outputs: ['success', 'error']
  },
  
  slack: {
    id: 'slack',
    name: 'Slack',
    description: 'Send a message to Slack',
    icon: '/slack.png',
    color: 'purple',
    category: 'action',
    defaultConfig: {
      channel: '#general',
      message: '',
      name: 'Slack',
      description: 'Send message to Slack'
    },
    inputs: ['success'],
    outputs: ['success', 'error']
  },
  
  // Original blocks (kept for compatibility)
  trigger: {
    id: 'trigger',
    name: 'Trigger',
    description: 'Starts the workflow execution',
    icon: Zap,
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
    icon: Settings,
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
    icon: HelpCircle,
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
    icon: Clock,
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
