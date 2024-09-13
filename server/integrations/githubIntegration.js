require("dotenv").config();
const { Integration } = require("../models/Integration");
const mongoose = require("mongoose");
const { User } = require("../models/User");
const router = require("express").Router();

const SCOPES = [
  "user",
  "repo"
];
//${SCOPES.join()}

router.get("/register",(req,res)=>{
    const authorizeUrl=`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user,repo`;
    res.redirect(authorizeUrl);
  });

  router.get("/callback",async(req,res)=>{
    const {code}=req.query;
    console.log(code);
    try{

      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          redirect_uri: process.env.GITHUB_REDIRECT_URI,
          code: code,
        }),
      });
      
      const tokenResponse = await response.json();
      


      const {access_token,token_type,scope}=tokenResponse;
  
       let userResponse = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          'Authorization': `bearer ${access_token}`,
          'Accept': 'application/vnd.github.v3+json' // Optional, but often useful to specify the API version
        }
      });
      
      userResponse = await userResponse.json();
      const{id,avatar_url,email}=userResponse;
      console.log("hello",id,avatar_url,email);

      await handleIntegration(req.user.userId, id, email,avatar_url,tokenResponse);

      res.redirect(process.env.CLIENT_BASE_URL);
  
    }
    catch(error){
      res.status(500).send('error duing authorization');
    }
  
  });


async function handleIntegration(userId, accountId, email, avatar, tokens) {
  let existingIntegration = await Integration.findOne({
    userId: userId,
    provider: "github",
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
    provider: "github",
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
