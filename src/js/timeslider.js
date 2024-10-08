// import meteoriteMap from './map.js'

export default function timeSlider(data, renderFn) {

	//https://bl.ocks.org/shashank2104/d7051d80e43098bf9a48e9b6d3e10e73
	var margin = {left: 30, right: 30},
		width = 1400,
		height = 50,
		range = [1960, 2014],
		step = 1; // change the step and if null, it'll switch back to a normal slider

	// append svg
	var svg = d3.selectAll('.d3-slider').append('svg')
		.attr("viewBox", "0 0 " + width + " " + height)
		.attr('class', 'slider-svg')

	var slider = svg.append('g')
		.classed('slider', true)
		.attr('transform', 'translate(' + margin.left +', '+ (height/2) + ')');

	// using clamp here to avoid slider exceeding the range limits
	var xScale = d3.scaleLinear()
		.domain(range)
		.range([0, width - margin.left - margin.right])
		.clamp(true);

	// array useful for step sliders
	var rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
	var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
		if (d%2 == 0) return d;
	});

	xScale.clamp(true);
	// drag behavior initialization
	var drag = d3.drag()
		.on('start.interrupt', function () {
			slider.interrupt();
		}).on('start drag', function () {
			dragged(d3.event.x);
		});

	// this is the main bar with a stroke (applied through CSS)
	var track = slider.append('line').attr('class', 'track')
		.attr('x1', xScale.range()[0])
		.attr('x2', xScale.range()[1]);

	// this is a bar (steelblue) that's inside the main "track" to make it look like a rect with a border
	var trackInset = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset');

	var ticks = slider.append('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
		.call(xAxis);

	// drag handle
	var handle = slider.append('circle').classed('handle', true)
		.attr('r', 8);

	// this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
	// try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
	var trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
		.call(drag);

	// initial transition
	slider.transition().duration(750)
		.tween("drag", function () {
			var i = d3.interpolate(0, 10);
			return function (t) {
				dragged(xScale(i(t)));
			}
		});

	function dragged(value) {
		var x = xScale.invert(value), index = null, midPoint, cx, xVal;
		if(step) {
			// if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
			for (var i = 0; i < rangeValues.length - 1; i++) {
				if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
					index = i;
					break;
				}
			}
			midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
			if (x < midPoint) {
				cx = xScale(rangeValues[index]);
				xVal = rangeValues[index];
			} else {
				cx = xScale(rangeValues[index + 1]);
				xVal = rangeValues[index + 1];
			}
		} else {
			// if step is null or 0, return the drag value as is
			cx = xScale(x);
			xVal = x.toFixed(3);
		}
		// use xVal as drag value
        handle.attr('cx', cx);
        console.log(renderFn)
		renderFn(data, xVal);
	}
}