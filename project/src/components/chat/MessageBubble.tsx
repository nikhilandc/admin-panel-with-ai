import React from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { Message, User } from '../../types';

interface MessageBubbleProps {
  message: Message;
  sender?: User;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  sender,
  isCurrentUser
}) => {
  // Format the message timestamp
  const formattedTime = format(new Date(message.timestamp), 'h:mm a');
  
  return (
    <div 
      className={clsx(
        'flex items-end group',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
      data-message-id={message.id}
    >
      {!isCurrentUser && sender && (
        <Avatar 
          src={sender.avatar}
          alt={sender.name}
          size="sm"
          className="mb-1 mr-2 flex-shrink-0"
        />
      )}
      
      <div className={clsx(
        'max-w-[75%] rounded-2xl px-4 py-2.5 relative group',
        isCurrentUser 
          ? 'bg-primary-600 text-white rounded-br-none' 
          : 'bg-neutral-200 text-neutral-900 rounded-bl-none'
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        <div className={clsx(
          'flex items-center text-xs mt-1',
          isCurrentUser ? 'text-primary-200 justify-end' : 'text-neutral-500'
        )}>
          {formattedTime}
          
          {isCurrentUser && (
            <span className="ml-1.5">
              {message.read ? (
                <CheckCheck size={14} className="text-primary-200" />
              ) : (
                <Check size={14} className="text-primary-200" />
              )}
            </span>
          )}
        </div>
        
        {/* Tooltip that appears on text selection - handled in parent component */}
      </div>
    </div>
  );
};

export default MessageBubble;