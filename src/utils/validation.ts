import * as z from 'zod';

// Base validation schemas for each block type
export const amazonSalesValidation = z.object({
  metric: z.string().min(1, 'Metric is required'),
  timeframe: z.string().min(1, 'Timeframe is required'),
});

export const aiAgentValidation = z.object({
  systemPrompt: z.string().min(10, 'System prompt must be at least 10 characters'),
});

export const gmailValidation = z.object({
  recipient: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export const slackValidation = z.object({
  channel: z.string().min(1, 'Channel is required'),
  message: z.string().min(1, 'Message is required'),
});

export const triggerValidation = z.object({
  event: z.string().min(1, 'Event type is required'),
});

export const actionValidation = z.object({
  actionType: z.string().min(1, 'Action type is required'),
});

export const conditionValidation = z.object({
  condition: z.string().min(1, 'Condition is required'),
  value1: z.string().min(1, 'First value is required'),
  value2: z.string().min(1, 'Second value is required'),
});

export const delayValidation = z.object({
  duration: z.number().min(1, 'Duration must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
});

// Validation schema mapping
export const blockValidationSchemas = {
  amazonSales: amazonSalesValidation,
  aiAgent: aiAgentValidation,
  gmail: gmailValidation,
  slack: slackValidation,
  trigger: triggerValidation,
  action: actionValidation,
  condition: conditionValidation,
  delay: delayValidation,
};

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Validate a block's configuration
export function validateBlockConfig(blockType: string, config: any): ValidationResult {
  const schema = blockValidationSchemas[blockType as keyof typeof blockValidationSchemas];
  
  if (!schema) {
    return {
      isValid: true,
      errors: {},
    };
  }

  try {
    schema.parse(config);
    return {
      isValid: true,
      errors: {},
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return {
        isValid: false,
        errors,
      };
    }
    return {
      isValid: false,
      errors: { general: ['Validation failed'] },
    };
  }
}

// Get validation errors for a specific field
export function getFieldErrors(blockType: string, config: any, fieldName: string): string[] {
  const result = validateBlockConfig(blockType, config);
  return result.errors[fieldName] || [];
}

// Check if a block has any validation errors
export function hasValidationErrors(blockType: string, config: any): boolean {
  const result = validateBlockConfig(blockType, config);
  return !result.isValid;
}

// Get all validation errors for a block
export function getAllValidationErrors(blockType: string, config: any): Record<string, string[]> {
  const result = validateBlockConfig(blockType, config);
  return result.errors;
}
