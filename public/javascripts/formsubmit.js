$(function () {
	/* Function to get a value out of the query string */
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	// Set form submitted page text to include user's submitted name.
	$("#firstName").html(getParameterByName("firstName"));
});
