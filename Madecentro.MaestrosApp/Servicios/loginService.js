(function () {

    'use strict';

    angular.module('appmadecentro').factory('loginService', ['$rootScope', '$http', 'TreidConfigSrv', '$timeout', '$location', '$route', '$cookieStore', function ($rootScope, $http, TreidConfigSrv, $timeout, $location, $route, $cookieStore) {
        
        var loginService = {};
        loginService.UserData = {           
            PrimerApellido: "",
            PrimerNombre: "",
            SegundoApellido: "",
            SegundoNombre: "",
            UserName: "",
            cs_IdUsuario: 1,
            Sucursales:[]
        };

        //loginService.cerrarSesion = function () {
        //    $cookieStore.remove('serviceLogIn');
        //    $state.go('/');
        //    location.reload();
        //};
        
        loginService.hasSession = false;   
        loginService.verificarsession = function (userData) {
            //    ir al codebehnd con ajax y verificar session
            // retornar datos rol y permisos
            return false;
        };

   

        return loginService;
    }])
}());