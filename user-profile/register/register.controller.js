(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$filter', 'UserFactory', 'MessageFactory', 'GoogleMapFactory'];
    function RegisterController($scope, $filter, UserFactory, MessageFactory, GoogleMapFactory) {
        var vm = this;

        vm.register = register;
        vm.openMap = openMap;
        vm.updateLocation = updateLocation;

        vm.user = {};
        vm.user.location = '';

        function register() {
            vm.dataLoading = true;
            vm.googleplaceAutocomplete = '';
            vm.googleplaceAutocompletePlace = '';
            UserFactory.CreateUpdate(vm.user)
                .then(function (response) {
                    if (response.success) {
                        MessageFactory.Success('User record saved successful', true);
                    } else {
                        MessageFactory.Error(response.message);
                    }
                    vm.dataLoading = false;
                    localStorage.retainUserName = vm.user.username;
                },
                function (error) {
                    console.log(error);
                });
        }

        function openMap() {
            GoogleMapFactory.initMap();
        }

        function updateLocation() {
            vm.user.location = localStorage.latlong;
        }

        function retainUser() {
            //retain last user entered
            if (localStorage.users) {
                UserFactory.GetByUsername(localStorage.retainUserName)
                    .then(function (user) {
                        vm.user = user;
                        vm.user.dob = new Date(new Date(user.dob).toISOString().split("T")[0]);
                    });
            }
        }
        retainUser();
    }

})();
