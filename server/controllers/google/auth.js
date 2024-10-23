require("dotenv").config();
const { google } = require("googleapis");
const { Integration } = require("../../models/Integration");
const { User } = require("../../models/User");
const { Google } = require("../../models/Google");
const { oauth2Client } = require("./config");

async function register(req, res) {
  const SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/drive",
  ];

  let scope = req.body.scope;

  switch (scope) {
    case "drive":
      SCOPES.push("https://www.googleapis.com/auth/drive");
      break;
    case "sheets":
      SCOPES.push("https://www.googleapis.com/auth/spreadsheets");
      break;
    case "docs":
      SCOPES.push("https://www.googleapis.com/auth/documents");
      break;
    default:
      break;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  res.redirect(authUrl);
}

async function callback(req, res) {
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
    res.redirect(process.env.CLIENT_BASE_URL);
  } catch (error) {
    console.error("Error handling Google callback:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
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
    provider: "google",
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
  const accountExist = integration.accounts.some(
    (account) => account.accountId === accountId
  );

  if (accountExist) {
    const account = await Google.findOne({ accountId });
    account.tokens.accessToken = tokens.access_token;
    account.tokens.refreshToken = tokens.refresh_token;
    account.tokens.expiry = tokens.expiry_date;
    await account.save();
  } else {
    let newAccount = new Google({
      userId,
      integrationId: integration._id,
      avatar,
      email: accountEmail,
      accountId,
      tokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiry: tokens.expiry_date,
      },
    });

    newAccount = await newAccount.save();
    integration.accounts.push(newAccount._id);
    await integration.save();
  }
}

async function createNewIntegration(
  userId,
  accountId,
  accountEmail,
  avatar,
  tokens
) {
  try {
    const newIntegration = await new Integration({
      userId,
      provider: "google",
    }).save();

    const newAccount = await new Google({
      userId,
      integrationId: newIntegration._id,
      avatar,
      email: accountEmail,
      accountId,
      tokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiry: tokens.expiry_date,
      },
    }).save();

    newIntegration.accounts.push(newAccount._id);
    await newIntegration.save();

    const user = await User.findById(userId);
    user.integrations.push(newIntegration._id);
    await user.save();
  } catch (error) {
    console.error("Error creating new integration:", error);
  }
}

module.exports = { register, callback };
