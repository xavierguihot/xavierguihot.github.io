/** Draws the white circles, which represent parts of my life.
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function drawWhiteCircles(svg, jsonTimeLine) {

  // Each part of the whole graph, centered around a white circle is what I'll
  // call a life period:
  let circleContainers = svg.selectAll("g")
    .data(jsonTimeLine.life_parts)
    .enter().append("g")
    .attr("transform", d => "translate(" + d.center_x + "," + d.center_y + ")");

  circleContainers.append("circle")
    .attr("r", jsonTimeLine.circle_radius)
    .attr("fill", d => d.draw_white_circle ? "white" : "none")
    .attr("stroke-width", 2)
    .style("filter", "url(#drop-shadow)")
    .style("opacity", 0.24); // adjusts the darkness of the shadow

  // The white circles' dates (e.g. 1990-2008):
  circleContainers.append("text")
    .attr("x", 0).attr("y", 0)
    .attr("dy", "0.3em")
    .attr("text-anchor", "middle")
    .style("font-family", "Heebo")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("user-select", "none")
    .text(d => d.label);

  // The white circles' optional underlying part of dates (e.g. apr.-oct.):
  circleContainers.append("text")
    .attr("x", 0).attr("y", 16)
    .attr("dy", "0.3em")
    .attr("text-anchor", "middle")
    .style("font-family", "Heebo")
    .style("font-size", "10px")
    .style("fill", "slategrey")
    .style("font-weight", "bold")
    .style("user-select", "none")
    .text(d => d.sub_label);
}
