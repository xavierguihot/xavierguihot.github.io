
function drawRandomTextsAndImages(svg, dataPath, x, y) {

	var textAndImagesContainer = svg.append("g")
		.attr("transform", "translate(" + x + "," + y + ")");

	d3.json(dataPath, function(json) {

		textAndImagesContainer.selectAll("random_text")
			.data(json.sentences)
			.enter().append("a")
			.attr("xlink:href", function(d) { return d.link ? d.link : undefined; })
			.append("text")
			.text( function(d) { return d.text; })
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.style("font-family", function(d) { return d.font; })
			.style("font-size", function(d) { return d.size + "px"; })
			.style("font-weight", function(d) { return d.weight; })
			.style("fill", function(d) { return d.color; })
			.style("text-decoration", function(d) { return d.link ? "underline": undefined; });

		textAndImagesContainer.selectAll("random_image")
			.data(json.images)
			.enter().append("svg:image")
			.attr("xlink:href", function(d) { return d.path; })
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.attr("width", function(d) { return d.width; })
			.attr("height", function(d) { return d.height; });
	});
}
