import { CheckCircle, XCircle } from 'lucide-react';
import { validateBlockConfig } from '../utils/validation';

interface ValidationIndicatorProps {
  blockType: string;
  config: any;
  className?: string;
}

export default function ValidationIndicator({ blockType, config, className = '' }: ValidationIndicatorProps) {
  const validationResult = validateBlockConfig(blockType, config || {});
  
  if (validationResult.isValid) {
    return (
      <div className={`flex items-center space-x-1 text-green-600 ${className}`}>
        <CheckCircle className="h-4 w-4" />
        <span className="text-xs">Valid</span>
      </div>
    );
  }
  
  const errorCount = Object.keys(validationResult.errors).length;
  
  return (
    <div className={`flex items-center space-x-1 text-red-600 ${className}`}>
      <XCircle className="h-4 w-4" />
      <span className="text-xs">{errorCount} error{errorCount > 1 ? 's' : ''}</span>
    </div>
  );
}
