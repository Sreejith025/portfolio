import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  // ✅ Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // ✅ Manually parse body (Vercel fix)
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(buffers).toString());

    const { name, email, message } = body;

    if (!name  !email  !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ MongoDB
    const client = await connectToDatabase();
    const db = client.db("portfolio");
    const collection = db.collection("contacts");

    await collection.insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    // ✅ Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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
      ,
    });

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}