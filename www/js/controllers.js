angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
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
