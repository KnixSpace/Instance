require("dotenv").config();
const { Integration } = require("../models/Integration");
const axios = require("axios");
const { User } = require("../models/User");
const { ConnectionStates } = require("mongoose");
const router = require("express").Router();

const LINKEDIN_SCOPES = ["openid", "profile", "email", "w_member_social"];
const LINKEDIN_OAUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_PROFILE_URL = "https://api.linkedin.com/v2/userinfo";

router.get("/register", (req, res) => {
  const authUrl = `${LINKEDIN_OAUTH_URL}?response_type=code&client_id=${
    process.env.LINKEDIN_CLIENT_ID
  }&redirect_uri=${
    process.env.LINKEDIN_CALLBACK_URI
  }&state=123456&scope=${LINKEDIN_SCOPES.join(" ")}`;
  res.redirect(authUrl);
});

router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is missing " });
    }
    const tokenResponse = await axios.post(LINKEDIN_TOKEN_URL, null, {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_CALLBACK_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      },
    });

    const tokens = tokenResponse.data;

    const profileResponse = await axios.get(LINKEDIN_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const profileData = profileResponse.data;

    await handleIntegration(
      req.user.userId,
      profileData.sub,
      profileData.email,
      profileData.picture,
      tokens
    );

    res.redirect(process.env.CLIENT_BASE_URL);
  } catch (error) {
    console.error("Error handling LinkedIn callback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
async function handleIntegration(userId, accountId, email, avatar, tokens) {
  let existingIntegration = await Integration.findOne({
    userId: userId,
    provider: "linkedin",
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
  intigration,
  accountId,
  email,
  avatar,
  tokens
) {
  const accountExists = intigration.accounts.some(
    (account) => account.accountId === accountId
  );

  if (!accountExists) {
    intigration.accounts.push({
      accountId,
      email,
      avatar,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
    await intigration.save();
  }
}
async function createNewIntegration(userId, accountId, email, avatar, tokens) {
  const newIntegration = new Integration({
    userId,
    provider: "linkedin",
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
