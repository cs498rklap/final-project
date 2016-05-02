var userServices = angular.module('user.services', []);
var baseUrl = "http://localhost:3000/api";

userServices.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
        isLoggedIn: function isLoggedIn() {
            if(user) {
                return true;
            } else {
                return false;
            }
        },
        getUserStatus: function getUserStatus() {
            return $http.get(baseUrl + '/user/status')
            // handle success
            .success(function (data) {
                if(data.status){
                    user = true;
                } else {
                    user = false;
                }
            })
            // handle error
            .error(function (data) {
                user = false;
            });
        },
        login: function login(username, password) {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a post request to the server
            $http.post(baseUrl + '/user/login',
            {username: username, password: password})
            // handle success
            .success(function (data, status) {
                if(status === 200 && data.status){
                    user = true;
                    deferred.resolve();
                } else {
                    user = false;
                    deferred.reject();
                }
            })
            // handle error
            .error(function (data) {
                user = false;
                deferred.reject();
            });

            // return promise object
            return deferred.promise;
        },
        logout: function logout() {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a get request to the server
            $http.get(baseUrl + '/user/logout')
            // handle success
            .success(function (data) {
                user = false;
                deferred.resolve();
            })
            // handle error
            .error(function (data) {
                user = false;
                deferred.reject();
            });

            // return promise object
            return deferred.promise;
        },
        register: function register(username, password) {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a post request to the server
            $http.post(baseUrl + '/user/register',
            {username: username, password: password})
            // handle success
            .success(function (data, status) {
                if(status === 200 && data.status){
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            // handle error
            .error(function (data) {
                deferred.reject();
            });

            // return promise object
            return deferred.promise;
        }
    });
}]);
