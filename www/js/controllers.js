angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
        angular.module('ionicApp', ['ionic'])

            .controller('MainCtrl', ['$scope', function($scope) {
                $scope.data = {
                    isLoading: false
                };


        }]);
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
