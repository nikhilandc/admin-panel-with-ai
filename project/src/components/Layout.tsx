import React, { useState } from 'react';
import InboxSection from './inbox/InboxSection';
import ChatSection from './chat/ChatSection';
import FinAIChatbot from './ai/FinAIChatbot';
import { useAppStore } from '../store';
import { Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const [showInbox, setShowInbox] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const selectedConversationId = useAppStore((state) => state.selectedConversationId);
  
  // Handle mobile view toggles
  const toggleInbox = () => setShowInbox(!showInbox);
  const toggleAI = () => setShowAI(!showAI);
  
  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      {/* Mobile Menu Buttons */}
      <div className="lg:hidden fixed bottom-4 right-4 flex gap-2 z-50">
        <button
          onClick={toggleInbox}
          className="p-3 bg-[#1a1a1a] text-white rounded-full shadow-lg"
        >
          {showInbox ? <X size={20} /> : <Menu size={20} />}
        </button>
        <button
          onClick={toggleAI}
          className="p-3 bg-[#1a1a1a] text-white rounded-full shadow-lg"
        >
          {showAI ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Inbox Section */}
      <div className={`
        ${showInbox ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:relative
        w-full lg:w-80
        h-full
        border-r border-neutral-200
        bg-white
        overflow-y-auto
        transition-transform
        duration-300
        ease-in-out
        z-40
        lg:z-auto
      `}>
        <InboxSection onClose={() => setShowInbox(false)} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Section */}
        <div className={`
          flex-1
          flex
          flex-col
          ${selectedConversationId ? '' : 'items-center justify-center'}
        `}>
          {selectedConversationId ? (
            <ChatSection />
          ) : (
            <div className="text-center p-8">
              <h2 className="text-xl font-medium text-neutral-600">Select a conversation from your inbox</h2>
              <p className="text-neutral-500 mt-2">Choose a message to view and respond to it here</p>
            </div>
          )}
        </div>
        
        {/* Fin AI Chatbot Section */}
        <div className={`
          ${showAI ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0
          fixed lg:relative
          right-0
          w-full lg:w-96
          h-full
          border-l border-neutral-200
          bg-chat-bg
          overflow-y-auto
          transition-transform
          duration-300
          ease-in-out
          z-30
          lg:z-auto
        `}>
          <FinAIChatbot onClose={() => setShowAI(false)} />
        </div>
      </div>
    </div>
  );
};

export default Layout;