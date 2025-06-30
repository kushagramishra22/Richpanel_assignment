import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FacebookConnect.css';

const FacebookConnect = () => {
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(null);
  
  const token = localStorage.getItem("token");
  
  useEffect(() => {
  // Clean up Facebook's #_=_ hash
  if (window.location.hash === '#_=_') {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.href.split('#')[0]);
    }
  }
}, []);

  useEffect(() => {
    const fetchPage = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/fb/page', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPageInfo(res.data);
  } catch (err) {
    setPageInfo(null);
  }
};
    fetchPage();
  }, []);

 const handleConnect = async () => {
  try {
    setLoading(true);
    const res = await axios.get('http://localhost:5000/api/fb/login-url', {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.href = res.data.url;
  } catch (err) {
    console.error('Error generating login URL:', err);
    alert('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

 const handleDeletePage = async () => {
  try {
    await axios.delete('http://localhost:5000/api/fb/page', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPageInfo(null);
    alert('Page disconnected successfully!');
  } catch (err) {
    console.error('Error deleting page:', err);
    alert('Something went wrong while disconnecting.');
  }
};

  return (
    <div className="fb-container">
      <div className="fb-card">
        <h2 className="fb-heading">
          {pageInfo ? 'Facebook Page Connected' : 'Connect Your Facebook Page'}
        </h2>

        {pageInfo ? (
          <>
            <p className="fb-label">
              <strong>Page Name:</strong> {pageInfo.pageName}
            </p>
            <p className="fb-label">
              <strong>Connected At:</strong> {new Date(pageInfo.connectedAt).toLocaleString()}
            </p>
            <button
              onClick={handleDeletePage}
              className="fb-delete-btn"
            >
              Disconnect Page
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            className="fb-connect-btn"
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Connect with Facebook'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FacebookConnect;