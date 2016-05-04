var postsServices = angular.module('posts.services', []);

// All of the $http calls relating to tasks
postsServices.factory('Posts', function($http) {
	return {
		get : function(sortField, sortDirection, limit, skip, count) {
			return $http.get('http://localhost:3000/api/posts?select={"__v": 0, "comments": 0, "user": 0}&sort={"'+sortField+'":"'+sortDirection+'"}&limit='+limit+'&skip='+skip+'&count='+count);
		},
		getLike : function(searchField, searchTerm, sortField, sortDirection, limit, skip, count) {
			if(searchField == "" || searchField == null || searchTerm == "" || searchTerm == null) {
				return $http.get('http://localhost:3000/api/posts?select={"__v": 0, "comments": 0, "user": 0}&sort={"'+sortField+'":"'+sortDirection+'"}&limit='+limit+'&skip='+skip+'&count='+count);
			}
			return $http.get('http://localhost:3000/api/posts?find="'+searchTerm+'"&findField="'+searchField+'"&select={"__v": 0, "comments": 0, "user": 0}&sort={"'+sortField+'":"'+sortDirection+'"}&limit='+limit+'&skip='+skip+'&count='+count);
		},
		getById : function(postId) {
			return $http.get('http://localhost:3000/api/posts/'+postId);
		},
		post : function (newTitle, newAuthor, newUser, newContent, newTags) {
			var requestBody = {
				title: newTitle,
				author: newAuthor,
				user: newUser,
				content: newContent,
				tags: newTags
			};
			return $http.post('http://localhost:3000/api/posts', $.param(requestBody),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
		},
		getWithQuery: function(params) {
			return $http.get('http://localhost:3000/api/posts', {params: params === undefined ? {} : params});
		}
	}
});