const axios = require('axios');
const dotenv = require('dotenv');
const {Notion} = require("../../models/Notion"); 
 
async function getPages (req,res){ 
    try {
        //Fetch all pages 
       const { accountId }  = req.body;
       
        const user = await Notion.findById( accountId ); 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }  
        
        //Define Notion API URL and Headers 
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

        //Getting all pages 
        const options = response.data.results.map(page => ({
            value : page.id, 
            label: page.properties.title?.title[0]?.plain_text || 'Untitled'
        }));
        res.status(200).json({ options }); 
 
    } catch (error) {

        // Capture and return error details
        const errorMessage = error.response
        ? error.response.data.message || error.response.data
        : error.message;
  
      return {
        success: false,
        message: `Failed to get pages : ${errorMessage}`,
      };
    }
};  

module.exports = { getPages }; 
