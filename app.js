// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [passage, setPassage] = useState(null);
  const [insights, setInsights] = useState('');
  const [prayer, setPrayer] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Load daily passage
  useEffect(() => {
    axios.get('/api/passage')
      .then(res => setPassage(res.data))
      .catch(err => console.error(err));
  }, []);

  // Get AI Insights
  const handleInsights = async () => {
    try {
      const res = await axios.post('/api/insights', { passage: passage?.text });
      setInsights(res.data.insights);
    } catch (err) {
      console.error(err);
    }
  };

  // Get Prayer Points
  const handlePrayer = async () => {
    try {
      const res = await axios.post('/api/prayer', { passage: passage?.text });
      setPrayer(res.data.prayer);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Chat
  const handleChat = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/chat', {
        passage: passage?.text,
        message: chatMessage
      });
      setChatHistory([...chatHistory, 
        { question: chatMessage, answer: res.data.reply }]);
      setChatMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Daily Bible Study</h1>
        {passage && (
          <div className="passage">
            <h2>{passage.reference}</h2>
            <p>{passage.text}</p>
          </div>
        )}
      </header>

      <div className="insights-section">
        <button onClick={handleInsights}>Get AI Insights</button>
        <div className="insights">{insights}</div>
      </div>

      <div className="chat-section">
        <form onSubmit={handleChat}>
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask about the passage..."
          />
          <button type="submit">Ask</button>
        </form>
        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index}>
              <p><strong>You:</strong> {chat.question}</p>
              <p><strong>AI:</strong> {chat.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="prayer-section">
        <button onClick={handlePrayer}>Generate Prayer Points</button>
        <div className="prayer">{prayer}</div>
      </div>
    </div>
  );
}

export default App;
