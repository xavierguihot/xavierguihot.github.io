function drawStackOverflow(stackOverflowContainer, activateApiCalls) {

  drawFlair(stackOverflowContainer, activateApiCalls);
};

function drawFlair(stackOverflowContainer, activateApiCalls) {

  if (activateApiCalls) {

    stackOverflowContainer.append("svg:image")
    .attr("id", "stack-overflow-flair")
    .attr("xlink:href", "https://stackoverflow.com/users/flair/9297144.png")
    .attr("transform", "translate(870,1125)")
    .attr("width", 150)
    .attr('height', 41.7)
    .style("cursor", "pointer")
    .on("click", function() {
      window.open("https://stackoverflow.com/users/9297144/xavier-guihot","_blank")
    });

    let profileUrl = "https://stackoverflow.com/users/9297144/xavier-guihot"
    let crossDomainUrl = "https://crossorigin.me"

    $.get(crossDomainUrl + "/" + profileUrl, function(response) {

      var topInfo =
        "top " +
        response
          .split("top ")[1].split("</a>")[0]
          .replace("<b>", "").replace("</b>", "");

      drawTopSoPct(topInfo, stackOverflowContainer);
    });
  }
}

function drawTopSoPct(topInfo, stackOverflowContainer) {

  let lines = [
    { "line": topInfo.split("%")[0] + "%", "x": 911, "y": 1154 },
    { "line": topInfo.split("%")[1], "x": 911, "y": 1163 }
  ]

  stackOverflowContainer
    .selectAll("top-so-pct")
    .data(lines)
    .enter().append("text")
    .text( function(d) { return d.line; })
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
    .style("fill", "#07C")
    .style("font-family", "Arial,\"Helvetica Neue\",Helvetica,sans-serif")
    .style("font-size", "8.5px")
    .style("font-weight", "bold")
    .style("cursor", "pointer")
    .on("click", function() {
      window.open("https://stackoverflow.com/users/9297144/xavier-guihot","_blank")
    });
}
