(function () {
    'use strict';

    angular
        .module('app')
        .factory('GoogleMapFactory', GoogleMapFactory);

    GoogleMapFactory.$inject = ['$http'];

    function GoogleMapFactory($http) {
        var map, infoWindow, service = {};
        service.initMap = initMap;
        return service;

        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 15
            });
            infoWindow = new google.maps.InfoWindow;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent('Location found.');
                    infoWindow.open(map);
                    map.setCenter(pos);
                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }

            //add event listener
            google.maps.event.addListener(map, 'click', function (event) {
                var marker = new google.maps.Marker({position: event.latLng, map: map});
                var path = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + event.latLng.lat() + " " + ", " + event.latLng.lng();
                function handleSuccess(result) {
                    localStorage.latlong = result.data.results[2].formatted_address;
                }
                function handleError(error) {
                    console.log('Error getting locations, ' + error);
                }
                $http.get(path).then(handleSuccess, handleError);
            });
        }

        // private functions
        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
    }
})();

