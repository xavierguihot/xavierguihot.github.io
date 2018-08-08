
function StackOverflowFlair(svg, x, y) {

  const PROFILE_URL = "https://stackoverflow.com/users/9297144/xavier-guihot?tab=profile";
  const ACCOUNT_INFO = "https://api.stackexchange.com/2.2/users/9297144?order=desc&sort=reputation&site=stackoverflow";

  d3.json(ACCOUNT_INFO).then( function(json) {

    let flairContainer =
      svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

    flairContainer.append("svg:image")
      .attr("id", "stack-overflow-flair")
      .attr("xlink:href", "img/profile_so.png")
      .attr("width", 24)
      .attr("height", 24);

    let reputation =
      json.items[0].reputation.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    addText(flairContainer, reputation, "#535a60", 33, 16, 12, true);

    addText(flairContainer, "●", "#fcca01", 71, 16, 15);
    addText(flairContainer, json.items[0].badge_counts.gold, "#cda400", 81, 16, 12);

    addText(flairContainer, "●", "#8c9298", 95, 16, 15);
    addText(flairContainer, json.items[0].badge_counts.silver, "#8c9298", 105, 16, 12);

    addText(flairContainer, "●", "#c38b5f", 125, 16, 15);
    addText(flairContainer, json.items[0].badge_counts.bronze, "#c38b5f", 135, 16, 12);

    flairContainer.append("svg:image")
      .attr("xlink:href", "img/so-icon.png")
      .attr("x", 153)
      .attr("y", -3)
      .attr("width", 28)
      .attr("height", 28);

    flairContainer.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 180)
      .attr("height", 24)
      .style("fill", "none")
      .attr("pointer-events", "all")
      .style("cursor", "pointer")
      .on("click", function () {
        window.open(PROFILE_URL, "_blank");
      });
  });

  function addText(container, text, color, x, y, size, bold) {
    container.append("a")
      .append("text")
      .text(text)
      .attr("x", x)
      .attr("y", y)
      .style("fill", color)
      .style("font-weight", bold ? "bold": null)
      .style("font-family", "Arial, \"Helvetica Neue\", Helvetica, sans-serif\n")
      .style("font-size", size + "px")
      .style("user-select", "none");
  }
}
