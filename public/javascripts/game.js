$(function () {

	/* Fallback coordinates if user doesn't accept or have geolocation */
	var londonCoords = new google.maps.LatLng(51.507222, -0.127500);

	/* Google API objects */
	var map;
	var sv;
	var panorama;
	var marker1;
	var marker2;

	/* Coordinate objects */
	var randomPlace;
	var userLoc;

	/* Game variables */
	var totalScore = 0;
	var usingSetCoords = false;
	var isFavourited = false;
	var currentMap = 1;
	var numOfRounds = 5;
	var actualDist;

	// Set display for number of rounds in game
	$("#rounds").html(numOfRounds);

	/* Converts an angle from degrees to radians */
	function toRadians(angle) {
		return angle * Math.PI / 180;
	};

	/* Finds distance between 2 coordinates using haversine formula */
	function getDistance(p1, p2) {
		// Earth’s mean radius in kilometres
		var R = 6378.137;
		var dLat = toRadians(p2.D - p1.D);
		var dLong = toRadians(p2.k - p1.k);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRadians(p1.D)) * Math.cos(toRadians(p2.D)) *
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;

		return d;
	};

	/* Sets up result map and places markers between the 2 locations */
	function setupMap() {

		// Reset map and marker variables
		$("#map-canvas").html("");
		marker1 = null;
		marker2 = null;
		map = null;

		// Hide unused map objects
		var mapOptions = {
			streetViewControl : false,
			zoomControl : false,
			mapTypeControl : false
		};

		// Create a new map based on the defined options
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		var bounds = new google.maps.LatLngBounds(null);

		// Define marker based on panorama's coordinates
		marker1 = new google.maps.Marker({
				position : randomPlace,
				map : map
			});

		// Extend the bounds to include the first marker's position
		bounds.extend(marker1.position);

		// Define marker based on user's/fallback coordinates
		marker2 = new google.maps.Marker({
				position : userLoc,
				map : map
			});

		// Extend the bounds to include each marker's position
		bounds.extend(marker2.position);

		map.fitBounds(bounds);
		map.panToBounds(bounds);
		google.maps.event.trigger(map, 'resize');
	}

	/*
	Perform a check on local storage to see if the current panorama
	has already been favourited.
	 */
	function checkIfFavourited() {
		for (i = 0; i < localStorage.length; i++) {
			var itemKey = localStorage.key(i);
			if (itemKey.indexOf("Panorama") > -1) {
				var value = localStorage.getItem(itemKey);
				if (value == (randomPlace.k + "," + randomPlace.B)) {
					isFavourited = true;
				}
			}
		}
	}

	/* Set up the next round */
	function initialize() {

		// If user doesn't have/refuses to use their location, set their location to London.
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(setUserLoc, setLondonLoc);
		} else {
			setLondonLoc();
		}

		$("#roundNo").html(currentMap);

		// Generate random location coordinates and check for nearest panorama through
		// Google's street view service.
		sv = new google.maps.StreetViewService();
		var long = ((Math.random() * 360) - 180).toFixed(6);
		var lat = ((Math.random() * 180) - 90).toFixed(6);
		randomPlace = new google.maps.LatLng(lat, long);
		sv.getPanoramaByLocation(randomPlace, 60000, processSVData);
	}

	/* Set up panorama or try again if one couldn't be found */
	function processSVData(data, status) {
		if (panorama != null) {
			panorama.setVisible(false);
		}
		if (status == google.maps.StreetViewStatus.OK) {
			// Set random place to panorama's actual location.
			randomPlace = data.location.latLng;

			// Set up favourite heart for this panorama
			$("#heartShape").attr("class", "");
			isFavourited = false;
			checkIfFavourited();
			setFavourited();

			// Set display options for the panorama
			// Set pitch to 0 and heading to a random direction
			var panoramaOptions = {
				position : randomPlace,
				addressControl : false,
				linksControl : false,
				panControl : false,
				zoomControlOptions : {
					style : google.maps.ZoomControlStyle.SMALL
				},
				enableCloseButton : false,
				pov : {
					heading : (Math.random() * 360),
					pitch : 0
				}
			};

			// Display the panorama
			panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
			$("#gameSection").show();
			$("#guessSection").show();
			panorama.setPano(data.location.pano);
			panorama.setVisible(true);

		} else {
			// Didn't find a panorama within the specified range of the coordinates
			// Try again
			initialize();
		}
	}

	/* Set up next round */
	$("#nextRound").click(function () {
		$("#resultSection").hide();
		$("#answerSection").hide();
		initialize();
	});

	/* Calculate distance and score for round when submit button is clicked */
	$("#guessSubmit").click(function () {
		getDistanceFromPan();
	});

	/* Set user loc using the geolocation coordinages of the player */
	function setUserLoc(position) {
		userLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		usingSetCoords = false;
		$("#guessLabel").html("How far are you from this place? (km)");
	}

	/* Set user loc using the London coordinates */
	function setLondonLoc() {
		userLoc = londonCoords;
		usingSetCoords = true;
		$("#guessLabel").html("How far is London from this place? (km)");
	}

	/* Calculate distance and check against user's guess */
	function getDistanceFromPan() {
		if (!isNaN($("#distGuess").val())) {
			var guess = $("#distGuess").val();

			// Get actual distance between user and panorama location
			actualDist = getDistance(userLoc, randomPlace);

			// Find out how far off the player's guess was
			var closeness = actualDist - guess;
			var loc = "";
			if (usingSetCoords) {
				loc = "London";
			} else {
				loc = "your location";
			}
			// Set display of result
			$("#ans").html("You were " + Math.abs(closeness).toFixed(0) + "km off. Actual distance from " + loc + " was " + actualDist.toFixed(0) + "km.");

			var score = 0;

			// Calculate score based on closeness of guess
			if (closeness < 0) {
				score = ((Math.abs(guess) / actualDist) * 100).toFixed(0);
				score = score - 100;
				score = 100 - score;
				if (score < 0) {
					score = 0;
				}
			} else {
				score = ((Math.abs(guess) / actualDist) * 100).toFixed(0);
			}

			//Display score
			if (isNaN(score)) {
				alert("Something went wrong");
			} else {
				$("#score").html(parseInt($("#score").html()) + parseInt(score));
			}

			// Add to total score
			totalScore += parseInt(score);

			// Hide game section and trigger display of result.
			$("#distGuess").val('');
			$("#gameSection").hide();
			$("#guessSection").hide();
			displayResult();
		}
	}

	/* Display result or game over screen when round is complete */
	function displayResult() {
		currentMap += 1;
		$("#resultSection").show();

		if (currentMap <= numOfRounds) {
			// Setup map for display of round result
			setupMap();
			$("#answerSection").show();
		} else {

			// Display final score
			$('body').removeClass('restart').addClass('gameOver');
			$("#finalScoreSection").show();
			$("#finalScore").html(totalScore);

			// Set session best in session storage if new highest
			// Otherwise, get current
			var sessionBest = sessionStorage.getItem('sessionBest');
			if (sessionBest == null || sessionBest < totalScore) {
				sessionBest = totalScore;
				sessionStorage.setItem('sessionBest', sessionBest);
			}

			// Set up all time best score if new highest
			// Otherwise, get current
			var alltimeBest = localStorage.getItem('alltimeBest');
			if (alltimeBest == null || alltimeBest < totalScore) {
				alltimeBest = totalScore;
				localStorage.setItem('alltimeBest', alltimeBest);
			}

			// Display session and all time best scores
			$("#sessionBest").html(sessionBest);
			$("#alltimeBest").html(alltimeBest);

			// Reset scores in anticipation of next game.
			totalScore = 0;
			$("#score").html = 0;
		}
	}

	/* Set hover function and hover leave function for heart button */
	$("#heartShape").hover(function () {
		$("#heartShape").attr('fill', "#250352");
	},
		function () {
		setFavourited();
	});

	/* Set SVG heart colour based on whether the current panorama is favourited */
	function setFavourited() {
		if (isFavourited) {
			$("#heartShape").attr('fill', "#FD6E8A");
		} else {
			$("#heartShape").attr('fill', "#848D82");
		}
	}

	/* When heart button is clicked, set as new favourite if relevant */
	$('#heartShape').click(function () {
		if (!isFavourited) {
			// Add coordinates to favourites within local storage.
			var noOfFavs = localStorage.length;
			var storageKey = "Panorama " + noOfFavs;
			var coords = randomPlace.k + "," + randomPlace.D;
			localStorage.setItem(storageKey, coords);

			// Set display of heart to match new status
			isFavourited = true;
			setFavourited();

			// Spin using CSS3 animation
			$("#heartShape").attr("class", "spin");

			// Show favourite span and set to fade away
			var favText = $("#favText");
			favText.removeClass('favouritedHidden');

			setTimeout(function () {
				favText.removeClass('favouritedInvis');
			}, 20);

			setTimeout(function () {
				favText.addClass('favouritedInvis');
				favText.one('transitionend', function (e) {
					favText.addClass('favouritedHidden');
				});
			}, 600);

		} else {

			// Show already added to favourites span and set to fade away
			var alreadyFavText = $("#alreadyFavText");
			alreadyFavText.removeClass('favouritedHidden');

			setTimeout(function () {
				alreadyFavText.removeClass('favouritedInvis');
			}, 20);

			setTimeout(function () {
				alreadyFavText.addClass('favouritedInvis');
				alreadyFavText.one('transitionend', function (e) {
					alreadyFavText.addClass('favouritedHidden');
				});
			}, 600);
		}

		return false;
	});

	/* Set up round one again for new game */
	$("#restart").click(function () {
		$('body').removeClass('gameOver').addClass('restart');
		totalScore = 0;
		currentMap = 1;
		$("#distGuess").val('');
		$("#resultSection").hide();
		$("#finalScoreSection").hide();
		initialize();
	});

	// Set up initial round when page is loaded.
	initialize();

	// If the user is offline, take them to the offline page (Required as index page needs to be cached for offline mode)
	if (!navigator.onLine) {
		window.location = "offline.html";
	}
});
