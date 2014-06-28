var myLocationID;
var myLocation;
var myMeasurement;
var outsideT; var interiorT; var exteriorT;
var RChart = [ [74.8, 15.0, 7.5, 5.0, 3.7, 3.0, 2.5, 2.1, 1.9],
				[68.0, 13.6, 6.8, 4.5, 3.4, 2.7, 2.3, 1.9, 1.7],
				[61.2, 12.2, 6.1, 4.1, 3.1, 2.4, 2.0, 1.7, 1.5],
				[54.4, 10.9, 5.4, 3.6, 2.7, 2.2, 1.8, 1.6, 1.4],
				[47.6, 9.5, 4.8, 3.2, 2.4, 1.9, 1.6, 1.4, 1.2],
				[40.8, 8.2, 4.1, 2.7, 2.0, 1.6, 1.4, 1.2, 1.1],
				[34.0, 6.8, 3.4, 2.3, 1.7, 1.4, 1.1, 1.0, 0.9],
				[27.2, 5.4, 2.7, 1.8, 1.4, 1.1, 0.9, 0.8, 0.7],
				[20.4, 4.1, 2.0, 1.4, 1.0, 0.8, 0.7, 0.6, 0.5],
			  ];

$(document).ready(function() {

/////page forward
	
	//landing -> measure	
	$('.location-img').on('click', function () {
		myLocationID = $(this).attr("id");

		myLocation = $(this).children('p').text();
		$('.my-location').text(myLocation);

		$('#page-landing').hide();
		$('#page-measure').show();
	})

	//measure -> ambient result
	$('#btn-ambient').on('click', function () {
		$('#page-measure').hide();
		$('#page-ambient').show();
		//Generate d3js result
		ShowAmbientResult(myLocationID);
	})

	//measure -> insulation input
	$('#btn-insulation').on('click', function () {
		$('#page-measure').hide();
		$('#page-insulation1').show();
	})

	//insulation input -> insulation result
	$('#btn-result').on('click', function () {
		if (($('#inputOutside').val() === "") && ($('#inputInterior').val() === "") && ($('#inputExterior').val() === "")) {
			alert ("Please input all the values and view the result!");
		} else { 
			outsideT = $('#inputOutside').val();
			interiorT = $('#inputInterior').val();
			exteriorT = $('#inputExterior').val();
			
			CalculateEfficiency(outsideT, interiorT, exteriorT);
			
			$('#page-insulation1').hide();
			$('#page-insulation2').show();
		};
	})

	// ----> recommendations
	$('.btn-rec-eff').on('click', function () {
		$('svg').remove();
		$('#page-insulation2').hide();
		$('#page-ambient').hide();
		$('#page-rec-eff').show();
	})

	$('.btn-rec-amb').on('click', function () {
		$('svg').remove();
		$('#page-insulation2').hide();
		$('#page-ambient').hide();
		$('#page-rec-amb').show();
	})


/////page back

	//measure -> landing
	$('#pre-home').on('click', function () {
		$('#page-measure').hide();
		$('#page-landing').show();
	})
	//insulation input -> measure
	$('#pre-measure').on('click', function () {
		$('#page-insulation1').hide();
		$('#page-measure').show();
	})
	//insulation result -> insulation input
	$('#pre-insulation').on('click', function () {
		$('#page-insulation2').hide();
		$('#page-insulation1').show();
	})
	//ambient result -> measure
	$('#pre-measure-a').on('click', function () {
		$('svg').remove();
		$('#page-ambient').hide();
		$('#page-measure').show();
	})
	//measure -> landing
	$('.go-home').on('click', function () {
		$('#page-rec-amb').hide();
		$('#page-rec-eff').hide();
		$('#page-landing').show();
	})



});

function CalculateEfficiency (outside, interior, exterior) {
	var WallDifference = Math.round((interior - exterior) / 5);
	WallDifference = Math.abs(WallDifference);
	var OutsideT = Math.round(((outside-32)*(5/9))/10)+4;

	if ((WallDifference > 8) && (OutsideT > 8)) {
		return '';
	} else {
		var RValue = RChart[OutsideT][WallDifference];

		$('#rvalue').text(RValue);
		var RValue_parsed = Math.sqrt(RValue * 1000);
		$('#img-efficiency').width(RValue_parsed);
	};
}


function ShowAmbientResult (location) {
	var t = 1297110663, // start time (seconds since epoch)
      	v = 70, // start value (subscribers)
      	data = d3.range(33).map(next); // starting dataset
  
  	function next() {
    	return {
      		time: ++t,
      		value: v = ~~Math.max(10, Math.min(90, v + 10 * (Math.random() - .5)))
    	};
 	};

 	setInterval(function() {
   		data.shift();
	   	data.push(next());
	    redraw();
	}, 2000);

	var w = 42, h = 330; //maximum bar size

	var x = d3.scale.linear().domain([0, 1]).range([0, w]);
	var y = d3.scale.linear().domain([0, 100]).rangeRound([0, h]);

	var chart = d3.select("#ambient-result").append("svg")
		.attr("class", "chart")
		.attr("width", w * data.length - 1)
		.attr("height", h);

	chart.selectAll("rect")
		.data(data)
		.enter().append("rect")
		.attr("x", function(d, i) { return x(i) - .5; })
		.attr("y", function(d) { return h - y(d.value) - .5; })
		.attr("width", w)
		.attr("height", function(d) { return y(d.value); });

	chart.append("line")
		.attr("x1", 0)
		.attr("x2", w * data.length)
		.attr("y1", h - .5)
		.attr("y2", h - .5)
		.style("stroke", "rgb(251,251,251)");

	function redraw() {
		var rect = chart.selectAll("rect")
			.data(data, function(d) { return d.time; });

		rect.enter().insert("rect", "line")
			.attr("x", function(d, i) { return x(i + 1) - .5; })
			.attr("y", function(d) { return h - y(d.value) - .5; })
			.attr("width", w)
			.attr("height", function(d) { return y(d.value); })
			.transition()
			.duration(1000)
			.attr("x", function(d, i) { return x(i) - .5; });
	
		rect.transition()
			.duration(1000)
			.attr("x", function(d, i) { return x(i) - .5; });
	
		rect.exit().transition()
			.duration(1000)
			.attr("x", function(d, i) { return x(i - 1) - .5; })
			.remove();
	}


	


}

	// var margin = {top: 20, right: 20, bottom: 30, left: 40},
	//     width = 960 - margin.left - margin.right,
	//     height = 500 - margin.top - margin.bottom;

	// var x = d3.scale.ordinal()
	//     .rangeRoundBands([0, width], .1);

	// var y = d3.scale.linear()
	//     .range([height, 0]);

	// var xAxis = d3.svg.axis()
	//     .scale(x)
	//     .orient("bottom");

	// var yAxis = d3.svg.axis()
	//     .scale(y)
	//     .orient("left")
	//     .ticks(10, "%");

	// var svg = d3.select("#ambient-result").append("svg")
	//     .attr("width", width + margin.left + margin.right)
	//     .attr("height", height + margin.top + margin.bottom)
	//   .append("g")
	//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// d3.tsv("data/data.tsv", type, function(error, data) {
	//   x.domain(data.map(function(d) { return d.TIME; }));
	//   y.domain([0, d3.max(data, function(d) { return d.VALUE; })]);

	//   svg.append("g")
	//       .attr("class", "x axis")
	//       .attr("transform", "translate(0," + height + ")")
	//       .call(xAxis);

	//   svg.append("g")
	//       .attr("class", "y axis")
	//       .call(yAxis)
	//     .append("text")
	//       .attr("transform", "rotate(-90)")
	//       .attr("y", 6)
	//       .attr("dy", ".71em")
	//       .style("text-anchor", "end")
	//       .text("VALUE");

	//   svg.selectAll(".bar")
	//       .data(data)
	//     .enter().append("rect")
	//       .attr("class", "bar")
	//       .attr("x", function(d) { return x(d.TIME); })
	//       .attr("width", x.rangeBand())
	//       .attr("y", function(d) { return y(d.VALUE); })
	//       .attr("height", function(d) { return height - y(d.VALUE); });

	// });

	// function type(d) {
	//   d.VALUE = +d.VALUE;
	//   return d;
	// }
