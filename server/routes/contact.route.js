import express from "express";
import { sendMessage, getMessages } from "../controller/contact.controller.js";
// import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", 
//    protect ,
     getMessages);

export default router;