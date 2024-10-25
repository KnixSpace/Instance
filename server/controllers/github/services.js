const { default: axios } = require("axios");
const { Github } = require("../../models/Github");

async function getRepoDetails(req, res) {
  const userId = req.body.userId;
  const events = req.body.events;

  // if (!userId || !Array.isArray(events) || events.length === 0) {
  //   return res
  //     .status(400)
  //     .json({
  //       message: "Invalid input. Please provide userId and events array.",
  //     });
  // }

  try {
    const gitAccount = await Github.findOne({ userId });
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
                type: "all",
                sort: "created",
                direction: "desc",
                per_page: 100, // Max items per page
                page,
              },
            }
          );

          const repos = reposResponse.data;
          allRepos = allRepos.concat(repos);

          // Check if fewer than 100 repos are returned (end of pages)
          if (repos.length < 100) {
            fetchMore = false;
          } else {
            page++; // Fetch the next page
          }
        }

        return allRepos;
      };

      const repos = await getAllRepos(gitAccount.accessToken);

      const repoDetails = repos.map((repo) => ({
        repoId: repo.id,
        repoName: repo.full_name,
      }));
      res.status(200).json({
        message: "Repositories fetched successfully",
        repos,
        // events,
      });
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
}

module.exports = { getRepoDetails };
