import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCheck } from 'lucide-react';

interface ArtisanChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
}

interface Message {
  id: string;
  sender: 'user' | 'artisan';
  text: string;
  time: string;
}

export const ArtisanChatModal: React.FC<ArtisanChatModalProps> = ({
  isOpen,
  onClose,
  sellerName,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'artisan',
      text: `Assalam-o-Alaikum! I am ${sellerName}. Welcome to my home craft shop on Ghar Se Ghar Tak. How can I customize your order today?`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: input,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate artisan response
    setTimeout(() => {
      const replies = [
        `JazakAllah for your query! Yes, I can customize the measurements or color shade according to your preference. All orders are protected by Ghar Se Ghar Tak Escrow.`,
        `Walaikum Assalam! I handcraft each piece in my courtyard. It usually takes 2-3 days to finish. Would you like me to add a custom hand-embroidered name tag?`,
        `Thank you for messaging! You can proceed with the Safe Escrow payment on the site, and I will start preparing your creation right away!`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: 'artisan',
          text: randomReply,
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-100 flex flex-col h-[500px]">
        {/* Header */}
        <div className="bg-stone-900 text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-800 text-amber-300 font-bold font-serif flex items-center justify-center border border-amber-400">
              {sellerName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-amber-100 font-serif">{sellerName}</h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[10px] text-stone-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Homepreneur
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Escrow banner */}
        <div className="bg-amber-50 p-2 text-center text-[10px] text-amber-900 font-medium border-b border-amber-200">
          🛡️ Never share personal bank details outside Ghar Se Ghar Tak. Pay via Safe Escrow.
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-rose-900 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <div
                  className={`text-[9px] flex items-center justify-end gap-1 ${
                    msg.sender === 'user' ? 'text-rose-200' : 'text-stone-400'
                  }`}
                >
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-rose-300" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2">
          <input
            type="text"
            placeholder="Ask about sizing, color, or shipping..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
          <button
            type="submit"
            className="p-2 bg-rose-900 hover:bg-rose-800 text-white rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
