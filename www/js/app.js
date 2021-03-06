// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

    /* Ajout des images à la Whitelist d'Angular afin de pouvoir afficher les lins de type file:// */
    .config(function($compileProvider){
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|content):/);
    })

    .run(function ($ionicPlatform, $state) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            var user = angular.fromJson(window.localStorage['user']);
            if (user != null) {
                $state.go('tab.dash');
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        //openFB.init({appId: '314876622033222'});

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            /* Vue de login */
            .state('signin', {
                url: '/sign-in',
                templateUrl: 'templates/login.html',
                controller: 'SignInCtrl'
            })


            /* Vue de création de compte */
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            })


            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })


            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.detailFilm', {
                url: '/detailFilm/:idFilm',
                views: {
                    'tab-dash': {
                        templateUrl: "templates/detailFilm.html",
                        controller: 'DetailFilmCtrl'
                    }
                }
            })

            .state('tab.friends', {
                url: '/friends',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
            .state('tab.friend-detail', {
                url: '/friend/:friendId',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/friend-detail.html',
                        controller: 'FriendDetailCtrl'
                    }
                }
            })


            .state('tab.cinema', {
                url: '/cinema',
                views: {
                    'tab-cinema': {
                        templateUrl: 'templates/tab-cinema.html',
                        controller: 'CinemaCtrl'
                    }
                }
            })

            .state('tab.detailFilmCine', {
                url: '/detailFilmCine/:idFilm',
                views: {
                    'tab-cinema': {
                        templateUrl: "templates/detailFilm.html",
                        controller: 'DetailFilmCtrl'
                    }
                }
            })

            .state('tab.params', {
                url: '/params',
                views: {
                    'tab-params': {
                        templateUrl: 'templates/tab-params.html',
                        controller: 'ParamsCtrl'
                    }
                }
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/sign-in');

    });

