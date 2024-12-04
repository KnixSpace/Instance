const axios = require('axios');
const dotenv = require('dotenv');
const {Notion} = require("../../models/Notion"); 

async function addContent(pageId,text,accountId) { 
   
    try { 
         
        // Fetch Notion account details
        const user = await Notion.findOne({ accountId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const access_token = user.accessToken;

        // Define Notion API for add content and headers

        const response = await axios.patch(
            `https://api.notion.com/v1/blocks/${pageId}/children`,
            {
                children: [
                    {
                        object: 'block',
                        type: 'paragraph',
                        paragraph: {
                            rich_text: [
                                {
                                    type: 'text',
                                    text: {
                                        content: text
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                }
            }
        );
             
        return{
            success: true,
            message: 'Content added successfully',
            data: response.data 
        }; 

    } catch (error) {
    // Capture and return error details
    const errorMessage = error.response
    ? error.response.data.message || error.response.data
    : error.message;

  return {
    success: false,
    message: `Failed to add content : ${errorMessage}`,
  };
    }
}

module.exports = { addContent }; 