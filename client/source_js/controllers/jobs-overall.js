var jobsControllers = angular.module('jobs.controllers', []);

jobsControllers.controller('JobListController', ['$scope', 'Jobs', function($scope, Jobs) {
    var jobsPerPage = 6;
    $scope.refresh = function () {
        if ($scope.field=='state'){
            $scope.which={state:$scope.state};
        } else if ($scope.field=='title'){
            $scope.which={title: { "$regex": $scope.query, "$options": "i" }};
        } else if ($scope.field=='description') {
            $scope.which={description: { "$regex": $scope.query, "$options": "i" }};
        } else {
            $scope.which="";
        }
        var queryString= "where="+JSON.stringify($scope.which)+"&sort={"+$scope.orderBy+":"+$scope.order+"}&limit="+jobsPerPage+"&skip="+(($scope.page-1)*jobsPerPage);
        Jobs.get(queryString).success(function (data) {
            $scope.jobs = data['data'];
        });
        Jobs.get("count=true&"+queryString).success(function (data) {
            $scope.count = data['data'];
        });
    };
    $scope.field='none';
    $scope.states=Jobs.states();
    $scope.which = "";
    $scope.orderBy = "dateCreated";
    $scope.order = -1;
    $scope.page = 1;
    $scope.count = 0;

    $scope.maxPage = function () {
        return Math.ceil($scope.count / jobsPerPage);
    };

    $scope.getPages = function () {
        var maxPage = Math.ceil($scope.count / jobsPerPage);
        if (maxPage<5) {
            var pages = [];
            for (var i = 1; i<= maxPage;i++){
                pages.push(i);
            }
            return pages;
        } else {
            if ($scope.page <=3 ){
                return [1,2,3,4,5];
            } else if ($scope.page >= maxPage - 2) {
                return [maxPage-4,maxPage-3,maxPage-2,maxPage-1,maxPage];
            } else {
                return [$scope.page-2,$scope.page-1,$scope.page,$scope.page+1,$scope.page+2];
            }
        }
    };

    $scope.nextPage = function () {
        if (Math.ceil($scope.count / jobsPerPage) > $scope.page) {
            $scope.page = $scope.page + 1;
            $scope.refresh();
        }
    };

    $scope.prevPage = function () {
        if ($scope.page > 1) {
            $scope.page = $scope.page - 1;
            $scope.refresh();
        }
    };

    $scope.firstPage = function () {
        if($scope.page != 1) {
            $scope.page = 1;
            $scope.refresh();
        }
    };

    $scope.lastPage = function () {
        if ($scope.page != Math.ceil($scope.count / jobsPerPage)) {
            $scope.page = Math.ceil($scope.count / jobsPerPage);
            $scope.refresh();
        }
    };

    $scope.setPage = function (number) {
        if (number > 0 && number <= Math.ceil($scope.count / jobsPerPage)) {
            if ($scope.page != Math.ceil(number)) {
                $scope.page = Math.ceil(number);
                $scope.refresh();
            }
        }
    };

    $scope.refresh();

}]);

jobsControllers.controller('JobAddController', ['$scope', '$location', 'Jobs', 'AuthService', function($scope, $location, Jobs, AuthService) {

    $scope.posting = false;

    $scope.states = Jobs.states();

    $scope.title = "";
    $scope.company = "";
    $scope.city = "";
    $scope.state = {'name': "", 'abbreviation': ""};
    $scope.link = "";
    //$scope.tags = "";
    $scope.deadline = "";
    $scope.description = "";
    //$scope.tags = "";
    $scope.newTag = "";
	$scope.newTags = [];
    $scope.author = "";


    $scope.titleError = false;
    $scope.companyError = false;
    $scope.cityError = false;
    $scope.stateError = false;
    $scope.requiredFieldError = false;

    $scope.postSuccess = false;
    $scope.postError = false;

    $scope.postSuccessMessage = "";
    $scope.postErrorMessage = "";

    $scope.addTag = function() {
        if ($scope.newTags.indexOf($scope.newTag) >= 0) {
            $scope.tagError = 'You\'ve already added this tag.';
        } else if ($scope.newTag.length > 0) {
            $scope.newTags.push($scope.newTag);
        }
        $scope.newTag = '';
    };

	$scope.removeTag = function(index) {
        $scope.newTags.splice(index, 1);
    };

    $scope.postJob = function () {
        //Prevent repeated posting.
        if ($scope.posting) {
            return;
        }
        $scope.posting = true;
        AuthService.getUserInformation().
        success(function (data) {
            var userObject = data["data"];
            $scope.author = userObject.name;
            $scope.user = userObject._id;
            $scope.titleError = false;
            $scope.companyError = false;
            $scope.cityError = false;
            $scope.stateError = false;
            $scope.requiredFieldError = false;

            $scope.postSuccess = false;
            $scope.postError = false;

            $scope.postErrorMessage = "";

            if($scope.title == undefined || $scope.title == "") {
                $scope.titleError = true;
                $scope.requiredFieldError = true;
            }
            if($scope.company == undefined || $scope.company == "") {
                $scope.companyError = true;
                $scope.requiredFieldError = true;
            }
            if($scope.city == undefined || $scope.city == "") {
                $scope.cityError = true;
                $scope.requiredFieldError = true;
            }
            if($scope.state.name == undefined || $scope.state.name == "") {
                $scope.stateError = true;
                $scope.requiredFieldError = true;
            }
            if($scope.requiredFieldError) {
                $scope.postError=true;
                $scope.postErrorMessage="Required field missing."
                $scope.posting=false;
                return;
            }

            /*var tagsArray = [];
            if($scope.tags != undefined && $scope.tags!="") {
                tagsArray = $scope.tags.split(',');
            }*/

            var postBody = {
                "user" : $scope.user,
                "author" : $scope.author,
                "title": $scope.title,
                "company": $scope.company,
                "city": $scope.city,
                "state": $scope.state.abbreviation,
                "link": $scope.link,
                "deadline": $scope.deadline,
                "description": $scope.description,
                "tags": $scope.newTags
            };

            Jobs.post(postBody).
            success( function (data){
                $scope.title = "";
                $scope.company = "";
                $scope.city = "";
                $scope.state = {'name': "", 'abbreviation': ""};
                $scope.link = "";
                $scope.tags = "";
                $scope.deadline = "";
                $scope.description = "";
                $scope.tags = "";
                $scope.author = "";
                $scope.user = "";
                $scope.posting=false;
                $scope.postSuccess=true;
                $location.path('/jobs');
            }).
            error(function (data) {
                $scope.posting=false;
                if(data == undefined || data == null) {
                    $scope.postErrorMessage = "Unable to connect to database. Could not post new job.";
                }
                else {
                    $scope.postErrorMessage = data["message"];
                }
                $scope.postError=true;
            });
        }).
        error(function (data) {
            $scope.posting=false;
            if(data == undefined || data == null) {
                $scope.postErrorMessage = "Unable to retrieve user. Could not post new job.";
            }
            else {
                $scope.postErrorMessage = data["message"];
            }
            $scope.postError=true;
        });
    }

}]);