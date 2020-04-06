/** Draws the arcs around circles.
 *
 * You may have noticed that arc shadows are drawn for all life periods before
 * drawing the actual arcs. In fact if you do the loop on life periods and apply
 * the drawing of both shadows and arcs one period after the other, you'll then
 * have, for periods with joined arcs, the shadow of the arc of the next period
 * visible at the junction with the arc of the previous period.
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function drawArcs(svg, jsonTimeLine) {

  // The color gradients container:
  let gradientDefs = svg.append("svg:defs");

  // We first draw the shadows of arcs:
  jsonTimeLine.life_parts.forEach(
    lifePeriod => { if (lifePeriod.arcs) drawArcShadow(lifePeriod.arcs) }
  );

  // And then we draw the arcs and their label:
  jsonTimeLine.life_parts.forEach( lifePeriod => {
    if (lifePeriod.arcs) {
      drawArcShapes(lifePeriod.arcs);
      drawArcTexts(lifePeriod.arcs);
      addTooltips(lifePeriod.arcs);
    }
  });

  /** Draws the arc shapes with a color gradient */
  function drawArcShapes(arcs) {

    // The end angle is not defined yet since it will be during the
    // transition:
    let arc = d3.arc()
      .innerRadius(d => d.inner_radius)
      .outerRadius(d => d.outer_radius)
      .startAngle(d => d.start_angle);

    svg.selectAll("arc_shape_path")
      .data(arcs)
      .enter().append("path")
      .attr("d", d => arc(d))
      .attr(
        "transform",
        d => "translate(" + d.circle_center_x + "," + d.circle_center_y + ")"
      )
      // The color gradient style:
      .attr("fill", d => generateGradientFill(d))
      // Let's add the transition which makes the arc appear, by
      // transitioning the endAngle from start_angle to end_angle:
      .transition()
      .duration(1300)
      .attrTween("d", d => {
        let i = d3.interpolate(d.start_angle + 0.1, d.end_angle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });
  }

  /** Draws a shadow under arc shapes.
   *
   * I'd have preferred to set the shadow on the actual arc shapes (within the
   * drawArcShapes function), but in order to lower the darkness of the
   * shadow, we have to use the "opacity" style, which would otherwise also
   * apply to the brightness of the color gradient, making it lighter.
   */
  function drawArcShadow(arcs) {

    // The end angle is not defined yet since it will be during the transition:
    let arc = d3.arc()
      .innerRadius(d => d.inner_radius)
      .outerRadius(d => d.outer_radius)
      .startAngle(d => d.start_angle);

    svg.selectAll("arc_shape_path_for_shadow")
      .data(arcs)
      .enter().append("path")
      .attr("d", d => arc(d))
      .attr(
        "transform",
        d => "translate(" + d.circle_center_x + "," + d.circle_center_y + ")"
      )
      .attr("fill", d => {
        // The exceptional case for which one of the colors is white and we want
        // the arc shadow to disappear the same way the arc becomes white (i.e.
        // we need a gradient for the shadow as well):
        if (d.shadow_dissipation) return generateShadowGradientFill(d);
        // For any other arc:
        else return "white";
      })
      .style("filter", "url(#drop-shadow)")
      // Adjusts the darkness of the shadow:
      .style("opacity", 0.30)
      // Let's add the transition which makes the arc appear, by transitioning
      // the endAngle from start_angle to end_angle:
      .transition()
      .duration(1300)
      .attrTween("d", d => {
        let i = d3.interpolate(d.start_angle + 0.1, d.end_angle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });
  }

  /** Draws the text within arc shapes.
   *
   * Thanks to Nadieh Bremer for her life saving post related to the question of
   * curved texts within curved areas:
   * https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html
   */
  function drawArcTexts(arcs) {

    // We must draw another arc (invisible this time, just a pattern), to
    // be able to center the text inside the gradient-colored arc shape
    // (otherwise it could only be placed outside the arc shape...):
    let arc = d3.arc()
      // When label is flipped, we need an offset to move away the text to the
      // exterior:
      .innerRadius(d => d.inner_radius + (d.text.startOffset ? 7 : 0))
      .outerRadius(d => d.text_radius)
      .startAngle(d => d.start_angle)
      .endAngle(d => d.end_angle);

    svg.selectAll("arc_text_path")
      // We filter out arcs for which we don't have text:
      .data(arcs.filter(d => d.text))
      .enter().append("path")
      .attr("id", d => d.id)
      .attr("d", d => arc(d))
      .attr(
        "transform",
        d => "translate(" + d.circle_center_x + "," + d.circle_center_y + ")"
      )
      .attr("fill", "none");

    // Once the pattern curved shape set, we can put the text (textPath) by
    // referencing the associated shape:
    svg.selectAll("arc_text")
      // We filter out arcs for which we don't have text:
      .data(arcs.filter(d => d.text))
      .enter().append("text").append("textPath")
      // Link to the curved arc to use as a pattern:
      .attr("xlink:href", d => "#" + d.id)
      // Quick fix for labels which are flipped (default is 6px) (this is dirty):
      .attr("startOffset", d => d.text.startOffset ? d.text.startOffset : "6px")
      // weirdly enough, here you should use "attr" instead of "style":
      .attr("font-size", d => d.text.size)
      .attr("font-family", "Heebo")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .style("user-select", "none")
      .text(d => d.text.label)
      .transition()
      .duration(1300)
      .attr("fill", d => d.text.color);
  }

  /** And yet another arc drawing, this time to provide the tooltip.
   *
   * We could have left the tooltip insertion to the real arc shape (the one)
   * with the color, but since there is the text above, we would have had to add
   * the tooltip to the text as well, for when the mouse hovers the text within
   * the arc. And even this way, the tooltip would have moved when the mousse
   * transitions from the shape to the text.
   */
  function addTooltips(arcs) {

    let arc = d3.arc()
      .innerRadius(d => d.inner_radius)
      .outerRadius(d => d.outer_radius)
      .startAngle(d => d.start_angle)
      .endAngle(d => d.end_angle);

    svg.selectAll("arc_shape_tooltip")
      .data(arcs)
      .enter().append("path")
      .attr("d", d => arc(d))
      .attr("class", d => d.class)
      .attr(
        "transform",
        d => "translate(" + d.circle_center_x + "," + d.circle_center_y + ")"
      )
      .style("fill", "transparent")
      .style("cursor", d => d.redirect ? "pointer" : "default")
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
      .on("click", d => { if (d.redirect) window.open(d.redirect, "_blank") });

    // And the tooltip whenever there's one:
    $("path.tooltiped").tipsy({
      html: true,
      gravity: "sw",
      opacity: 1.0,
      title: function() {
        let d = this.__data__;
        return "<div style=\"color:lightgrey;font-size:14px;text-align:center\">" + d.tooltip + "</div>";
      }
    });
  }

  /** Defines the color gradient to apply to an arc.
   *
   * Mostly helped here by Dan Kronstal's example at:
   *    https://bl.ocks.org/dankronstal/b12b025d0eea52ad3f4a
   */
  function generateGradientFill(d) {

    let newGrad = gradientDefs.append("svg:linearGradient")
      .attr("id", d.id + "-gradient")
      // We rotate the gradient to fit the average angle between the
      // start and end angles:
      .attr("gradientTransform", "rotate(" + d.gradient_rotation + ")")
      .attr("spreadMethod", "pad");

    // We set the color transitions and where they happen:
    d.gradient_colors.forEach( function(gradientTransition) {
      newGrad.append("svg:stop")
        .attr("offset", gradientTransition.offset + "%")
        .attr("stop-color", gradientTransition.color)
        .attr("stop-opacity", 1);
    });

    return "url(#" + newGrad.attr("id") + ")";
  }

  /** Same as generateGradientFill, but used to give a gradient to the arc shadow.
   *
   * This is only used when an extremity of the arc is white and we want for the
   * white part of the gradient to be shadow free.
   */
  function generateShadowGradientFill(d) {

    let newGrad = gradientDefs.append("svg:linearGradient")
      .attr("id", d.id + "-gradient-shadow")
      .attr("gradientTransform", "rotate(" + d.gradient_rotation + ")")
      .attr("spreadMethod", "pad");

    // We set the color transitions and where they happen:
    d.gradient_colors.forEach( gradientTransition => {

      let fillColor = gradientTransition.dissipation ? "none" : gradientTransition.color;
      let fillOpacity = gradientTransition.dissipation ? 0 : 1;

      newGrad.append("svg:stop")
        .attr("offset", gradientTransition.offset + "%")
        .attr("stop-color", fillColor)
        .attr("stop-opacity", fillOpacity);
    });

    return "url(#" + newGrad.attr("id") + ")";
  }
}
