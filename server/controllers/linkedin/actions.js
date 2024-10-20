require("dotenv").config();
const axios = require("axios");
const { Linkedin } = require("../../models/Linkedin");

async function postShare(text, userId, email) {
  // const text = "This is my first post on linkedin";
  // const email = "prakashbhukan95@gmail.com";

  const user = await Linkedin.findOne({ email });
  // console.log(user);

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  const access_token = user.accessToken;
  const userId = user.accountId;
  // console.log(access_token);
  // console.log(userId);

  const apiUrl = "https://api.linkedin.com/v2/ugcPosts";
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
    "X-Restli-Protocol-Version": "2.0.0",
  };

  const postData = {
    author: `urn:li:person:${userId}`, // Your LinkedIn Person URN
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: text,
        },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  try {
    const response = await axios.post(apiUrl, postData, { headers });
    return {
      success: true,
      message: "Post shared successfully on LinkedIn!",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error sharing post on linkedin",
      error: error.response ? error.response.data : error.message,
    };
  }
}

module.exports = { postShare };
