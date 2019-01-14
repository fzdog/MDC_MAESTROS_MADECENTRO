(function () {
    'use strict';
    angular.module('appmadecentro').controller('HomeCtrl', ['$scope', 'loginService', '$location', '$http', 'TreidConfigSrv', '$rootScope', '$cookieStore', function ($scope, loginService, $location, $http, TreidConfigSrv, $rootScope, $cookieStore) {

        $scope.InitData = function () {
            $scope.hola = "hola";
            $scope.objectDialog.HideDialog();
        };

        if ($location.$$path == "/") {

            if ($rootScope.CerrarSession.value) {
                $cookieStore.remove('serviceLogIn');
                
                loginService.hasSession = false;
                $rootScope.$$childHead.showmodal = true;
                $rootScope.listMaestrosEncabezado = [];
            }
            loginService.hasSession = false;
            $rootScope.$$childHead.showmodal = true;
            
        }

    }]);
}());
