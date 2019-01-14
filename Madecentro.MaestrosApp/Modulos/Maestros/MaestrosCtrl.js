(function () {
    'use strict';

    angular.module('appmadecentro')
           .controller('MaestrosCtrl', MaestrosCtrl);

    MaestrosCtrl.$inject = ['$scope', 'TreidConfigSrv', 'loginService', '$q', '$location', '$cookieStore', '$rootScope', 'gestionMaestrosService'];

    function MaestrosCtrl($scope, TreidConfigSrv, loginService, $q, $location, $cookieStore, $rootScope, gestionMaestrosService) {
        
        var vm = $scope;

        vm.init = function () {

            /*manejo de la barra ppal*/
            $rootScope.itemInicio.value                = 1;
            $rootScope.maestro_dctos.value             = 0;
            $rootScope.maestro_dctos.seleccionado      = false;
            $rootScope.programacion_dctos.seleccionado = false;
            $rootScope.maestro_plazas.value            = 0;
            $rootScope.maestro_plazas.seleccionado     = false;
            $rootScope.log_usuario.nombre              = loginService.UserData.Usuario;
            $rootScope.log_usuario.cargo               = loginService.UserData.d_cargo;

            toastr.options = {
                closeButton      : true,
                debug            : false,
                newestOnTop      : false,
                positionClass    : "toast-top-right",
                preventDuplicates: false,
                onclick          : null,
                showEasing       : "swing",
                hideEasing       : "linear",
                showMethod       : "fadeIn",
                hideMethod       : "fadeOut",
                timeOut          : "5000"
            };

            $rootScope.progressbar.reset();
            vm.d_encabezado = "Seleccione Aplicación";

            /*En esta lista configuramos cada encabezado con sus respectivos maestros*/
            vm.listEncabezadoMaestros = [
                {
                    c_encabezado: 2,
                    d_encabezado: "Gestión Humana",
                    show_encabezado: false,
                    icon_class: "hi-icon-black-tie",
                    is_selected: false,
                    listMaestros: [
                        {
                            text_tooltip: "Gestión de personal",
                            path: "/GestionPersonal",
                            icon_class: "hi-icon-user-plus",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Gestión de posiciones",
                            path: "/GestionPlazas",
                            icon_class: "hi-icon-street-view",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Gestión de cargos",
                            path: "/GestionCargos",
                            icon_class: "fa fa-users",
                            show_maestro: true
                        }
                    ]
                },
                {
                    c_encabezado: 3,
                    d_encabezado: "Descuentos",
                    show_encabezado: false,
                    icon_class: "hi-icon-usd",
                    is_selected: false,
                    listMaestros: [
                        {
                            text_tooltip: "Gestión descuentos",
                            path: "/GestionDescuentos",
                            icon_class: "hi-icon-percent",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Programación de descuentos",
                            path: "/ProgramacionDescuentos",
                            icon_class: "hi-icon-calendar",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Gestión mayor descuento",
                            path: "/GestionMayorDescuento",
                            icon_class: "fa fa-sort-amount-desc",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Gestión Super Oferta",
                            path: "/GestionSuperOferta",
                            icon_class: "fa fa-tags",
                            show_maestro: true
                        }
                    ]
                },
                {
                    c_encabezado: 4,
                    d_encabezado: "SAM",
                    show_encabezado: false,
                    icon_class: "hi-icon-shopping-cart",
                    is_selected: false,
                    listMaestros: [
                        {
                            text_tooltip: "Gestion Usuarios SAM",
                            path: "/GestionUsuariosSam",
                            icon_class: "hi-icon-users",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Gestion Sedes Pdv",
                            path: "/GestionSedesPdv",
                            icon_class: "hi-icon-list",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Gestion Bodegas PDV",
                            path: "/GestionBodegasPdv",
                            icon_class: "hi-icon-industry",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Autorizadores Mayor Descuento",
                            path: "/AutorizadoresMayorDcto",
                            icon_class: "hi-icon-percent",
                            show_maestro: true
                        }
                    ]
                },
                {
                    c_encabezado: 5,
                    d_encabezado: "Logística",
                    show_encabezado: false,
                    icon_class: "hi-icon-cubes",
                    is_selected: false,
                    listMaestros: [
                        {
                            text_tooltip: "Meses de inventario Sugerido",
                            path: "/GestionMesesInv",
                            icon_class: "fa fa-calendar-check-o",
                            show_maestro: true
                        },
                        {
                            text_tooltip: "Gestion usuarios transporte",
                            path: "/UsuariosTransporte",
                            icon_class: "hi-icon-users",
                            show_maestro: true
                        }
                    ]
                },
                {
                    c_encabezado: 6,
                    d_encabezado: "Comercial",
                    show_encabezado: false,
                    icon_class: "fa-bar-chart",
                    is_selected: false,
                    listMaestros: [
                        {
                            text_tooltip: "Presupuesto mes PV",
                            path: "/GestionPresupuestosMesPdv",
                            icon_class: "fa-calculator",
                            show_maestro: true
                        }
                    ]
                }
            ];

            for (var k = 0; k < vm.listEncabezadoMaestros.length; k++) {

                for (var l = 0; l < vm.listEncabezadoMaestros[k].listMaestros.length; l++) {
                    vm.listEncabezadoMaestros[k].listMaestros[l].c_encabezado = vm.listEncabezadoMaestros[k].c_encabezado;
                }    
            }

            vm.encabezado_selected = function (item) {

                vm.listMaestrosEncabezado         = [];
                $rootScope.listMaestrosEncabezado = [];
                /*asignamos el nombre del encabezado de los maestros*/
                vm.d_encabezado                   = "Maestros " + item.d_encabezado;
                /*asignamos los items de maestros que corresponden al encabezado*/
                vm.listMaestrosEncabezado         = item.listMaestros;

                /*asignamos a cada maestro el código de su respectivo encabezado*/
                vm.listMaestrosEncabezado.forEach(function(itemMaestro) {
                    itemMaestro.c_encabezado = item.c_encabezado;
                });

                /* utilizamos estas variables globales con la intención de que al volver a la vista de maestros, 
                   se pinten nuevamente los maestros del encabezado seleccionado previamente*/
                $rootScope.d_encabezado           = "Maestros " + item.d_encabezado;
                $rootScope.listMaestrosEncabezado = angular.copy(vm.listMaestrosEncabezado);

                /*movemos el scroll al top de la página*/
                $("#app-outer-container").animate({
                    scrollTop: 0
                }, 120);
            };

            vm.get_apps_disponibles = function () {
                
                gestionMaestrosService.getAppsDisponibles(TreidConfigSrv.variables.idAplicacion, loginService.UserData.cs_IdUsuario)
                 .then(function (datos) {
                     if (datos.data.length > 0 && datos.data[0].length > 0) {
                         vm.array_apps_disponibles = datos.data[0];

                         for (var i = 0; i < vm.array_apps_disponibles.length; i++) {

                             var item = vm.array_apps_disponibles[i];

                             for (var j = 0; j < vm.listEncabezadoMaestros.length; j++) {
                                 var opc = vm.listEncabezadoMaestros[j];

                                 if (parseInt(item.cs_id_opcion_aplicacion) === parseInt(opc.c_encabezado))
                                     vm.listEncabezadoMaestros[j].show_encabezado = true;
                             }
                         }

                         /* utilizamos estas variables globales con la intención de que al volver a la vista de maestros, 
                            se pinten nuevamente los maestros del encabezado seleccionado previamente*/
                         if (!_.isUndefined($rootScope.listMaestrosEncabezado) && $rootScope.listMaestrosEncabezado.length > 0) {
                             vm.d_encabezado = $rootScope.d_encabezado;
                             vm.listMaestrosEncabezado = angular.copy($rootScope.listMaestrosEncabezado);
                         }

                         /*asignamos a una vble global los diferentes encabezados que se encuentran configurados*/
                         $rootScope.listEncabezadoMaestros = angular.copy(vm.listEncabezadoMaestros);
                         /*almacenamos la lista de encabezados que tiene disponible el usuario*/
                         $rootScope.array_apps_disponibles = angular.copy(vm.array_apps_disponibles);
                     } else {
                         vm.array_apps_disponibles = [];
                         toastr.warning('No tienes maestros de aplicaciones disponibles!');
                     }
                 });
            };
            
            vm.RedirectTo = function (pathname) {
                $location.path(pathname);
                $rootScope.actualPage = pathname;
            };

            vm.get_apps_disponibles();
        };
        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('serviceLogIn');

        if (!_.isNull(vm.cookieUser) && !_.isUndefined(vm.cookieUser)) {

            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.cs_IdUsuario) === parseInt(loginService.UserData.cs_IdUsuario)) {

                if ($location.$$path == "/Maestros") {
                    $rootScope.$$childHead.showmodal = false;
                    vm.init();
                }
            } else {
                $rootScope.$$childHead.showmodal = true;
                vm.RedirectTo('/');
            }
        } else {
            vm.RedirectTo('/');
            $rootScope.$$childHead.showmodal = true;
        }
    };
}());

