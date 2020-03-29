/** Draws a word cloud of my IT knowledge.
 *
 * Simple use of the d3-cloud library (https://github.com/jasondavies/d3-cloud),
 * which is itself based on d3 (https://d3js.org/).
 *
 * The size of competences is more of an instantaneous snapshot of my knowledge
 * than a cumulative time spent on a subject.
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function WordCloud(svg, dataPath, x, y) {

  let fill = d3.scaleOrdinal(d3.schemeCategory20);
  let specialFill = { "scala": "#DC322F", "d3.js": "#F5824C", "python": "#FFDB4E", "spark": "#2FA4E7", "mongodb": "#68B245" }

  d3.json(dataPath).then( function(data) {

    // Let's parse json data and add the size a word will take:
    let wordCloud = data.map( function(d) {
      return { text: d.word, size: 5 + d.score * 2.5, score: d.score };
    });

    let layout = d3.layout.cloud()
      .size([600, 700])
      .words(wordCloud)
      .padding(2) // I prefer smaller spaces between words
      .rotate( function(d) {
        // I want words with higher score to be horizontal:
        if (d.score >= 10) return 0;
        // and my small words (in length) to be horizontal as well:
        else if (d.text.length <= 2) return 0;
        // and others to be randomly horizontal or vertical:
        else return ~~(Math.random() * 2) * -90;
      })
      .font("Impact")
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {

      svg.append("g")
        .attr("transform", "translate(" + x + "," + y + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .attr("id", d => d.text)
        .style("font-family", "Impact")
        .style("fill", (d, i) => specialFill[d.text] || fill(i))
        .style("text-anchor", "middle")
        .style("user-select", "none")
        .attr("transform",
          d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"
        )
        .text(d => d.text)
        // We prepare the apparition of labels:
        .style("font-size", "0px")
        // And perform their apparition ("pop-up"):
        .transition()
        .duration(1000)
        .style("font-size", d => d.size + "px");
    }
  });
}
