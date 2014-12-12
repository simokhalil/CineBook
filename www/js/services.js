angular.module('starter.services', ['ngResource'])

    .factory("Films", function($resource) {
        return $resource("http://api.themoviedb.org/3/genre/:id/movies?api_key=149afb8797c85940697c2759d764a2c7&sort_by=release_date.desc");
    })

    .factory("FilmsDisney", function($resource) {
        return $resource("http://api.themoviedb.org/3/list/:id?language=fr&api_key=149afb8797c85940697c2759d764a2c7");
    })

    .factory("FilmsPaginated", function($resource) {
        return $resource("http://api.themoviedb.org/3/genre/:id/movies?api_key=149afb8797c85940697c2759d764a2c7&page=:page&sort_by=release_date.desc");
    })

    .factory("detailFilm", function($resource) {
        return $resource("http://api.themoviedb.org/3/movie/:idFilm?api_key=149afb8797c85940697c2759d764a2c7&language=fr");
    })

    .factory("videoFilm", function($resource){
        return $resource("http://api.themoviedb.org/3/movie/:idFilm/videos?api_key=149afb8797c85940697c2759d764a2c7")
    })

    /*
    * Service pour stocker le JSON reçu du serveur lors de la connexion d'un user
     */
    .factory('Friendship', function($http, $q) {


                var myService = {
                    async: function(){
                        var user = angular.fromJson(window.localStorage['user']);

                        var promise = $http.post('http://cinebook-project.tk/friends/check', user )
                            .success(function (data, status, headers, config) {
                                console.log('json = ' +angular.toJson(data));
                            })
                            .error(function(data, status, headers, config){
                                console.log('ERROR');
                            }).then(function(data){
                                console.log("myService = " +data.data.friendships);
                                return data.data.friendships;
                            });
                        return promise;
                    }
                };



                return myService;

    })

    /*
     * Service pour régler le problème du scroll vertical sur un scroll horizontal
     * */
    .factory('ScrollFix', function($timeout, $ionicScrollDelegate){
        return {
            fix: function () {
                $timeout(function(){
                    //return false; // <--- comment this to "fix" the problem
                    var sv = $ionicScrollDelegate.$getByHandle('horizontal').getScrollView();
                    var container = sv.__container;
                    var originaltouchStart = sv.touchStart;
                    var originalmouseDown = sv.mouseDown;
                    var originaltouchMove = sv.touchMove;
                    var originalmouseMove = sv.mouseMove;
                    container.removeEventListener('touchstart', sv.touchStart);
                    container.removeEventListener('mousedown', sv.mouseDown);
                    document.removeEventListener('touchmove', sv.touchMove);
                    document.removeEventListener('mousemove', sv.mouseMove);
                    sv.touchStart = function(e) {
                        e.preventDefault = function(){}
                        originaltouchStart.apply(sv, [e]);
                    }
                    sv.touchMove = function(e) {
                        e.preventDefault = function(){}
                        originaltouchMove.apply(sv, [e]);
                    }
                    sv.mouseDown = function(e) {
                        e.preventDefault = function(){}
                        originalmouseDown.apply(sv, [e]);
                    }
                    sv.mouseMove = function(e) {
                        e.preventDefault = function(){}
                        originalmouseMove.apply(sv, [e]);
                    }
                    container.addEventListener("touchstart", sv.touchStart, false);
                    container.addEventListener("mousedown", sv.mouseDown, false);
                    document.addEventListener("touchmove", sv.touchMove, false);
                    document.addEventListener("mousemove", sv.mouseMove, false);
                });
            }
        }
    })

    /*
     * Service pour stocker le user connecté
     * Cette variable est vidée en cas de déconnexion
     */
    .factory('globalUser', function() {
        var globalUser = null;

        return {
            get: function() {
                return globalUser;
            },
            set: function(user) {
                globalUser = user;
            },
            unset: function(){
                globalUser = null;
            }
        }
    })

    .factory('Camera', ['$q', function($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);
