angular.module('NavCtrl', []).controller('NavController', function($scope) {
    $scope.pageLangs = languageData.pages.login;
    $scope.nav = languageData.nav;
    $scope.header = languageData.header;
    $scope.footer = languageData.footer;
    $scope.dictionary = languageData.dictionary;
});