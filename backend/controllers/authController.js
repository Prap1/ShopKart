import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

const generateVerificationToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  return token;
};

const sendVerificationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "praphool47@gmail.com",
      pass: "mgxlfctsihuhysco",
    },
  });

  const mailOptions = {
    from: "praphool47@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `
      <p>Please click the following link to verify your email address:</p>
      <a href="http://localhost:3000/verify/${token}">Verify Email</a>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validations
    if (!name) {
      return res.send({ error: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone number is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Register user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      verificationToken,
    }).save();

    sendVerificationEmail(user.email, verificationToken);

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).send({
        success: false,
        message: "Email is not verified",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await userModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid verification token",
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Email verification successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in email verification",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required" });
    }

    // Check user
    const user = await userModel.findOne({ email, answer });

    // Validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    // Password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and should be min 6 characters long" });
    }
    const hashedPassword = await hashPassword(password);

    // Update
    await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        password: password ? hashedPassword : user.password,
        address: address || user.address,
        phone: phone || user.phone,
      },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating order",
      error,
    });
  }
};

