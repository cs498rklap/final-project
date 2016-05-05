var userServices = angular.module('user.services', []);

userServices.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
        isLoggedIn: function() {
            if(user) {
                return true;
            } else {
                return false;
            }
        },
        getUserStatus: function() {
            return $http.get('/api/user/status')
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
        login: function(username, password) {

            // create a new instance of deferred
            var deferred = $q.defer();
            var params = {
                username: username,
                password: password
            };
            // send a post request to the server
            $http.post('/api/user/login',
            $.param(params), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            // handle success
            .success(function (data, status) {
                console.log(data);
                console.log(status);
                if(status === 200 && data.message){
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
        logout: function() {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a get request to the server
            $http.get('/api/user/logout')
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
        register: function(username, password, email, name) {

            // create a new instance of deferred
            var deferred = $q.defer();
            var params = {
                username: username,
                password: password,
                email: email,
                name: name
            };
            // send a post request to the server
            $http.post('/api/user/register', $.param(params), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
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
        },
        getUserInformation: function() {
            return $http.get('/api/user/info');
        }
    });
}]);
