var app = angular.module('demo',[]);
app.run(function ($http) {
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.post['dataType'] = 'json'
});
app.controller('MongoController',function($scope,$http){
    $scope.delete=function () {
        alert("Record Deleted");
        var req = $http.post('http://127.0.0.1:8081/delete');
        req.success(function(data, status, headers, config) {
            console.log(data);
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }
    $scope.update=function () {
        alert("Record Updated");
        var req = $http.post('http://127.0.0.1:8081/update',$scope.id1);
        req.success(function(data, status, headers, config) {
            $scope.message = data;
            console.log(data);
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }
    $scope.insert = function(){
        alert("Registration Successful");
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        var req = $http.post('http://127.0.0.1:8081/register',$scope.formData);
        req.success(function(data, status, headers, config) {
            console.log(data);
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });

    };
    $scope.records=function () {
        var req = $http.post('http://127.0.0.1:8081/disp');
        req.success(function(data, status, headers, config) {
            var col = [];
            for (var i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }
            var table = document.createElement("table");
            table.border="2";
            var tr = table.insertRow(-1);
            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");
                th.innerHTML = col[i];
                tr.appendChild(th);
            }
            for (var i = 0; i < data.length; i++) {
                tr = table.insertRow(-1);
                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = data[i][col[j]];
                }
            }
            var divContainer = document.getElementById("container");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }
});

