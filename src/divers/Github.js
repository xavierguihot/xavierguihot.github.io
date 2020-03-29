
function GithubFlair(user, svg, x, y) {

  Array.prototype.sum = function() { return [].reduce.call(this, (a, i) => a + i, 0); };

  const REPOS_INFO = "https://api.github.com/users/" + user + "/repos";
  const PROFILE_URL = "https://github.com/" + user;

  const flairContainer =
    svg.append("g")
      .attr("id", "github-flair")
      .attr("transform", "translate(" + x + "," + y + ")");

  d3.json(REPOS_INFO).then( function(json) {

    const userRepos = json.filter(r => r.owner.login === user).filter(r => !r.fork);

    const stars = userRepos.map(r => r.stargazers_count).sum();
    const forks = userRepos.map(r => r.forks_count).sum();

    flairContainer.append("svg:image")
      .attr("id", "github-flair-image")
      .attr("xlink:href", "img/profile.png")
      .attr("width", 24)
      .attr("height", 24);

    flairContainer.append("path")
      .attr("id", "github-flair-stars-icon")
      .attr("d", "M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z")
      .attr("transform", "translate(30,5)")
      .style("fill", "#586069");
    addText(flairContainer, stars, 46, 18.5);

    flairContainer.append("path")
      .attr("id", "github-flair-forks-icon")
      .attr("d", "M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z")
      .attr("transform", "translate(64,5)")
      .style("fill", "#586069");
    addText(flairContainer, forks, 78, 18.5);

    flairContainer.append("svg:image")
      .attr("xlink:href", "img/github.png")
      .attr("x", 95)
      .attr("y", 3)
      .attr("width", 18)
      .attr("height", 18);

    flairContainer.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 120)
      .attr("height", 24)
      .style("fill", "none")
      .attr("pointer-events", "all")
      .style("cursor", "pointer")
      .on("click", function () {
        window.open(PROFILE_URL, "_blank");
      });
  });
}

function addText(container, text, x, y) {
  container.append("a")
    .append("text")
    .text(text)
    .attr("x", x)
    .attr("y", y)
    .style("fill", "#586069")
    .style("font-family", "BlinkMacSystemFont")
    .style("font-size", "15px")
    .style("user-select", "none");
}
