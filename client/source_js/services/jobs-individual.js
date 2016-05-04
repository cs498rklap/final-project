var jobServices = angular.module('job.services', []);
var baseUrl = "http://localhost:3000/api";

jobServices.factory('Job', function($http, $window) {
    return {
        getJob : function(Id) {
            return $http.get(baseUrl + '/jobs/' + Id);
        }
    };
});
