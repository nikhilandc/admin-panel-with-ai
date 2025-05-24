import React, { useState } from 'react';
import { Search, Inbox, Settings, Filter, X } from 'lucide-react';
import { useAppStore } from '../../store';
import ConversationItem from './ConversationItem';
import Avatar from '../ui/Avatar';

interface InboxSectionProps {
  onClose?: () => void;
}

const InboxSection: React.FC<InboxSectionProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const conversations = useAppStore((state) => state.conversations);
  const currentUser = useAppStore((state) => state.currentUser);
  const selectedConversationId = useAppStore((state) => state.selectedConversationId);
  const setSelectedConversation = useAppStore((state) => state.setSelectedConversation);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search in participant names
    const participantMatch = conversation.participants.some(
      (participant) => participant.name.toLowerCase().includes(searchLower)
    );
    
    // Search in messages
    const messageMatch = conversation.messages.some(
      (message) => message.content.toLowerCase().includes(searchLower)
    );
    
    // Search in subject
    const subjectMatch = conversation.subject?.toLowerCase().includes(searchLower);
    
    return participantMatch || messageMatch || subjectMatch;
  });

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    // Close inbox on mobile after selection
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Your Inbox</h1>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600">
            <Settings size={18} />
          </button>
          {onClose && (
            <button 
              className="lg:hidden p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* Search */}
      <div className="p-3 border-b border-neutral-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-3 py-2 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
        <div className="flex items-center space-x-1.5">
          <button className="px-2.5 py-1 text-xs rounded-md bg-[#1a1a1a] text-white flex items-center">
            <Inbox size={14} className="mr-1.5" />
            All
          </button>
          <button className="px-2.5 py-1 text-xs rounded-md text-neutral-600 hover:bg-neutral-200 flex items-center">
            Unread
          </button>
        </div>
        <button className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-600">
          <Filter size={14} />
        </button>
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-neutral-100 p-3 rounded-full mb-3">
              <Inbox size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-sm font-medium text-neutral-700">No conversations found</h3>
            <p className="text-xs text-neutral-500 mt-1">
              {searchTerm ? 'Try a different search term' : 'Your inbox is empty'}
            </p>
          </div>
        )}
      </div>
      
      {/* User Info */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center">
        <Avatar 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          size="sm" 
          status="online" 
          className="mr-3"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">{currentUser.name}</p>
          <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
        </div>
        <button className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-600 ml-2">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default InboxSection;