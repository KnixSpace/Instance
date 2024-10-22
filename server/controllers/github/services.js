const { default: axios } = require("axios");
const { Github } = require("../../models/Github");
// take the useris from the browser and other then that take the selected events as the array
// here i take the events array for future services and usefor different evets to change the sortof the array
// have to set the error codes according to the errors

async function getRepoDetails(req, res) {
  const userId = req.body.userId;
  const events = req.body.events;
  // const userid='6710c6a43bac3357d7fa895b'; // Extract the events array from the request body


  if (!userId || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ message: 'Invalid input. Please provide userId and events array.' });
  }

  try {
    // Find the GitHub account using the userId
    const gitAccount = await Github.findOne({ userId });
    if (!gitAccount) {
      //   return res.status(404).json({ message: 'GitHub account not linked' });
      res.redirect(`${process.env.HOST_URL}/api/v1/integration/auth/github/register`);
    }
    else {
      // Fetch the repositories for the user using GitHub API
      const reposResponse = await axios.get(
        `https://api.github.com/users/${gitAccount.gituserName}/repos`,
        {
          headers: {
            Authorization: `Bearer ${gitAccount.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            type: 'all', // Fetch all types of repositories (public, private, forks, etc.)
            sort: 'created', // 'created', 'updated', 'pushed', 'full_name'
            direction: 'desc', // In descending order
          },
        }
      );


      const repos = reposResponse.data; // Repositories fetched from GitHub API

      // Create a response array with the repository name, ID, and the events array
      const repoDetails = repos.map((repo) => ({
        repoId: repo.id,
        repoName: repo.full_name, // repo.full_name gives the 'owner/repo' format
        events: events, // The events array provided by the frontend
      }))

      // Respond with the array of repositories, events, and status 200
      res.status(200).json({
        message: 'Repositories fetched successfully',
        repoDetails, // Include repo details with the events array
      });
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ message: 'Failed to fetch repositories' });
  }
}
module.exports = { getRepoDetails };