var jobServices = angular.module('job.services', []);

jobServices.factory('Job', function($http, $window) {
    return {
        getJob : function(Id) {
            return $http.get('/api/jobs/' + Id);
        }
    };
});
