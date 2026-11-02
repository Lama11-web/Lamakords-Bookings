import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MapPin, 
  Compass, 
  ExternalLink, 
  Loader2, 
  Trash2, 
  Building2, 
  Globe2, 
  Check, 
  CornerDownRight,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingChunks?: any[];
  timestamp: string;
}

export const GeminiChatbotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  const { listings, role: userRole } = useApp();

  const [chatRole, setChatRole] = useState<'concierge' | 'maps_guide' | 'host_copilot'>('concierge');
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: 'Mwabuka kabotu! I am your Lama Kords AI Concierge. I can help you discover luxury safari lodges, plan your Victoria Falls adventures, find verified homestays, or explore Zambian attractions with live Google Maps grounding. What would you like to explore today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const starterPrompts = [
    { label: 'Safari in South Luangwa', prompt: 'Recommend a 3-day wildlife safari lodge in South Luangwa with solar backup and game drives.' },
    { label: 'Victoria Falls Stays', prompt: 'What are top luxury villas or chalets near Victoria Falls under ZMW 4,500/night?' },
    { label: 'Google Maps: Lusaka Dining', prompt: 'Find authentic Zambian restaurants serving traditional nshima and fresh bream in Lusaka with Google Maps locations.', useMaps: true },
    { label: 'Siavonga / Lake Kariba', prompt: 'What activities and lakeside resorts do you recommend in Siavonga?' }
  ];

  const handleSend = async (customPrompt?: string, forceMaps?: boolean) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Determine if Maps Grounding should be used
      const shouldUseMaps = forceMaps || chatRole === 'maps_guide' || textToSend.toLowerCase().includes('maps') || textToSend.toLowerCase().includes('restaurant') || textToSend.toLowerCase().includes('attraction');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, text: m.text })),
          chatRole: shouldUseMaps ? 'maps_guide' : chatRole,
          useMapsGrounding: shouldUseMaps,
          userLocation: { lat: -15.4167, lng: 28.3056 } // Lusaka / Zambia coordinates
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get a response from AI Concierge.');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply,
        groundingChunks: data.groundingChunks || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Error: ${err.message || 'Unable to connect to Gemini API. Please ensure your GEMINI_API_KEY is configured in AI Studio Secrets.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        text: 'Chat history cleared. How may I assist your Zambian travels today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 overflow-hidden">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl h-[88vh] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lama Kords Gemini AI Concierge
                </h3>
                <span className="text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Multi-Turn Stays Advisory with Google Maps Grounding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear Conversation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Persona Mode Switcher */}
        <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs overflow-x-auto shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mr-2">Assistant Role:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setChatRole('concierge')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                chatRole === 'concierge' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              Safari & Stays Concierge
            </button>
            <button
              onClick={() => setChatRole('maps_guide')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-colors ${
                chatRole === 'maps_guide' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Google Maps Guide</span>
            </button>
            <button
              onClick={() => setChatRole('host_copilot')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                chatRole === 'host_copilot' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              Host Copilot
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-amber-600 text-white rounded-tr-xs shadow-xs' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Google Maps Grounding Links & Places Section */}
                  {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Google Maps Verified Places & Sources:</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {msg.groundingChunks.map((chunk: any, cIdx: number) => {
                          const mapData = chunk.maps;
                          if (!mapData) return null;
                          return (
                            <a
                              key={cIdx}
                              href={mapData.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 transition-colors group"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-semibold text-[11px] text-amber-600 group-hover:underline">
                                  {mapData.title || 'View Location on Google Maps'}
                                </span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span className={`block text-[10px] mt-2 font-mono ${
                    isUser ? 'text-amber-200 text-right' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-xs flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span>Gemini is thinking and retrieving Zambian map context...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starter Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider shrink-0">Try:</span>
          {starterPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.prompt, p.useMaps)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about stays, safaris, Victoria Falls, or Google Maps locations..."
              className="flex-1 text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold disabled:opacity-50 transition-colors shadow-md flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
