const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Message = require("./models/Message");

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ Contact Form Route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // ✅ Save message to MongoDB
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();
    console.log("✅ Message saved in MongoDB");

    // ✅ EMAIL TRANSPORTER (IMPORTANT)
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // ✅ timeouts (fix for Render timeout)
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});


    // ✅ Mail Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📩 New Portfolio Message: ${subject}`,
      text: `
You got a new message from your portfolio website:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    };

    // ✅ Send Email (safe try-catch)
    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully!");
    } catch (mailError) {
      console.log("⚠️ Email failed but message saved:", mailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "✅ Message received successfully!",
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

