var postsControllers = angular.module('posts.controllers', []);

/* List Posts Controller ---------------------------------------------------------------------------------- */
postsControllers.controller('PostsController', ['$scope', 'Posts', function($scope, Posts) {
	/* Variables used in this controller: */
	// Data:
	$scope.postsList = [];
	$scope.maxContentLength = 75;
	// Pagnation:
	$scope.pagesList = [];
	$scope.currentPage = 1;
	$scope.numPages = 1;
	$scope.maxPostsPerPage = 6;
	// Sorting:
	$scope.sortType = "timestamp";
	$scope.sortDirection = "-1";
	$scope.searchTerm = "";
	$scope.searchType = "title";
	// Errors:
	$scope.showGetPostsError = false;
	$scope.errorMessage = "";
	$scope.showNoPostsWarning = false;
	$scope.warningMessage = "";

	/* Functions used in this controller: */
	// Load all posts according to the search and sort parameters
	$scope.loadPosts = function() {
		// Reset error messages
		$scope.showGetPostsError = false;
		$scope.showNoPostsWarning = false;

		// Check to see if there is a search term
		var search = "";
		var searchField = "";
		if($scope.searchTerm != undefined && $scope.searchTerm != "") {
			search = $scope.searchTerm;
			searchField = $scope.searchType;
		}

		// First count the number of results and pages
		Posts.getLike(searchField, search, $scope.sortType, $scope.sortDirection, $scope.maxPostsPerPage, 0, true).success(function(data) {
			var totalNumResults = data["data"];
			var skip = 0;
			if(totalNumResults == 0 || totalNumResults == undefined) {
				$scope.numPages = 0;
				$scope.currentPage = 0;
			} else {
				$scope.numPages = Math.ceil(totalNumResults / $scope.maxPostsPerPage);
				skip = ($scope.currentPage-1)*$scope.maxPostsPerPage;
				if(skip < 0) {
					skip = 0;
				}
			}
			// Now get the results based on the current page
			Posts.getLike(searchField, search, $scope.sortType, $scope.sortDirection, $scope.maxPostsPerPage, skip, false).success(function(data) {
				$scope.postsList = data["data"];
				// Show the user a warning if no tasks were returned
				if($scope.postsList.length == 0) {
					$scope.warningMessage = "No posts with the given parameters were found.";
					$scope.showNoPostsWarning = true;
					$scope.updatePagesList(0, 0);
				}
				// Trim the length of the content shown to the user if it is too long
				else {
					$scope.postsList.forEach(function(post) {
						if(post.content.length > $scope.maxContentLength) {
							post.content = post.content.substring(0, $scope.maxContentLength);
							post.content += ". . .";
						}
					});
					$scope.updatePagesList(1, $scope.numPages);
				}
			}).error(function(data) { // Error getting the results for this page
				if(typeof data == undefined || data == null) {
					$scope.errorMessage = "Unable to connect to the API and retrieve the list of posts.";
				}
				else {
					$scope.errorMessage = data["message"];
				}
				$scope.showGetPostsError = true;
			});
		}).error(function(data) { // Error counting the number of results
			if(typeof data == undefined || data == null) {
				$scope.errorMessage = "Unable to connect to the API and retrieve the list of posts.";
			}
			else {
				$scope.errorMessage = data["message"];
			}
			$scope.showGetPostsError = true;
		});

	};

	// Function to create the array containing the list of page numbers
	// Will just contain '0' if there are no results
	// Otherwise will contain '1', '2', ... 'X', where X is the last page number
	$scope.updatePagesList = function(startPage, endPage) {
		if(startPage == "0") {
			$scope.pagesList = ["0"];
		}
		else {
			$scope.pagesList = [];
			for(var index = startPage; index <= endPage; index++) {
				$scope.pagesList.push(index);
			}
		}
	};

	// Go to the next page
	$scope.nextPage = function() {
		if(($scope.currentPage + 1) > $scope.numPages) {
			$scope.currentPage = 1;
		}
		else {
			$scope.currentPage = $scope.currentPage + 1;
		}
		$scope.loadPosts();
	};

	// Go to the previous page
	$scope.previousPage = function() {
		if(($scope.currentPage - 1) <= 0) {
			$scope.currentPage = $scope.numPages;
		}
		else {
			$scope.currentPage = $scope.currentPage - 1;
		}
		$scope.loadPosts();
	};

	// Go to the page with the given number
	// If the given page is invalid, then stay on the current page
	$scope.goToPage = function(pageNumber) {
		if(pageNumber > 0 && pageNumber <= $scope.numPages) {
			$scope.currentPage = pageNumber;
			$scope.loadPosts();
		}
	};

	// Go to the lowest numbered page (usually 1, but 0 if there are no pages)
	$scope.goToFirstPage = function() {
		if($scope.numPages != "0") {
			$scope.goToPage(1);
		}
		else {
			$scope.goToPage(0);
		}
	};

	// Go to the highest numbered page
	$scope.goToLastPage = function() {
		$scope.goToPage($scope.numPages);
	};

	// Go back to page 1 and reload the tasks list
	$scope.resetPages = function() {
		$scope.currentPage = 1;
		$scope.loadPosts();
	};

	/* Code to run automatically on page load: */
	$scope.loadPosts();
}]);

/* Add  Post  Controller ---------------------------------------------------------------------------------- */
postsControllers.controller('AddPostController', ['$scope', 'Posts', 'AuthService', function($scope, Posts, AuthService) {
	/* Variables Used in This Controller */
	// Data:
	$scope.newTitle = "";
	$scope.newAuthor = "";
	$scope.newContent = "";
	$scope.newTags = "";
	$scope.user = [];
	// Errors:
	$scope.showTitleError = false;
	$scope.showAuthorError = false;
	$scope.showContentError = false;
	$scope.showResultError = false;
	$scope.showResultSuccess = false;
	$scope.error = false;
	$scope.fatalError = false;
	$scope.prevPostName = "";
	$scope.resultErrorMessage = "";
	$scope.fatalErrorMessage = "";

	/* Functions Used in This Controller */
	// Add a post to the database using the given information
	$scope.addPost = function() {
		// Reset status messages
		$scope.showTitleError = false;
		$scope.showAuthorError = false;
		$scope.showContentError = false;
		$scope.showResultError = false;
		$scope.showResultSuccess = false;
		$scope.error = false;
		$scope.fatalError = false;

		// Force required fields be filled before submitting request
		if($scope.newTitle == undefined || $scope.newTitle == "") {
			$scope.showTitleError = true;
			$scope.error = true;
		}
		if($scope.newAuthor == undefined || $scope.newAuthor == "") {
			$scope.showAuthorError = true;
			$scope.error = true;
		}
		if($scope.newContent == undefined || $scope.newContent == "") {
			$scope.showContentError = true;
			$scope.error = true;
		}
		if($scope.error) {
			return;
		}

		// Format tags to send to the API
		var newTagsArray = [];
		if($scope.newTags != undefined && $scope.newTags != "") {
			newTagsArray = $scope.newTags.split(',');
		}

		// Send the new post data to the API
		Posts.post($scope.newTitle, $scope.newAuthor, $scope.user, $scope.newContent, newTagsArray).success(function(data) {
			$scope.showResultSuccess = true;
			$scope.prevPostName = $scope.newTitle;
		}).error(function(data) {
			if(data == undefined || data == null) {
				$scope.resultErrorMessage = "Error connecting to the API.  Unable to add the new post.";
			}
			else {
				$scope.resultErrorMessage = data["message"];
			}
			$scope.showResultError = true;
		});
	};

	// Get the information about the currently logged in user from the API
	$scope.getCurrentUser = function() {
		AuthService.getUserInformation().success(function(data) {
			$scope.user = data["data"];
			$scope.newAuthor = $scope.user.name;
		}).error(function(data) {
			$scope.fatalError = true;
			$scope.fatalErrorMessage = "Unable to retrieve your user information, which is required to author a new post."
		});
	};

	/* Code to run automatically on page load: */
	$scope.getCurrentUser();

}]);