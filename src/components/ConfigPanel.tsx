import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ConfigPanelProps {
  selectedNode: any;
  onUpdateNode: (id: string, field: string, value: any) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedNode, onUpdateNode }) => {
  if (!selectedNode) {
    return (
      <div className="w-80 border-r bg-background p-4 h-full">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Select a block to configure its properties</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, field, value);
  };

  return (
    <div className="w-80 border-r bg-background p-4 h-full">
      <ScrollArea className="h-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Configuration
              <Badge variant="secondary">{selectedNode.data.type}</Badge>
            </CardTitle>
            <CardDescription>Configure your block properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="block-name">Block Name</Label>
              <Input
                id="block-name"
                value={selectedNode.data.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter block name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="block-description">Description</Label>
              <Textarea
                id="block-description"
                value={selectedNode.data.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter block description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-type">Block Type</Label>
              <Input
                id="block-type"
                value={selectedNode.data.type || ''}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Amazon Sales Report Configuration */}
            {selectedNode.data.type === 'amazonSales' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="metric">Metric</Label>
                  <Select
                    value={selectedNode.data.config?.metric || ''}
                    onValueChange={(value) => handleChange('config', { ...selectedNode.data.config, metric: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Revenue">Revenue</SelectItem>
                      <SelectItem value="Units Sold">Units Sold</SelectItem>
                      <SelectItem value="Orders">Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select
                    value={selectedNode.data.config?.timeframe || ''}
                    onValueChange={(value) => handleChange('config', { ...selectedNode.data.config, timeframe: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                      <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                      <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* AI Agent Configuration */}
            {selectedNode.data.type === 'aiAgent' && (
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={selectedNode.data.config?.systemPrompt || ''}
                  onChange={(e) => handleChange('config', { ...selectedNode.data.config, systemPrompt: e.target.value })}
                  placeholder="Enter system prompt for the AI agent"
                  rows={4}
                />
              </div>
            )}

            {/* Gmail Configuration */}
            {selectedNode.data.type === 'gmail' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Email</Label>
                  <Input
                    id="recipient"
                    type="email"
                    value={selectedNode.data.config?.recipient || ''}
                    onChange={(e) => handleChange('config', { ...selectedNode.data.config, recipient: e.target.value })}
                    placeholder="Enter recipient email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={selectedNode.data.config?.subject || ''}
                    onChange={(e) => handleChange('config', { ...selectedNode.data.config, subject: e.target.value })}
                    placeholder="Enter email subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message Body</Label>
                  <Textarea
                    id="message"
                    value={selectedNode.data.config?.message || ''}
                    onChange={(e) => handleChange('config', { ...selectedNode.data.config, message: e.target.value })}
                    placeholder="Enter email message"
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Slack Configuration */}
            {selectedNode.data.type === 'slack' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="channel">Channel</Label>
                  <Input
                    id="channel"
                    value={selectedNode.data.config?.channel || ''}
                    onChange={(e) => handleChange('config', { ...selectedNode.data.config, channel: e.target.value })}
                    placeholder="#general"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slack-message">Message</Label>
                  <Textarea
                    id="slack-message"
                    value={selectedNode.data.config?.message || ''}
                    onChange={(e) => handleChange('config', { ...selectedNode.data.config, message: e.target.value })}
                    placeholder="Enter Slack message"
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Original configurations */}
            {selectedNode.data.type === 'trigger' && (
              <div className="space-y-2">
                <Label htmlFor="trigger-event">Trigger Event</Label>
                <Select
                  value={selectedNode.data.config?.event || ''}
                  onValueChange={(value) => handleChange('config', { ...selectedNode.data.config, event: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedNode.data.type === 'action' && (
              <div className="space-y-2">
                <Label htmlFor="action-type">Action Type</Label>
                <Select
                  value={selectedNode.data.config?.actionType || ''}
                  onValueChange={(value) => handleChange('config', { ...selectedNode.data.config, actionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Send Email</SelectItem>
                    <SelectItem value="api">API Call</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default ConfigPanel;
