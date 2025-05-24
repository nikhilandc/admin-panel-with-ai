import React from 'react';
import { MoreHorizontal, Phone, Video, User, Star } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { Conversation } from '../../types';

interface ChatHeaderProps {
  conversation: Conversation;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find(p => p.id !== 'current-user') || conversation.participants[0];
  
  return (
    <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <Avatar 
          src={otherParticipant.avatar} 
          alt={otherParticipant.name} 
          status="online" 
          className="mr-3"
        />
        
        <div>
          <div className="flex items-center">
            <h2 className="text-base font-medium text-neutral-900">{otherParticipant.name}</h2>
            <button className="ml-2 text-neutral-400 hover:text-neutral-600">
              <Star size={14} />
            </button>
          </div>
          
          <div className="flex items-center mt-0.5">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-1.5"></span>
              <span className="text-xs text-neutral-500">Online</span>
            </span>
            
            {conversation.subject && (
              <>
                <span className="mx-1.5 text-neutral-300">•</span>
                <span className="text-xs text-neutral-500">{conversation.subject}</span>
              </>
            )}
            
            {conversation.status && (
              <>
                <span className="mx-1.5 text-neutral-300">•</span>
                <Badge 
                  variant={
                    conversation.status === 'open' ? 'success' : 
                    conversation.status === 'pending' ? 'warning' : 'default'
                  }
                  size="sm"
                >
                  {conversation.status}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-md hover:bg-neutral-100 text-neutral-600">
          <Phone size={18} />
        </button>
        <button className="p-2 rounded-md hover:bg-neutral-100 text-neutral-600">
          <Video size={18} />
        </button>
        <button className="p-2 rounded-md hover:bg-neutral-100 text-neutral-600">
          <User size={18} />
        </button>
        <button className="p-2 rounded-md hover:bg-neutral-100 text-neutral-600">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;