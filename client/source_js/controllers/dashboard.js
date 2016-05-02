var dashboardControllers = angular.module('dashboard.controllers', []);

dashboardControllers.controller('DashboardController', ['$scope', 'Jobs', 'Posts', function($scope, Jobs, Posts){
    $scope.user = 'testuser'; // test for now
    $scope.postsOrderBy = 'timestamp';
    $scope.jobsOrderBy = 'dateCreated';
    $scope.sortDirection = 1;
    $scope.limit = 5;

    $scope.maxContentLength = 75;

    $scope.initialize = function() {
        Posts.get($scope.postsOrderBy, $scope.sortDirection, $scope.limit).then(function(results) {
            $scope.mostRecentPosts = results.data.data;
            $scope.mostRecentPosts.forEach(function(post) {
                if (post.content.length > $scope.maxContentLength) {
                    post.content = post.content.substring(0, $scope.maxContentLength);
                    post.content += '...';
                }
            });
            return Jobs.get('sort={' + $scope.jobsOrderBy + ':' + $scope.sortDirection + '}&limit=' + $scope.limit);
        }, function(error) {
            $scope.error = error.message;
        }).then(function(results) {
            $scope.mostRecentJobs = results.data.data;
        }, function(error) {
            $scope.error = error.message;
        });
    };
}]);