angular.module('starter.controllers', [])

    .controller('BodyCtrl', function($scope, Friendship) {
        var user = angular.fromJson(window.localStorage['user']);
        $scope.badge = {};

        Friendship.async().then(function(d) {
            $scope.badge.friend = d;
            console.log("Friendship = " +angular.toJson($scope.badge.friend) );
        });



    })

    /*****************************************
     * DASH *
     *****************************************/
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


    /*****************************************
     * LOGIN *
     *****************************************/
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
                    //console.log("Error : " +json.error);
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
                        //console.log("Infos = " + angular.toJson(json));
                        window.localStorage['user'] = angular.toJson(user);
                        window.localStorage['userId'] = json.user.id;
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


    /*****************************************
     * FILM DETAILS *
     *****************************************/
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

    /*****************************************
     * FRIENDS *
     *****************************************/
    .controller('FriendsCtrl', function($scope, $state, $http, $ionicPopup, $ionicModal, $ionicLoading, $ionicViewService, Friendship) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $ionicLoading.show();
        var user = angular.fromJson(window.localStorage['user']);
        console.log("user = " +angular.toJson(user));
        $scope.userId = window.localStorage['userId'];

        $http.post('http://eimk.tk/cinebook/public/friends', user )
            .success(function (data, status, headers, config) {
                var json = angular.fromJson(data);
                $scope.friends = json.friends;

                var friendInfos = angular.toJson(json.friends);
                console.log("friendInfos : " +friendInfos);

                $ionicLoading.hide();
            })
            .error(function(data, status, headers, config){
                console.log('ERROR');
            });

        //$scope.friends = angular.fromJson(window.localStorage['userInfos']).friends;
        $scope.data = {
            showDelete: false
        };

        Friendship.async().then(function(d) {
            $scope.badge.friend = d;
            console.log("Friendship = " +angular.toJson($scope.badge.friend) );
        });

        $scope.refreshFriends = function(){
            $http.post('http://eimk.tk/cinebook/public/friends', user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    $scope.friends = json.friends;

                    var friendInfos = angular.toJson(json.friends);
                    console.log("friendInfos : " +friendInfos);

                    $ionicLoading.hide();
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                })
                .finally(function(){
                    Friendship.async().then(function(d) {
                        $scope.badge.friend = d;
                        console.log("Friendship = " +angular.toJson($scope.badge.friend) );
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }


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
                    $ionicLoading.show();
                    $http.post('http://eimk.tk/cinebook/public/friend/delete/'+friend.id, user )
                        .success(function (data, status, headers, config) {

                            $ionicLoading.hide();
                            $scope.friends.splice($scope.friends.indexOf(friend), 1);
                        })
                        .error(function(data, status, headers, config){
                            console.log('ERROR');
                        });
                } else {
                    console.log('Nan, tu n\'est pas sûr');
                }
            });
        };

        $scope.friendDetails = function(id){
            $ionicViewService.nextViewOptions({
                disableAnimate: false,
                disableBack: false
            });
            $state.go('tab.friend-detail',{'friendId': id});
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

        $scope.clearSearch = function() {
            $scope.data.searchQuery = '';
        };

        $scope.searchFriend = function(query){
            console.log('query = ' +query);
            var user = angular.fromJson(window.localStorage['user']);
            $http.post('http://eimk.tk/cinebook/public/friend/search/'+query, user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    console.log("search = " + angular.toJson(data));
                    $scope.friendResults = json.results;
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                });
        }

        $scope.addFriend = function(friendId){
            console.log(friendId);
            $http.post('http://eimk.tk/cinebook/public/friend/add/'+friendId, user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    console.log("search = " + angular.toJson(data));
                    $scope.leaveAddDialog();
                    $scope.refreshFriends();
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                });
        }

        $scope.friendshipDeal = function(friend){
            var confirmPopup = $ionicPopup.confirm({
                title: friend.first_name +' '+ friend.last_name,
                template: 'Accepte-tu l\'invitation ?',
                okText: 'Confirmer',
                okType: 'button-stable',
                cancelText: 'Supprimer',
                cancelType : 'button-assertive'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $ionicLoading.show();
                    $http.post('http://eimk.tk/cinebook/public/friend/confirm/'+friend.id, user )
                        .success(function (data, status, headers, config) {

                            $ionicLoading.hide();
                            $scope.refreshFriends();
                        })
                        .error(function(data, status, headers, config){
                            console.log('ERROR');
                        });
                } else {
                    $http.post('http://eimk.tk/cinebook/public/friend/decline/'+friend.id, user )
                        .success(function (data, status, headers, config) {

                            $ionicLoading.hide();
                            $scope.refreshFriends();
                        })
                        .error(function(data, status, headers, config){
                            console.log('ERROR');
                        });
                }

                Friendship.async().then(function(d) {
                    //$scope.badge.friend = d;
                    console.log("Friendship = " +angular.toJson($scope.badge.friend) );
                });
            });
        }
    })


    /*****************************************
     * FRIEND DETAILS *
     *****************************************/
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


    /*****************************************
     * PARAMETERS *
     *****************************************/
    .controller('ParamsCtrl', function($scope, $state, $ionicViewService) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $scope.user = angular.fromJson(window.localStorage['userInfos']).user;
            $scope.logout = function(){
                window.localStorage.clear();
                $state.go('signin');
            };
    })


    /*****************************************
     * SEARCH *
     *****************************************/
    .controller('SearchCtrl', function($scope,$ionicViewService) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    })


    /*****************************************
     * CINEMA *
     *****************************************/
    .controller('CinemaCtrl', function($scope, $state, $ionicPlatform, $timeout, Films, FilmsPaginated, detailFilm) {

        var result;
        var overviews = new Array();
        Films.get({id:16}, function(data) {
            var json = angular.fromJson(data);

            result = angular.fromJson(json.results);


            for (var i = 0; i < result.length; i++) {
                console.log(result[i].id);
                detailFilm.get({idFilm: result[i].id}, function (data) {

                    var json = angular.fromJson(data);
                    console.log("json= " + angular.toJson(data));
                    overviews.push(json);
                });

            }

            $scope.overviews = overviews;
        });

        $timeout(function() {
            $scope.page = 1;
        }, 1000);

        $scope.loadMore = function() {
            $timeout(function() {
                $scope.page += 1;
                console.log("appel "+$scope.page);
                FilmsPaginated.get({id: 16, page:$scope.page}, function (data) {
                    var json = angular.fromJson(data);

                    result = angular.fromJson(json.results);

                    for (var i = 0; i < result.length; i++) {
                        detailFilm.get({idFilm: result[i].id}, function (data) {
                            var json = angular.fromJson(data);
                            $scope.overviews.push(json);
                        });
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }, 1000);
        };


        $scope.$on('$stateChangeSuccess', function() {
            //$scope.loadMore();
            console.log("done");
        });



    });


