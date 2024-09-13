require("dotenv").config();
const { google } = require("googleapis");
const { Integration } = require("../models/Integration");
const mongoose = require("mongoose");
const { User } = require("../models/User");
const router = require("express").Router();

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/drive.readonly",
];

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_INTEGRATION_CALLBACK_URI
);

router.get("/register", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(authUrl);
});

router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "Authorization code is missing" });
    } 

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();
    const { id, email, picture } = userInfo.data;
    
    await handleIntegration(req.user.userId, id, email, picture, tokens);
    res.redirect(process.env.WEB_URL);
  } catch (error) { 
    console.error("Error handling Google callback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function handleIntegration(userId, accountId, email, avatar, tokens) {
  let existingIntegration = await Integration.findOne({
    userId: userId,
    provider: "google",
  });

  if (existingIntegration) {
    await updateExistingIntegration(
      existingIntegration,
      accountId,
      email,
      avatar,
      tokens
    );
  } else {
    await createNewIntegration(userId, accountId, email, avatar, tokens);
  }
}

async function updateExistingIntegration(
  integration,
  accountId,
  email,
  avatar,
  tokens
) {
  const accountExists = integration.accounts.some(
    (account) => account.accountId === accountId
  );
  if (!accountExists) {
    integration.accounts.push({
      accountId,
      email,
      avatar,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token, 
    });
    await integration.save();
  }
}

async function createNewIntegration(userId, accountId, email, avatar, tokens) {
  const newIntegration = new Integration({
    userId,
    provider: "google",
    accounts: [
      {
        accountId,
        email,
        avatar,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      },
    ],
  });
  await newIntegration.save();

  const user = await User.findById(userId);
  user.integrations.push(newIntegration._id);
  await user.save();
}
module.exports = router;
