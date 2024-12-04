const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_INTEGRATION_CALLBACK_URI
);

//checking for token expiry
function isTokenExpired(expiry) {
  const currentTime = Date.now();
  return currentTime > expiry;
}

//get new tokens from refresh token
async function getNewTokens(refreshToken) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
}

//update new tokens
async function updateTokens(account) {
  try{
  const credentials = await getNewTokens(account.tokens.refreshToken);

  const { access_token, refresh_token, expiry_date } = credentials;

  account.tokens.accessToken = access_token;
  account.tokens.refreshToken = refresh_token;
  account.tokens.expiry = expiry_date;

  await account.save();}
  catch(err){
    console.log(err);
  } 
}

module.exports = { oauth2Client, isTokenExpired, updateTokens };
