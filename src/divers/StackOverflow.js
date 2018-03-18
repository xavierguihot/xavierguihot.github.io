
function StackOverflowFlair(svg, activateApiCalls, x, y) {

  let FLAIR_URL = "https://stackoverflow.com/users/flair/9297144.png";
  let PROFILE_URL = "https://stackoverflow.com/users/9297144/xavier-guihot";
  let CROSS_DOMAIN_URL = "https://crossorigin.me";

  var flairContainer =
    svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (activateApiCalls) {

    flairContainer.append("svg:image")
      .attr("id", "stack-overflow-flair")
      .attr("xlink:href", FLAIR_URL)
      .attr("width", 150)
      .attr('height', 41.7)
      .style("cursor", "pointer")
      .on("click", function() { window.open(PROFILE_URL,"_blank"); });

    $.get(CROSS_DOMAIN_URL + "/" + PROFILE_URL, function(response) {

      var topInfo =
        "top " +
        response
          .split("top ")[1].split("</a>")[0]
          .replace("<b>", "").replace("</b>", "");

      drawTopSoPct(topInfo, flairContainer);
    });
  }

  function drawTopSoPct(topInfo, flairContainer) {

    var lines = [
      { "line": topInfo.split("%")[0] + "%", "x": 41, "y": 29 },
      { "line": topInfo.split("%")[1], "x": 41, "y": 38 }
    ];

    flairContainer
      .selectAll("top-so-pct")
      .data(lines)
      .enter().append("text")
      .text( function(d) { return d.line; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style("fill", "#07C")
      .style("font-family", "Arial,\"Helvetica Neue\",Helvetica,sans-serif")
      .style("font-size", "8.5px")
      .style("font-weight", "bold")
      .style("cursor", "pointer")
      .on("click", function() { window.open(PROFILE_URL,"_blank"); });
  }
}
