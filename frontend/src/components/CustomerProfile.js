// components/CustomerProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Inbox.css';

const CustomerProfile = ({ senderId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!senderId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/fb/profile/${senderId}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [senderId]);

  if (!senderId) {
    return (
      <div className="customer-profile">
        <p>Select a conversation to view profile.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="customer-profile">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="customer-profile">
      <div className="profile-box">
        <img src={profile.picture} alt="Profile" style={{ width: '80px', borderRadius: '50%' }} />
        <h3>{profile.name}</h3>
        <p><strong>ID:</strong> {profile.id}</p>
      </div>
    </div>
  );
};

export default CustomerProfile;
