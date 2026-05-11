import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIChatAssistantProps {
  language: 'en' | 'gu' | 'hi';
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const getInitialMessage = () => {
    if (language === 'gu') return 'નમસ્તે! હું તમારો પંચામૃત આસિસ્ટન્ટ છું. આજે હું તમને સૌરાષ્ટ્રની શુદ્ધતા શોધવામાં કેવી રીતે મદદ કરી શકું? 😊';
    if (language === 'hi') return 'नमस्ते! मैं आपका पंचामृत सहायक हूँ। आज मैं आपको सौराष्ट्र की शुद्धता खोजने में कैसे मदद कर सकता हूँ? 😊';
    return 'Namaste! I am your Panchamrut assistant. How can I help you discover the purity of Saurashtra today? 😊';
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: getInitialMessage() }
  ]);

  useEffect(() => {
    setMessages([{ role: 'model', text: getInitialMessage() }]);
  }, [language]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getChatResponse(userMsg, messages, language);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-2xl md:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-green p-4 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Sparkles size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {language === 'en' ? 'Panchamrut Assistant' : language === 'gu' ? 'પંચામૃત આસિસ્ટન્ટ' : 'पंचामृत सहायक'}
                  </h3>
                  <p className="text-[10px] opacity-80">
                    {language === 'en' ? 'Always here to help' : language === 'gu' ? 'હંમેશા મદદ માટે તૈયાર' : 'हमेशा मदद के लिए तैयार'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-cream/30 p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-gold text-white rounded-tr-none' 
                      : 'bg-white text-text border border-gold/10 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm text-text-muted border border-gold/10">
                    <Loader2 size={14} className="animate-spin" />
                    {language === 'en' ? 'Assistant is thinking...' : language === 'gu' ? 'આસિસ્ટન્ટ વિચારી રહ્યો છે...' : 'सहायक सोच रहा है...'}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gold/10 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'en' ? 'Ask about products, benefits...' : language === 'gu' ? 'પ્રોડક્ટ્સ અને ફાયદા વિશે પૂછો...' : 'उत्पादों और लाभों के बारे में पूछें...'}
                  className="flex-1 rounded-full border border-gold/20 bg-cream/20 px-4 py-2 text-sm outline-none focus:border-green"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green text-white transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-text-muted">
                Powered by Panchamrut AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-lg hover:bg-green-dark"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};
