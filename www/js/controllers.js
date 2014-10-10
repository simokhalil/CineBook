angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope, Films) {
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

        $scope.goDetailFilm = function(filmData){
            $state.go('film.detail');
        }
    });


    var actus = new Array();
    for(var i= 1; i<=10; i++){
        actus.push({"title": "Message"+i})
    }
    $scope.actus = actus;
})

.controller('SignInCtrl', function($scope, $state) {
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
            $state.go('tab.dash');
        };
})

.controller('DetailFilmCtrl', function($scope,$stateParams,detailFilm){

detailFilm.get($stateParams, function (data) {
    var json = angular.fromJson(data);
    console.log("json= "+ data);
    $scope.data= json;
    $state.go('tab.dash');
})

})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
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


