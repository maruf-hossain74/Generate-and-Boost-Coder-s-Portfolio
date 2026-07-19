const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");
const User = require("../models/User");
const UserStats = require("../models/UserStats");
const auth = require("../middleware/auth");

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const createUserStats = async (userId) => {
  try {
    await UserStats.create({ userId });
  } catch {
    /* stats doc may already exist */
  }
};

router.post("/signup", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName || email.split("@")[0],
      provider: "local",
    });

    await createUserStats(user._id);

    const token = generateToken(user);

    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        error: `This account uses ${user.provider} sign-in. Please use that method.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/oauth/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "idToken is required" });
    }

    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    const payload = response.data;

    if (!payload.email) {
      return res.status(400).json({ error: "Invalid Google token" });
    }

    let user = await User.findOne({ providerId: payload.sub, provider: "google" });

    if (!user) {
      user = await User.findOne({ email: payload.email.toLowerCase() });
      if (user) {
        user.provider = "google";
        user.providerId = payload.sub;
        if (payload.picture) user.avatar = payload.picture;
        await user.save();
      } else {
        user = await User.create({
          email: payload.email.toLowerCase(),
          displayName: payload.name || payload.email.split("@")[0],
          avatar: payload.picture || "",
          provider: "google",
          providerId: payload.sub,
        });
        await createUserStats(user._id);
      }
    }

    const token = generateToken(user);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: "Google authentication failed" });
  }
});

router.post("/oauth/github", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ error: "Failed to get GitHub token" });
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const profile = userResponse.data;
    const githubId = String(profile.id);

    let email = profile.email;
    if (!email) {
      const emailsResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const primary = emailsResponse.data.find((e) => e.primary);
      email = primary ? primary.email : `${githubId}@github.user`;
    }

    let user = await User.findOne({
      providerId: githubId,
      provider: "github",
    });

    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.provider = "github";
        user.providerId = githubId;
        if (profile.avatar_url) user.avatar = profile.avatar_url;
        await user.save();
      } else {
        user = await User.create({
          email: email.toLowerCase(),
          displayName: profile.name || profile.login || email.split("@")[0],
          avatar: profile.avatar_url || "",
          provider: "github",
          providerId: githubId,
        });
        await createUserStats(user._id);
      }
    }

    const token = generateToken(user);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: "GitHub authentication failed" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

module.exports = router;
