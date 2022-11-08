// router.get("/:id", getBorrowers)
// router.post("/", createPost);
// router.patch("/:id", updatePost);
// router.delete("/:id", deletePost);


import express from "express";

// DEFINE ROUTER
const finesRouter = express.Router();

// IMPORT SERVICES
import { createfines, deletefines, getAllfiness, getfines, updatefines } from "../services/fines.service";

// IMPLEMENT ROUTES
finesRouter.get("/", getAllfiness);
finesRouter.get("/:isbn", getfines);
finesRouter.post("/", createfines);
finesRouter.put("/:isbn", updatefines);
finesRouter.delete("/:isbn", deletefines);


export default finesRouter;