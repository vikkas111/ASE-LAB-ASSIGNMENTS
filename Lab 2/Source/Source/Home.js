<script>
angular.module('GoogleDirection', [])
    .controller('googlemapoutput', function ($scope,$http) {

        var map;
        var mapOptions;
        var directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true
        });
        var directionsService = new google.maps.DirectionsService();

        $scope.initialize = function () {
            var pos = new google.maps.LatLng(0, 0);
            var mapOptions = {
                zoom: 3,
                center: pos
            };

            map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);
        };
        $scope.calcRoute = function () {
            var end = document.getElementById('endlocation').value;
            var start = document.getElementById('startlocation').value;

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                    directionsDisplay.setDirections(response);
                    console.log(status);
                }

            });
        };

        google.maps.event.addDomListener(window, 'load', $scope.initialize);

        $scope.getWeather = function () {

            $http.get('http://api.openweathermap.org/data/2.5/weather?q='+document.getElementById('startlocation').value+'&appid=31bd556b96df84d2e1f5b145f1d665fc').success(function(data){


                console.log(data);
                temp2 =  data.main.temp;
                weather2 = data.weather[0].main;
                console.log(temp2)
                $scope.starttemp= ((temp2 * 9/5)-459.67);
                $scope.weatherstart = weather2;


            });
            $http.get('http://api.openweathermap.org/data/2.5/weather?q='+document.getElementById('endlocation').value+'&appid=31bd556b96df84d2e1f5b145f1d665fc').success(function(data){

                temp1 =  data.main.temp;
                console.log(temp1);
                weather1 = data.weather[0].main;
                $scope.endtemp= ((temp1 * 9/5)-459.67);
                $scope.weatherend = weather1;


            });

        }
    });




</script>