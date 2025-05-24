import { create } from 'zustand';
import { Conversation, User, AIConversation, SelectedTextAction, Message, AIMessage } from '../types';
import { mockConversations, mockAIConversations, mockUsers } from '../data/mockData';

interface AppState {
  currentUser: User;
  conversations: Conversation[];
  aiConversations: AIConversation[];
  selectedConversationId: string | null;
  selectedTextAction: SelectedTextAction | null;
  composerContent: string;
  
  // Actions
  setSelectedConversation: (id: string | null) => void;
  selectTextForAI: (text: string, messageId: string) => void;
  clearSelectedText: () => void;
  addMessageToConversation: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  markConversationAsRead: (conversationId: string) => void;
  addAIQuestion: (conversationId: string, text: string, messageId?: string) => void;
  addAIResponse: (conversationId: string, content: string) => void;
  setComposerContent: (content: string) => void;
  getSelectedConversation: () => Conversation | null;
  getAIConversationForSelected: () => AIConversation | null;
}

// Helper functions
const generateId = () => `id-${Math.random().toString(36).substr(2, 9)}`;
const getCurrentTimestamp = () => new Date().toISOString();

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockUsers.find(user => user.id === 'current-user')!,
  conversations: mockConversations,
  aiConversations: mockAIConversations,
  selectedConversationId: null,
  selectedTextAction: null,
  composerContent: '',

  setSelectedConversation: (id) => {
    set({ selectedConversationId: id });
    if (id) {
      get().markConversationAsRead(id);
    }
  },

  selectTextForAI: (text, messageId) => {
    set({ selectedTextAction: { text, messageId } });
  },

  clearSelectedText: () => {
    set({ selectedTextAction: null });
  },

  addMessageToConversation: (conversationId, messageData) => {
    const { conversations, currentUser } = get();
    
    const newMessage: Message = {
      id: generateId(),
      senderId: messageData.senderId,
      recipientId: messageData.recipientId,
      content: messageData.content,
      read: messageData.read,
      timestamp: getCurrentTimestamp(),
      attachments: messageData.attachments,
    };

    set({
      conversations: conversations.map(conv => 
        conv.id === conversationId 
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: newMessage,
            }
          : conv
      ),
      composerContent: '',
    });
  },

  markConversationAsRead: (conversationId) => {
    const { conversations } = get();
    
    set({
      conversations: conversations.map(conv => 
        conv.id === conversationId 
          ? {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map(msg => ({
                ...msg,
                read: true,
              })),
            }
          : conv
      ),
    });
  },

  addAIQuestion: (conversationId, text, messageId) => {
    const { aiConversations } = get();
    const existingConversation = aiConversations.find(conv => conv.conversationId === conversationId);
    
    const newQuestion: AIMessage = {
      id: generateId(),
      conversationId,
      originalMessageId: messageId,
      content: text,
      timestamp: getCurrentTimestamp(),
      type: 'question',
    };

    if (existingConversation) {
      set({
        aiConversations: aiConversations.map(conv => 
          conv.conversationId === conversationId 
            ? {
                ...conv,
                messages: [...conv.messages, newQuestion],
              }
            : conv
        ),
      });
    } else {
      const newAIConversation: AIConversation = {
        id: generateId(),
        conversationId,
        messages: [newQuestion],
      };
      
      set({
        aiConversations: [...aiConversations, newAIConversation],
      });
    }
  },

  addAIResponse: (conversationId, content) => {
    const { aiConversations } = get();
    const existingConversation = aiConversations.find(conv => conv.conversationId === conversationId);
    
    const newResponse: AIMessage = {
      id: generateId(),
      conversationId,
      content,
      timestamp: getCurrentTimestamp(),
      type: 'response',
    };

    if (existingConversation) {
      set({
        aiConversations: aiConversations.map(conv => 
          conv.conversationId === conversationId 
            ? {
                ...conv,
                messages: [...conv.messages, newResponse],
              }
            : conv
        ),
      });
    }
  },

  setComposerContent: (content) => {
    set({ composerContent: content });
  },

  getSelectedConversation: () => {
    const { selectedConversationId, conversations } = get();
    return selectedConversationId 
      ? conversations.find(conv => conv.id === selectedConversationId) || null
      : null;
  },

  getAIConversationForSelected: () => {
    const { selectedConversationId, aiConversations } = get();
    return selectedConversationId 
      ? aiConversations.find(conv => conv.conversationId === selectedConversationId) || null
      : null;
  }
}));