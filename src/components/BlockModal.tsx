import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
// import { validateBlockConfig, getFieldErrors } from "../utils/validation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, FileText, Save, X, Trash2, TestTube } from "lucide-react";
import { blockTypes } from "../data/blockTypes";
import { motion } from "motion/react";

const formSchema = z.object({
  // Amazon Sales Report fields
  metric: z.string().optional(),
  timeframe: z.string().optional(),
  
  // AI Agent fields
  systemPrompt: z.string().optional(),
  
  // Gmail fields
  recipient: z.string().optional(),
  subject: z.string().optional(),
  customSubject: z.string().optional(),
  message: z.string().optional(),
  
  // Slack fields
  channel: z.string().optional(),
  customChannel: z.string().optional(),
  
  // Generic fields
  instructions: z.string().optional(),
  dateRange: z.string().optional(),
  dateGranularity: z.string().optional(),
  asinGranularity: z.string().optional(),
});

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: {
    id: string;
    data: {
      label: string;
      type: string;
      config?: Record<string, unknown>;
      errorMessage?: string;
      errorTimestamp?: string;
      errorDetails?: string;
      instructions?: string;
      dateRange?: string;
      dateGranularity?: string;
      asinGranularity?: string;
    };
  } | null;
  onSave: (id: string, data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}

type FormData = z.infer<typeof formSchema>;

export default function BlockModal({ isOpen, onClose, node, onSave, onDelete }: BlockModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Amazon Sales Report
      metric: "",
      timeframe: "",
      
      // AI Agent
      systemPrompt: "",
      
      // Gmail
      recipient: "",
      subject: "",
      customSubject: "",
      message: "",
      
      // Slack
      channel: "",
      customChannel: "",
      
      // Generic
      instructions: "",
      dateRange: "",
      dateGranularity: "",
      asinGranularity: "",
    },
  });

  // Update form when node changes
  useEffect(() => {
    if (node?.data) {
      form.reset({
        // Amazon Sales Report
        metric: (node.data.config?.metric as string) || "",
        timeframe: (node.data.config?.timeframe as string) || "",
        
        // AI Agent
        systemPrompt: (node.data.config?.systemPrompt as string) || "",
        
        // Gmail
        recipient: (node.data.config?.recipient as string) || "",
        subject: (node.data.config?.subject as string) || "",
        customSubject: (node.data.config?.customSubject as string) || "",
        message: (node.data.config?.message as string) || "",
        
        // Slack
        channel: (node.data.config?.channel as string) || "",
        customChannel: (node.data.config?.customChannel as string) || "",
        
        // Generic
        instructions: node.data.instructions || "",
        dateRange: node.data.dateRange || "",
        dateGranularity: node.data.dateGranularity || "",
        asinGranularity: node.data.asinGranularity || "",
      });
    }
  }, [node, form]);

  // Verificação de segurança
  if (!node || !node.data) return null;

  const handleSave = (data: FormData) => {
    onSave(node.id, data);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent direction="right" className="max-h-[100vh] w-[400px]">
        <DrawerHeader className="text-left p-6">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {(() => {
              const blockType = blockTypes[node.data.type];
              if (blockType?.icon) {
                // Check if it's an image path (string) or Lucide icon
                if (typeof blockType.icon === 'string') {
                  return (
                    <motion.div 
                      className="h-8 w-8 flex items-center justify-center rounded-md bg-white border border-gray-200"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img 
                        src={blockType.icon} 
                        alt={node.data.label}
                        className="h-5 w-5 object-contain"
                      />
                    </motion.div>
                  );
                } else {
                  // It's a Lucide icon
                  const IconComponent = blockType.icon;
                  return (
                    <motion.div 
                      className="h-8 w-8 flex items-center justify-center rounded-md bg-primary/10 text-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </motion.div>
                  );
                }
              }
              // Fallback to first letter
              return (
                <motion.div 
                  className="h-8 w-8 flex items-center justify-center rounded-md bg-primary/10 text-primary font-bold uppercase"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                >
                  {node.data.label?.[0] || "?"}
                </motion.div>
              );
            })()}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            >
              <DrawerTitle>{node.data.label || "New Step"}</DrawerTitle>
              <DrawerDescription>Configure your block parameters</DrawerDescription>
            </motion.div>
          </motion.div>
        </DrawerHeader>

            <div className="px-6 pb-4 flex-1 overflow-y-auto">
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="input">INPUT</TabsTrigger>
                  <TabsTrigger value="current">CURRENT</TabsTrigger>
                  <TabsTrigger value="output">OUTPUT</TabsTrigger>
                  <TabsTrigger value="logs">LOGS</TabsTrigger>
                </TabsList>

            <TabsContent value="input" className="mt-6">
              <div className="text-center text-muted-foreground py-16">
              <p>No input data yet</p>
              <p className="text-sm">Execute previous nodes</p>
            </div>
            </TabsContent>

            <TabsContent value="current" className="mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                  {/* Amazon Sales Report Configuration */}
                  {node.data.type === 'amazonSales' && (
                    <>
                      <FormField
                        control={form.control}
                        name="metric"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metric</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select metric" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Revenue">Revenue</SelectItem>
                                <SelectItem value="Units Sold">Units Sold</SelectItem>
                                <SelectItem value="Orders">Orders</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="timeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeframe</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timeframe" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                                <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                                <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* AI Agent Configuration */}
                  {node.data.type === 'aiAgent' && (
                    <FormField
                      control={form.control}
                      name="systemPrompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Prompt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter system prompt for the AI agent"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Gmail Configuration */}
                  {node.data.type === 'gmail' && (
                    <>
                      <FormField
                        control={form.control}
                        name="recipient"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter recipient email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select or enter subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Weekly Sales Report">Weekly Sales Report</SelectItem>
                                <SelectItem value="Monthly Analytics">Monthly Analytics</SelectItem>
                                <SelectItem value="Data Export Complete">Data Export Complete</SelectItem>
                                <SelectItem value="Custom">Custom (enter below)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch("subject") === "Custom" && (
                        <FormField
                          control={form.control}
                          name="customSubject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter custom subject" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message Body</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter email message"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Slack Configuration */}
                  {node.data.type === 'slack' && (
                    <>
                      <FormField
                        control={form.control}
                        name="channel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Channel</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select channel" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="#general">#general</SelectItem>
                                <SelectItem value="#sales">#sales</SelectItem>
                                <SelectItem value="#analytics">#analytics</SelectItem>
                                <SelectItem value="#reports">#reports</SelectItem>
                                <SelectItem value="#alerts">#alerts</SelectItem>
                                <SelectItem value="Custom">Custom (enter below)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch("channel") === "Custom" && (
                        <FormField
                          control={form.control}
                          name="customChannel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Channel</FormLabel>
                              <FormControl>
                                <Input placeholder="#custom-channel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter Slack message"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Generic Configuration */}
                  {!['amazonSales', 'aiAgent', 'gmail', 'slack'].includes(node.data.type) && (
                    <>
                      <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                              <Textarea
                  placeholder="Description for new step"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Range</FormLabel>
                            <FormControl>
                              <Input
                  placeholder="2024-01-01,2024-01-31"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-1">
                              Date range for the report.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </form>
              </Form>
            </TabsContent>

                <TabsContent value="output" className="mt-6">
                  <div className="text-center text-muted-foreground py-16">
                    <p>Execute this node to view data</p>
                  </div>
                </TabsContent>

                <TabsContent value="logs" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <h3 className="font-medium">Execution Logs</h3>
                    </div>
                    
                    {node.data.errorMessage ? (
                      <div className="space-y-3">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-800">Execution Failed</span>
                          </div>
                          <div className="text-sm text-red-700 space-y-1">
                            <p><strong>Error:</strong> {node.data.errorMessage}</p>
                            <p><strong>Timestamp:</strong> {node.data.errorTimestamp}</p>
                            <p><strong>Node ID:</strong> {node.id}</p>
                          </div>
                        </div>
                        
                        {node.data.errorDetails && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-sm mb-2">Error Details</h4>
                            <pre className="text-xs text-gray-700 bg-white p-3 rounded border overflow-auto max-h-40">
                              {node.data.errorDetails}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-16">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No execution logs yet</p>
                        <p className="text-sm">Run the flow to see execution details</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

        <DrawerFooter className="pt-6 px-6 border-t bg-muted/20">
          <div className="space-y-3">
            {/* Primary Actions */}
            <div className="flex gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  type="button"
                  onClick={() => {
                    toast.info('Test run started', {
                      description: `Testing ${node.data.label} configuration...`,
                    });
                    
                    // Simulate test run
                    setTimeout(() => {
                      toast.success('Test completed', {
                        description: `${node.data.label} test run completed successfully.`,
                      });
                    }, 1500);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm"
                  size="sm"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Step
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button 
                  onClick={form.handleSubmit(handleSave)} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </motion.div>
            </div>
            
            {/* Secondary Actions */}
            <div className="flex gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <DrawerClose asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 hover:bg-gray-50 text-gray-700"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </DrawerClose>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    if (node) {
                      onDelete(node.id);
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Block
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Helpful hint */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Use <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Delete</kbd> key to quickly remove selected blocks
            </p>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
