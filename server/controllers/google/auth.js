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
  ];

  const scopes = req.body.scopes;
  SCOPES.push(...scopes);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  res.status(200).json({ authUrl });
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

    await handleIntegration(req.user.userId, userInfo.data, tokens);
    res.send(`
      <html>
        <body style="color:#fbfeff;background:#0f1318">
          <p>Closing the window and refersh accounts...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error handling Google callback:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
}

async function handleIntegration(userId, userInfo, tokens) {
  const existingIntegration = await Integration.findOne({
    userId,
    provider: "google",
  }).populate({ path: "accounts", select: "accountId email" });

  if (existingIntegration) {
    await updateExistingIntegration(
      userId,
      existingIntegration,
      userInfo,
      tokens
    );
  } else {
    await createNewIntegration(userId, userInfo, tokens);
  }
}

async function updateExistingIntegration(
  userId,
  integration,
  userInfo,
  tokens
) {
  const { id, email, picture, name } = userInfo;
  const accountExist = integration.accounts.some(
    (account) => account.accountId === id
  );

  const newScope = tokens.scope.split(" ").filter((item) => item !== "openid");

  if (accountExist) {
    const account = await Google.findOne({ accountId: id });
    account.tokens.accessToken = tokens.access_token;
    account.tokens.refreshToken = tokens.refresh_token;
    account.tokens.expiry = tokens.expiry_date;

    const previousScope = account.scopes;

    if (previousScope.length > 0) {
      const addScope = newScope.filter((item) => !previousScope.includes(item));
      account.scopes.push(...addScope);
    } else {
      account.scopes.push(...newScope);
    }

    await account.save();
  } else {
    let newAccount = new Google({
      userId,
      integrationId: integration._id,
      avatar: picture,
      name,
      email,
      accountId: id,
      scopes: newScope,
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

async function createNewIntegration(userId, userInfo, tokens) {
  const { id, email, picture, name } = userInfo;
  try {
    const newIntegration = await new Integration({
      userId,
      provider: "google",
    }).save();

    const scopes = tokens.scope.split(" ").filter((item) => item !== "openid");

    const newAccount = await new Google({
      userId,
      integrationId: newIntegration._id,
      avatar: picture,
      name,
      email,
      accountId: id,
      scopes,
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
