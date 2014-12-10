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
    .controller('DashCtrl', function($scope, $http, $state, $ionicLoading, $ionicModal,ScrollFix, Films, FilmsDisney) {
        //ScrollFix.fix();

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

        /*Films.get({id:16}, function(data){
            var json = angular.fromJson(data);
            console.log("json = " + angular.toJson(data));
            var imgs = angular.fromJson(json.results);
            $scope.imgs = imgs;
            console.log("imgs = " +imgs);
        });*/


        FilmsDisney.get({id:'51224e42760ee3297424a1e0'}, function(data){
            var json = angular.fromJson(data);
            console.log("json = " + angular.toJson(data));
            var imgs = angular.fromJson(json.items);
            $scope.imgs = imgs;
            console.log("imgs = " +imgs);
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

        $scope.like = function(actu){
            if(actu.can_like==true) {
                $http.post('http://eimk.tk/cinebook/public/post/like/' + actu.id, user)
                    .success(function (data, status, headers, config) {
                        var json = angular.fromJson(data);

                        if (json.error == true) {
                            $scope.msgError = json;
                        } else {
                            var temp = parseInt(angular.fromJson(actu).likes) + 1;
                            console.log(temp);
                            actu.likes = temp;
                            actu.can_like = false;
                        }
                    })
                    .error(function (data, status, headers, config) {
                        console.log('ERROR');
                    })
            }
        }

        //Load comments modal template
        $ionicModal.fromTemplateUrl('templates/comment-modal.html', function(modal) {
            $scope.commentModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        });

        $scope.showComments = function(actu){
            $scope.commentModal.show();
            $ionicLoading.show();
            $http.post('http://eimk.tk/cinebook/public/post/' + actu.id+'/comments', user)
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    $scope.comments = json.comments_list;
                    $scope.actu = actu;
                    $ionicLoading.hide();
                })
                .error(function (data, status, headers, config) {
                    console.log('ERROR');
                    $ionicLoading.hide();
                })
        };

        $scope.leaveComments = function() {
            // Remove dialog
            $scope.commentModal.remove();
            // Reload modal template to have cleared form
            $ionicModal.fromTemplateUrl('templates/comment-modal.html', function(modal) {
                $scope.commentModal = modal;
            }, {
                scope: $scope,
                animation: 'slide-in-up'
            });
        };

        $scope.refreshComments = function(actu){
            $ionicLoading.show();
            $http.post('http://eimk.tk/cinebook/public/post/' + actu.id+'/comments', user)
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    $scope.comments = json.comments_list;
                    $scope.actu = actu;
                    $ionicLoading.hide();
                })
                .error(function (data, status, headers, config) {
                    console.log('ERROR');
                    $ionicLoading.hide();
                })
        }

        $scope.onComment = function(actu, comment){
            var data = user;
            data.comment = comment;
            data.post_id = actu.id;
            $http.post('http://eimk.tk/cinebook/public/post/' + actu.id+'/comments/add', data)
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    if(json.error == false) {
                        $scope.clearCommentInput();
                        $ionicLoading.hide();
                        $scope.refreshComments(actu);
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('ERROR');
                    $ionicLoading.hide();
                })
        }

        $scope.clearCommentInput = function(){
            $scope.comment = '';
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
    .controller('DetailFilmCtrl', function($scope, $stateParams, $http, $ionicLoading, $ionicViewService, $ionicModal, detailFilm, videoFilm){
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $ionicLoading.show();
        detailFilm.get($stateParams, function (data) {
            var json = angular.fromJson(data);
            console.log("json= "+ angular.toJson(data));
            $scope.data= json;
            var i=0;
            var nb_mot=0;
            var littleoverview="";
            while(nb_mot<30 && i<data.overview.length)
            {

                if(data.overview[i]==' ')
                {
                    nb_mot++;

                }
                console.log("lo=",littleoverview);
                littleoverview+=data.overview[i];
                i++;
            }
                littleoverview=littleoverview+" ...";
            $scope.lo=littleoverview;
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
        });

        // Load the Share dialog from the given template URL
        $ionicModal.fromTemplateUrl('templates/share-modal.html', function(modal) {
            $scope.shareDialog = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        });

        $scope.showShareDialog = function(){
            $scope.shareDialog.show();
        };
        $scope.leaveShareDialog = function() {
            // Remove dialog
            $scope.shareDialog.remove();
            // Reload modal template to have cleared form
            $ionicModal.fromTemplateUrl('templates/share-modal.html', function(modal) {
                $scope.shareDialog = modal;
            }, {
                scope: $scope,
                animation: 'slide-in-up'
            });
        };
        $scope.shareFilm = function(){
            $scope.showShareDialog();

        };

        $scope.onShare = function(){
            var user = angular.fromJson(window.localStorage['user']);

            var img = $scope.data.backdrop_path;
            var synopsys = $scope.lo;
            var title = $scope.data.title;
            var content = $scope.data.comment;

            var data = user;
            data.img = img;
            data.overview = synopsys;
            data.title = title;
            data.content = content;

            $http.post('http://eimk.tk/cinebook/public/posts/add', data )
                .success(function (data, status, headers, config) {
                    console.log('Response = ' +data);
                    var json = angular.fromJson(data);
                    if(data.error == false){
                        $scope.leaveShareDialog();
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                });
        };
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
    .controller('ParamsCtrl', function($scope, $state, $ionicViewService, Cam) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $scope.user = angular.fromJson(window.localStorage['userInfos']).user;
        $scope.logout = function(){
            window.localStorage.clear();
            $state.go('signin');
        };


        $scope.getImage = function() {
            console.log('Getting camera');
            Cam.getPicture().then(function(imageURI) {
                console.log(imageURI);
                $scope.lastPhoto = imageURI;
            }, function(err) {
                console.err(err);
            }, {
                sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
        }
    })


    /*****************************************
     * SEARCH *
     *****************************************/
    /*.controller('SearchCtrl', function($scope,$ionicViewService) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    })*/


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


