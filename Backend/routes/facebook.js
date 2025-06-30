const express = require('express');
const router = express.Router();
const axios = require('axios');
const Page = require('../models/Page');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { sendMessage } = require('../controllers/facebookController');
require('dotenv').config();
const { getCustomerProfile } = require('../controllers/facebookController');

// ENV variables
const clientId = process.env.FB_APP_ID;
const clientSecret = process.env.FB_APP_SECRET;
const redirectUri = process.env.FB_REDIRECT_URI;


// Add route to handle message replies
router.post('/send', sendMessage); 

router.post('/messages/reply', sendMessage);
router.get('/fb/profile/:senderId', getCustomerProfile);


// 🔹 Step 1: Send Facebook Login URL
router.get('/login-url', (req, res) => {
  const fbLoginUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_messaging,pages_show_list,pages_read_engagement`;
  res.json({ url: fbLoginUrl });
});

// 🔹 Step 2: Facebook OAuth callback to exchange code for access token
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Missing authorization code' });
  }

  try {
    const tokenResponse = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      },
    });

    const userAccessToken = tokenResponse.data.access_token;

    const pagesResponse = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
      params: {
        access_token: userAccessToken,
      },
    });

    const pages = pagesResponse.data.data;

    if (pages.length === 0) {
      return res.status(400).json({ message: 'No Facebook pages found.' });
    }

    const page = pages[0];

    const savedPage = await Page.findOneAndUpdate(
      { pageId: page.id },
      {
        pageId: page.id,
        pageName: page.name,
        accessToken: page.access_token,
        connectedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    res.redirect('http://localhost:3000/connect'); 
    return res.status(200).json({
      message: 'Page connected successfully',
      page: savedPage,
    });
     
    // Redirect to your frontend page after successful connection
  } catch (error) {
    console.error(' Facebook OAuth error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Facebook authentication failed' });
  }
});

// 🔹 Webhook Verification (GET)
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log(' Webhook verified!');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
  }
});

// 🔹 Webhook Message Listener (POST)
router.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    for (const entry of body.entry) {
      const event = entry.messaging[0];

      console.log('Incoming Message Event:', event);

      if (!event.message || !event.message.text) continue;

      try {
        // Save Message
        const newMessage = await Message.create({
          senderId: event.sender.id,
          recipientId: event.recipient.id,
          timestamp: event.timestamp,
          text: event.message.text,
        });

        console.log(' Message saved to MongoDB:', newMessage);

        // Save or Update Conversation
        let convo = await Conversation.findOne({ senderId: event.sender.id });

        if (!convo || (event.timestamp - convo.lastMessageTimestamp > 24 * 60 * 60 * 1000)) {
          await Conversation.create({
            senderId: event.sender.id,
            messages: [{ text: event.message.text, timestamp: event.timestamp }],
            lastMessageTimestamp: event.timestamp,
          });
        } else {
          convo.messages.push({
            text: event.message.text,
            timestamp: event.timestamp,
          });
          convo.lastMessageTimestamp = event.timestamp;
          await convo.save();
        }

      } catch (err) {
        console.error(' Error saving message or conversation:', err.message);
      }
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

//  Route: Get connected page info
router.get('/page', async (req, res) => {
  try {
    const page = await Page.findOne(); // You can filter by user if needed
    if (!page) return res.status(404).json({ message: 'No connected page found' });
    res.json(page);
  } catch (err) {
    console.error('Error fetching page info:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//  Route: Delete connected page
router.delete('/page', async (req, res) => {
  try {
    await Page.deleteOne(); // Again, customize if needed
    res.json({ message: 'Page disconnected successfully' });
  } catch (err) {
    console.error('Error deleting page:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
