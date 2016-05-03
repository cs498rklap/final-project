var postServices = angular.module('post.services', []);

postServices.factory('PostIndividual', function($http) {
    return {
        get: function(id) {
            var baseUrl = 'http://localhost:3000';
            return $http.get(baseUrl + '/api/posts/' + id);
        },
        update: function(id, item) {
            var baseUrl = 'http://localhost:3000';
            return $http.put(baseUrl + '/api/posts/' + id, $.param(item), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        },
        delete: function(id) {
            var baseUrl = 'http://localhost:3000';
            return $http.delete(baseUrl + '/api/users/' + id);
        }
    };
});