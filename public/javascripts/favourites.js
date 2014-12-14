$(function () {

	// Populate drop down list based on contents of local storage
	if (localStorage.length > 0) {
		for (i = 0; i < localStorage.length; i++) {
			var itemKey = localStorage.key(i);
			if (itemKey.indexOf("Panorama") > -1) {
				var value = localStorage.getItem(itemKey);
				$('#favPanoramaList').append(
					$('<option></option>').val(value).html(itemKey));
			}
		}

	}
	
	// Handle display for when there are no favourites
	if ($('#favPanoramaList').children('option').length <= 1) {
		$("#noPansSection").show();
	}
	
	// Objects for panorama display
	var sv;
	var panorama;
	var coords;

	/* Event for when the user selects a favourite from the drop down list */
	$('#favPanoramaList').change(function () {
	
		// Take string from value of drop down option and parse as necessary
		var coordString = $('#favPanoramaList').val();
		if (coordString !== "") {
			var coordsArray = coordString.split(",");
			var lat = coordsArray[0];
			var lon = coordsArray[1];
			
			// Create new google map objects and find panorama associated with favourite coordinates
			coords = new google.maps.LatLng(lat, lon);
			sv = new google.maps.StreetViewService();
			$("#gameSection").show();
			sv.getPanoramaByLocation(coords, 60000, processSVData);
		}
	});

	/* Set up panorama object */
	function processSVData(data, status) {
		if (panorama != null) {
			panorama.setVisible(false);
		}
		if (status == google.maps.StreetViewStatus.OK) {
		
			// Set panorama options
			var panoramaOptions = {
				position : coords,
				addressControl : false,
				linksControl : false,
				panControl : false,
				zoomControlOptions : {
					style : google.maps.ZoomControlStyle.SMALL
				},
				enableCloseButton : false,
				pov : {
					heading : 270,
					pitch : 0
				}
			};
			
			// Display panorama
			panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
			panorama.setPano(data.location.pano);
			panorama.setVisible(true);

		}
	}

});
