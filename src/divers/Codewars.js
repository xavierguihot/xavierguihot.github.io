
function CodewarsFlair(user, svg, x, y) {

  const FLAIR_URL = "https://www.codewars.com/users/" + user + "/badges/micro";
  const PROFILE_URL = "https://www.codewars.com/users/xavierguihot/stats";

  const flairContainer =
    svg.append("g")
    .attr("id", "codewars-flair")
    .attr("transform", "translate(" + x + "," + y + ")");

  flairContainer.append("svg:image")
    .attr("id", "codewars-flair-image")
    .attr("xlink:href", FLAIR_URL)
    .attr("width", 110)
    .attr("height", 18);

  flairContainer.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 110)
    .attr("height", 18)
    .style("fill", "none")
    .attr("pointer-events", "all")
    .style("cursor", "pointer")
    .on("click", function () {
      window.open(PROFILE_URL, "_blank");
    });
}
