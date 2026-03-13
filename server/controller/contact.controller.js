import Contact from "../models/contact.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, subject } = req.body;

    if (!name || !email || !subject) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const contact = new Contact({ name, email, subject });
    await contact.save();

    return res.status(201).json({ message: "Message sent successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};