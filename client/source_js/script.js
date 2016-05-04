// This function initializes the carousel on the homepage.
$(document).ready(function(){
	alert("script.js ready function");
	$("#carousel").owlCarousel({
		singleItem: true,
		slideSpeed: 300,
      	navigation: true,
      	navigationText: ["Back", "Next"],
      	paginationNumbers: true,
      	paginationSpeed: 400,
      	autoHeight: true,
      	transitionStyle: "fadeUp",
  		loop:  true,
    	margin:  10,
  	});
});