import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import './Inbox.css';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/conversations');
      setConversations(res.data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (convId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${convId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Fetch customer profile
  const fetchProfile = async (senderId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/fb/profile/${senderId}`);
      setProfile(res.data || null);
    } catch (err) {
      console.error('Error fetching customer profile:', err);
      setProfile(null);
    }
  };

  // When user clicks on a conversation
  const handleSelect = (id) => {
    setSelectedId(id);
    fetchMessages(id);
    fetchProfile(id);
  };

  // Refresh conversations and messages
  const refreshMessages = () => {
    if (selectedId) fetchMessages(selectedId);
    fetchConversations();
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="inbox-container">
      <ConversationList
        conversations={conversations}
        onSelect={handleSelect}
        selectedId={selectedId}
      />

      <div className="message-panel">
        <MessageThread
          messages={messages}
          senderId={selectedId}
          refreshMessages={refreshMessages}
        />
      </div>

      <div className="customer-profile">
        {selectedId ? (
          <div className="profile-box">
            <h3>Customer Info</h3>
            {profile ? (
              <>
                <img
                  src={profile.picture?.data?.url || profile.picture}
                  alt="Profile"
                  style={{ width: '100px', borderRadius: '50%', marginBottom: '10px' }}
                />
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>ID:</strong> {selectedId}</p>
                <p><strong>Email:</strong> {profile.email || 'Not available'}</p>
              </>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        ) : (
          <div className="profile-box">
            <p>Select a conversation to see customer info</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
