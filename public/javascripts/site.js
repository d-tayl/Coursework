$(function () {
	/* Hover function for site logo to cause spinning */
	$("#mainTitle").hover(function () {
		$("#logo").attr('class', "spin");
	},
		function () {
		$("#logo").attr('class', "");
	});
});
