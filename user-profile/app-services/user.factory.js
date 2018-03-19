(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserFactory', UserFactory);

    UserFactory.$inject = ['$timeout', '$filter', '$q'];
    function UserFactory($timeout, $filter, $q) {

        var service = {};
        service.GetByUsername = GetByUsername;
        service.CreateUpdate = CreateUpdate;
        return service;

        function GetByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { username: username });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function CreateUpdate(user) {
            var deferred = $q.defer();

            $timeout(function () {
                GetByUsername(user.username)
                    .then(function (existingUser) {
                        var users = getUsers();
                        if (existingUser !== null) {
                            for (var i = 0; i < users.length; i++) {
                                if (users[i].username === user.username) {
                                    users[i] = user;
                                    break;
                                }
                            }
                        } else {
                            // assign id
                            var lastUser = users[users.length - 1] || { id: 0 };
                            user.id = lastUser.id + 1;
                            user.dob = user.dob.setDate(user.dob.getDate() + 1);//add 1 day while saving

                            // save to local storage
                            users.push(user);
                        }
                        setUsers(users);
                        deferred.resolve({ success: true });
                    });
            }, 1000);

            return deferred.promise;
        }

        // private functions
        function getUsers() {
            if(!localStorage.users){
                localStorage.users = JSON.stringify([]);
            }
            return JSON.parse(localStorage.users);
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }
    }
})();