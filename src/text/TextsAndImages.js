
function TextsAndImages(svg, dataPath, x, y) {

  let textAndImagesContainer = svg.append("g")
    .attr("transform", "translate(" + x + "," + y + ")");

  d3.json(dataPath).then( function(json) {

    textAndImagesContainer.selectAll("random_text")
      .data(json.sentences)
      .enter().append("a")
      .style("cursor", d => d.link ? "pointer" : "default")
      .append("text")
      .text(d => d.text)
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
      .style("font-family", d => d.font)
      .style("font-size", d => d.size + "px")
      .style("font-weight", d => d.weight)
      .style("fill", d => d.color)
      .style("text-decoration", d => d.link ? "underline": undefined)
      .on("click", d => { if (d.link) window.open(d.link, "_blank"); });

    textAndImagesContainer.selectAll("random_image")
      .data(json.images)
      .enter().append("svg:image")
      .attr("xlink:href", d => d.path)
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
      .attr("width", d => d.width)
      .attr("height", d => d.height)
      .style("cursor", d => d.link ? "pointer" : "default")
      .on("click", d => { if (d.link) window.open(d.link, "_blank"); });
  });
}
