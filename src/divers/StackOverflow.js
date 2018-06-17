
function StackOverflowFlair(svg, x, y) {

  const FLAIR_URL = "https://stackoverflow.com/users/flair/9297144.png";
  const PROFILE_URL = "https://stackoverflow.com/users/9297144/xavier-guihot";

  let flairContainer =
    svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  flairContainer.append("svg:image")
    .attr("id", "stack-overflow-flair")
    .attr("xlink:href", FLAIR_URL)
    .attr("width", 150)
    .attr("height", 41.7)
    .style("cursor", "pointer")
    .on("click", function() { window.open(PROFILE_URL,"_blank"); });
}
