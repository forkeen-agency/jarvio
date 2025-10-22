import React from 'react';

interface ConfigPanelProps {
  selectedNode: any;
  onUpdateNode: (id: string, field: string, value: any) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedNode, onUpdateNode }) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-100 p-4 h-full">
        <h2 className="text-xl font-bold mb-4">Configuration</h2>
        <p className="text-gray-500">Select a block to configure its properties</p>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, field, value);
  };

  return (
    <div className="w-80 bg-gray-100 p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Block Name
          </label>
          <input
            type="text"
            value={selectedNode.data.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={selectedNode.data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Block Type
          </label>
          <input
            type="text"
            value={selectedNode.data.type || ''}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        {selectedNode.data.type === 'trigger' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger Event
            </label>
            <select
              value={selectedNode.data.config?.event || ''}
              onChange={(e) => handleChange('config', { ...selectedNode.data.config, event: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select event</option>
              <option value="webhook">Webhook</option>
              <option value="schedule">Schedule</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        )}

        {selectedNode.data.type === 'action' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type
            </label>
            <select
              value={selectedNode.data.config?.actionType || ''}
              onChange={(e) => handleChange('config', { ...selectedNode.data.config, actionType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select action</option>
              <option value="email">Send Email</option>
              <option value="api">API Call</option>
              <option value="database">Database</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPanel;
