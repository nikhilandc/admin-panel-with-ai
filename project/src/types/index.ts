export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
}

export interface Conversation {
  id: string;
  participants: User[];
  subject?: string;
  lastMessage?: Message;
  messages: Message[];
  unreadCount: number;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  status?: 'open' | 'closed' | 'pending';
}

export interface AIMessage {
  id: string;
  conversationId: string;
  originalMessageId?: string;
  content: string;
  timestamp: string;
  type: 'question' | 'response';
}

export interface AIConversation {
  id: string;
  conversationId: string;
  messages: AIMessage[];
}

export type SelectedTextAction = {
  text: string;
  messageId: string;
};