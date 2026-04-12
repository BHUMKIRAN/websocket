import User from "../model/user.js";
import forgetToken from "../model/forgetToken.js";
import generateCode from "../lib/codeGenerator.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in ! Please Proceed to login " });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newuser._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      },
    );

    return res.status(201).json({ token, user: newuser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid  password" });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      },
    );
    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tokenDoc = await forgetToken.create({
      userId: user._id,
      token: generateCode(),
      expiresAt: new Date(Date.now() + 3600000),
    });

    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Your password reset token is: ${tokenDoc.token}`,
    });

    return res.status(200).json({
      message: "Reset token sent to email",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tokenDoc = await forgetToken.findOne({ userId: user._id });

    if (!tokenDoc || tokenDoc.token !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (tokenDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    // 🔐 hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password
    user.password = hashedPassword;
    await user.save();

    // delete token after use
    await forgetToken.deleteOne({ userId: user._id });

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const UpdatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password are required" });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  register,
  login,
  resetPassword,
  UpdatePassword,
  forgotPassword,
};
