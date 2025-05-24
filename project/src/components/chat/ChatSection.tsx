import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import { SelectedTextAction } from '../../types';
import { Wand2, Volume2, Heart, FileText, DramaIcon as GrammarIcon, Languages } from 'lucide-react';

const ChatSection: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<SelectedTextAction | null>(null);
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const selectedConversation = useAppStore((state) => state.getSelectedConversation());
  const currentUser = useAppStore((state) => state.currentUser);
  const selectTextForAI = useAppStore((state) => state.selectTextForAI);
  const composerContent = useAppStore((state) => state.composerContent);
  const setComposerContent = useAppStore((state) => state.setComposerContent);
  const addMessageToConversation = useAppStore((state) => state.addMessageToConversation);
  
  const handleTextSelection = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const selectionNode = selection?.anchorNode?.parentElement;
    
    if (selectedText && selectedText.length > 0 && selectionNode) {
      const messageElement = selectionNode.closest('[data-message-id]');
      const messageId = messageElement?.getAttribute('data-message-id');
      
      if (messageId) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        const x = rect.left + (rect.width / 2);
        const y = rect.top;
        
        setSelectionPosition({ x, y });
        setSelection({
          text: selectedText,
          messageId: messageId
        });
      }
    } else {
      if (!e.target || !(e.target as HTMLElement).closest('.selection-menu') && !(e.target as HTMLElement).closest('.ask-fin-ai-button')) {
        setSelection(null);
      }
    }
  };

  const handleAIAction = async (action: string) => {
    if (selection && selectedConversation && !isProcessing) {
      setIsProcessing(true);
      let prompt = '';
      
      switch (action) {
        case 'rephrase':
          prompt = `Rephrase this text in a different way while maintaining its meaning: "${selection.text}"`;
          break;
        case 'tone':
          prompt = `Adjust the tone of voice in this message to be more professional and clear: "${selection.text}"`;
          break;
        case 'friendly':
          prompt = `Make this message more friendly and approachable while maintaining its core message: "${selection.text}"`;
          break;
        case 'formal':
          prompt = `Make this message more formal and professional: "${selection.text}"`;
          break;
        case 'grammar':
          prompt = `Fix any grammar and spelling issues in this text while maintaining its meaning: "${selection.text}"`;
          break;
        case 'translate':
          prompt = `Translate this text to English, Spanish, and French: "${selection.text}"`;
          break;
        case 'Ask Fin AI':
          prompt = `Ask Fin AI about this text: "${selection.text}"`;
          break;
        default:
          prompt = selection.text;
      }
      
      selectTextForAI(prompt, selection.messageId);
      setSelection(null);
      setIsProcessing(false);
    }
  };

  const handleSendMessage = (content: string) => {
    if (selectedConversation && content.trim()) {
      const otherParticipant = selectedConversation.participants.find(
        p => p.id !== currentUser.id
      );
      
      if (otherParticipant) {
        addMessageToConversation(selectedConversation.id, {
          senderId: currentUser.id,
          recipientId: otherParticipant.id,
          content,
          read: true,
        });
      }
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!e.target || (!(e.target as HTMLElement).closest('.selection-menu') && !(e.target as HTMLElement).closest('.ask-fin-ai-button'))) {
        setSelection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-500">Select a conversation to view messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversation={selectedConversation} />
      
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onMouseUp={handleTextSelection}
      >
        {selectedConversation.messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;
          const sender = isCurrentUser 
            ? currentUser 
            : selectedConversation.participants.find(p => p.id === message.senderId);
            
          return (
            <MessageBubble
              key={message.id}
              message={message}
              sender={sender}
              isCurrentUser={isCurrentUser}
            />
          );
        })}

        {selection && (
          <>
            {/* Selection menu */}
            <div 
              className="selection-menu fixed transform -translate-x-1/2 bg-white shadow-lg rounded-lg border border-neutral-200 p-2 z-50 flex flex-col gap-1 animate-fade-in"
              style={{
                left: selectionPosition.x,
                top: selectionPosition.y + window.scrollY + 10,
                maxWidth: '90vw',
                width: '200px',
                zIndex: 1000
              }}
            >
              <button
                className="px-3 py-1.5 text-sm rounded hover:bg-neutral-50 flex items-center gap-2 text-left transition-colors"
                onClick={() => handleAIAction('rephrase')}
                disabled={isProcessing}
              >
                <Wand2 size={14} />
                Rephrase
              </button>
              <button
                className="px-3 py-1.5 text-sm rounded hover:bg-neutral-50 flex items-center gap-2 text-left transition-colors"
                onClick={() => handleAIAction('tone')}
                disabled={isProcessing}
              >
                <Volume2 size={14} />
                My tone of voice
              </button>
              <button
                className="px-3 py-1.5 text-sm rounded hover:bg-neutral-50 flex items-center gap-2 text-left transition-colors"
                onClick={() => handleAIAction('friendly')}
                disabled={isProcessing}
              >
                <Heart size={14} />
                More friendly
              </button>
              <button
                className="px-3 py-1.5 text-sm rounded hover:bg-neutral-50 flex items-center gap-2 text-left transition-colors"
                onClick={() => handleAIAction('formal')}
                disabled={isProcessing}
              >
                <FileText size={14} />
                More formal
              </button>
              <button
                className="px-3 py-1.5 text-sm rounded hover:bg-neutral-50 flex items-center gap-2 text-left transition-colors"
                onClick={() => handleAIAction('grammar')}
                disabled={isProcessing}
              >
                <GrammarIcon size={14} />
                Fix grammar & spelling
              </button>
              <button
                className="px-3 py-1.5 text-sm rounded hover:bg-neutral-50 flex items-center gap-2 text-left transition-colors"
                onClick={() => handleAIAction('translate')}
                disabled={isProcessing}
              >
                <Languages size={14} />
                Translate
              </button>
            </div>

            {/* Floating Ask Fin AI button */}
            <button
              className="ask-fin-ai-button fixed px-3 py-1 rounded bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors z-[1100]"
              style={{
                left: selectionPosition.x,
                top: selectionPosition.y + window.scrollY - 40, // 40px above selection menu
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
              }}
              onClick={() => handleAIAction('Ask Fin AI')}
              disabled={isProcessing}
              type="button"
            >
              Ask Fin AI
            </button>
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <MessageComposer 
        value={composerContent}
        onChange={setComposerContent}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatSection;
