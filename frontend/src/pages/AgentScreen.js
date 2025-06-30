// components/AgentScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import CustomerProfile from './CustomerProfile';
import './Inbox.css';

const AgentScreen = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const fetchMessages = async (senderId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/conversations/${senderId}/messages`);
      setSelectedMessages(res.data);
    } catch (err) {
      console.error('Error loading messages:', err);
      setSelectedMessages([]);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    fetchMessages(id);
  };

  return (
    <div className="inbox-container">
      <ConversationList
        conversations={conversations}
        onSelect={handleSelect}
        selectedId={selectedId}
      />

      <div className="message-panel">
        <MessageThread
          messages={selectedMessages}
          senderId={selectedId}
          refreshMessages={() => fetchMessages(selectedId)}
        />
      </div>

      <CustomerProfile senderId={selectedId} />
    </div>
  );
};

export default AgentScreen;
