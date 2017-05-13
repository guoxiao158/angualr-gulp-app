"use strict";

angular.module('app')
.controller('favoriteCtrl', ['$http', '$state', '$scope', function($http, $state, $scope) {
  $http.get('data/myFavorite.json')
  .then(function(res) {
    $scope.list = res.data;
  })
}])
