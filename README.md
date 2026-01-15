# Portfolio Backend 

This is the backend server for my personal portfolio website.

## 🔧 Tech Stack
- Node.js
- Express.js
- MongoDB (Atlas)
- Nodemailer (Gmail)

## ✨ Features
- Contact form API
- Saves messages to MongoDB
- Sends email notification on every message
- CORS enabled
- Production ready

## 📌 API Endpoint
POST `/api/contact`

### Request Body:
```json
{
  "name": "User Name",
  "email": "user@email.com",
  "subject": "Hello",
  "message": "This is a test message"
}
