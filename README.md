# Richpanel Facebook Helpdesk App

This is a full-stack web application built as part of Richpanel's engineering assignment. It enables agents to connect a Facebook page, view incoming messages from users, and respond directly from the agent interface.

---

## 📌 Features

- 🔐 User Authentication (Register/Login)
- 🔗 Facebook Page OAuth Integration
- 📥 Conversation Inbox for Agent
- 💬 Real-time Facebook message syncing
- 📤 Send replies to Facebook users from the app
- 👤 View customer's profile information (Name, ID, Profile Picture)
- 🎨 Clean UI matching Richpanel's design expectations

---

## 🔧 Tech Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **APIs**: Facebook Graph API
- **Auth**: JWT + Password Hashing with bcrypt
- **Styling**: Custom CSS

---

## 🚀 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/kushagraMishra22/richpanel-helpdesk.git
cd richpanel-helpdesk
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret
FB_PAGE_ID=your_page_id
FB_PAGE_ACCESS_TOKEN=your_page_access_token
```

### 3. Run Backend Server

```bash
cd backend
npm install
nodemon server.js
```

### 4. Run Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

## 📷 Screenshots

- Agent Login & Register git add ![image](https://github.com/user-attachments/assets/c2b693cc-6b02-4441-a63a-c55ee61e1ca5) ![image](https://github.com/user-attachments/assets/df996993-974a-49ff-845b-c036f0dc30df)


- Facebook Page Connect UI ![image](https://github.com/user-attachments/assets/09fc9890-86ea-4fb0-af53-7914f75ab537) ![image](https://github.com/user-attachments/assets/e2f5e589-ca17-4ea3-b85e-4bafe32bffbf)


- Messenger Inbox UI 
- Customer Profile with Picture
- Reply to Customers

---

## 📌 Notes

- Webhook is setup to receive messages from Facebook.
- Page access token must be generated via OAuth flow.
- Customers who haven't accepted permissions or aren't testers may cause profile fetch errors due to Facebook restrictions.

---

## 👤 Author

**Kushagra Mishra**

- GitHub: [@kushagraMishra22](https://github.com/kushagraMishra22)
- LinkedIn: [Kushagra Mishra](https://www.linkedin.com/in/kushagramishra22)
