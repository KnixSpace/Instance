require("dotenv").config();
const axios = require("axios");
const { Integration } = require("../../models/Integration");
const { User } = require("../../models/User");
const {Slack} = require("../../models/Slack");

const SLACK_OAUTH_URL = "https://slack.com/oauth/v2/authorize";
const SLACK_TOKEN_URL = "https://slack.com/api/oauth.v2.access";
const SLACK_USER_INFO_URL = "https://slack.com/api/users.identity";

async function register(req,res){
  const BOT_SCOPES = [
    
    "channels:read",
    "channels:write.invites",
    "channels:write.topic",
    "chat:write",
    "users:read",
    "users:read.email",
    "team:read" 
    
];
    // User token scopes
    const USER_SCOPES = [
        "identity.basic",
        "identity.email"
    ];
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `${SLACK_OAUTH_URL}?client_id=${
        process.env.SLACK_CLIENT_ID
    }&redirect_uri=${
       process.env.SLACK_CALLBACK_URI
     }&state=${state}&scope=${BOT_SCOPES.join(",")}&user_scope=${USER_SCOPES.join(",")}`;

     res.status(200).json({ authUrl });
};

async function callback(req,res) {
    try{
        const { code } = req.query;

       
        if (!code) {
            return res.status(400).json({ message: "Authorization code is missing" });
        } 
        const tokenResponse = await axios.post(
            SLACK_TOKEN_URL,
            {
                code,
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                redirect_uri: process.env.SLACK_CALLBACK_URI,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const tokens = tokenResponse.data;
  
        const userResponse = await axios.get(SLACK_USER_INFO_URL, {
            headers: {
                Authorization: `Bearer ${tokens.authed_user.access_token}`,
            },
        });

        const userData = userResponse.data.user;
        res.send(`
            <html>
                <body style="color:#fbfeff;background:#0f1318">
                    <p>Closing the window and refresh accounts...</p>
                </body>
            </html>
        `); 
         const reqId = "67384ee2f7378646cd1821fc"; 
        await handleIntegration(
            reqId,
            userData.id,
            userData.email,
            userData.image_512,
            tokens.access_token
        );
    }catch (error) {
        console.error("Error handling Slack callback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function handleIntegration(
    userId,
    accountId,
    accountEmail,
    avatar,
    accessToken
  ) {
    const existingIntegration = await Integration.findOne({
      userId,
      provider: "slack",
    }).populate({ path: "accounts", select: "accountId email" });
  
    if (existingIntegration) {
      await updateExistingIntegration(
        userId,
        existingIntegration,
        accountId,
        accountEmail,
        avatar,
        accessToken
      );
    } else {
      await createNewIntegration(userId, accountId, accountEmail, avatar, accessToken);
    }
  } 
  
  async function updateExistingIntegration(
    userId,
    integration,
    accountId,
    accountEmail,
    avatar,
    accessToken
  ) {
    const accountExists = integration.accounts.some(
      (account) => account.accountId === accountId
    );
  
    if (!accountExists) {
      const newAccount = await new Slack({
        userId,
        integrationId: integration._id,
        avatar,
        email: accountEmail,
        accountId,
        accessToken: accessToken,
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
    accessToken
  ) {
    const newIntegration = await new Integration({
      userId,
      provider: "slack",
    }).save();
  
    const newAccount = await new Slack({
      userId,
      integrationId: newIntegration._id,
      avatar,
      email: accountEmail,
      accountId,
      accessToken: accessToken
    }).save();
  
    newIntegration.accounts.push(newAccount._id);
    await newIntegration.save();
  
    const user = await User.findById(userId);
    user.integrations.push(newIntegration._id);
    await user.save();
  }
  
  
module.exports = { register, callback };