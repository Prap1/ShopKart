import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  verifyEmailController,
  resetPasswordController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Create router object
const router = express.Router();

// Register || METHOD POST
router.post("/register", registerController);

// Login || POST
router.post("/login", loginController);

// Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password",resetPasswordController);

// Test routes
router.get("/test", requireSignIn, isAdmin, testController);

// Protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Update profile
router.put("/profile", requireSignIn, updateProfileController);

// Orders
router.get("/orders", requireSignIn, getOrdersController);

// All orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

// Verify email
router.get("/verify/:token", verifyEmailController);

export default router;
