angular.module('starter.controllers', [])

    /* Dashboard Controller */
    .controller('DashCtrl', function($scope, $http, $state, Films, globalJson) {
            /*theMovieDb.genres.getMovies({"id": "16"}, function(data){
             var json = angular.fromJson(data);
             console.log("json = " + data);
             var imgs = angular.fromJson(json.results);
             $scope.imgs = imgs;
             console.log("imgs = " +$scope.imgs);
             }, function(data){
             console.log("error");
             });*/

        var user = angular.fromJson(window.localStorage['user']);

        if(!user){
            $state.go('tab.signin');
        }

        $http.post('http://eimk.tk/cinebook/public/userInfos', user )
            .success(function (data, status, headers, config) {
                var json = angular.fromJson(data);
                var userInfos = angular.toJson(json);
                console.log("userInfos : " +userInfos);
                if(json.error == true) {
                    $scope.msgError = json;
                }else{
                    console.log("login = " + angular.toJson(user));
                    globalJson.set(json);
                    window.localStorage['userInfos'] = userInfos;
                    console.log("globalJson = " + angular.toJson(globalJson.get()));
                    $scope.globalJson = angular.fromJson(window.localStorage['userInfos']);
                }
            })
            .error(function(data, status, headers, config){
                console.log('ERROR');
            });

        Films.get({id:16}, function(data){
            var json = angular.fromJson(data);
            console.log("json = " + angular.toJson(data));
            var imgs = angular.fromJson(json.results);
            $scope.imgs = imgs;
            console.log("imgs = " +imgs);

            /*$scope.goDetailFilm = function(filmData){
                $state.go('film.detail');
            }*/
        });
    })

    /* Login Controller */
    .controller('SignInCtrl', function($scope, $http, $state, globalJson) {

        $scope.doLogin = function(loginData){
            console.log("user : " + loginData.login);
            console.log("pass : " + loginData.password);
            var user = {
                login: loginData.login,
                password : loginData.password
            };
            $http.post('http://eimk.tk/cinebook/public/login', user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    var userInfos = angular.toJson(json);
                    console.log("Error : " +json.error);
                    if(json.error == true) {
                        $scope.msgError = json;
                        $scope.showError= function() {
                            return true;
                        }
                    }else{
                        console.log("login = " + user);
                        window.localStorage['user'] = angular.toJson(user);
                        $state.go('tab.dash');
                        $scope.showError= function() {
                            return false;
                        }
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                });
        };
})

    .controller('DetailFilmCtrl', function($scope,$stateParams,detailFilm,videoFilm){

        detailFilm.get($stateParams, function (data) {
            var json = angular.fromJson(data);
            console.log("json= "+ data);
            $scope.data= json;

            /************** Genres ****************/
            var genres = angular.fromJson(json.genres);
            console.log(json.genres.length);
            $scope.genres ="";
            for(var i=0; i<json.genres.length; i++){
                console.log("genre :" + genres[i].name);
                $scope.genres+= genres[i].name;

                if(i != json.genres.length-1){
                    $scope.genres +=", "
                }
            }
            /************* Date de sortie *******************/
            var releaseDate = angular.fromJson(json).release_date;
            var arrayDate = releaseDate.split('-');
            //console.log(releaseDate);
            releaseDate = arrayDate[2]+"/"+arrayDate[1]+"/"+arrayDate[0];
            //console.log(releaseDate);
            $scope.release_date = releaseDate;

        })
        videoFilm.get($stateParams, function (data) {
            var json = angular.fromJson(data);
            $scope.video=angular.fromJson(json.results[0]);
        })
    })

    .controller('FriendsCtrl', function($scope) {
        $scope.friends = angular.fromJson(window.localStorage['userInfos']).friends;
    })

    .controller('FriendDetailCtrl', function($scope, $stateParams, $http, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);

        var user = angular.fromJson(window.localStorage['user']);
        $http.post('http://eimk.tk/cinebook/public/friend/'+$stateParams.friendId, user )
            .success(function (data, status, headers, config) {
                var json = angular.fromJson(data);
                var friendInfos = angular.toJson(json);
                console.log("friendInfos : " +friendInfos);
                if(json.error == true) {
                    $scope.msgError = json;
                }else{

                }
            })
            .error(function(data, status, headers, config){
                console.log('ERROR');
            });
    })

    .controller('ParamsCtrl', function($scope, $state) {
            $scope.logout = function(){
                window.localStorage.clear();
                $state.go('signin');
            };
    })

    .controller('SearchCtrl', function($scope) {
    })

    .controller('CinemaCtrl', function($scope) {
    });


