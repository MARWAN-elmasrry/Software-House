import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  patchBlog,
  toggleImportant,
  deleteBlog,
  getStats,
} from "../controller/blog.controller.js";

const router = Router();

// Stats — must come before /:id
router.get("/stats", getStats);

// Collection
router.route("/").get(getAllBlogs).post(createBlog);

// Toggle featured — specific patch before generic /:id
router.patch("/:id/toggle-important", toggleImportant);

// Single resource
router.route("/:id")
  .get(getBlogById)
  .put(updateBlog)
  .patch(patchBlog)
  .delete(deleteBlog);

export default router;