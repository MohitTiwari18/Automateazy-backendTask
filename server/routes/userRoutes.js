import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/test", checkAuth); // Check authentication

export default router;
