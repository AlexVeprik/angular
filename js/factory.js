basicApp.factory('authService', ['$http', '$q', '$rootScope',
    'userAuthenticationModel', 'localStorageService',
    function($http, $q, $rootScope, userAuthenticationModel, localStorageService) {

        var
            login = function(username, password, persistent) {
                /*
                return $http({
                    method          : 'POST',
                    url             : '/v1/token',
                    headers         : {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: JSONtoXFrom,
                    data            : {
                        grant_type: 'password',
                        username  : username,
                        password  : password
                    }
                })
                    .success(function (data) {
                        setAuthenticationDetails(data.userName, data.token, data.expired);
                        applySecurityHeader();
                        persistAuthenticationDetails(persistent);
                        return data;
                    })
                    .error(function (errorResponse) {
                        return $q.reject(errorResponse.message);
                    });
                */
                if (username == 'admin' && password == 'admin') {
                    setAuthenticationDetails(username, 'StableToken', (Date.now() / 1000) +
                        100)
                    applySecurityHeader();
                    persistAuthenticationDetails(persistent);
                    var deferred = $q.defer();

                    setTimeout(function() {
                        deferred.resolve({})
                    }, 10);

                    return deferred.promise;
                } else {
                    return $q.reject({
                        data: {
                            message: "Invalid Credentials"
                        }
                    });
                }


            },

            setAuthenticationDetails = function(userName, accessToken, expiry) {
                userAuthenticationModel.userName = userName;
                userAuthenticationModel.token = accessToken;
                userAuthenticationModel.tokenExpiry = expiry;
            },

            clearAuthenticationModel = function() {
                userAuthenticationModel.reset();
            },

            // This adds Authorization HTTP header to all requests and sets it's value to the provided token
            applySecurityHeader = function() {
                $http.defaults.headers.common['Authorization'] = "Bearer " +
                    userAuthenticationModel.token;
            },

            persistAuthenticationDetails = function(persistent) {
                if (localStorageService.isSupported) {
                    if (persistent) {
                        // set storage to local only if the user has requested to remember his login
                        localStorageService.setStorageType('localStorage');
                    } else {
                        localStorageService.setStorageType('sessionStorage');
                    }
                    localStorageService.set('authDetails', userAuthenticationModel);
                }
            },

            register = function(registration) {
                return $http({
                    method: 'POST',
                    url: '/v1/users',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: JSONtoXFrom,
                    data: registration
                });
            },

            logout = function() {
                if (localStorageService.isSupported) {
                    localStorageService.remove('authDetails');
                }
                $http.defaults.headers.common['Authorization'] = null;
                clearAuthenticationModel();
                $rootScope.$broadcast('event:auth-logoutSuccess', null);
            },

            authorized = function() {
                return userAuthenticationModel && userAuthenticationModel.isValid();
            },

            restoreAuthorize = function() {
                if (localStorageService.isSupported) {
                    localStorageService.setStorageType('localStorage');
                    userAuthenticationModel.apply(localStorageService.get('authDetails'));
                    if (authorized()) {
                        applySecurityHeader();
                    }
                }
                return this.authorized();
            };

        return {
            login: login,
            register: register,
            logout: logout,
            authorized: authorized,
            restoreAuthorize: restoreAuthorize
        };
    }
]);

basicApp.factory('dataService', ['$http', function($http) {
    var dataService = {};

    dataService.getUsers = function() {
        return $http.get("/api/user")
            .then(function(success) {
                return success.data;
            });
    };

    dataService.getUserByUserName = function(userName) {
        return $http.get("/api/user/name/" + userName)
            .then(function(success) {
                return success.data;
            });
    };

    dataService.getUserByEmailAddress = function(emailAddress) {
        return $http.get("/api/user/email/" + emailAddress)
            .then(function(success) {
                return success.data;
            });
    };

    dataService.getAvailableFriends = function(userName) {
        return $http.get("/api/relationship/potentials/" + userName)
            .then(function(success) {
                return success.data;
            });
    };

    dataService.addFriend = function(userBeingFollowed) {
        return $http({
                url: "/v1/friends-add",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: JSONtoXFrom,
                data: {
                    friend: userBeingFollowed
                }
            })
            .then(function(success) {
                return success.data;
            });
    };

    dataService.availableFriendsByFilter = function(followerUserName, query) {
        return $http({
                url: "/v1/friends-find",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: JSONtoXFrom,
                data: {
                    find: query
                }
            })
            .then(function(success) {
                return success.data;
            });
    };

    dataService.getTop10Friends = function() {
        return $http.get("/v1/friends");
    };

    dataService.breakRelationship = function(relationshipId) {
        return $http.delete("/api/relationship/" + relationshipId);
    };

    dataService.addProfileComment = function(profileUserName, commentUserName,
        comment) {
        var data = {
            profileUserName: profileUserName,
            commentUserName: commentUserName,
            comment: comment
        };
        return $http.post("/api/comment", data)
            .then(function(success) {
                return success.data;
            });
    };

    dataService.getTop20ProfileComments = function(profileUserName) {
        return $http.get("/api/comment/top20/" + profileUserName)
            .then(function(success) {
                return success.data;
            });
    };

    dataService.deleteComment = function(id) {
        return $http.delete("/api/comment/" + id);
    };

    dataService.updateComment = function(id, comment) {
        var data = {
            id: id,
            comment: comment
        };
        return $http.put("/api/comment", data);
    };

    dataService.uploadCommentImage = function(id, imgSrc) {
        var data = {
            id: id,
            imgSrc: imgSrc
        };
        return $http.put("/api/comment/updateCommentImage", data);
    };

    dataService.getAllCategories = function() {
        return $http.get("/v1/categories")
            .then(function(success) {
                return success.data;
            });
    };

    dataService.saveUserSubCategories = function(userId, subCategories) {
        return $http({
            method: 'PUT',
            url: "/v1//users/" + userId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: JSONtoXFrom,
            data: {
                interest: subCategories
            }
        });
    };

    return dataService;
}]);
basicApp.factory('messageModalService', ['ngDialog', function(ngDialog) {
    return {
        open: function(title, message, options) {
            var defaults = {
                className: "ngdialog-theme-plain",
                templateUrl: '/template/messageModal.html',
                closeByEscape: true,
                showClose: false,
                closeByDocument: false,
                data: {
                    header: title ? title : "Information",
                    message: message ? message : ""
                }
            };

            options = $.extend(true, defaults, options); // deep extend

            return ngDialog.open(options);
        }
    };
}]);
basicApp.factory('confirmModalService', ['ngDialog', function(ngDialog) {
    return {
        open: function(title, message, options) {
            var defaults = {
                className: "ngdialog-theme-plain",
                templateUrl: '/template/confirmDialog.html',
                closeByEscape: false,
                showClose: false,
                closeByDocument: false,
                data: {
                    header: title ? title : "Discarding Your Changes",
                    message: message ? message : "Are you sure you want to discard your changes?",
                    btnConfirmCaption: "OK",
                    btnCancelCaption: "Cancel"
                }
            };

            options = $.extend(true, defaults, options); // deep extend

            return ngDialog.openConfirm(options);
        }
    };
}]);
