const axios = require('axios');
const { WebClient } = require('@slack/web-api');
const { Slack } = require('../../models/Slack');

async function createChannel(accountId="U07CM8QF065",channelName="hello",isPrivate="false"){
           
    try{  
         
        // Find user's Slack credentials from database
        const user = await Slack.findOne({ accountId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize Slack Web Client
        const client = new WebClient(user.accessToken);

        // Create channel
        const result = await client.conversations.create({
            name: channelName,
            is_private: isPrivate
        });

        return{
            success: true,
            channel: {
                id: result.channel.id,
                name: result.channel.name,
                is_private: result.channel.is_private
            } 
        };

    } catch (error) {
        const errorMessage = error.response
        ? error.response.data.message || error.response.data
        : error.message;
    
      return {
        success: false,
        message: `Failed to send message: ${errorMessage}`,
      };
    }
} 

async function getChannelList(accountId="U07CM8QF065") {
    try {
        // Find user's Slack credentials
        const user = await Slack.findOne({ accountId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize Slack Web Client
        const client = new WebClient(user.accessToken);

        // Get channel list
        const result = await client.conversations.list({
            exclude_archived: true,
            types: 'public_channel,private_channel'
        });

        const channels = result.channels.map(channel => ({
            id: channel.id,
            name: channel.name,
            is_private: channel.is_private,
            member_count: channel.num_members
        }));

        return {
            success: true,
            channels 
        };

    } catch (error) {
           // Capture and return error details
           const errorMessage = error.response
           ? error.response.data.message || error.response.data
           : error.message;
     
         return {
           success: false,
           message: `Failed to get channels: ${errorMessage}`,
         };
    }
} 
async function sendMessage(accountId,channelId,message) { 
    try { 
        // Find user's Slack credentials
        const user = await Slack.findOne({ accountId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize Slack Web Client
        const client = new WebClient(user.accessToken);

        // Send message
        const result = await client.chat.postMessage({
            channel: channelId,
            text: message
        });

       return{
            success: true,
            messageDetails: {
                ts: result.ts,
                channel: result.channel
            } 
        };

    } catch (error) {
    // Capture and return error details
    const errorMessage = error.response
    ? error.response.data.message || error.response.data
    : error.message;

  return {
    success: false,
    message: `Failed to send message: ${errorMessage}`,
  };
    }
}

module.exports = {
    createChannel,
    getChannelList,
    sendMessage
};