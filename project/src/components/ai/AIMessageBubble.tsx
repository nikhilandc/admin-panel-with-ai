import React, { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Bot, Copy, Check, Plus } from 'lucide-react';
import { AIMessage } from '../../types';
import Button from '../ui/Button';

interface AIMessageBubbleProps {
  message: AIMessage;
  onAddToComposer: (content: string) => void;
}

const AIMessageBubble: React.FC<AIMessageBubbleProps> = ({ 
  message, 
  onAddToComposer
}) => {
  const [copied, setCopied] = useState(false);
  
  const formattedTime = format(new Date(message.timestamp), 'h:mm a');
  const isQuestion = message.type === 'question';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleAddToComposer = () => {
    onAddToComposer(message.content);
  };
  
  return (
    <div className={clsx(
      'group',
      isQuestion ? 'flex justify-end' : ''
    )}>
      <div className={clsx(
        'max-w-[90%] rounded-2xl px-4 py-2.5 relative',
        isQuestion 
          ? 'bg-[#f3f3f3] text-neutral-900 ml-auto rounded-br-none' 
          : 'bg-white border border-neutral-200 rounded-tl-none'
      )}>
        {!isQuestion && (
          <div className="flex items-center mb-2">
            <div className="h-6 w-6 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[#1a1a1a] mr-2">
              <Bot size={14} />
            </div>
            <span className="text-xs font-medium text-[#1a1a1a]">Fin AI</span>
          </div>
        )}
        
        <div className="text-sm whitespace-pre-wrap">
          {message.content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        
        <div className={clsx(
          'flex items-center text-xs mt-1.5',
          isQuestion ? 'justify-end text-neutral-500' : 'text-neutral-500'
        )}>
          {formattedTime}
        </div>
        
        {!isQuestion && (
          <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              icon={copied ? <Check size={14} /> : <Copy size={14} />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleAddToComposer}
              className="bg-[#1a1a1a] hover:bg-[#333333]"
            >
              Add to Composer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMessageBubble;