'use strict';

var app = angular.module('domainApp');

app.controller('mainController', function ($scope) {
    console.log('controller loaded');

    $scope.title = 'hello world';
});
