require("dotenv").config();
const axios = require("axios");
const { Linkedin } = require("../../models/Linkedin");

async function createPost(text, accountId) {
  try {
    // Fetch LinkedIn account details
    const account = await Linkedin.findById(accountId);
    if (!account) {
      return {
        success: false,
        message: "LinkedIn account not found",
      };
    }

    // Define LinkedIn API URL and headers
    const apiUrl = "https://api.linkedin.com/v2/ugcPosts";
    const headers = {
      Authorization: `Bearer ${account.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    };

    // Post data payload
    const postData = {
      author: `urn:li:person:${account.accountId}`, // LinkedIn Person URN
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    // Make the API request
    const response = await axios.post(apiUrl, postData, { headers });

    return {
      status: true,
      data: response.data,
      message: "Post created successfully",
    };
  } catch (error) {
    // Capture and return error details
    const errorMessage = error.response
      ? error.response.data.message || error.response.data
      : error.message;

    return {
      status: false,
      message: `Failed to create post: ${errorMessage}`,
    };
  }
} 

module.exports = { createPost };