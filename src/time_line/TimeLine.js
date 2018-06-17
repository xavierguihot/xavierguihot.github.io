/** Draws a time line of my professional life.
 *
 * Since I'm cruelly lacking of creativity and since I found this marvelous
 * info-design https://www.behance.net/gallery/7990211/Infographic-Design by
 * Chen-Wen Liang, this script is a tentative at reproducing this timeline with
 * d3.js in order to propose a dynamic version of my resume.
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function TimeLine(svg, dataPath, x, y) {

  d3.json(dataPath).then( function(jsonTimeLine) {

    let decoratedData = decorateData(jsonTimeLine);

    let translatedSvg = svg.append("g")
      .attr("transform", "translate(" + x + "," + y + ")");

    prepareShadows(translatedSvg);

    drawRays(translatedSvg, decoratedData);

    drawWhiteCircles(translatedSvg, decoratedData);

    drawArcs(translatedSvg, decoratedData);

    drawTooltipImages(translatedSvg, decoratedData);
  });

  function drawRays(svg, jsonTimeLine) {
    jsonTimeLine.life_parts.forEach(
      (lifePeriod, i) => { if (lifePeriod.rays) new Ray(svg, lifePeriod, i) }
    );
  }

  function drawTooltipImages(svg, jsonTimeLine) {
    jsonTimeLine.life_parts.forEach(
      (lifePeriod, i) => new TooltipImages(svg, lifePeriod, i)
    );
  }

  /** Prepares the "filter" used to draw shadows (for the white circles for instance).
   *
   * This is almost a perfect copy of this code snippet:
   *    http://bl.ocks.org/cpbotha/5200394.
   *
   * To apply it to an element, it's then enough to add this style:
   *    .style("filter", "url(#drop-shadow)")
   */
  function prepareShadows(svg) {

    let defs = svg.append("defs");

    let filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("width", "300%").attr("height", "300%");

    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");

    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2.5).attr("dy", 2.5)
      .attr("result", "offsetBlur");

    let feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
  }

  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };
}
