import React from 'react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { Conversation } from '../../types';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ 
  conversation, 
  isSelected,
  onClick 
}) => {
  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find(p => p.id !== 'current-user') || conversation.participants[0];
  
  // Get the last message
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  
  // Format the timestamp
  const formattedTime = lastMessage 
    ? formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })
    : '';
  
  // Determine badge variant based on priority
  const priorityVariant = conversation.priority === 'high' 
    ? 'error' 
    : conversation.priority === 'medium' 
      ? 'warning' 
      : 'default';

  return (
    <div 
      className={clsx(
        'p-3 hover:bg-neutral-50 cursor-pointer transition-colors duration-200',
        isSelected ? 'bg-primary-50' : '',
        conversation.unreadCount > 0 ? 'bg-blue-50' : ''
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <Avatar 
          src={otherParticipant.avatar} 
          alt={otherParticipant.name} 
          status={isSelected ? 'online' : undefined}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={clsx(
              'text-sm font-medium truncate',
              conversation.unreadCount > 0 ? 'text-neutral-900' : 'text-neutral-700'
            )}>
              {otherParticipant.name}
            </h3>
            <span className="text-xs text-neutral-500">{formattedTime}</span>
          </div>
          
          {conversation.subject && (
            <p className={clsx(
              'text-xs truncate mt-0.5',
              conversation.unreadCount > 0 ? 'font-medium text-neutral-800' : 'text-neutral-600'
            )}>
              {conversation.subject}
            </p>
          )}
          
          <p className={clsx(
            'text-xs truncate mt-1',
            conversation.unreadCount > 0 ? 'font-medium text-neutral-800' : 'text-neutral-500'
          )}>
            {lastMessage?.content}
          </p>
          
          <div className="mt-2 flex items-center space-x-2">
            {conversation.priority && (
              <Badge variant={priorityVariant} size="sm">
                {conversation.priority}
              </Badge>
            )}
            
            {conversation.tags && conversation.tags.map((tag) => (
              <Badge key={tag} size="sm" variant="default">
                {tag}
              </Badge>
            ))}
            
            {conversation.unreadCount > 0 && (
              <Badge variant="primary" className="ml-auto">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;