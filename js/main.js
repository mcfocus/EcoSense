$(document).ready(function() {
	
	var myLocation;
	var myMeasurement;
	var outsideT; var interiorT; var exteriorT;

/////page forward
	
	//landing -> measure	
	$('.location-img').on('click', function () {
		myLocation = $(this).attr("id");
		
		$('#page-landing').hide();
		$('#page-measure').show();
	})

	//measure -> ambient result
	$('#btn-ambient').on('click', function () {
		$('#page-measure').hide();
		$('#page-ambient').show();
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
			//alert(exteriorT);
			$('#page-insulation1').hide();
			$('#page-insulation2').show();
		};
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
		$('#page-ambient').hide();
		$('#page-measure').show();
	})

});