/** Draws a word cloud of my IT knowledge.
 *
 * Simple use of the d3-cloud library (https://github.com/jasondavies/d3-cloud),
 * which is itself based on d3 (https://d3js.org/).
 *
 * The size of competences is more of an instantaneous snapshot of my knowledge
 * than a cumulative time spent on a subject (I spent thousands of hours working
 * with Java (more than Scala), but since I haven't used it much these past
 * years, I wouldn't be able to write a single line without StackOverflow, and
 * thus Java is less emphasized in this word graph).
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function drawWordCloud(svg, dataPath, x, y) {

	var fill = d3.scaleOrdinal(d3.schemeCategory20);

	d3.json(dataPath, function(data) {

		// Let's parse json data and add the size a word will take:
		var wordCloud = data.map( function(d) {
			return { text: d.word, size: 6 + d.score * 2.5, score: d.score };
		});

		var layout = d3.layout.cloud()
			.size([600, 750])
			.words(wordCloud)
			.padding(2) // I prefer smaller spaces between words
			.rotate( function(d) {
				// I want words with higher score to be horizontal:
				if (d.score >= 10) return 0;
				// and my small words (in length) to be horizontal as weel:
				else if (d.text.length <= 2) return 0;
				// and others to be randomely horizontal or vertical:
				else return ~~(Math.random() * 2) * -90;
			})
			.font("Impact")
			.fontSize( function(d) { return d.size; })
			.on("end", draw);

		layout.start();

		function draw(words) {

			svg.append("g")
				.attr("transform", "translate(" + x + "," + y + ")")
				.selectAll("text")
				.data(words)
				.enter().append("text")
				.attr("id", function(d) { return d.text; })
				.style("font-family", "Impact")
				.style("fill", function(d, i) { return fill(i); })
				.attr("text-anchor", "middle")
				.attr("transform", function(d) {
					return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) { return d.text; })
				// We prepare the apparition of labels:
				.style("font-size", function(d) { return "0px"; })
				// And perform their apparition ("pop-up"):
				.transition()
				.duration(1000)
				.style("font-size", function(d) { return d.size + "px"; });
		}
	});
}
