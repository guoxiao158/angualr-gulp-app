"use strict"

angular.module('app')
.controller('loginCtrl', ['cache', '$http', '$state', '$scope', function(cache, $http, $state, $scope) {
  $scope.submit = function() {
    $http.post('data/login.json').success(function(res) {
      cache.put('id', res.id);
      cache.put('name', res.name);
      cache.put('image', res.image);
      $state.go('main');
    })
  }
}])
