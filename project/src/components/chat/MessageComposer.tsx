import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  Send,
  Smile,
  Mic,
  Image,
  Bold,
  Italic,
  Type,
  Languages,
  Wand2,
  Volume2,
  Heart,
  FileText,
  X
} from 'lucide-react';
import Button from '../ui/Button';

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (content: string) => void;
  selection?: {
    text: string;
    messageId: string;
  } | null;
  selectedConversation?: any; // Define a proper type if available
  selectTextForAI?: (prompt: string, messageId: string) => void;
}

type AIActionType = 'rephrase' | 'tone' | 'friendly' | 'formal' | 'grammar' | 'translate';

const MessageComposer: React.FC<MessageComposerProps> = ({
  value,
  onChange,
  onSend,
  selection,
  selectedConversation,
  selectTextForAI
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formattingRef = useRef<HTMLDivElement>(null);

  const [showFormatting, setShowFormatting] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          insertFormat('italic');
          break;
        case '1':
          e.preventDefault();
          insertFormat('h1');
          break;
        case '2':
          e.preventDefault();
          insertFormat('h2');
          break;
      }
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      onChange('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    onChange(textarea.value);

    // Auto-resize
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const insertFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText = '';
    let cursorOffset = 2;

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `_${selectedText}_`;
        cursorOffset = 1;
        break;
      case 'h1':
        newText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'h2':
        newText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = selectedText ? start + newText.length : start + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleAIAction = async (action: AIActionType) => {
    if (!selection || !selectedConversation || isProcessing || !selectTextForAI) return;

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
    }

    await selectTextForAI(prompt, selection.messageId);
    setIsProcessing(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formattingRef.current && !formattingRef.current.contains(e.target as Node)) {
        setShowFormatting(false);
        setShowAIOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-3 border-t border-neutral-200 bg-white">
      <div className="flex flex-col space-y-2">
        {/* Formatting Toolbar */}
        <div className="flex items-center justify-between px-2" ref={formattingRef}>
          <div className="flex items-center space-x-1">
            <button onClick={() => insertFormat('bold')} title="Bold (Ctrl+B)" className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600">
              <Bold size={16} />
            </button>
            <button onClick={() => insertFormat('italic')} title="Italic (Ctrl+I)" className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600">
              <Italic size={16} />
            </button>
            <button onClick={() => insertFormat('h1')} title="Heading 1 (Ctrl+1)" className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600">
              <Type size={16} />
            </button>
            <button onClick={() => insertFormat('h2')} title="Heading 2 (Ctrl+2)" className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600">
              <Type size={14} />
            </button>
            <div className="h-4 w-px bg-neutral-200 mx-1" />
            <button
              onClick={() => setShowAIOptions(!showAIOptions)}
              title="AI Assistance"
              className={`p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 ${showAIOptions ? 'bg-neutral-100' : ''}`}
            >
              <Wand2 size={16} />
            </button>
          </div>

          {showFormatting && (
            <button className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600" onClick={() => setShowFormatting(false)}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* AI Options */}
        {showAIOptions && (
          <div className="flex flex-wrap gap-1 px-2 pb-2 animate-fade-in">
            {([
              { label: 'Rephrase', icon: Wand2, action: 'rephrase' },
              { label: 'Tone', icon: Volume2, action: 'tone' },
              { label: 'Friendly', icon: Heart, action: 'friendly' },
              { label: 'Formal', icon: FileText, action: 'formal' },
              { label: 'Grammar', icon: FileText, action: 'grammar' },
              { label: 'Translate', icon: Languages, action: 'translate' }
            ] as { label: string; icon: any; action: AIActionType }[]).map(({ label, icon: Icon, action }) => (
              <button
                key={action}
                className="px-2 py-1 text-xs rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center gap-1 transition-colors"
                onClick={() => handleAIAction(action)}
                disabled={isProcessing}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
            {isProcessing && <span className="text-xs text-neutral-500 ml-2">Processing...</span>}
          </div>
        )}

        {/* Message Input */}
        <div className="flex items-end space-x-2">
          <div className="flex-1 bg-neutral-100 rounded-lg p-2">
            <div className="flex items-center space-x-2 mb-2">
              <button className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-600">
                <Paperclip size={18} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-600">
                <Image size={18} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-600">
                <Mic size={18} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-600">
                <Smile size={18} />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              placeholder="Type a message..."
              className="w-full border-0 bg-transparent resize-none focus:ring-0 text-sm p-1 max-h-[120px]"
              rows={1}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onClick={() => setShowFormatting(true)}
            />
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<Send size={16} />}
            onClick={handleSend}
            className="mb-1"
          />
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
