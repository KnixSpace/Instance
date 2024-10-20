require("dotenv").config();
const { google } = require("googleapis");
const { Integration } = require("../../models/Integration");
const { User } = require("../../models/User");
const { Google } = require("../../models/Google");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_INTEGRATION_CALLBACK_URI
);

const register = async (req, res) => {
  const SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  // const { scope } = req.body;\
  const scope = "drive";

  switch (scope) {
    case "drive":
      SCOPES.push("https://www.googleapis.com/auth/drive");
      SCOPES.push("https://www.googleapis.com/auth/spreadsheets");
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
};

const callback = async (req, res) => {
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function handleIntegration(userId, accountId, email, avatar, tokens) {
  const existingIntegration = await Integration.findOne({
    userId,
    provider: "google",
  }).populate({ path: "accounts", select: "accountId email" });
  console.log(existingIntegration);

  if (existingIntegration) {
    await updateExistingIntegration(
      userId,
      existingIntegration,
      accountId,
      email,
      avatar,
      tokens
    );
  } else {
    console.log("new");
    await createNewIntegration(userId, accountId, email, avatar, tokens);
  }
}

async function updateExistingIntegration(
  userId,
  integration,
  accountId,
  email,
  avatar,
  tokens
) {
  const accounExists = integration.accounts.some(
    (account) => account.accountId === accountId
  );

  if (!accounExists) {
    let newAccount = new Google({
      userId,
      integrationId: integration._id,
      avatar,
      email,
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
  } else {
    return;
  }
}

async function createNewIntegration(userId, accountId, email, avatar, tokens) {
  let newIntegration = new Integration({
    userId,
    provider: "google",
  });
  newIntegration = await newIntegration.save();

  let newAccount = new Google({
    userId,
    integrationId: newIntegration._id,
    avatar,
    email,
    accountId,
    tokens: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiry: tokens.expiry_date,
    },
  });
  newAccount = await newAccount.save();

  newIntegration = await Integration.findOne({ userId, provider: "google" });
  newIntegration.accounts.push(newAccount._id);
  await newIntegration.save();

  const user = await User.findById(userId);
  user.integrations.push(newIntegration._id);
  await user.save();
}

module.exports = { register, callback };
