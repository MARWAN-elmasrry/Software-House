import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import contactRoutes from "./routes/contact.route.js";

dotenv.config(); 

const app = express();

connectDB().then().catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json()); 

app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`; 

app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}`);
});