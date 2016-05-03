var postControllers = angular.module('post.controllers', []);

postControllers.controller('PostIndividualController', ['$scope', '$routeParams', '$location', 'PostIndividual', function($scope, $routeParams, $location, PostIndividual) {
    $scope.newComment = '';
    $scope.edit = [];
    $scope.commentError = [];
    $scope.addedTag = '';
    $scope.contents = [];

    $scope.getPost = function(id) {
        PostIndividual.get(id).then(function(response) {
            $scope.post = response.data.data;
            $scope.contents = $scope.post.content.split('\n');
            $scope.setEditArray();
        }, function(error) {
            $scope.error = error.data.message;
        });
    };

    $scope.addComment = function() {
        if ($scope.newComment.length === 0) {
            $scope.error = "Please enter comment text.";
        } else {
            var comment = {
                username: 'testUser',
                text: $scope.newComment,
                timestamp: Date.now()
            };
            var params = {
                '$push': { comments: comment }
            };
            PostIndividual.update($scope.post._id, params).then(function(response) {
                $scope.error = '';
                $scope.post.comments = response.data.data.comments;
                $scope.newComment = '';
            }, function(error) {
                $scope.error = error.message;
            });
        }
    };

    $scope.deleteComment = function(comment) {
        var params = {
            '$pull': { comments: {'_id': comment._id }}
        };
        PostIndividual.update($scope.post._id, params).then(function(response) {
            $scope.error = '';
            $scope.post.comments = $scope.post.comments.filter(function(obj) {
                return obj._id !== comment._id;
            });
            $scope.setEditArray();
        }, function(error) {
            $scope.error = error.message;
        });
    };

    $scope.updateComment = function(comment, index) {
        if (comment.text.length === 0) {
            $scope.commentError[index] = 'Please enter comment text you wish to update for this comment.';
        } else {
            var params = {
                'cid': comment._id,
                'ctext': comment.text
            };
            PostIndividual.update($scope.post._id, params).then(function(response) {
                $scope.post.comments = response.data.data.comments;
                $scope.edit[index] = false;
                $scope.commentError[index] = '';
            }, function(error) {
                $scope.error = error.message;
            });
        }
    };

    $scope.setEditArray = function() {
        $scope.edit = Array.apply(null, Array($scope.post.comments.length)).map(function() { return false; });
        $scope.commentError = Array.apply(null, Array($scope.post.comments.length)).map(function() { return ''; });
    };

    $scope.addTag = function() {
        console.log($scope.post.tags);
        console.log($scope.addedTag);
        console.log($scope.post.tags.indexOf($scope.addedTag));
        if ($scope.post.tags.indexOf($scope.addedTag) >= 0)
        $scope.error = 'You\'ve already added this tag.';
        else if ($scope.addedTag.length > 0)
        $scope.post.tags.push($scope.addedTag);
        $scope.addedTag = '';
    };

    $scope.removeTag = function(index) {
        $scope.post.tags.splice(index, 1);
    };

    $scope.updatePost = function() {
        if ($scope.post.title.length === 0) {
            $scope.error = 'Please enter a valid title';
        } else if ($scope.post.content.length === 0) {
            $scope.error = 'Please enter some content.';
        } else {
            var params = {
                title: $scope.post.title,
                content: $scope.post.content,
                tags: $scope.post.tags
            };
            console.log(params);
            PostIndividual.update($scope.post._id, params).then(function(response) {
                $scope.error = '';
                $location.path('/posts/' + $scope.post._id);
            }, function(error) {
                $scope.error = error.message;
            });
        }
    };

    $scope.initialize = function() {
        if ($routeParams.id) {
            $scope.getPost($routeParams.id);
        } else {
            $scope.error = "No Post Found";
        }
    };
}]);