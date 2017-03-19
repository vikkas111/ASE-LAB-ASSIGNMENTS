angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

  .controller('AppCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.player = function() {
      $rootScope.player();
    }
  }])

  .controller('BrowseCtrl', ['$window', '$ionicPlatform', '$rootScope', '$scope', '$ionicScrollDelegate', 'AudioSvc', '$ionicModal',
    function($window, $ionicPlatform, $rootScope, $scope, $ionicScrollDelegate, AudioSvc, $ionicModal) {
      $scope.files = [];

      $ionicModal.fromTemplateUrl('templates/player.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $rootScope.hidePlayer = function() {
        $scope.modal.hide();
      };

      $rootScope.player = function() {
        $scope.modal.show();
      };

      $ionicPlatform.ready(function() {

        $rootScope.show('Accessing Filesystem.. Please wait');
        $window.requestFileSystem($window.LocalFileSystem.PERSISTENT, 0, function(fs) {
            //console.log("fs", fs);

            var directoryReader = fs.root.createReader();

            directoryReader.readEntries(function(entries) {
                var arr = [];
                processEntries(entries, arr); // arr is pass by refrence
                $scope.files = arr;
                $rootScope.hide();
              },
              function(error) {
                console.log(error);
              });
          },
          function(error) {
            console.log(error);
          });

        $scope.showSubDirs = function(file) {

          if (file.isDirectory || file.isUpNav) {
            if (file.isUpNav) {
              processFile(file.nativeURL.replace(file.actualName + '/', ''));
            } else {
              processFile(file.nativeURL);
            }
          } else {
            if (hasExtension(file.name)) {
              if (file.name.indexOf('.mp4') > 0) {
                // Stop the audio player before starting the video
                $scope.stopAudio();
                VideoPlayer.play(file.nativeURL);
              } else {
                fsResolver(file.nativeURL, function(fs) {
                  //console.log('fs ', fs);
                  // Play the selected file
                  AudioSvc.playAudio(file.nativeURL, function(a, b) {
                    //console.log(a, b);
                    $scope.position = Math.ceil(a / b * 100);
                    if (a < 0) {
                      $scope.stopAudio();
                    }
                    if (!$scope.$$phase) $scope.$apply();
                  });

                  $scope.loaded = true;
                  $scope.isPlaying = true;
                  $scope.name = file.name;
                  $scope.path = file.fullPath;

                  // show the player
                  $scope.player();

                  $scope.pauseAudio = function() {
                    AudioSvc.pauseAudio();
                    $scope.isPlaying = false;
                    if (!$scope.$$phase) $scope.$apply();
                  };
                  $scope.resumeAudio = function() {
                    AudioSvc.resumeAudio();
                    $scope.isPlaying = true;
                    if (!$scope.$$phase) $scope.$apply();
                  };
                  $scope.stopAudio = function() {
                    AudioSvc.stopAudio();
                    $scope.loaded = false;
                    $scope.isPlaying = false;
                    if (!$scope.$$phase) $scope.$apply();
                  };

                });
              }
            } else {
              $rootScope.toggle('Oops! We cannot play this file :/', 3000);
            }

          }

        }

        function fsResolver(url, callback) {
          $window.resolveLocalFileSystemURL(url, callback);
        }

        function processFile(url) {
          fsResolver(url, function(fs) {
            //console.log(fs);
            var directoryReader = fs.createReader();

            directoryReader.readEntries(function(entries) {
                if (entries.length > 0) {
                  var arr = [];
                  // push the path to go one level up
                  if (fs.fullPath !== '/') {
                    arr.push({
                      id: 0,
                      name: '.. One level up',
                      actualName: fs.name,
                      isDirectory: false,
                      isUpNav: true,
                      nativeURL: fs.nativeURL,
                      fullPath: fs.fullPath
                    });
                  }
                  processEntries(entries, arr);
                  $scope.$apply(function() {
                    $scope.files = arr;
                  });

                  $ionicScrollDelegate.scrollTop();
                } else {
                  $rootScope.toggle(fs.name + ' folder is empty!', 2000);
                }
              },
              function(error) {
                console.log(error);
              });
          });
        }

        function hasExtension(fileName) {
          var exts = ['.mp3', '.m4a', '.ogg', '.mp4', '.aac'];
          return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
        }

        function processEntries(entries, arr) {

          for (var i = 0; i < entries.length; i++) {
            var e = entries[i];

            // do not push/show hidden files or folders
            if (e.name.indexOf('.') !== 0) {
              arr.push({
                id: i + 1,
                name: e.name,
                isUpNav: false,
                isDirectory: e.isDirectory,
                nativeURL: e.nativeURL,
                fullPath: e.fullPath
              });
            }
          }
          return arr;
        }

      });
    }
  ])




  .controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function() {
      LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        $state.go('tab.dash');
      }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    }
  })




    .controller('ChatsCtrl',function($scope, $state)
    {
        $scope.goaudio = function () {
            $state.go('tab.chats');
        }

    })



  .controller('RegisterCtrl',function($scope, $state)
  {
    $scope.register = function () {
      $state.go('tab.dash');
    }

  })

  .controller('navCtrl',function($scope, $state) {

  })

.controller("ExampleController", function($scope, $cordovaMedia, $ionicLoading) {

  $scope.play = function(src) {
    var media = new Media(src, null, null, mediaStatusCallback);
    $cordovaMedia.play(media);
  }

  var mediaStatusCallback = function(status) {
    if(status == 1) {
      $ionicLoading.show({template: 'Loading...'});
    } else {
      $ionicLoading.hide();
    }
  }

})


    .controller('MainCtrl',function($scope,  $state)
    {

        $scope.login1 = function() {
            $state.go('login');

        }

        $scope.register1 = function() {
            $state.go('register');
        }


    })




.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MovieController', function($scope, $http){
  $scope.audio = function() {
    $state.go('nav');
  }

  $scope.$watch('search', function() {
        fetch();
    });

    $scope.search = "Sherlock Holmes";
    var msg = new SpeechSynthesisUtterance('Tags related to the given image are'+ $scope.search);
    window.speechSynthesis.speak(msg);

    function fetch(){
        $http.get("http://www.omdbapi.com/?t=" + $scope.search + "&tomatoes=true&plot=full")
            .then(function(response){ $scope.details = response.data; });
        $http.get("http://www.omdbapi.com/?s=" + $scope.search)
            .then(function(response){ $scope.related = response.data; });


      //document.getElementByName('itext').innerHTML = itext.toString().replace(/,/g, ', ');
        //var msg = new SpeechSynthesisUtterance('Tags related to the given image are'+itext);
        //window.speechSynthesis.speak(msg);

    }

    $scope.update = function(movie){
        $scope.search = movie.Title;
      var msg = new SpeechSynthesisUtterance('Tags related to the given image are'+ $scope.search);
      window.speechSynthesis.speak(msg);
    };

    $scope.select = function(){
        this.setSelectionRange(0, this.value.length);
    }

    //document.getElementByName('itext').value= itext.toString().replace(/,/g, ', ');
    //var msg = new SpeechSynthesisUtterance('Tags related to the given image are'+itext);
    //window.speechSynthesis.speak(msg);
});



