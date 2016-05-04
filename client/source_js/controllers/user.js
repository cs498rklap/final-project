var userControllers = angular.module('user.controllers', []);

userControllers.controller('MainController', ['$scope', '$rootScope', 'AuthService', function($scope, $rootScope, AuthService) {
    AuthService.getUserStatus().then(function(){
        $rootScope.isLoggedIn = AuthService.isLoggedIn();
    });
}]);

userControllers.controller('LoginController',
['$scope', '$location', '$rootScope', 'AuthService',
function ($scope, $location, $rootScope, AuthService) {
    $scope.login = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call login from service
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
            $scope.disabled = false;
            $scope.loginForm = {};
            $rootScope.isLoggedIn = true;
            $location.path('/dashboard');
        })
        // handle error
        .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Invalid username and/or password";
            $scope.disabled = false;
            $scope.loginForm = {};
        });
    };
}]);

userControllers.controller('LogoutController',
['$scope', '$rootScope', '$location', 'AuthService',
function ($scope, $rootScope, $location, AuthService) {

    $scope.logout = function () {

        // call logout from service
        AuthService.logout()
        .then(function () {
            $rootScope.isLoggedIn = false;
            $location.path('/login');
        });

    };

}]);

userControllers.controller('RegisterController',
['$scope', '$location', 'AuthService',
function ($scope, $location, AuthService) {

    $scope.register = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call register from service
        AuthService.register($scope.registerForm.username, $scope.registerForm.password, $scope.registerForm.email, $scope.registerForm.name)
        // handle success
        .then(function () {
            $location.path('/login');
            $scope.disabled = false;
            $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
            $scope.registerForm = {};
        });

    };

}]);

/* Home Page Controller ---------------------------------------------------------------------------------- */
// Image Sources (Images Cropped and Overlay Text Added):
//     http://rack.3.mshcdn.com/media/ZgkyMDEyLzEyLzA2LzY0L2pvYnNlYXJjaDY0LjRDMC5qcGcKcAl0aHVtYgk5NTB4NTM0IwplCWpwZw/f1cda8a5/cfa/job-search-640x400.jpg
//     https://idisciple.blob.core.windows.net/idm/You-Will-Help-Others-Overcome-What-You-Have-Been-Through.png
//     http://www.framingthedialogue.com/wp-content/uploads/2009/12/magic8ball-its-bushs-fault.jpg
//     http://www.mrwallpaper.com/wallpapers/blue-sunny-sky.jpg
userControllers.controller('HomeController', ['$scope', function($scope) {
    /* Functions used in this controller: */
    // Initialize the Owl Carousel variables
    $scope.loadCarousel = function() {
        $("#carousel").owlCarousel({
            singleItem: true,
            slideSpeed: 300,
            navigation: true,
            navigationText: ["Back", "Next"],
            paginationNumbers: true,
            paginationSpeed: 400,
            autoHeight: true,
            transitionStyle: "fadeUp",
            loop:  true,
            margin:  10,
            autoPlay:  true,
            autoPlayTimeout:  500,
            autoPlayHoverPause:  true
        }).trigger('play.owl.autoplay',[500]);
    };

    /* Code to run automatically on page load: */
    $scope.loadCarousel();

}]);