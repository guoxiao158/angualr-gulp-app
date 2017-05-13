"use strict";
angular.module('app')
.directive('appPositionList', ['$http', function($http) {
  return {
    restrict: 'A',
    templateUrl: 'view/template/positionList.html',
    scope: {
      data: '=',
      filterObj: '=',
      isFavorite: '='
    },
    link: function($scope) {
      $scope.select = function(item) {
        $http.post('data/favorite.json', {
          id: item.id,
          select: !item.select,
        }).success(function(res){
          if(res.state === 1){
            item.select = !item.select;
          }
        })
      }
    }
  }
}])
