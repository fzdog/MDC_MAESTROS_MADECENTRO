
(function() {
    'use strict';

    angular.module('appmadecentro', [
            'ngRoute', 'ngCookies', 'ui.bootstrap', 'angularFileUpload',
            'ngAnimate', 'ngMessages', 'ngProgress', 'blockUI', 'smart-table'
        ])
        .config(function($routeProvider, $locationProvider, blockUIConfig) {
            var rand = parseInt(Math.random() * 10000);
            moment.locale('es');

            $routeProvider
                .when('/', {
                    templateUrl: 'Modulos/Home/HomeView.html?rand=' + rand,
                    controller: 'HomeCtrl'
                }).when('/Maestros', {
                    templateUrl: 'Modulos/Maestros/MaestrosView.html?rand=' + rand,
                    controller: 'MaestrosCtrl'
                }).when('/GestionPersonal', {
                    templateUrl: 'Modulos/GestionPersonal/GestionPersonal.html?rand=' + rand,
                    controller: 'GestionPersonal'
                }).when('/GestionPlazas', {
                    templateUrl: 'Modulos/GestionPlazas/GestionPlazasView.html?rand=' + rand,
                    controller: 'GestionPlazas'
                }).when('/GestionDescuentos', {
                    templateUrl: 'Modulos/GestionDescuentos/GestionDescuentosView.html?rand=' + rand,
                    controller: 'GestionDescuentos'
                }).when('/GestionUsuariosSam', {
                    templateUrl: 'Modulos/GestionUsuariosSam/UsuariosSamView.html?rand=' + rand,
                    controller: 'UsuariosSam'
                }).when('/GestionMesesInv', {
                    templateUrl: 'Modulos/GestionMesesInv/MesesInventario.html?rand=' + rand,
                    controller: 'MesesInventario'
                }).when('/ProgramacionDescuentos', {
                    templateUrl: 'Modulos/ProgramacionDescuentos/ProgramacionDescuentos.html?rand=' + rand,
                    controller: 'ProgramacionDescuentos'
				}).when('/GestionCargos', {
                    templateUrl: 'Modulos/GestionCargos/GestionCargosView.html?rand=' + rand,
                    controller: 'GestionCargosCtrl'
				}).when('/GestionSedesPdv', {
                    templateUrl: 'Modulos/GestionSedesPdv/GestionSedesPdvView.html?rand=' + rand,
                    controller: 'GestionSedesPdvCtrl'
                }).when('/GestionBodegasPdv', {
                    templateUrl: 'Modulos/GestionBodegasPdv/GestionBodegasPdvView.html?rand=' + rand,
                    controller: 'GestionBodegasPdvCtrl'
				}).when('/AutorizadoresMayorDcto', {
                    templateUrl: 'Modulos/AutorizadoresMayorDcto/AutorizadoresMayorDctoView.html?rand=' + rand,
                    controller: 'AutorizadoresMayorDctoCtrl'
				}).when('/GestionPresupuestosMesPdv', {
                    templateUrl: 'Modulos/GestionPresupuestosMesPdv/GestionPresupuestosMesPdvView.html?rand=' + rand,
                    controller: 'GestionPresupuestosMesPdvCtrl'
				}).when('/UsuariosTransporte', {
					templateUrl: 'Modulos/UsuariosTransporte/UsuariosTransporte.html?rand=' + rand,
                    controller: 'UsuariosTransporte'
                }).when('/GestionMayorDescuento', {
                    templateUrl: 'Modulos/GestionMayorDescuento/GestionMayorDescuento.html?rand=' + rand,
                    controller: 'GestionMayorDescuento'
                }).when('/GestionSuperOferta', {
                    templateUrl: 'Modulos/GestionSuperOferta/GestionSuperOferta.html?rand=' + rand,
                    controller: 'GestionSuperOferta'

                }).otherwise({
                    redirectTo: '/'
                });
            //}).when('/ForgotPassword/:idUsuarioChangePass', {
            //    templateUrl: 'Modulos/ForgotPassword/ForgotPasswordView.html',
            //    controller: 'ForgotPasswordCtrl'

            blockUIConfig.delay = 0;
            //blockUIConfig.message = 'Espere...';


        })
        .controller('app', [
            '$scope', '$rootScope', '$route', '$location', '$http', 'TreidConfigSrv', 'loginService', 'ngProgressFactory', function($scope, $rootScope, $route, $location, $http, TreidConfigSrv, loginService, ngProgressFactory) {

                $scope.Init = function() {
                    var vm = $scope;
                    vm.VERSION_APP = VERSION_APP;
                    /*instancia global progressbar*/
                    $rootScope.progressbar = ngProgressFactory.createInstance();

                    $rootScope.actualPage = "";

                    alertify.defaults = {
                        // dialogs defaults
                        modal: true,
                        basic: false,
                        frameless: false,
                        movable: false,
                        resizable: false,
                        closable: true,
                        closableByDimmer: true,
                        maximizable: false,
                        startMaximized: false,
                        pinnable: true,
                        pinned: true,
                        padding: true,
                        overflow: true,
                        maintainFocus: true,
                        //transition: 'slide',
                        autoReset: true,

                        // notifier defaults
                        notifier: {
                            // auto-dismiss wait time (in seconds)  
                            delay: 5,
                            // default position
                            position: 'bottom-right'
                        },

                        // language resources 
                        glossary: {
                            // dialogs default title
                            title: 'Alerta!',
                            // ok button text
                            ok: 'Aceptar',
                            // cancel button text
                            cancel: 'Cancelar'
                        },

                        // theme settings
                        theme: {
                            // class name attached to prompt dialog input textbox.
                            input: 'ajs-input',
                            // class name attached to ok button
                            ok: 'btn btn-warning',
                            // class name attached to cancel button 
                            cancel: 'btn btn-warning'
                        }
                    };

                    $rootScope.DominioPpal =
                    {
                        value: ""
                    };
                    $rootScope.idCompaniaAspirante =
                    {
                        value: ""
                    };
                    $rootScope.itemInicio = {
                        value: 0
                    };
                    $rootScope.maestro_dctos = {
                        value: 0,
                        seleccionado: false
                    };
                    $rootScope.programacion_dctos = {
                        seleccionado: false
                    };
                    $rootScope.maestro_plazas = {
                        value: 0,
                        seleccionado: false
                    };

                    $scope.Surcursales = [];
                    $scope.valido = false;
                    $scope.objectDialog = {};
                    $scope.mostrarMenu = true;

                    $rootScope.idCompaniaAspirante.value = TreidConfigSrv.variables.idCompaniaAspitante;

                    $scope.RedirectTo = function(pathname) {

                        $location.path(pathname);
                        $rootScope.actualPage = pathname;
                    };

                    // cerrar session
                    //$scope.cerrarSession = function () {
                    //    loginService.cerrarSesion();
                    //};
					
					  $scope.sort=function(keyname){ //Elkin; tener pendiente esta funcion en app.js
                        $scope.sortKey = keyname;
                        $scope.reverse = !$scope.reverse;
                    };

                    $scope.AbrirImagen = function(URL) {
                        var k = parseInt(Math.random() * 10000);
                        $rootScope.urlImagenReply = URL.trim() + "?time=" + k;
                        $(document).ready(function() {
                            $("#ImagenPerfil").modal(
                            {
                                //show: true
                                //backdrop: 'static',
                                //keyboard: false
                     
                            });
                        });
                    };
                    angular.activarFancybox();
                };

                $scope.Init();
            }
        ])
        .run(function($timeout) {
            angular.activarFancybox = function() {
                $timeout(function() {
                    $("img[alt^='zoom']").each(function() {
                        $(this).fancybox({
                            content: $("<img/>").attr("src", this.src).addClass('img-responsive'),
                            openEffect: 'none',
                            closeEffect: 'fade',
                            openSpeed: 10,
                            playSpeed: 10
                        });
                    });
                }, 300);
            };
        });
}());