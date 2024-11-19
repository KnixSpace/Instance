const axios = require('axios');
const { WebClient } = require('@slack/web-api');
const { Slack } = require('../../models/Slack');

async function createChannel(req,res){


    try{ 
        const accountId = "U0817RY7NE7"; // req.params.accountId
        const channelName = "new-channel"; // req.body.channelName
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
module.exports = {
    createChannel
};