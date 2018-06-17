/** Draws tooltip images which are displayed on mouseovers.
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function TooltipImages(svg, lifePeriod, i) {

  // If there are rays for this life period:
  if (lifePeriod.rays) {

    // The drawing of invisible images which appears when tooltips are
    // activated. It's inside a timer in order to delay the download of images
    // to give enough ram/cpu to initial transitions to be fluid (not sure if it
    // does actually help):
    setTimeout( function() {
      lifePeriod.rays.forEach( (ray, j) => {
        if (ray.mouseover_images)
          drawElmtImages(svg, ray.mouseover_images, i, j);
      });
    }, 2200);
  }

  // If there are arcs for this life period:
  if (lifePeriod.arcs) {

    setTimeout( function() {
      lifePeriod.arcs.forEach( (arc, j) => {
        if (arc.mouseover_images)
          drawElmtImages(svg, arc.mouseover_images, i, j + 1000);
      });
    }, 3000);
  }
}

/** The drawing of mouseover images for a given arc or ray.
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function drawElmtImages(svg, mouseover_images, i, j) {

  // A shape to set a shadow under the image:
  svg.selectAll("image_shadow_" + i + "_" + j)
    .data(mouseover_images)
    .enter().append("svg:image")
    .attr("xlink:href", d => d.path)
    .attr("id", d => "shadow_" + d.path.replace(/\//g, "_").replace(/.png/g, ""))
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", d => d.width)
    .attr("height", d => d.height)
    // This is because it's an element of top of all others, which adds an
    // overlay above other elements and thus catches mouse events when it's not
    // supposed to. Without this, elmts under this image wouldn't have tooltips
    // events:
    .attr("pointer-events", "none")
    .style("filter", "url(#drop-shadow)") // the shadow
    // The image is hidden at first, and will only be revealed when the mouse
    // hovers the ray's label:
    .style("opacity", 0);

  // The image:
  svg.selectAll("ray_tooltip_image_" + i + "_" + j)
    .data(mouseover_images)
    .enter().append("svg:image")
    .attr("id", d => d.path.replace(/\//g, "_").replace(/.png/g, ""))
    .attr("xlink:href", d => d.path)
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", d => d.width)
    .attr("height", d => d.height)
    .attr("pointer-events", "none")
    // The image is hidden at first, and will only be revealed when the mouse
    // hovers the ray's label:
    .style("opacity", 0);
}
