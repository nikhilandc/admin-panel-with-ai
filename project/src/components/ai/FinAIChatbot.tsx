import React, { useRef, useEffect } from 'react';
import { Sparkles, Bot, Plus, Copy, CornerDownLeft, X } from 'lucide-react';
import { useAppStore } from '../../store';
import Button from '../ui/Button';
import AIMessageBubble from './AIMessageBubble';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const BASE_URL = "https://api.chatanywhere.tech/v1";

interface FinAIChatbotProps {
  onClose?: () => void;
}

const FinAIChatbot: React.FC<FinAIChatbotProps> = ({ onClose }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const selectedConversationId = useAppStore((state) => state.selectedConversationId);
  const selectedTextAction = useAppStore((state) => state.selectedTextAction);
  const aiConversation = useAppStore((state) => state.getAIConversationForSelected());
  const addAIQuestion = useAppStore((state) => state.addAIQuestion);
  const addAIResponse = useAppStore((state) => state.addAIResponse);
  const setComposerContent = useAppStore((state) => state.setComposerContent);
  const clearSelectedText = useAppStore((state) => state.clearSelectedText);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiConversation?.messages]);

  useEffect(() => {
    if (selectedTextAction && selectedConversationId) {
      addAIQuestion(selectedConversationId, selectedTextAction.text, selectedTextAction.messageId);
      
      // Call OpenAI API
      getAIResponse(selectedTextAction.text);
      clearSelectedText();
    }
  }, [selectedTextAction, selectedConversationId]);

  const getAIResponse = async (prompt: string) => {
    if (!selectedConversationId) return;

    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful customer service AI assistant. Provide clear, professional responses.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      addAIResponse(selectedConversationId, aiResponse);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      addAIResponse(selectedConversationId, 'I apologize, but I encountered an error processing your request. Please try again.');
    }
  };

  const handleAddToComposer = (content: string) => {
    setComposerContent(content);
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-md bg-[#1a1a1a] flex items-center justify-center text-white mr-3">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-base font-medium text-neutral-900">Fin AI Copilot</h2>
            <p className="text-xs text-neutral-500">Ask anything about this conversation</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600">
            <Plus size={18} />
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
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedConversationId ? (
          <>
            {(!aiConversation || aiConversation.messages.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="h-12 w-12 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[#1a1a1a] mb-3">
                  <Bot size={24} />
                </div>
                <h3 className="text-base font-medium text-neutral-700">Hi, I'm Fin AI Copilot</h3>
                <p className="text-sm text-neutral-500 mt-1 max-w-xs">
                  Ask me anything about this conversation or highlight text to get my assistance
                </p>
                <div className="mt-6 space-y-2 w-full max-w-xs">
                  <SuggestionButton 
                    icon={<CornerDownLeft size={14} />}
                    text="How should I respond to this message?"
                    onClick={() => {
                      if (selectedConversationId) {
                        const prompt = "How should I respond to this customer's message?";
                        addAIQuestion(selectedConversationId, prompt);
                        getAIResponse(prompt);
                      }
                    }}
                  />
                  <SuggestionButton 
                    icon={<CornerDownLeft size={14} />}
                    text="Summarize this conversation"
                    onClick={() => {
                      if (selectedConversationId) {
                        const prompt = "Can you summarize this conversation?";
                        addAIQuestion(selectedConversationId, prompt);
                        getAIResponse(prompt);
                      }
                    }}
                  />
                </div>
              </div>
            )}
            
            {aiConversation && aiConversation.messages.map((message) => (
              <AIMessageBubble
                key={message.id}
                message={message}
                onAddToComposer={handleAddToComposer}
              />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-12 w-12 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[#e1a8e6] mb-3">
              <Bot size={24} />
            </div>
            <h3 className="text-base font-medium text-neutral-700">Select a conversation</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Choose a conversation from your inbox to get AI assistance
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {selectedConversationId && (
        <div className="p-3 border-t border-neutral-200">
          <div className="bg-white border border-neutral-300 rounded-lg p-2.5 flex items-center">
            <input 
              type="text"
              placeholder="Ask Fin AI a question..."
              className="flex-1 border-0 focus:ring-0 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  getAIResponse(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button className="p-1.5 rounded-md hover:bg-neutral-100 text-[#1a1a1a]">
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface SuggestionButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ icon, text, onClick }) => {
  return (
    <button
      className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-left text-sm hover:bg-neutral-50 transition-colors flex items-center"
      onClick={onClick}
    >
      <span className="mr-2 text-neutral-500">{icon}</span>
      {text}
    </button>
  );
};

export default FinAIChatbot;