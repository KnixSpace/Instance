const { default: axios } = require("axios");
const { Github } = require("../../models/Github");

async function getRepoDetails(req, res) {
  const userId = req.body.userId;
  const accountId= req.body.accountId;

  try {
    const gitAccount = await Github.findOne({ userId ,accountId});
    if (!gitAccount) {
      res.redirect(
        `${process.env.HOST_URL}/api/v1/github/integration/register`
      );
    } else {
      // Function to fetch all repositories (handle pagination)
      const getAllRepos = async (accessToken) => {
        let allRepos = [];
        let page = 1;
        let fetchMore = true;

        while (fetchMore) {
          const reposResponse = await axios.get(
            // `https://api.github.com/users/${username}/repos`, //this will give only the public repos not private ones
            `https://api.github.com/user/repos`, // this api give all private and public repo of the user
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
              },
              params: {
                type: 'owner', 
                sort: 'created', 
                direction: 'desc',
                per_page: 100, // Max items per page
                page,
              },
            }
          );

          const repos = reposResponse.data;
          allRepos = allRepos.concat(repos);

          if (repos.length < 100) {
            fetchMore = false;
          } else {
            page++; // Fetch the next page
          }
        }

        return allRepos;
      };

      const repos = await getAllRepos(gitAccount.accessToken);

      const options = repos.map((repo) => ({
      
        label: repo.full_name, 
        value: repo.id,
      }));
      res.status(200).json({
        message: 'Repositories fetched successfully',
        options,
      });
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
}


module.exports = { getRepoDetails };
