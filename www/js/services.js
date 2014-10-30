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

                        var promise = $http.post('http://eimk.tk/cinebook/public/friends/check', user )
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

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
