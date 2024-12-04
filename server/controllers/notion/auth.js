require("dotenv").config();
const axios = require("axios");
const { Integration } = require("../../models/Integration");
const { User } = require("../../models/User");
const { Notion } = require("../../models/Notion");

const NOTION_OAUTH_URL = "https://api.notion.com/v1/oauth/authorize";
const NOTION_TOKEN_URL = "https://api.notion.com/v1/oauth/token";
const NOTION_USER_URL = "https://api.notion.com/v1/users/me";

async function register(req, res) {
  const NOTION_SCOPES = [
    "read_user",
    "read_blocks",
    "read_pages",
    "read_databases",
    "write_blocks",
    "write_pages",
    "write_databases"
  ];

  const state = Math.random().toString(36).substring(7);
  const authUrl = `${NOTION_OAUTH_URL}?client_id=${
    process.env.NOTION_CLIENT_ID
  }&redirect_uri=${
    process.env.NOTION_CALLBACK_URI
  }&response_type=code&owner=user&state=${state}&scope=${NOTION_SCOPES.join(",")}`;
  res.status(200).json({ authUrl });
} 

async function callback(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is missing" });
    }

    const tokenResponse = await axios.post(
      NOTION_TOKEN_URL,
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NOTION_CALLBACK_URI,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );
   
    const tokens = tokenResponse.data;

    const userResponse = await axios.get(NOTION_USER_URL, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "Notion-Version": "2022-06-28",
      },
    });

    const userData = userResponse.data;
    
    const id = userData.id;
    const avatar = userData.avatar_url; 
    const name = userData.name;
    await handleIntegration(
      req.user.userId,
      id,
      avatar,
      tokens,
      name
    );

    res.send(`
      <html>
        <body style="color:#fbfeff;background:#0f1318">
          <p>Closing the window and refresh accounts...</p>
        </body>
      </html>
    `); 
  } catch (error) {
    console.error("Error handling Notion callback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleIntegration(
  userId,
  accountId,
  avatar,
  tokens,
  name
) {
  const existingIntegration = await Integration.findOne({
    userId,
    provider: "notion",
  }).populate({ path: "accounts", select: "accountId email" });

  if (existingIntegration) {
    await updateExistingIntegration(
      userId,
      existingIntegration,
      accountId,
      avatar,
      tokens,
      name
    );
  } else {
    await createNewIntegration(
      userId,
      accountId,
      avatar,
      tokens,
      name
    );
  }
}

async function updateExistingIntegration(
  userId,
  integration,
  accountId,
  avatar,
  tokens,
  name 
) {
  const accountExists = integration.accounts.some(
    (account) => account.accountId === accountId
  );

  if (!accountExists) {
    const newAccount = await new Notion({
      userId,
      integrationId: integration._id,
      avatar,
      accountId,
      accessToken: tokens.access_token,
      name:name
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
  avatar,
  tokens,
  name
) {
  const newIntegration = await new Integration({
    userId,
    provider: "notion",
  }).save();

  const newAccount = await new Notion({
    userId,
    integrationId: newIntegration._id,
    avatar,
    accountId,
    accessToken: tokens.access_token,
    name
  }).save();

  newIntegration.accounts.push(newAccount._id);
  await newIntegration.save();

  const user = await User.findById(userId);
  user.integrations.push(newIntegration._id);
  await user.save();
}

module.exports = { register, callback };