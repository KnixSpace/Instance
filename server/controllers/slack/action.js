const axios = require('axios');
const { WebClient } = require('@slack/web-api');
const { Slack } = require('../../models/Slack');

async function createChannel(req,res){

    try{ 
        const accountId = "U07CM8QF065"; // req.params.accountId
        const channelName = "new-channel-01"; // req.body.channelName
        const isPrivate = false; // req.body.isPrivate

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

        res.json({
            success: true,
            channel: {
                id: result.channel.id,
                name: result.channel.name,
                is_private: result.channel.is_private
            }
        });

    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create channel',
            error: error.message
        });
    }
} 

async function getChannelList(req, res) {
    try {
        const accountId = "U07CM8QF065"; // req.params.accountId
        
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

        res.json({
            success: true,
            channels
        });

    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch channels',
            error: error.message
        });
    }
} 
async function sendMessage(req, res) {
    try {
        const accountId = "U07CM8QF065"; // req.params.accountId
        const channelId = "C07CXCDPPU0"; // req.body.channelId
        const message = "Hello from API"; // req.body.message

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

        res.json({
            success: true,
            message: 'Message sent successfully',
            messageDetails: {
                ts: result.ts,
                channel: result.channel
            }
        });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
}

module.exports = {
    createChannel,
    getChannelList,
    sendMessage
};