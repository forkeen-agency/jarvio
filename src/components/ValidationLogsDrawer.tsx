import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Info } from 'lucide-react';
import type { Node } from 'reactflow';
import { getAllValidationErrors } from '../utils/validation';

interface ValidationLogsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  validationErrors: Node[];
  executionErrors: Record<string, string>;
}

export default function ValidationLogsDrawer({ 
  isOpen, 
  onClose, 
  nodes, 
  validationErrors, 
  executionErrors 
}: ValidationLogsDrawerProps) {
  const getValidationErrorDetails = (node: Node) => {
    return getAllValidationErrors(node.data.type, node.data.config || {});
  };

  const hasErrors = (node: Node) => {
    const hasValidationErrors = validationErrors.some(n => n.id === node.id);
    const hasExecutionErrors = executionErrors[node.id] === 'error';
    return hasValidationErrors || hasExecutionErrors;
  };

  const hasValidationErrors = (node: Node) => {
    return validationErrors.some(n => n.id === node.id);
  };

  const hasExecutionErrors = (node: Node) => {
    return executionErrors[node.id] === 'error';
  };

  // Separate nodes with errors from valid nodes
  const nodesWithErrors = nodes.filter(node => hasErrors(node));
  const validNodes = nodes.filter(node => !hasErrors(node));

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Flow Status</span>
          </SheetTitle>
          <SheetDescription>
            Check the status of all nodes in your flow.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6">
            {/* Errors Section */}
            {nodesWithErrors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <h2 className="font-medium text-red-600">Issues ({nodesWithErrors.length})</h2>
                </div>
                
                {nodesWithErrors.map((node) => {
                  const validationErrorDetails = getValidationErrorDetails(node);
                  const hasConfigErrors = hasValidationErrors(node);
                  const hasExecErrors = hasExecutionErrors(node);
                  
                  return (
                    <div key={node.id} className="border border-red-200 rounded-lg p-3 space-y-2 bg-red-50 dark:bg-red-900/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-red-800 dark:text-red-200">{node.data.label}</h3>
                          <p className="text-sm text-red-600 dark:text-red-400">{node.data.type}</p>
                        </div>
                        <div className="flex space-x-1">
                          {hasConfigErrors && (
                            <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">Config</Badge>
                          )}
                          {hasExecErrors && (
                            <Badge variant="destructive" className="text-xs">Failed</Badge>
                          )}
                        </div>
                      </div>
                      
                      {hasConfigErrors && (
                        <div className="space-y-1">
                          {Object.entries(validationErrorDetails).map(([field, errors]) => (
                            <div key={field} className="text-sm">
                              <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                {field === 'general' ? 'General' : field}:
                              </p>
                              <ul className="space-y-0.5 text-yellow-700 dark:text-yellow-300">
                                {errors.map((error, errorIndex) => (
                                  <li key={errorIndex} className="text-xs">• {error}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {hasExecErrors && (
                        <div className="text-sm text-red-700 dark:text-red-300">
                          <p>{node.data.errorMessage || 'Execution failed'}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Valid Nodes Section */}
            {validNodes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <h2 className="font-medium text-green-600">Working ({validNodes.length})</h2>
                </div>
                
                <div className="grid gap-2">
                  {validNodes.map((node) => (
                    <div key={node.id} className="border border-green-200 rounded-lg p-3 bg-green-50 dark:bg-green-900/10">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <div>
                          <h3 className="font-medium text-green-800 dark:text-green-200 text-sm">{node.data.label}</h3>
                          <p className="text-xs text-green-600 dark:text-green-400">{node.data.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* No nodes message */}
            {nodes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">No nodes in your flow yet.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}