/** Draws the rays (segments), going from the center of white circles.
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function Ray(svg, lifePeriod, i) {

  // The drawing of the segment (the ray):
  svg.selectAll("line_period_" + i)
    .data(lifePeriod.rays)
    .enter().append("line")
    .attr("x1", d => d.x1)
    .attr("y1", d => d.y1)
    // x2 and y2 are initialized as x1 and y1, but are modified by the transition
    .attr("x2", d => d.x1)
    .attr("y2", d => d.y1)
    .attr("stroke", d => d.ray.color)
    .attr("stroke-width", d => d.ray.width)
    .attr("fill", "none")
    .transition()
    .duration(1300)
    .attr("x2", d => d.x2)
    .attr("y2", d => d.y2);

  // The drawing of the text:
  svg.selectAll("text_period_" + i)
    // Some rays don't have text:
    .data(lifePeriod.rays.filter(d => d.text))
    .enter().append("text")
    .text(d => d.text.label)
    .attr("class", d => d.class)
    .attr("transform", d => {

      // In order to put the text to the left or the right of the ray:
      let angle = d.text.reverse_text ? d.angle : 180 + d.angle;

      return (
        // Move to the end of the ray (should be x2 and y2,
        // but since at initialisation we make the text
        // appear from the circle, it's x1 and y1):
        "translate(" + d.x1 + "," + d.y1 + ")" +
        // Rotate to be aligned with the ray (at its left or right):
        "rotate(" + angle + ")" +
        // Slightly move away the text from the ray:
        "translate(0,-10)"
      );
    })
    .attr("dy", d => d.text.dy + "em")
    .attr("text-anchor", d => d.text.reverse_text ? "end" : "begin")
    .style("font-family", d => d.text.font)
    .style("font-size", d => d.text.size + "px")
    .style("cursor", d => d.redirect ? "pointer" : "default")
    .style("user-select", "none")
    .attr("stroke", "white")
    .on("mouseover", d => {
      if (d.mouseover_images)
        d.mouseover_images.forEach(y => {
          // The image's shadow:
          d3.select("#shadow_" + y.path.replace(/\//g, "_").replace(/.png/g, ""))
            .style("opacity", 0.60); // 0.24 for a light shadow
          // The image:
          d3.select("#" + y.path.replace(/\//g, "_").replace(/.png/g, ""))
            .style("opacity", 1);
        });
    }).on("mouseout", d => {
      if (d.mouseover_images)
        d.mouseover_images.forEach(y => {
          // The image's shadow:
          d3.select("#shadow_" + y.path.replace(/\//g, "_").replace(/.png/g, ""))
            .style("opacity", 0);
          // The image:
          d3.select("#" + y.path.replace(/\//g, "_").replace(/.png/g, ""))
            .style("opacity", 0);
        });
    })
    .on("click", d => { if (d.redirect) window.open(d.redirect, "_blank"); })
    .transition()
    .duration(1300)
    .attr("stroke", d => d.text.color)
    .attr("transform", d => {

      let angle = d.text.reverse_text ? d.angle : 180 + d.angle;

      // Same as the initialisation transformation, except it defines the final
      // position of the text:
      return (
        "translate(" + d.x2 + "," + d.y2 + ")" +
        "rotate(" + angle + ")" +
        "translate(0,-10)"
      );
    });

  // The text tooltips:
  $("text.tooltiped").tipsy({
    html: true,
    gravity: "sw",
    opacity: 1.0,
    title: function() {
      let d = this.__data__;
      return "<div style=\"color:lightgrey;font-size:14px;text-align:center\">" + d.tooltip + "</div>";
    }
  });
}
