(function () {
    'use strict';

    angular.module('appmadecentro')
        .controller('GestionSedesPdvCtrl', ['$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'ngProgressFactory', 'blockUI', 'GestionSedesPdvService', function ($scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, ngProgressFactory, blockUI, GestionSedesPdvService) {
            var vm = $scope;
            vm.init = function () {

                $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                //$(document).on("ready", inicio);
                $(document).ready(function () {
                    $(".js-example-basic-single").select2();
                });

                $("span.help-block").hide();
                $("#btnvalidar").click(vm.validar);
                //$("#email_administrador").keyup(vm.validar);//keyup = validacion en tiempo real en java script// pero para eso se utilizo en angular ng-change=""

                vm.validar = function () {
                    var valor = document.getElementById("email_administrador").value;
                    if (utils.checkEmail(valor)) {//el checkEmail esta en la carpeta de utilidades
                        $("#icono_texto").remove();
                        $("#email_administrador").parent().attr("class", "form-group has-succes has-feedback");
                        $("#email_administrador").parent().children("span").text("ok").hide();
                        $("#email_administrador").parent().append("<span id='icono_texto' class='glyphicon glyphicon-ok form-control-feedback'></span>");

                        return true;
                    } else {
                        $("#icono_texto").remove();
                        $("#email_administrador").parent().attr("class", "form-group has-error has-feedback");
                        $("#email_administrador").parent().children("span").text("Debe ingresar un correo valido").show();
                        $("#email_administrador").parent().append("<span id='icono_texto' class='glyphicon glyphicon-remove form-control-feedback'></span>");
                        return false;
                    }

                };


                //arrays
                vm.array_consultar_optimizacion = [];
                vm.array_consultar_co = [];

                //objects
                vm.obj_buscar_centro_operacion = {
                    c_centro_operacion: ''
                    , sw_activo: true
                    , log_update: loginService.UserData.cs_IdUsuario
                };

                //functions
                vm.limpiar_consulta = function () {
                    vm.obj_buscar_centro_operacion = {
                        log_update: loginService.UserData.cs_IdUsuario
                    };
                    vm.obj_buscar_centro_operacion.orientacion_optimizacion = "";
                    vm.invisible();

                    vm.consultar_co();
                };

                vm.visible = function () {
                    vm.show_prefijos_facturacion = 1;
                    vm.show_permisos = 1;
                    vm.show_btn = 1;
                    vm.show_datos_pdv = 1;
                    vm.show_co = 1;
                };

                vm.invisible = function () {
                    vm.show_prefijos_facturacion = 0;
                    vm.show_permisos = 0;
                    vm.show_btn = 0;
                    vm.show_datos_pdv = 0;
                    vm.show_co = 0;
                };
                vm.activar_sw = function () {
                    vm.obj_buscar_centro_operacion.sw_activo = true;
                    if (vm.obj_buscar_centro_operacion.sw_cobrar_corte == null || vm.obj_buscar_centro_operacion.sw_cobrar_corte == 0 || vm.obj_buscar_centro_operacion.sw_cobrar_corte == undefined) {
                        vm.obj_buscar_centro_operacion.sw_cobrar_corte = false;
                    };
                    if (vm.obj_buscar_centro_operacion.ip_publica == null || vm.obj_buscar_centro_operacion.ip_publica == 0 || vm.obj_buscar_centro_operacion.ip_publica == undefined) {
                        vm.obj_buscar_centro_operacion.ip_publica = "No aplica";
                    };
                    if (vm.obj_buscar_centro_operacion.clasificacion_pv == null || vm.obj_buscar_centro_operacion.clasificacion_pv == 0 || vm.obj_buscar_centro_operacion.clasificacion_pv == undefined) {
                        vm.obj_buscar_centro_operacion.clasificacion_pv = "";
                    };

                };


                vm.consultar_co = function () {
                    GestionSedesPdvService.consultar_co()
                   .then(function (consultar_co) {
                       if (consultar_co.data.length > 0 && consultar_co.data[0].length > 0) {
                           vm.array_consultar_co = consultar_co.data[0];
                           $timeout(function () {
                               $("#select_co").select2({
                               });
                           }, 50);
                       } else {
                           console.log("No se encontro CO");
                       }
                   });
                };

                vm.consultar_connector_unoee = function () {
                    GestionSedesPdvService.consultar_connector_unoee()
                   .then(function (consultar_connector_unoee) {
                       if (consultar_connector_unoee.data.length > 0 && consultar_connector_unoee.data[0].length > 0) {
                           vm.obj_buscar_centro_operacion.conector_unoe = consultar_connector_unoee.data[0][0].vr_parametro;

                       } else {
                           console.log("No se encontro CO");
                       }
                   });
                    return;// vm.obj_buscar_centro_operacion.conector_unoe;
                };



                //consultar Centro de operacion
                vm.buscar_centro_operacion = function () {
                    GestionSedesPdvService.buscar_centro_operacion(vm.obj_buscar_centro_operacion.c_centro_operacion)
                      .then(function (buscar_centro_operacion) {
                          if (vm.obj_buscar_centro_operacion.c_centro_operacion === "" || vm.obj_buscar_centro_operacion.c_centro_operacion === null || vm.obj_buscar_centro_operacion.c_centro_operacion === undefined) {
                              toastr.warning('Debe ingresar el codigo de centro de operación.');
                              return;
                          }
                          if (buscar_centro_operacion.data.length > 0 && buscar_centro_operacion.data[0].length > 0) {
                              vm.obj_buscar_centro_operacion = buscar_centro_operacion.data[0][0];
                              if (vm.obj_buscar_centro_operacion.sw_activo == null) {
                                  vm.activar_sw();
                              }
                              if (vm.obj_buscar_centro_operacion.conector_unoe == "" || vm.obj_buscar_centro_operacion.conector_unoe == null || vm.obj_buscar_centro_operacion.conector_unoe == undefined) {
                                  vm.consultar_connector_unoee();
                              }
                              vm.obj_buscar_centro_operacion.log_update = loginService.UserData.cs_IdUsuario;
                              vm.visible();
                              console.log(vm.obj_buscar_centro_operacion);

                          } else {
                              toastr.warning("No se encontro ese centro de operación");
                              vm.invisible();
                              return;
                          }
                      });
                };

                vm.consultar_optimizacion = function () {
                    GestionSedesPdvService.consultar_optimizacion()
                     .then(function (consultar_optimizacion) {
                         if (consultar_optimizacion.data.length > 0 && consultar_optimizacion.data[0].length > 0) {
                             vm.array_consultar_optimizacion = consultar_optimizacion.data[0];
                         } else {
                             console.log("No se encontro GRUPOS");
                         }
                     });
                };
                vm.consultar_optimizacion();


                vm.actualizar_sedes = function () {


                    var mensaje = 'Campos vacios';

                    if (vm.obj_buscar_centro_operacion.clasificacion_pv == null || vm.obj_buscar_centro_operacion.clasificacion_pv == undefined || vm.obj_buscar_centro_operacion.clasificacion_pv == "" || vm.obj_buscar_centro_operacion.clasificacion_pv == 0) {
                        mensaje = (mensaje + ' - Clacificacion Pdv ');
                        toastr.warning(mensaje);
                        document.getElementById('txt_clasificacion_pdv').focus();
                        return;

                    };
                    if (vm.obj_buscar_centro_operacion.c_centro_operacion == null || vm.obj_buscar_centro_operacion.c_centro_operacion == undefined || vm.obj_buscar_centro_operacion.c_centro_operacion == "") {
                        mensaje = (mensaje + ' - Centro de operacion ');
                        toastr.warning(mensaje);
                        document.getElementById('txt_co').focus();
                        return;
                    };
                    if (vm.obj_buscar_centro_operacion.ip_publica == null || vm.obj_buscar_centro_operacion.ip_publica == undefined || vm.obj_buscar_centro_operacion.ip_publica == "") {
                        //mensaje = (mensaje + ' - Ip publica: No aplica');
                        vm.obj_buscar_centro_operacion.ip_publica = 'No aplica'
                        //toastr.warning(mensaje);
                        document.getElementById('id_ip').focus();
                        return;
                    };
                    if (vm.obj_buscar_centro_operacion.sw_cobrar_medio_tablero == null || vm.obj_buscar_centro_operacion.sw_cobrar_medio_tablero == undefined || vm.obj_buscar_centro_operacion.sw_cobrar_medio_tablero == "") {
                        vm.sw_cobrar_medio_tablero = false;

                    };
                    if (vm.obj_buscar_centro_operacion.sw_cobrar_un_cuarto_tablero == null || vm.obj_buscar_centro_operacion.sw_cobrar_un_cuarto_tablero == undefined || vm.obj_buscar_centro_operacion.sw_cobrar_un_cuarto_tablero == "") {
                        vm.sw_cobrar_un_cuarto_tablero = false;
                    };
                    if (vm.obj_buscar_centro_operacion.sw_cobrar_tres_cuarto_tablero == null || vm.obj_buscar_centro_operacion.sw_cobrar_tres_cuarto_tablero == undefined || vm.obj_buscar_centro_operacion.sw_cobrar_tres_cuarto_tablero == "") {
                        vm.sw_cobrar_tres_cuarto_tablero = false;
                    };
                    if (vm.obj_buscar_centro_operacion.orientacion_optimizacion === null || vm.obj_buscar_centro_operacion.orientacion_optimizacion === undefined || vm.obj_buscar_centro_operacion.orientacion_optimizacion === "") {
                        toastr.warning('Seleccione una opción <b>Orientación optimización lepton </b>');
                        return;

                    };

                    mensaje = '<b>INFO :</b> el centro de operacion: ';
                    if (vm.obj_buscar_centro_operacion.sw_activo == null || vm.obj_buscar_centro_operacion.sw_activo == undefined || vm.obj_buscar_centro_operacion.sw_activo == "") {
                        mensaje = (mensaje + vm.obj_buscar_centro_operacion.c_centro_operacion + ' esta <b>DESACTIVADO</b>');
                        vm.obj_buscar_centro_operacion.sw_activo == false;
                        toastr.info(mensaje);
                    };
                    if (vm.obj_buscar_centro_operacion.sw_cobrar_corte == null || vm.obj_buscar_centro_operacion.sw_cobrar_corte == undefined || vm.obj_buscar_centro_operacion.sw_cobrar_corte == "") {
                       // mensaje = (mensaje + vm.obj_buscar_centro_operacion.c_centro_operacion + ' No se cobrara cortes');
                        vm.obj_buscar_centro_operacion.sw_cobrar_corte == false;
                       // toastr.info(mensaje);


                    };


                    GestionSedesPdvService.actualizar_sedes(vm.obj_buscar_centro_operacion)
                           .then(function (result) {
                               if (result.MSG === "GUARDADO") {
                                   setTimeout('document.location.reload()', 2000);

                                   toastr.success('Registro guardado correctamente');

                               } else {
                                   toastr.warning('Algo no esta bien');
                                   console.warning(result.MSG);
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
                        if ($location.$$path == "/GestionSedesPdv") {
                            $rootScope.$$childHead.showmodal = false;
                            $rootScope.actualPage = "/GestionSedesPdv";
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

