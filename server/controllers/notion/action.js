const axios = require('axios');
const dotenv = require('dotenv');

const {Notion} = require("../../models/Notion"); 

async function getPages (req, res){ 
    try {
       // const accountId = "2e370a4a-573b-4713-8dc1-8cf6a0c1f602"; 
         const accountId = req.params.id 
        const user = await Notion.findOne({ accountId });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        } 
        const response = await axios.post('https://api.notion.com/v1/search', 
            {
                filter: { property: 'object', value: 'page' }
            },
            {
                headers: {  
                    Authorization: `Bearer ${user.accessToken}`,
                    'Notion-Version': '2021-08-16',
                    'Content-Type': 'application/json'
                }
            }
        );

        const pages = response.data.results.map(page => ({
            id: page.id,
            title: page.properties.title?.title[0]?.plain_text || 'Untitled'
        }));
    
        res.json({
            pages 
        });

    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pages',
            error: error.message
        });
    }
};
async function addContent(req, res) {
   // const pageId = "4b4a9740-3287-4d59-8961-05ecdbd553cc";
    const pageId = req.params.id;
   // const text = "Minor Project Instance";
    const text = req.body.text;
  //  const accountId = "2e370a4a-573b-4713-8dc1-8cf6a0c1f602";
    const accountId = req.params.accountId
    try {
        const user = await Notion.findOne({ accountId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const access_token = user.accessToken;

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
             
        console.log('Page updated successfully');
        return res.status(200).json({
            success: true,
            message: 'Content added successfully',
            data: response.data
        });

    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to add content',
            error: error.response?.data || error.message
        });
    }
}

module.exports = { getPages, addContent }; 