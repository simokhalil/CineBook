angular.module('starter.controllers', [])




.controller('DashCtrl', function($scope, Films, globalJson) {
    /*theMovieDb.genres.getMovies({"id": "16"}, function(data){
        var json = angular.fromJson(data);
        console.log("json = " + data);
        var imgs = angular.fromJson(json.results);
        $scope.imgs = imgs;
        console.log("imgs = " +$scope.imgs);
    }, function(data){
        console.log("error");
    });*/

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

        console.log("globalJson = " + angular.toJson(globalJson.get()));
        $scope.globalJson = angular.fromJson(globalJson.get());

    var actus = new Array();

    for(var i= 1; i<=10; i++){
        actus.push({"title": "Message"+i})
    }
    $scope.actus = actus;
})

.controller('SignInCtrl', function($scope, $http, $state, globalJson) {
        $scope.fbLogin = function() {
            openFB.login(
                function(response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        $state.go('tab.dash');
                    } else {
                        alert('Facebook login failed');
                    }
                },
                {scope: 'email,publish_actions'});
        };

        $scope.doLogin = function(loginData){
            console.log("user : " + loginData.username);
            console.log("pass : " + loginData.password);
            var user = {
                login: loginData.username,
                password : loginData.password
            };
            $http.post('http://eimk.tk/cinebook/public/login', user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    var user = angular.toJson(json);
                    console.log("Error : " +json.error);
                    if(json.error == true) {
                        $scope.msgError = json;
                        $scope.showError= function() {
                            return true;
                        }
                    }else{
                        console.log("login = " + user);
                        globalJson.set(json);
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

.controller('FriendsCtrl', function($scope, globalJson) {
  $scope.friends = angular.fromJson(globalJson.get().friends);
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('ParamsCtrl', function($scope) {
        $scope.test = 'test 123';
})

.controller('SearchCtrl', function($scope) {
})

.controller('CinemaCtrl', function($scope) {
});


