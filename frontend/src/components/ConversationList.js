import React from 'react';
import './Inbox.css';

const ConversationList = ({ conversations, onSelect, selectedId }) => {
  return (
    <div className="conversation-list">
      <h3>Inbox</h3>

      {conversations.length === 0 ? (
        <p>No conversations found</p>
      ) : (
        conversations.map((conv) => {
          const senderId = conv._id || 'Unknown';
          const lastMessage = conv.lastMessage || 'No message';
          const time = conv.timestamp
            ? new Date(conv.timestamp).toLocaleString()
            : 'No timestamp';

          return (
            <div
              key={conv._id}
              className={`conversation-item ${selectedId === conv._id ? 'active' : ''}`}
              onClick={() => onSelect(conv._id)}
            >
              <p><strong>Sender:</strong> {senderId}</p>
              <p><strong>Last Msg:</strong> {lastMessage}</p>
              <p><strong>Time:</strong> {time}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ConversationList;
