var jobsControllers = angular.module('jobs.controllers', []);

jobsControllers.controller('JobListController', ['$scope', 'Jobs', function($scope, Jobs) {
    var jobsPerPage = 1;
    $scope.refresh = function () {
        var queryString= "where="+JSON.stringify($scope.which)+"&sort={"+$scope.orderBy+":"+$scope.order+"}&limit="+jobsPerPage+"&skip="+(($scope.page-1)*jobsPerPage);
        Jobs.get(queryString).success(function (data) {
            $scope.jobs = data['data'];
        });
        Jobs.get("count=true&"+queryString).success(function (data) {
            $scope.count = data['data'];
        });
    };

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

jobsControllers.controller('JobAddController', ['$scope', 'Jobs', function($scope, Jobs) {

    $scope.posting = false;

    $scope.states = Jobs.states();

    $scope.title = "";
    $scope.company = "";
    $scope.city = "";
    $scope.state = {'name': "", 'abbreviation': ""};
    $scope.link = "";
    $scope.tags = "";
    $scope.deadline = "";
    $scope.description = "";
    $scope.tags = "";


    $scope.titleError = false;
    $scope.companyError = false;
    $scope.cityError = false;
    $scope.stateError = false;
    $scope.requiredFieldError = false;

    $scope.postSuccess = false;
    $scope.postError = false;

    $scope.postSuccessMessage = "";
    $scope.postErrorMessage = "";

    $scope.postJob = function () {
        //Prevent repeated posting.
        if ($scope.posting) {
            return;
        }
        $scope.posting = true;
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

        var tagsArray = [];
        if($scope.tags != undefined && $scope.tags!="") {
            tagsArray = $scope.tags.split(',');
        }

        var postBody = {
            "title": $scope.title,
            "company": $scope.company,
            "city": $scope.city,
            "state": $scope.state.abbreviation,
            "link": $scope.link,
            "deadline": $scope.deadline,
            "description": $scope.description,
            "tags": tagsArray
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
            $scope.posting=false;
            $scope.postSuccess=true;
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


    }

}]);