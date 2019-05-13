
function TextsAndImages(svg, dataPath, x, y) {

  let textAndImagesContainer = svg.append("g")
    .attr("transform", "translate(" + x + "," + y + ")")
    .style("opacity", 0);

  textAndImagesContainer
    .transition().duration(1300)
    .style("opacity", 1);

  d3.json(dataPath).then( function(json) {

    textAndImagesContainer.selectAll("random_text")
      .data(json.sentences)
      .enter().append("a")
      .style("cursor", d => {
        if (d.text.endsWith("@protonmail.com")) return "text";
        if (d.link) return "pointer";
        return "default";
      })
      .append("text")
      .text(d => d.text)
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
      .style("font-family", d => d.font)
      .style("font-size", d => d.size + "px")
      .style("font-weight", d => d.weight)
      .style("fill", d => d.color)
      .style("opacity", d => d.opacity || 1.0)
      .style("text-decoration", d => d.link ? "underline" : undefined)
      .style("user-select", d => d.text.endsWith("@protonmail.com") ? undefined : "none")
      .on("click", d => { if (d.link) window.open(d.link, "_blank"); });

    textAndImagesContainer.selectAll("random_image")
      .data(json.images)
      .enter().append("svg:image")
      .attr("xlink:href", d => d.path)
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
      .attr("width", d => d.width)
      .attr("height", d => d.height)
      .style("opacity", d => d.opacity || 1.0)
      .style("cursor", d => d.link ? "pointer" : "default")
      .on("click", d => { if (d.link) window.open(d.link, "_blank"); });

    // The location icon:
    textAndImagesContainer.append("path")
      .attr("d", "M8.1 17.7S2 9.9 2 6.38A6.44 6.44 0 0 1 8.5 0C12.09 0 15 2.86 15 6.38 15 9.91 8.9 17.7 8.9 17.7c-.22.29-.58.29-.8 0zm.4-8.45a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5z")
      .attr("transform", "translate(-550,910)")
      .style("fill", "#6A737C");
  });
}
