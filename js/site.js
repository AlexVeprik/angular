/**
 * Created by sergey on 06.01.15.
 */
'use strict';
var basicApp = angular.module('basicApp', [
    'ngRoute',
    'LocalStorageModule',
    'ngDialog',
    "ui.bootstrap"
]);

// Routing configuration
basicApp.config(['$routeProvider', '$locationProvider',
    'localStorageServiceProvider',

    function($routeProvider, $locationProvider, localStorageServiceProvider) {

        // $locationProvider.html5Mode(true);
        //$http.defaults.headers.common["X-Custom-Header"] = "Angular.js";
        localStorageServiceProvider
            .setPrefix('codePiquante')
            //.setStorageType('sessionStorage') // initially set to session storage
            .setNotify(true, true);

        $routeProvider
            .when('/', {
                controller: 'guestLandingController',
                templateUrl: '/template/guestlanding.html'
            })
            .when('/login', {
                controller: 'loginController',
                templateUrl: '/template/login.html'
            })
            .when('/dashboard', {
                controller: 'dashboardController',
                templateUrl: '/template/dashboard.html'
            })
            .otherwise({
                redirectTo: '/dashboard'
            });

    }
]);

basicApp.run(['$rootScope', '$location', 'authService',
    function($rootScope, $location, authService) {
        //
        //        // Initially the user is not authenticated
        //
        //        // Handles 'loginSuccess' event
        $rootScope.$on('event:auth-loginSuccess', function() {
            $location.path('/dashboard');
        });
        //
        //        // Handles 'loginFailed' event
        //        $rootScope.$on('event:auth-loginFailed', function () {
        //            // do logout here - clean up cookies, remove tokens, whatever else
        //        });
        //
        //        // Handles 'logoutSuccess' event
        $rootScope.$on('event:auth-logoutSuccess', function() {
            $location.path('/login');
        });

        // Initially display login prompt
        if (!authService.restoreAuthorize()) {
            //    $location.path('/feed');
            //} else {
            $location.path('/login');
        }

        $rootScope.$on('$routeChangeStart', function(event) {

            if (!authService.authorized() && $location.path() !== '/login') {
                console.log('DENY');
                event.preventDefault();
                $location.path('/login');
            } else {
                console.log('ALLOW');
                // $location.path('/home');
            }
        });



    }
]);
