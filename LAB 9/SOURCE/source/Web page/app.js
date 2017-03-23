/**
 * Created by bnqm6 on 10/19/2016.
 */
var app=angular.module("search",[]);
app.controller("searchctrl",function ($scope,$http) {
    $scope.search = function () {
        var movie=$scope.movie_title;
        var words = $http.get("http://127.0.0.1:8081/getdata/"+movie);
        words.success(function (data) {
            console.log(data);
            $scope.movie={"Title":data.body[0].Title,"Released":data.body[0].Released,"Genre":data.body[0].Genre, "Plot":data.body[0].Plot, "Plot_ESP":data.body[0].Plot_in_Spanish ,"Country":data.body[0].Country,"Rating":data.body[0].Rating, "Votes":data.body[0].Votes, "linkv":data.body[0].NYTimes};
        });
    }
});