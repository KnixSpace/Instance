require("dotenv").config();
const axios = require("axios");
const { Integration } = require("../../models/Integration");
const { User } = require("../../models/User");
const { Linkedin } = require("../../models/Linkedin");

const LINKEDIN_OAUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_PROFILE_URL = "https://api.linkedin.com/v2/userinfo";

async function register(req, res) {
  const LINKEDIN_SCOPES = ["openid", "profile", "email", "w_member_social"];

  const authUrl = `${LINKEDIN_OAUTH_URL}?response_type=code&client_id=${
    process.env.LINKEDIN_CLIENT_ID
  }&redirect_uri=${
    process.env.LINKEDIN_CALLBACK_URI
  }&state=123456&scope=${LINKEDIN_SCOPES.join(" ")}`;
  res.redirect(authUrl);
}

async function callback(req, res) {
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

    const id = profileResponse.data.sub;
    const email = profileResponse.data.email;
    const picture = profileResponse.data.avatar;

    await handleIntegration(req.user.userId, id, email, picture, tokens);

    res.redirect(process.env.CLIENT_BASE_URL);
  } catch (error) {
    console.error("Error handling LinkedIn callback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleIntegration(
  userId,
  accountId,
  accountEmail,
  avatar,
  tokens
) {
  const existingIntegration = await Integration.findOne({
    userId,
    provider: "linkedin",
  }).populate({ path: "accounts", select: "accountId email" });

  if (existingIntegration) {
    await updateExistingIntegration(
      userId,
      existingIntegration,
      accountId,
      accountEmail,
      avatar,
      tokens
    );
  } else {
    await createNewIntegration(userId, accountId, accountEmail, avatar, tokens);
  }
}

async function updateExistingIntegration(
  userId,
  integration,
  accountId,
  accountEmail,
  avatar,
  tokens
) {
  const accountExists = integration.accounts.some(
    (account) => account.accountId === accountId
  );

  if (!accountExists) {
    const newAccount = await new Linkedin({
      userId,
      integrationId: integration._id,
      avatar,
      email: accountEmail,
      accountId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    }).save();

    integration.accounts.push(newAccount._id);
    await integration.save();
  } else {
    return;
  }
}

async function createNewIntegration(
  userId,
  accountId,
  accountEmail,
  avatar,
  tokens
) {
  const newIntegration = await new Integration({
    userId,
    provider: "linkedin",
  }).save();

  const newAccount = await new Linkedin({
    userId,
    integrationId: newIntegration._id,
    avatar,
    email: accountEmail,
    accountId,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  }).save();

  newIntegration.accounts.push(newAccount._id);
  await newIntegration.save();

  const user = await User.findById(userId);
  user.integrations.push(newIntegration._id);
  await user.save();
}

module.exports = { register, callback };
