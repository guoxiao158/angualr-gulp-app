"use strict"

angular.module('app')
.controller('mainCtrl', ['$http', '$scope', function($http, $scope) {

  console.log($scope.$id, 111);
  $http.get('/data/positionList.json')
  .then(function(res) {
    $scope.list = res.data;
  })
}])
