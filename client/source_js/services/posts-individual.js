var postServices = angular.module('post.services', []);

postServices.factory('PostIndividual', function($http) {
    return {
        get: function(id) {
            return $http.get('/api/posts/' + id);
        },
        update: function(id, item) {
            return $http.put('/api/posts/' + id, $.param(item), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        },
        delete: function(id) {
            return $http.delete('/api/posts/' + id);
        }
    };
});