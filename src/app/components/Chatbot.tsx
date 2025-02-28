"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! How can I help you today?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newUserMessage = { id: messages.length + 1, text: inputValue, sender: "user" };
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = { 
        id: messages.length + 2, 
        text: "Thanks for your message! This is a demo response.", 
        sender: "bot" 
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 100);
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 px-10 py-8">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 1, y: 20 }}
            animate={{ opacity: 1, scale: 1.2, y: 0.2 }}
            exit={{ opacity: 0, scale: 1, y: 20 }}
            className="bg-black rounded-lg shadow-xl flex flex-col w-96 h-96 overflow-hidden border border-gray-800"
          >
            {/* Header */}
            <div className="bg-purple-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-medium">Chat Support</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1 rounded hover:bg-purple-700 transition-colors"
                >
                  <Minimize2 size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1 rounded hover:bg-purple-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto bg-stone-950">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-3 max-w-3/4 ${
                    message.sender === "user" 
                      ? "ml-auto bg-purple-800 text-white rounded-lg rounded-tr-none" 
                      : "mr-auto bg-gray-300 text-gray-800 rounded-lg rounded-tl-none"
                  } p-3`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            
            {/* Input area */}
            <div className="border-t border-gray-500 p-3 flex items-center  bg-stone-950">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button 
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ''}
                className={`ml-2 p-2 rounded-full ${
                  inputValue.trim() === '' 
                    ? 'bg-gray-200 text-gray-400' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                } transition-colors`}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 transition-colors"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;