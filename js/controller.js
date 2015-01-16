/**
 * Created by sergey on 06.01.15.
 */
'use strict';



basicApp.controller('loginController', ['$rootScope', '$scope', 'authService',
    function($rootScope, $scope, authService) {
        $scope.processingLogin = false;
        $scope.userName = null;
        $scope.password = null;
        $scope.rememberMe = false;
        $scope.errors = [];

        $scope.login = function() {
            if ($scope.userName && $scope.password) {
                $scope.processingLogin = true;

                doLogin()
                    .then(retrieveUserData)
                    .catch(errorHandler)
                    .finally(finalizer);
            }
        };

        var
            doLogin = function() {
                return authService.login($scope.userName, $scope.password, $scope.rememberMe);
            },
            retrieveUserData = function() {
                $rootScope.$broadcast('event:auth-loginSuccess', $scope.userName);
            },
            errorHandler = function(errorResponse) {
                $scope.errors = [errorResponse.data.message];
            },
            finalizer = function() {
                $scope.processingLogin = false;
            };

    }
]);
basicApp.controller('guestLandingController', ['$scope', 'localStorageService',
    function($scope, localStorageService) {


    }
]);


basicApp.controller('dashboardController', ['$scope', 'authService',
    'userAuthenticationModel',
    function($scope, authService, userAuthenticationModel) {
        $scope.userAuthenticationModel = userAuthenticationModel;

        $scope.logout = function() {
            authService.logout();
        }

    }
]);
