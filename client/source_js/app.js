var app = angular.module('lap', [
    'ngRoute',

    'user.services',
    'user.controllers',

    'jobs.services',
    'jobs.controllers',

    'job.services',
    'job.controllers',

    'posts.services',
    'posts.controllers',

    'post.services',
    'post.controllers',

    'dashboard.services',
    'dashboard.controllers',

    '720kb.datepicker'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'partials/home.html',
        access: {restricted: false}
    }).
    when('/dashboard', {
        templateUrl: 'partials/user/dashboard.html',
        controller: 'DashboardController',
        access: {restricted: true}
    }).
    when('/login', {
        templateUrl: 'partials/user/login.html',
        controller: 'LoginController',
        access: {restricted: false}
    }).
    when('/logout', {
        controller: 'LogoutController',
        access: {restricted: true}
    }).
    when('/register', {
        templateUrl: 'partials/user/register.html',
        controller: 'RegisterController',
        access: {restricted: false}
    }).
    when('/posts/:id', {
        templateUrl: 'partials/post/details.html',
        controller: 'PostIndividualController',
        access: {restricted: true}
    }).
    when('/edit-post/:id', {
        templateUrl: 'partials/post/edit.html',
        controller: 'PostIndividualController',
        access: {restricted: true}
    }).
    when('/jobs/:id', {
        templateUrl: 'partials/job/details.html',
        controller: 'JobsIndividualController',
        access: {restricted: true}
    }).
    when('/posts', {
        templateUrl: 'partials/post/list.html',
        controller: 'PostsController',
        access: {restricted: true}
    }).
    when('/addpost', {
        templateUrl: 'partials/post/add.html',
        controller: 'AddPostController',
        access: {restricted: true}
    }).
    when('/jobs', {
        templateUrl: 'partials/job/list.html',
        controller: 'JobListController',
        access: {restricted: true}
    }).
    when('/addjob', {
        templateUrl: 'partials/job/add.html',
        controller: 'JobAddController',
        access: {restricted: true}
    }).
    otherwise({
        redirectTo: '/'
    });
}]);

app.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
        AuthService.getUserStatus()
        .then(function(){
            if (!AuthService.isLoggedIn() && next.access.restricted){
                $location.path('/login');
                $route.reload();
            }
        });
    });
});