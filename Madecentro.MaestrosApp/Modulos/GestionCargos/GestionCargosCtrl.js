
(function () {
    'use strict';

    angular.module('appmadecentro')
        .controller('GestionCargosCtrl', ['$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'ngProgressFactory', 'blockUI', 'GestionCargosService', function ($scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, ngProgressFactory, blockUI, GestionCargosService) {
            var vm = $scope;
            vm.init = function () {

                $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                //arrays
                vm.array_consultar_cargos = [];
                vm.array_consultar_nivel_cargo = [];
                vm.array_consulta_modificar_cargo = [];

                //objects
                vm.obj_info_cargos = {
                    descripcion_cargos: '',
                    nivel_cargo: '',
                    sw_administrativo: '',
                    sw_activo: true,
                    log_insert: loginService.UserData.cs_IdUsuario//UserName
                };

                vm.obj_id_consulta = {
                    codigo_cargo: ''
                };

                vm.obj_modificar_cargos = {
                    codigo_cargo: '',
                    descripcion_cargos: '',
                    nivel_cargo: '',
                    //c_nivel_cargo:'',
                    sw_administrativo: '',
                    sw_activo: '',
                    log_update: loginService.UserData.cs_IdUsuario
                };

                vm.obj_info_nivel_cargo = {
                    nivel_cargo: ''
                };

                //functions
                vm.limpiar_insertar_cargos = function () {
                    vm.obj_info_cargos = {
                        descripcion_cargos: '',
                        nivel_cargo: '',
                        sw_administrativo: '',
                        sw_activo: true,
                        log_insert: loginService.UserData.cs_IdUsuario
                    }

                }
                vm.limpiar_modificar_cargos = function () {
                    vm.obj_modificar_cargos = {
                        codigo_cargo: '',
                        descripcion_cargos: '',
                        nivel_cargo: '',
                        sw_administrativo: '',
                        sw_activo: '',
                        log_update: loginService.UserData.cs_IdUsuario
                    };
                }

                //cerrar modal
                vm.cerrar_modal_modificar_cargo = function () {
                    $("#modal_modificar_cargo").modal('hide');
                    vm.limpiar_insertar_cargos();

                };
                vm.cerrar_modal_crear_cargo = function () {
                    $("#cerrar_modal_crear_cargo").modal('hide');
                };

                //Consultar Cargos
                vm.consultar_cargos = function () {
                    //toastr.info('entro Consultar Cargo!!')//comentario prueba
                    GestionCargosService.consultar_cargos()
                     .then(function (consultar_cargos) {
                         if (consultar_cargos.data.length > 0 && consultar_cargos.data[0].length > 0) {
                             vm.array_consultar_cargos = consultar_cargos.data[0];
                         } else {
                             console.log("No se encontro GRUPOS");
                         }
                     });
                };
                vm.consultar_cargos();

                ////Consulta Modificar Cargo modif
                vm.cargar_cargo = function (item) {
                    //vm.limpiar_modificar_cargos();
                    vm.obj_id_consulta.codigo_cargo = item.c_cargo;
                    if (vm.obj_id_consulta.codigo_cargo > 0) {
                        vm.consulta_modificar_cargo();
                    }
                }

                //Consulta Modificar Cargo
                vm.consulta_modificar_cargo = function () {
                    GestionCargosService.consulta_modificar_cargo(vm.obj_id_consulta.codigo_cargo)
                         .then(function (consulta_modificar_cargo) {
                             if (vm.obj_id_consulta.codigo_cargo === "" || vm.obj_id_consulta.codigo_cargo === null || vm.obj_id_consulta.codigo_cargo === undefined) {
                                 toastr.warning('Debe seleccionar cargo a modificar.');
                                 return;
                             }
                             if (consulta_modificar_cargo.data.length > 0 && consulta_modificar_cargo.data[0].length > 0) {
                                 vm.obj_modificar_cargos.codigo_cargo = consulta_modificar_cargo.data[0][0].c_cargo;
                                 vm.obj_modificar_cargos.descripcion_cargos = consulta_modificar_cargo.data[0][0].d_cargo;
                                 vm.obj_modificar_cargos.nivel_cargo = consulta_modificar_cargo.data[0][0].c_nivel_cargo;
                                 //vm.obj_modificar_cargos.c_nivel_cargo = consulta_modificar_cargo.data[0][0].d_nivel_cargo;
                                 vm.obj_modificar_cargos.sw_administrativo = consulta_modificar_cargo.data[0][0].sw_administrativo;
                                 vm.obj_modificar_cargos.sw_activo = consulta_modificar_cargo.data[0][0].sw_activo;
                             } else {
                                 console.log("No se encontro GRUPOS");
                             }
                         });
                };
                console.log(vm.array_consulta_modificar_cargo);

                //consultar Nivel Cargo
                vm.consultar_nivel_cargo = function () {
                    //toastr.info('entro Consultar Nivel Cargo!!')//comentario prueba
                    GestionCargosService.consultar_nivel_cargo()
                     .then(function (consultar_nivel_cargo) {
                         if (consultar_nivel_cargo.data.length > 0 && consultar_nivel_cargo.data[0].length > 0) {
                             vm.array_consultar_nivel_cargo = consultar_nivel_cargo.data[0];
                         } else {
                             console.log("No se encontro GRUPOS");
                         }
                     });
                };
                vm.consultar_nivel_cargo();//mostrar sin necesidad de ejecutar

                //INSERTAR CARGO
                vm.insertar_cargo = function () {
                    //validar
                    if (vm.obj_info_cargos.descripcion_cargos === "" || vm.obj_info_cargos.descripcion_cargos === null || vm.obj_info_cargos.descripcion_cargos === undefined) {
                        toastr.warning('Debe Ingresar el Nombre del cargo.');
                        return;
                    }
                    if (vm.obj_info_cargos.nivel_cargo === null || vm.obj_info_cargos.nivel_cargo === "" || vm.obj_info_cargos.nivel_cargo === undefined) {
                        toastr.warning('Debe Ingresar el Nivel del cargo.');
                        return;
                    }
                    GestionCargosService.insertar_cargo(vm.obj_info_cargos)
                       .then(function (result) {
                           if (result.MSG === "GUARDADO") {
                               toastr.success('Registro guardado correctamente.');
                               vm.cerrar_modal_crear_cargo();
                               vm.limpiar_insertar_cargos();
                               location.reload();//Actualizar
                           }
                           if (result.MSG === "EXISTE") {
                               toastr.error('Ya existe el cargo : <b>' + vm.obj_info_cargos.descripcion_cargos.toUpperCase() + '. </b> <br> No se guardaron cambios.');
                               vm.obj_info_cargos.descripcion_cargos = "";
                               $("#txt_nombre_cargo").focus();
                               return;
                           } else {
                               toastr.warning('¡Algo no esta bien!.');
                               console.warning(result.MSG);
                           }
                       });
                };

                //modificar Cargos
                vm.modificar_cargos = function () {
                    if (vm.obj_modificar_cargos.codigo_cargo === "" || vm.obj_modificar_cargos.codigo_cargo === null || vm.obj_modificar_cargos.codigo_cargo === undefined) {
                        toastr.warning('Debe Seleccionar cargo para modificar');
                        return;
                    }
                    if (vm.obj_modificar_cargos.descripcion_cargos === "" || vm.obj_modificar_cargos.descripcion_cargos === null || vm.obj_modificar_cargos.descripcion_cargos === undefined) {
                        toastr.warning('Debe Ingresar Nombre cargo a modificar');
                        return;
                    }
                    if (vm.obj_modificar_cargos.nivel_cargo === "" || vm.obj_modificar_cargos.nivel_cargo === null || vm.obj_modificar_cargos.nivel_cargo === undefined) {
                        toastr.warning('Debe Seleccionar nivel de cargo a modificar');
                        return;
                    }
                    if (vm.obj_modificar_cargos.sw_administrativo === undefined) {
                        (vm.obj_modificar_cargos.sw_administrativo = false);
                    }
                    if (vm.obj_modificar_cargos.sw_activo === undefined) {
                        (vm.obj_modificar_cargos.sw_administrativo = false);
                    }
                    vm.obj_modificar_cargos.log_update = loginService.UserData.cs_IdUsuario;
                    console.log(vm.obj_modificar_cargos);
                   
                    GestionCargosService.modificar_cargos(vm.obj_modificar_cargos)
                        .then(function (result) {
                            if (result.MSG === "GUARDADO") {
                                toastr.success('Registro almacenado correctamente');
                                vm.cerrar_modal_modificar_cargo();
                                vm.limpiar_modificar_cargos();
                                location.reload();
                            } if (result.MSG === "EXISTE") {
                                toastr.error('En el cargo : <b>' + vm.obj_modificar_cargos.descripcion_cargos.toUpperCase() + '. </b> <br> No se generaron cambios.');
                                vm.cerrar_modal_modificar_cargo();
                                vm.obj_modificar_cargos.descripcion_cargos = '';
                               // $("#txt_nombre_cargo").focus();
                                return;
                            } else {
                                toastr.warning(result.MSG);
                                toastr.warning('Algo no esta bien');
                            }
                        });
                };

                vm.RedirectTo = function (pathname) {
                    $location.path(pathname);
                    $rootScope.actualPage = pathname;
                };

                vm.cookieUser = {};
                vm.cookieUser = $cookieStore.get('serviceLogIn');
                if (vm.cookieUser != null) {
                    if (vm.cookieUser.hasSession && vm.cookieUser.UserData.cs_IdUsuario == loginService.UserData.cs_IdUsuario) {
                        if ($location.$$path == "/GestionCargos") {
                            $rootScope.$$childHead.showmodal = false;
                            $rootScope.actualPage = "/GestionCargos";
                            // vm.init();
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
            vm.init();
        }]);
}());

