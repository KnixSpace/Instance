require("dotenv").config();
const { Github } = require("../../models/Github");
const { Integration } = require("../../models/Integration");
const { User } = require("../../models/User");
const scope = "user,repo,admin:repo_hook";

const register = async (req, res) => {
  const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=${scope}`;
  res.redirect(authorizeUrl);
};

const callback = async (req, res) => {
  const { code } = req.query;
  // console.log(code);
  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          redirect_uri: process.env.GITHUB_REDIRECT_URI,
          code: code,
        }),
      }
    );

    const tokenResponse = await response.json();

    const { access_token, token_type, scope } = tokenResponse;

    let userResponse = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `bearer ${access_token}`,
        Accept: "application/vnd.github.v3+json", // Optional, but often useful to specify the API version
      },
    });

    userResponse = await userResponse.json();
    const { id, avatar_url, email, login } = userResponse;


    await handleIntegration(
      req.user.userId,
      id,
      email,
      avatar_url,
      tokenResponse,
      login
    );
    res.redirect(process.env.CLIENT_BASE_URL);
  } catch (error) {
    console.log(error);
    res.status(500).send("error duing authorization");
  }
};

async function handleIntegration(userId, accountId, email, avatar, tokens, gituserName) {
  const existingIntegration = await Integration.findOne({
    userId,
    provider: "github",
  }).populate({ path: "accounts", select: "accountId email" });

  if (existingIntegration) {
    await updateExistingIntegration(
      userId,
      existingIntegration,
      accountId,
      email,
      avatar,
      tokens,
      gituserName
    );
  } else {
    await createNewIntegration(userId, accountId, email, avatar, tokens, gituserName);
  }
}

async function updateExistingIntegration(
  userId,
  integration,
  accountId,
  email,
  avatar,
  tokens,
  gituserName
) {
  const accounExists = integration.accounts.find(
    (account) => account.accountId === accountId.toString()
  );

  if (!accounExists) {
    let newAccount = new Github({
      userId,
      integrationId: integration._id,
      avatar,
      email,
      accountId,
      accessToken: tokens.access_token,
      gituserName
    });

    newAccount = await newAccount.save();
    integration.accounts.push(newAccount._id);
    await integration.save();
  } else {
    accounExists.accessToken = tokens.access_token;
    await accounExists.save();
  }
}

async function createNewIntegration(userId, accountId, email, avatar, tokens, gituserName) {
  let newIntegration = new Integration({
    userId,
    provider: "github",
  });
  newIntegration = await newIntegration.save();

  let newAccount = new Github({
    userId,
    integrationId: newIntegration._id,
    avatar,
    email,
    accountId,
    accessToken: tokens.access_token,
    gituserName
  });
  newAccount = await newAccount.save();

  newIntegration = await Integration.findOne({ userId, provider: "github" });
  newIntegration.accounts.push(newAccount._id);
  await newIntegration.save();

  const user = await User.findById(userId);
  user.integrations.push(newIntegration._id);
  await user.save();
}

module.exports = { register, callback };
