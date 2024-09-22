import express from "express";
import {
  testRegister,
  testLogin,
  checkAuth,
} from "../controllers/testController.js"; // Ensure this path is correct

const router = express.Router();

// Test route to register a user
router.post("/test/create", testRegister);

// Test route to log in a user
router.post("/test/login", testLogin);

// Test route to check authentication
router.get("/test/auth", checkAuth);

export default router;
