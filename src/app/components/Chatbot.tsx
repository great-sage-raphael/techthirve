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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;
    
    // Add user message
    const userMessageId = messages.length + 1;
    const newUserMessage = { id: userMessageId, text: inputValue, sender: "user" };
    setMessages([...messages, newUserMessage]);
    
    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Send message to the chatbot API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from the chatbot.');
      }
      
      const data = await response.json();
      
      // Add bot response
      const botResponse = { 
        id: userMessageId + 1, 
        text: data.response || "Sorry, I couldn't process your request.", 
        sender: "bot" 
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorResponse = { 
        id: userMessageId + 1, 
        text: "Sorry, there was an error processing your request. Please try again.", 
        sender: "bot" 
      };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForestDataAnalysis = async () => {
    setIsLoading(true);
    
    const analysisRequestMsg = { 
      id: messages.length + 1, 
      text: "Analyzing forest data...", 
      sender: "user" 
    };
    
    setMessages([...messages, analysisRequestMsg]);
    
    try {
      // Request forest data analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze forest data.');
      }
      
      const data = await response.json();
      
      // Add analysis response
      const analysisResponse = { 
        id: messages.length + 2, 
        text: data.analysis || "Forest data analysis complete. Here are the results...", 
        sender: "bot" 
      };
      
      setMessages(prevMessages => [...prevMessages, analysisResponse]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorResponse = { 
        id: messages.length + 2, 
        text: "Sorry, there was an error analyzing the forest data. Please try again.", 
        sender: "bot" 
      };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
              <h3 className="font-medium">Forest AI Assistant</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={handleForestDataAnalysis} 
                  className="p-1 rounded bg-purple-700 hover:bg-purple-600 transition-colors text-xs"
                >
                  Analyze Forest Data
                </button>
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
              {isLoading && (
                <div className="flex justify-center items-center py-2">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input area */}
            <div className="border-t border-gray-500 p-3 flex items-center bg-stone-950">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button 
                onClick={handleSendMessage}
                disabled={inputValue.trim() === '' || isLoading}
                className={`ml-2 p-2 rounded-full ${
                  inputValue.trim() === '' || isLoading
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