// controllers/facebookController.js
const axios = require('axios');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const sendMessage = async (req, res) => {
  const { recipientId, message } = req.body;

  const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  const payload = {
    recipient: { id: recipientId },
    message: { text: message },
  };

  const timestamp = Date.now();

  console.log(" Sending to recipient:", recipientId);
  console.log("Message content:", message);

  try {
    // 1. Send to Facebook
    const response = await axios.post(url, payload);
    console.log(' Message sent to Facebook:', response.data);

    // 2. Save message to DB
    const saved = await Message.create({
    senderId: recipientId, //  Always use the customer's ID as the conversation key
    recipientId: 'agent',  // Optional, to indicate it came *from* the agent
    text: message,
    timestamp,
    isAgent: true,         //  Use this flag to mark it as an agent message
    });


    console.log(' Agent message saved to MongoDB:', saved);

    // 3. Update Conversation
    let convo = await Conversation.findOne({ senderId: recipientId });

    if (!convo || (timestamp - convo.lastMessageTimestamp > 24 * 60 * 60 * 1000)) {
      await Conversation.create({
        senderId: recipientId,
        messages: [{ text: message, timestamp, isAgent: true }],
        lastMessageTimestamp: timestamp,
      });
    } else {
        convo.messages.push({
        text: message,
        timestamp,
        isAgent: true,
        });
      convo.lastMessageTimestamp = timestamp;
      await convo.save();
    }

    res.status(200).json({ message: 'Reply sent & saved successfully' });

  } catch (err) {
    console.error(' Facebook Error Response:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
};


// GET profile by senderId
const getCustomerProfile = async (req, res) => {
  const { senderId } = req.params;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;

  try {
    if (senderId === "23879264988407749") {
  return res.json({
    id: senderId,
    name: "Tester Mishra",
    picture: "https://scontent.fvns1-1.fna.fbcdn.net/v/t39.30808-1/514421276_122107758584923358_8954066747297760262_n.jpg?stp=c0.42.736.736a_dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=FZN1I1AQyP0Q7kNvwGTPulu&_nc_oc=AdkV5J79hzDJTWFgs2yyzKqJsdAeGddM4kdcbWzJZKpzULol5jzk6E-EIVbs-vc4_RkjTrAZ1RzmfmW0NL15AjuO&_nc_zt=24&_nc_ht=scontent.fvns1-1.fna&_nc_gid=McW1IEx8QvqyChtlZGfjyw&oh=00_AfObW9gEUJR6bEpRXTLTh_bzSmRPgXFmWwIX_KBx8kpx9A&oe=6868C2D4",
    email: "tester@example.com"
  });
}
    const result = await axios.get(`https://graph.facebook.com/${senderId}?fields=first_name,last_name,profile_pic,email&access_token=${token}`);
    const data = result.data;

    res.json({
      id: senderId,
      name: `${data.first_name} ${data.last_name}`,
      picture: data.profile_pic,
      email: data.email || "Not available"
    });
  } catch (err) {
    console.error(' Failed to fetch profile:', err.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

module.exports = {
  sendMessage,
  getCustomerProfile
};

// module.exports = { sendMessage };
