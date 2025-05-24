import { Conversation, User, AIConversation } from '../types';
import { format, subHours, subDays, subMinutes } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'user-2',
    name: 'Emily Chen',
    email: 'emily@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'user-3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'user-4',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'user-5',
    name: 'Luis Easton',
    email: 'luis@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'current-user',
    name: 'You',
    email: 'you@example.com',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

// Helper function to create timestamps
const getTimestamp = (hoursAgo: number) => {
  return format(subHours(new Date(), hoursAgo), "yyyy-MM-dd'T'HH:mm:ss");
};

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [mockUsers[0], mockUsers[5]],
    subject: 'Refund request',
    messages: [
      {
        id: 'msg-1-1',
        senderId: 'user-1',
        recipientId: 'current-user',
        content: "Hello, I purchased your premium plan last week but I'm having issues accessing some features. Could you help me troubleshoot or process a refund if necessary?",
        timestamp: getTimestamp(5),
        read: true,
      },
      {
        id: 'msg-1-2',
        senderId: 'current-user',
        recipientId: 'user-1',
        content: "I'm sorry to hear you're having trouble. Could you tell me which specific features you're having issues with? I'd be happy to help resolve this.",
        timestamp: getTimestamp(4),
        read: true,
      },
      {
        id: 'msg-1-3',
        senderId: 'user-1',
        recipientId: 'current-user',
        content: "I can't access the advanced analytics dashboard and the export functionality isn't working. I've tried logging out and back in, but still having the same issues.",
        timestamp: getTimestamp(3),
        read: false,
      },
    ],
    unreadCount: 1,
    priority: 'high',
    status: 'open',
    tags: ['support', 'refund'],
  },
  {
    id: 'conv-2',
    participants: [mockUsers[1], mockUsers[5]],
    subject: 'Billing inquiry',
    messages: [
      {
        id: 'msg-2-1',
        senderId: 'user-2',
        recipientId: 'current-user',
        content: "Hi there, I noticed a double charge on my account this month. Can you please look into this and refund the extra payment? My transaction IDs are TXN-45678 and TXN-45679.",
        timestamp: getTimestamp(24),
        read: true,
      },
    ],
    unreadCount: 0,
    priority: 'medium',
    status: 'open',
  },
  {
    id: 'conv-3',
    participants: [mockUsers[2], mockUsers[5]],
    subject: 'Feature request',
    messages: [
      {
        id: 'msg-3-1',
        senderId: 'user-3',
        recipientId: 'current-user',
        content: "Hello! I love your product but I think it would be even better if you could add calendar integration. Would this be possible in a future update?",
        timestamp: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
        read: true,
      },
    ],
    unreadCount: 0,
    priority: 'low',
    status: 'open',
    tags: ['feature', 'feedback'],
  },
  {
    id: 'conv-4',
    participants: [mockUsers[3], mockUsers[5]],
    subject: 'Account verification',
    messages: [
      {
        id: 'msg-4-1',
        senderId: 'user-4',
        recipientId: 'current-user',
        content: "I'm trying to verify my account but I haven't received the verification email. I've checked my spam folder as well. Could you please resend it or help me verify my account another way?",
        timestamp: format(subDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
        read: false,
      },
    ],
    unreadCount: 1,
    status: 'pending',
  },
  {
    id: 'conv-5',
    participants: [mockUsers[4], mockUsers[5]],
    subject: 'Product inquiry',
    messages: [
      {
        id: 'msg-5-1',
        senderId: 'user-5',
        recipientId: 'current-user',
        content: "I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they already have something very similar. Would it be possible to return it for a refund or store credit?",
        timestamp: format(subMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss"),
        read: false,
      },
      {
        id: 'msg-5-2',
        senderId: 'current-user',
        recipientId: 'user-5',
        content: "Let me look into this for you, Luis. Can you please provide your order number?",
        timestamp: format(subMinutes(new Date(), 25), "yyyy-MM-dd'T'HH:mm:ss"),
        read: true,
      },
      {
        id: 'msg-5-3',
        senderId: 'user-5',
        recipientId: 'current-user',
        content: "Sure! The order number is #ORD-123456.",
        timestamp: format(subMinutes(new Date(), 20), "yyyy-MM-dd'T'HH:mm:ss"),
        read: true,
      },
      {
        id: 'msg-5-4',
        senderId: 'current-user',
        recipientId: 'user-5',
        content: "Thank you. Our return policy allows returns within 30 days of purchase. Since your purchase was in November, I'll need to check with our team about making an exception. I'll get back to you soon.",
        timestamp: format(subMinutes(new Date(), 15), "yyyy-MM-dd'T'HH:mm:ss"),
        read: true,
      },
    ],
    unreadCount: 0,
    priority: 'medium',
    status: 'open',
    tags: ['returns', 'customer-service'],
  },
];

// Mock AI Conversations
export const mockAIConversations: AIConversation[] = [
  {
    id: 'ai-conv-1',
    conversationId: 'conv-5',
    messages: [
      {
        id: 'ai-msg-1-1',
        conversationId: 'conv-5',
        originalMessageId: 'msg-5-1',
        content: "How should I respond to a customer requesting a return outside our 30-day policy for a Christmas gift?",
        timestamp: format(subMinutes(new Date(), 28), "yyyy-MM-dd'T'HH:mm:ss"),
        type: 'question',
      },
      {
        id: 'ai-msg-1-2',
        conversationId: 'conv-5',
        content: "Here's a suggested response for this situation:\n\nThank you for reaching out about returning your November purchase. While our standard policy is 30 days, we do have special considerations for holiday gifts. I'd be happy to make an exception in this case.\n\nYou have two options:\n1. Return for a full refund to the original payment method\n2. Exchange for store credit with an additional 10% bonus\n\nPlease let me know which option you prefer, and I'll provide instructions for the return process.",
        timestamp: format(subMinutes(new Date(), 27), "yyyy-MM-dd'T'HH:mm:ss"),
        type: 'response',
      },
      {
        id: 'ai-msg-1-3',
        conversationId: 'conv-5',
        originalMessageId: 'msg-5-3',
        content: "The customer provided order #ORD-123456. How can I verify this order in our system?",
        timestamp: format(subMinutes(new Date(), 18), "yyyy-MM-dd'T'HH:mm:ss"),
        type: 'question',
      },
      {
        id: 'ai-msg-1-4',
        conversationId: 'conv-5',
        content: "To verify this order:\n\n1. Go to the Orders section in your admin dashboard\n2. Enter the order number (ORD-123456) in the search field\n3. Check the order date to confirm it was purchased in November\n4. Verify the product details and price\n5. Check the customer's purchase history to see if they're a regular customer\n\nIf the order is confirmed and the customer has a good history with you, I recommend approving the return exception. For loyal customers, maintaining goodwill often outweighs strict policy enforcement.",
        timestamp: format(subMinutes(new Date(), 17), "yyyy-MM-dd'T'HH:mm:ss"),
        type: 'response',
      }
    ]
  }
];