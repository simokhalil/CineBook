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
        /* Service permettant le scroll vertical sur un scroll horizontal (liste des films dans le Dashboard)*/
        ScrollFix.fix();

        /* Afficher l'icone de chargement */
        $ionicLoading.show();

        /* Récupération des identifiants de l'utilisateur dans le localStorage */
        var user = angular.fromJson(window.localStorage['user']);

        /* Envoi + traitement de la requête au serveur pour avoir les données de l'utiliateur */
        $http.post('http://cinebook-project.tk/userInfos', user )
            .success(function (data, status, headers, config) {
                /* Convertir la réponse en JSON  et extraction des données de l'utilisateur */
                var json = angular.fromJson(data);
                var userInfos = angular.toJson(json);

                /* Gestion des erreurs rapportées le serveur */
                if(json.error == true) {
                    $scope.msgError = json;
                }else{
                    /* Si tout va bien, enregistrer les données de l'utilisateur dans le localStorage */
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

        /* Récupération des fimms Disney à mettre en avant en utilisant le service FilmsDisney*/
        FilmsDisney.get({id:'51224e42760ee3297424a1e0'}, function(data){
            var json = angular.fromJson(data);
            console.log("json = " + angular.toJson(data));
            var imgs = angular.fromJson(json.items);
            $scope.imgs = imgs;
            console.log("imgs = " +imgs);
        });


        /* Action de réactualisation des données du Dashboard suite au PullToRefresh */
        $scope.refreshActus = function(){
            /* Envoi et traitement de la requête au serveur */
            $http.post('http://cinebook-project.tk/userInfos', user )
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

        /* Quand l'utilisateur clique sur "J'aime" dans un post */
        $scope.like = function(actu){
            /* S'il peut aimer */
            if(actu.can_like==true) {
                /* Envoi de la requête au serveur */
                $http.post('http://cinebook-project.tk/post/like/' + actu.id, user)
                    .success(function (data, status, headers, config) {
                        var json = angular.fromJson(data);

                        if (json.error == true) {
                            $scope.msgError = json;
                        } else {
                            var temp = parseInt(angular.fromJson(actu).likes) + 1;
                            console.log(temp);
                            actu.likes = temp;
                            actu.can_like = false; //Définit l'utilisateur comme ne pouvant plus "Aimer" le post en question
                        }
                    })
                    .error(function (data, status, headers, config) {
                        console.log('ERROR');
                    })
            }
        }

        /* Modal pour Charger les commentaires */
        $ionicModal.fromTemplateUrl('templates/comment-modal.html', function(modal) {
            $scope.commentModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        });

        /* Afficher les commentaires */
        $scope.showComments = function(actu){
            $scope.commentModal.show();
            $ionicLoading.show();
            /* Envoi et traitement de la requête au serveur */
            $http.post('http://cinebook-project.tk/post/' + actu.id+'/comments', user)
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    /* Extraction des commentaires depuis le JSON reçu */
                    $scope.comments = json.comments_list;
                    $scope.actu = actu;
                    $ionicLoading.hide();
                })
                .error(function (data, status, headers, config) {
                    console.log('ERROR');
                    $ionicLoading.hide();
                })
        };

        /* Fermer la fenêtre des commentaires */
        $scope.leaveComments = function() {
            // Supprimer la modal
            $scope.commentModal.remove();
            // Recharger la modal pour qu'elle soit de nouveau disponible à être chargée
            $ionicModal.fromTemplateUrl('templates/comment-modal.html', function(modal) {
                $scope.commentModal = modal;
            }, {
                scope: $scope,
                animation: 'slide-in-up'
            });
        };

        /* Raffraîchir la liste des commentaires suite à un PullToRefresh */
        $scope.refreshComments = function(actu){
            $ionicLoading.show();
            $http.post('http://cinebook-project.tk/post/' + actu.id+'/comments', user)
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

        /* Quand l'utilisateur poste un commentaire */
        $scope.onComment = function(actu, comment){
            var data = user;
            data.comment = comment;
            data.post_id = actu.id;
            $http.post('http://cinebook-project.tk/post/' + actu.id+'/comments/add', data)
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

        /* Vide le champ du commentaire */
        $scope.clearCommentInput = function(){
            $scope.comment = '';
        }
    })

    /*****************************************
     * REGISTER *
     *****************************************/
    .controller('RegisterCtrl', function($scope, $http, $state, $ionicPopup,$ionicLoading, $ionicViewService) {
        /* Traitement de la demande de création de compte */
        $scope.doRegister = function(registerData){
            $ionicLoading.show();

            /* Récupération des données de l'utilisateur */
            var user = {
                nom: registerData.nom,
                prenom: registerData.prenom,
                email: registerData.email,
                password : registerData.password
            };

            /* Envoi de la requête d'enregistrement au serveur (en POST) */
            $http.post('http://cinebook-project.tk/register', user )
                .success(function(data, status, headers, config){
                    var json = angular.fromJson(data);
                    if(json.error == true) {
                        $ionicPopup.alert({
                            title: 'Création de compte',
                            template: 'Un problème est survenu, réessayez plus tard'
                        });
                        $ionicLoading.hide();
                    }
                    else {
                        var alert = $ionicPopup.alert({
                            title: 'Création de compte',
                            template: 'Compte créé avec succès. Cliquer sur OK pour se connecter'
                        }).then(function () {
                            $state.go('signin');
                        });
                        $ionicLoading.hide();
                    }
                })
        }

        /* Aller à la vue Login */
        $scope.goToSignin = function () {
            $state.go('signin');
        }
    })

    /*****************************************
     * LOGIN *
     *****************************************/
    .controller('SignInCtrl', function($scope, $http, $state, $ionicPopup,$ionicLoading, $ionicViewService) {

        /* Traitement de la demande d'authentification */
        $scope.doLogin = function(loginData){
            $ionicLoading.show();
            var user = {
                login: loginData.login,
                password : loginData.password
            };
            $http.post('http://cinebook-project.tk/login', user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    if(json.error == true) {
                        $scope.msgError = json;
                        $ionicPopup.alert({
                            title: 'Erreur d\'authentification',
                            template: json.message
                        });
                        $ionicLoading.hide();
                    }else{
                        window.localStorage['user'] = angular.toJson(user);
                        window.localStorage['userId'] = json.user.id;
                        $ionicViewService.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        $state.go('tab.dash');
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                });

        };

        /* Aller à la vue Register */
        $scope.goToRegister = function () {
            $state.go('register');
        }
    })


    /*****************************************
     * FILM DETAILS *
     *****************************************/
    .controller('DetailFilmCtrl', function($scope, $stateParams, $http, $ionicLoading, $ionicViewService, $ionicModal, detailFilm, videoFilm){
        /* Eviter de revenir à la vue actuelle par le bouton Retour */
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $ionicLoading.show();

        /* Charger les données du film sélectionné depuis le service detailFilm */
        detailFilm.get($stateParams, function (data) {
            var json = angular.fromJson(data);
            $scope.data= json;
            var i=0;
            var nb_mot=0;
            var littleoverview="";
            /* N'afficher que 30 mots de la description */
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

            /* Genres */
            var genres = angular.fromJson(json.genres);
            $scope.genres ="";
            for(var i=0; i<json.genres.length; i++){
                $scope.genres+= genres[i].name;

                if(i != json.genres.length-1){
                    $scope.genres +=", "
                }
            }

            /************* Date de sortie *******************/
            var releaseDate = angular.fromJson(json).release_date;
            var arrayDate = releaseDate.split('-');
            releaseDate = arrayDate[2]+"/"+arrayDate[1]+"/"+arrayDate[0];
            //console.log(releaseDate);
            $scope.release_date = releaseDate;


        });
        /******** Bande annonce **********/
        videoFilm.get($stateParams, function (data) {
            var json = angular.fromJson(data);
            $scope.video=angular.fromJson(json.results[0]);
            $ionicLoading.hide();
        });

        // Charger la modal de partage de film
        $ionicModal.fromTemplateUrl('templates/share-modal.html', function(modal) {
            $scope.shareDialog = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        });

        /* Afficher la modal de partage */
        $scope.showShareDialog = function(){
            $scope.shareDialog.show();
        };

        /*Fermer la modal de partage*/
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

        /* Ouvrir la modal de partage */
        $scope.shareFilm = function(){
            $scope.showShareDialog();

        };

        /* Quand l'utilisateur partage un film */
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

            $http.post('http://cinebook-project.tk/posts/add', data )
                .success(function (data, status, headers, config) {
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
        /* Empêcher le retour à la vue "Amis" avec le bouton Retour */
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $ionicLoading.show();

        var user = angular.fromJson(window.localStorage['user']);

        $scope.userId = window.localStorage['userId'];

        /* Charger les amis depuis le serveur */
        $http.post('http://cinebook-project.tk/friends', user )
            .success(function (data, status, headers, config) {
                var json = angular.fromJson(data);
                $scope.friends = json.friends;

                var friendInfos = angular.toJson(json.friends);

                $ionicLoading.hide();
            })
            .error(function(data, status, headers, config){
                console.log('ERROR');
            });

        $scope.data = {
            showDelete: false
        };

        /* Mettre le badge du nombre de demandes d'amis */
        Friendship.async().then(function(d) {
            $scope.badge.friend = d;
        });

        /* Raffraîchir la vue "Amis" avec le PullToRefresh */
        $scope.refreshFriends = function(){
            $http.post('http://cinebook-project.tk/friends', user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    $scope.friends = json.friends;

                    var friendInfos = angular.toJson(json.friends);

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


        /* Suppression d'un ami */
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
                    $http.post('http://cinebook-project.tk/friend/delete/'+friend.id, user )
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

        /* Afficher les détails d'un ami */
        $scope.friendDetails = function(id){
            $ionicViewService.nextViewOptions({
                disableAnimate: false,
                disableBack: false
            });
            $state.go('tab.friend-detail',{'friendId': id});
        };

        /* Charger la modal d'ajout d'ami */
        $ionicModal.fromTemplateUrl('templates/friend-add-modal.html', function(modal) {
            $scope.addDialog = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        /* Afficher la modal d'ajout d'ami */
        $scope.showAddDialog = function(){
            $scope.addDialog.show();
        };

        /* Fermer la modal d'ajout d'ami */
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

        /* Vider le champs de recherche */
        $scope.clearSearch = function() {
            $scope.data.searchQuery = '';
        };

        /* Rechercher un ami */
        $scope.searchFriend = function(query){
            console.log('query = ' +query);
            var user = angular.fromJson(window.localStorage['user']);
            $http.post('http://cinebook-project.tk/friend/search/'+query, user )
                .success(function (data, status, headers, config) {
                    var json = angular.fromJson(data);
                    console.log("search = " + angular.toJson(data));
                    $scope.friendResults = json.results;
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR');
                });
        }

        /* Ajouter un ami */
        $scope.addFriend = function(friendId){
            console.log(friendId);
            $http.post('http://cinebook-project.tk/friend/add/'+friendId, user )
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

        /* Traiter une demande d'ajout d'ami */
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
                    $http.post('http://cinebook-project.tk/friend/confirm/'+friend.id, user )
                        .success(function (data, status, headers, config) {

                            $ionicLoading.hide();
                            $scope.refreshFriends();
                        })
                        .error(function(data, status, headers, config){
                            console.log('ERROR');
                        });
                } else {
                    $http.post('http://cinebook-project.tk/friend/decline/'+friend.id, user )
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
        /* Empêcher le retour à la vue "DétailsFriend" avec le bouton Retour */
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $ionicLoading.show();

        var user = angular.fromJson(window.localStorage['user']);

        /* Charger les détails d'un ami depuis le serveur */
        $http.post('http://cinebook-project.tk/friend/'+$stateParams.friendId, user )
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
    .controller('ParamsCtrl', function($scope, $state, $ionicViewService, $http, $ionicPopup, Camera) {
        /* Empêcher le retour à la vur Paramètres avec le bouton Retour */
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $scope.user = angular.fromJson(window.localStorage['userInfos']).user;

        $scope.lastPhoto = "http://cinebook-project.tk/images/"+$scope.user.id+".jpg";

        /*$http.get("http://cinebook-project.tk/images/"+$scope.user.id+".jpg").then(function(resp) {
            $scope.lastPhoto = "http://cinebook-project.tk/images/"+$scope.user.id+".jpg";
            // For JSON responses, resp.data contains the result
        }, function(err) {
            $scope.lastPhoto = "../img/avatar.jpg"
        })*/


        /* Déconnexion */
        $scope.logout = function(){
            window.localStorage.clear();
            $state.go('signin');
        };

        var user = angular.fromJson(window.localStorage['user']);

        /* Changer la photo de profil */
        $scope.changePhoto = function(){
            /* Message de choix de la Caméra ou la Galerie */
            var confirmPopup = $ionicPopup.confirm({
                title: 'Changer la photo',
                template: 'D\'où prendre la photo?',
                cancelText: 'Caméra', // String (default: 'Cancel'). The text of the Cancel button.
                cancelType: 'button-default', // String (default: 'button-default'). The type of the Cancel button.
                okText: 'Galerie', // String (default: 'OK'). The text of the OK button.
                okType: 'button-positive'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    /* Chargement depuis la Galerie */
                    navigator.camera.getPicture(function(imageURI){
                            $scope.lastPhoto =  imageURI;
                            var ft = new FileTransfer(),
                                options = new FileUploadOptions();

                            options.fileKey = "photo";
                            options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
                            options.mimeType = "image/jpeg";
                            options.chunkedMode = false;
                            options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                                "description": "Uploaded from my phone",
                                "login": user.login,
                                "password": user.password
                            };

                            ft.upload(imageURI, 'http://cinebook-project.tk/user/uploadPhoto',
                                function (e) {
                                    alert('upload ok');
                                },
                                function (e) {
                                    alert("Upload failed");
                                    console.log("upload error source " + e);
                                }, options);
                        }, function(message) {
                            alert('get picture failed');
                        },{
                            quality: 50,
                            targetWidth: 128,
                            targetHeight: 128,
                            destinationType: navigator.camera.DestinationType.FILE_URI,
                            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                        }
                    );
                } else {
                    /* Chargement depuis une prise de photo depuis la Caméra */
                    navigator.camera.getPicture(function(imageURI){
                            $scope.lastPhoto =  imageURI;
                            var ft = new FileTransfer(),
                                options = new FileUploadOptions();

                            options.fileKey = "photo";
                            options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
                            options.mimeType = "image/jpeg";
                            options.chunkedMode = false;
                            options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                                "description": "Uploaded from my phone",
                                "login": user.login,
                                "password": user.password
                            };

                            ft.upload(imageURI, 'http://cinebook-project.tk/user/uploadPhoto',
                                function (e) {
                                    alert('Changement de photo effectué avec succès');
                                },
                                function (e) {
                                    alert("Une erreur est survenue lors du changement de photo");
                                }, options);

                        }, function(message) {
                            alert('get picture failed');
                        },{
                            quality: 50,
                            targetWidth: 128,
                            targetHeight: 128,
                            destinationType: navigator.camera.DestinationType.FILE_URI,
                            sourceType: navigator.camera.PictureSourceType.CAMERA
                        }
                    );
                }
            });
        }

        /* Supprimer la photo de profil */
        $scope.deletePhoto = function(){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer photo de profil',
                template: 'Supprimer la photo de profil ?',
                cancelText: 'Non',
                okText: 'Oui'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $http.post('http://cinebook-project.tk/user/deletePhoto', user)
                        .success(function(data, status, header, config){
                            $http.get("http://cinebook-project.tk/images/"+$scope.user.id+".jpg")
                                .success(function(data, status, header, config){
                                    $scope.lastPhoto = data.src;
                                });
                        });
                } else {
                    console.log('Pas de changement');
                }
            });
        }
    })

    /*****************************************
     * CINEMA *
     *****************************************/
    .controller('CinemaCtrl', function($scope, $state, $ionicPlatform, $timeout, Films, FilmsPaginated, detailFilm) {

        var result;
        var overviews = new Array();

        /* Charger la liste des films de la catégorie "Aminés" (16) à l'aide du service Films */
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

        /* Charger plus de films quand l'utilisateur arrive à la fin de la page */
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


