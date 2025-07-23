import React, { useEffect, useState, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { socket } from '../../services/socket';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on('receive_message', (message: string) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    setIsTyping(true);
    setMessages(prev => [...prev, `You: ${input}`]);
    socket.emit('send_message', input);
    setInput('');
    
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[600px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide">Live Chat</h2>
            <p className="text-blue-100 text-xs sm:text-sm opacity-90">Real-time messaging</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-3 sm:p-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-slate-500 text-sm sm:text-base font-medium">Start a conversation...</p>
              <p className="text-slate-400 text-xs sm:text-sm">Your messages will appear here</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwnMessage = msg.startsWith('You:');
            return (
              <div
                key={i}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <div className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isOwnMessage 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-4' 
                    : 'bg-white text-slate-800 mr-4 border border-slate-200'
                }`}>
                  <p className="text-sm sm:text-base leading-relaxed break-words">{msg}</p>
                  <div className={`text-xs mt-2 opacity-70 ${isOwnMessage ? 'text-blue-100' : 'text-slate-500'}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-slate-200 mr-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-6 bg-white/80 backdrop-blur-sm border-t border-slate-200">
        <div className="flex space-x-3 items-end">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 sm:py-4 pr-12 text-sm sm:text-base bg-white rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none transition-all duration-300 shadow-lg placeholder-slate-400 resize-none"
              maxLength={500}
            />
            <div className="absolute right-3 bottom-3 text-xs text-slate-400">
              {input.length}/500
            </div>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-lg disabled:cursor-not-allowed group"
          >
            <Send className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className="hidden sm:inline">Connected</span>
        </div>
      </div>

      <style >{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-blue-300::-webkit-scrollbar-thumb {
          background-color: rgb(147 197 253);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        @media (max-width: 640px) {
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Messages;