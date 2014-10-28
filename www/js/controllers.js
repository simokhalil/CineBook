angular.module('starter.controllers', [])

    /* Dashboard Controller */
    .controller('DashCtrl', function($scope, $http, $state, $ionicLoading, Films) {
        $ionicLoading.show();
        var user = angular.fromJson(window.localStorage['user']);

        $http.post('http://eimk.tk/cinebook/public/userInfos', user )
            .success(function (data, status, headers, config) {
                var json = angular.fromJson(data);
                var userInfos = angular.toJson(json);
                if(json.error == true) {
                    $scope.msgError = json;
                }else{
                    console.log("login = " + angular.toJson(user));
                    window.localStorage['userInfos'] = userInfos;
                    $scope.userInfos = angular.fromJson(window.localStorage['userInfos']);
                }
            })
            .error(function(data, status, headers, config){
                console.log('ERROR');
            })
            .finally(function(){
                $ionicLoading.hide();
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

        $scope.refreshActus = function(){
            $http.post('http://eimk.tk/cinebook/public/userInfos', user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    var userInfos = angular.toJson(json);
                    if(json.error == true) {
                        $scope.msgError = json;
                    }else{
                        console.log("login = " + angular.toJson(user));
                        window.localStorage['userInfos'] = userInfos;
                        $scope.userInfos = angular.fromJson(window.localStorage['userInfos']);
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                })
                .finally(function(){
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    })

    /* Login Controller */
    .controller('SignInCtrl', function($scope, $http, $state, $ionicPopup,$ionicLoading, $ionicViewService) {

        $scope.doLogin = function(loginData){
            $ionicLoading.show();
            //console.log("user : " + loginData.login);
            //console.log("pass : " + loginData.password);
            var user = {
                login: loginData.login,
                password : loginData.password
            };
            $http.post('http://eimk.tk/cinebook/public/login', user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    //var userInfos = angular.toJson(json);
                    console.log("Error : " +json.error);
                    if(json.error == true) {
                        $scope.msgError = json;
                        /*$scope.showError= function() {
                            return true;
                        }*/
                        $ionicPopup.alert({
                            title: 'Erreur d\'authentification',
                            template: json.message
                        });
                        $ionicLoading.hide();
                    }else{
                        console.log("login = " + user);
                        window.localStorage['user'] = angular.toJson(user);
                        $ionicViewService.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        $state.go('tab.dash');
                        /*$scope.showError= function() {
                            return false;
                        }*/
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                });

        };
})

    .controller('DetailFilmCtrl', function($scope, $stateParams, $ionicLoading, $ionicViewService, detailFilm, videoFilm){
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $ionicLoading.show();
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


        });
        videoFilm.get($stateParams, function (data) {
            var json = angular.fromJson(data);
            $scope.video=angular.fromJson(json.results[0]);
            $ionicLoading.hide();
        })
    })

    .controller('FriendsCtrl', function($scope,$state, $ionicPopup, $ionicModal, $ionicViewService) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $scope.friends = angular.fromJson(window.localStorage['userInfos']).friends;
        $scope.data = {
            showDelete: false
        };

        $scope.friendDetails = function(id){
            $ionicViewService.nextViewOptions({
                disableAnimate: false,
                disableBack: false
            });
            $state.go('tab.friend-detail',{'friendId': id});
        };

        $scope.onFriendDelete = function(friend) {
            console.log("item = " +angular.toJson(friend));
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer un ami',
                template: 'Tu es sûr(e) de vouloir enlever '+friend.email+' de ta liste d\'amis?',
                okText: 'Supprimer',
                okType: 'button-assertive',
                cancelText: 'Annuler'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    console.log('Yes, tu es sûr');
                } else {
                    console.log('Nan, tu n\'est pas sûr');
                }
            });
        };

        // Load the add / change dialog from the given template URL
        $ionicModal.fromTemplateUrl('templates/friend-add-modal.html', function(modal) {
            $scope.addDialog = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.showAddDialog = function(){
            $scope.addDialog.show();
        };
        $scope.leaveAddDialog = function() {
            // Remove dialog
            $scope.addDialog.remove();
            // Reload modal template to have cleared form
            $ionicModal.fromTemplateUrl('templates/friend-add-modal.html', function(modal) {
                $scope.addDialog = modal;
            }, {
                scope: $scope,
                animation: 'slide-in-up'
            });
        };
    })

    .controller('FriendDetailCtrl', function($scope, $stateParams, $http, $ionicLoading, $ionicViewService) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $ionicLoading.show();
        var user = angular.fromJson(window.localStorage['user']);
        $http.post('http://eimk.tk/cinebook/public/friend/'+$stateParams.friendId, user )
            .success(function (data, status, headers, config) {
                var json = angular.fromJson(data);
                $scope.friend = json.user;
                $scope.actus = json.posts;
                var friendInfos = angular.toJson(json);
                console.log("friendInfos : " +friendInfos);
                if(json.error == true) {
                    $scope.msgError = json;
                }else{

                }
                $ionicLoading.hide();
            })
            .error(function(data, status, headers, config){
                console.log('ERROR');
            });
    })

    .controller('ParamsCtrl', function($scope, $state, $ionicViewService) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
            $scope.logout = function(){
                window.localStorage.clear();
                $state.go('signin');
            };
    })

    .controller('SearchCtrl', function($scope,$ionicViewService) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    })

    .controller('CinemaCtrl', function($scope, $state, $ionicPlatform) {
        /* Eviter le retour avec le bouton Back */
        var deregister = $ionicPlatform.registerBackButtonAction(function(event){
            event.preventDefault();
            event.stopPropagation();
            $state.transitionTo("tab.dash");
        },100);

        $scope.$on('$destroy', deregister);
    });


