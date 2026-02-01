import mongoose from "mongoose";
import nodemailer from "nodemailer";

let isConnected = false;

// Connect MongoDB
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body;

    // OUTLET 1: Save to database
    await new Contact({ name, email, message }).save();

    // OUTLET 2: Email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: "Website Contact" <${process.env.EMAIL_USER}>,
      to: process.env.EMAIL_USER,
      subject: "📩 New Client Message",
      html: 
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      
    });

    return res.status(200).json({
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
}