var jobControllers = angular.module('job.controllers', []);

jobControllers.controller('JobsIndividualController', ['$scope', '$http', 'Job', '$window', '$routeParams',  function($scope, $http, Job, $window, $routeParams) {
    $scope.job = {};
    $scope.timestamp = "";

    Job.getJob($routeParams.id).success(function(data) {
        $scope.job = data.data;
        if ($scope.job.deadline)
        $scope.timestamp = new Date($scope.job.deadline).toString();
        else
        $scope.timestamp = "No Deadline";
    });
}]);
