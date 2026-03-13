import express from "express";

const router = express.Router();

import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  patchProject,
  deleteProject,
  getStats,
} from "../controller/project.controller.js";

// Stats
router.get("/stats", getStats);

// Collection routes
router
  .route("/")
  .get(getAllProjects)
  .post(createProject);

// Single resource routes
router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .patch(patchProject)
  .delete(deleteProject);

export default router;
