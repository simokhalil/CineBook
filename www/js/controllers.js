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
        console.log("json = " + data);
        var imgs = angular.fromJson(json.results);
        $scope.imgs = imgs;
        console.log("imgs = " +$scope.imgs);
    });


    var actus = new Array();
    for(var i= 1; i<=10; i++){
        actus.push({"title": "Message"+i})
    }
    $scope.actus = actus;
})

.controller('LoginCtrl', function($scope) {
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
