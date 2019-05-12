/** Decorates the timeline data extracted from json with higher level dimensions.
 *
 * For instance, some divs have their id precomputed, angles in degree are
 * casted into radian.
 *
 * @author: Xavier Guihot
 * @since:  2017-07
 */
function decorateData(jsonTimeLine) {

  jsonTimeLine.life_parts = jsonTimeLine.life_parts.map( function(lifePeriod, i) {

    // If there are arcs for this life period:
    if (lifePeriod.arcs) {

      lifePeriod.arcs = lifePeriod.arcs.map( function(d, j) {

        d.gradient_rotation = d.gradient_rotation ? d.gradient_rotation : ((d.start_angle + d.end_angle) % 360) / 2;

        // The arc start and finish angles, casted in radian:
        d.start_angle = Math.radians(d.start_angle);
        d.end_angle = Math.radians(d.end_angle);

        d.outer_radius = d.inner_radius + jsonTimeLine.arc_width;

        if (d.text && !d.text.size)
          d.text.size = 11.5;

        if (d.text && d.text.reverse_text)
          d.text_radius = d.inner_radius + jsonTimeLine.arc_width / 2 + 3;
        else
          d.text_radius = d.inner_radius + jsonTimeLine.arc_width / 2 - 4;

        // To know whether to display a tooltip or not:
        d.class = d.tooltip ? "tooltiped" : "not-tooltiped";

        d.id = "period-" + i + "-ray-" + j;

        // Let's embed in arcs the period center information (white
        // circle center):
        d.circle_center_x = lifePeriod.center_x;
        d.circle_center_y = lifePeriod.center_y;

        return d;
      });
    }

    // If there are rays for this life period:
    if (lifePeriod.rays) {

      lifePeriod.rays = lifePeriod.rays.map( function(d) {

        // The ray angle and the length (from the circle center):
        d.radian = Math.radians(d.angle);

        d.x1 = lifePeriod.center_x + jsonTimeLine.circle_radius * Math.cos(d.radian);
        d.y1 = lifePeriod.center_y + jsonTimeLine.circle_radius * Math.sin(d.radian);
        d.x2 = lifePeriod.center_x + d.length * Math.cos(d.radian);
        d.y2 = lifePeriod.center_y + d.length * Math.sin(d.radian);

        if (d.text && d.text.font === undefined)
          d.text.font = "Heebo";

        if (d.text && d.text.reverse_text === undefined)
          d.text.reverse_text = false;

        // To know whether to display a tooltip or not:
        d.class = d.tooltip ? "tooltiped" : "not-tooltiped";

        return d;
      });
    }

    // I have a circle (the one named "Future") for which I don't want to
    // display the circle, just the text "Future":
    if (lifePeriod.draw_white_circle === undefined)
      lifePeriod.draw_white_circle = true;

    return lifePeriod;
  });

  return jsonTimeLine;
}
