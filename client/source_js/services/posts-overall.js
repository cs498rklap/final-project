var postsServices = angular.module('posts.services', []);

// All of the $http calls relating to tasks
postsServices.factory('Posts', function($http) {
	return {
		get : function(sortField, sortDirection, limit, skip, count) {
			return $http.get('http://localhost:3000/api/posts?select={"__v": 0, "comments": 0}&sort={"'+sortField+'":"'+sortDirection+'"}&limit='+limit+'&skip='+skip+'&count='+count);
		},
		getById : function(postId) {
			return $http.get('http://localhost:3000/api/posts/'+postId);
		},
		post : function (newTitle, newAuthor, newContent, newTags) {
			var requestBody = {
				title: newTitle,
				author: newAuthor,
				content: newContent,
				tags: newTags
			};
			return $http.post('http://localhost:3000/api/posts', $.param(requestBody),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
		}
	}
});