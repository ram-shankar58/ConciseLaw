import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Chatbot.css';
import Markdown from 'react-markdown';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI('AIzaSyAhMO5GF4nU_a8kuXi21UUCeC8iKjTNn4Y'); // Replace with your actual API key

  const handleSendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are a helpful assistant. Answer the following question: ${input}`;
      const result = await model.generateContent(prompt);
      const botMessage = { text: await result.response.text(), sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            <Markdown>{msg.text}</Markdown>
          </div>
        ))}
        {isLoading && <p className="loading">Loading...</p>}
      </div>
      <div className="input-container">
        <textarea
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Any Law / Legal Related Queries Here"
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;