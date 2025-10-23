import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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

type FormData = z.infer<typeof formSchema>;

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  onSave: (id: string, data: any) => void;
}

export default function BlockModal({ isOpen, onClose, node, onSave }: BlockModalProps) {
  
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
        metric: node.data.config?.metric || "",
        timeframe: node.data.config?.timeframe || "",
        
        // AI Agent
        systemPrompt: node.data.config?.systemPrompt || "",
        
        // Gmail
        recipient: node.data.config?.recipient || "",
        subject: node.data.config?.subject || "",
        customSubject: node.data.config?.customSubject || "",
        message: node.data.config?.message || "",
        
        // Slack
        channel: node.data.config?.channel || "",
        customChannel: node.data.config?.customChannel || "",
        
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
    
    toast.success('Configuration saved', {
      description: `${node.data.label} configuration has been updated.`,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent direction="right" className="max-h-[100vh] w-[400px]">
        <DrawerHeader className="text-left p-6">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 flex items-center justify-center rounded-md bg-primary/10 text-primary font-bold uppercase">
              {node.data.label?.[0] || "?"}
            </div>
            <div>
              <DrawerTitle>{node.data.label || "New Step"}</DrawerTitle>
              <DrawerDescription>Configure your block parameters</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-6 pb-4 flex-1 overflow-y-auto">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="input">INPUT</TabsTrigger>
              <TabsTrigger value="current">CURRENT</TabsTrigger>
              <TabsTrigger value="output">OUTPUT</TabsTrigger>
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
          </Tabs>
        </div>

        <DrawerFooter className="pt-4 px-6">
          <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
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
                  className="flex-1"
                >
                  ▶ Test Step
                </Button>
            <Button onClick={form.handleSubmit(handleSave)} className="flex-1">
              Save Parameters
            </Button>
        </div>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full mt-2">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
