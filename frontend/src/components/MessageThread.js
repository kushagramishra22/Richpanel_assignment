// components/MessageThread.js
import React, { useState } from 'react';
import './Inbox.css';
import axios from 'axios';

const MessageThread = ({ messages, senderId, refreshMessages }) => {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  
  const handleSend = async () => {
    if (!reply.trim()) return;

    try {
      setSending(true);
      await axios.post('http://localhost:5000/api/messages/reply', {
        recipientId: senderId,
        message: reply,
      });
      setReply('');
      refreshMessages(); // to reload latest messages
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="message-thread">
      <h3>Messages</h3>
      {messages.length === 0 ? (
        <p>Select a conversation to view messages</p>
      ) : (
        <>
          {messages.map((msg, index) => (
            <div
            key={index}
            className={`message-item ${msg.isAgent ? 'agent' : 'user'}`}
            >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
                {new Date(msg.timestamp).toLocaleString()}
            </div>
            </div>
            ))}

          <div className="reply-box">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your message..."
              rows="3"
            />
            <button onClick={handleSend} disabled={sending}>
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageThread;
