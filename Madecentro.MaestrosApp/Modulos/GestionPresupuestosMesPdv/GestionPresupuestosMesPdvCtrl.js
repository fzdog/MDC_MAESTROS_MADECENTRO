
(function () {
    'use strict';

    angular.module('appmadecentro')
        .controller('GestionPresupuestosMesPdvCtrl', ['$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'ngProgressFactory', 'blockUI', 'GestionPresupuestosMesPdvService', function ($scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, ngProgressFactory, blockUI, GestionPresupuestosMesPdvService) {
            var vm = $scope;
            vm.init = function () {

                $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                $(document).ready(function () {
                    $(".js-example-basic-single").select2();
                });


                //Array
                vm.array_consultar_co = [];
                vm.array_consulta_co_mes_a_mes = [];
                //objects
                vm.obj_datos = {
                    usuario_actual: loginService.UserData.cs_IdUsuario
                    , vr_ppto_vendedor_externo: 0
                    , vr_ppto_vendedor_mostrador: 0
                    , vr_presupuesto_pv: 0
                    , sw_activo: true
                };

                //vm.obj_cambio_usuario = {
                //};

                //functions
                $timeout(function () {
                    $('#datepickerAnio').datetimepicker(
                    {
                        dayViewHeaderFormat: 'MMMM/YYYY',
                        locale: 'es',
                        sideBySide: false,
                        showClear: true,
                        widgetPositioning: {
                            horizontal: 'right',
                            vertical: 'top'
                        },
                        format: 'MM/YYYY'
                    });
                });


                vm.obtener_valor_fecha = function () {

                    vm.obj_datos.ano = moment($('#datepickerAnio').data("DateTimePicker").date()).format("YYYY");
                    vm.obj_datos.mes = moment($('#datepickerAnio').data("DateTimePicker").date()).format("MM");
                    return (vm.obj_datos.ano, vm.obj_datos.mes);
                }


                vm.consultar_co = function () {
                    GestionPresupuestosMesPdvService.consultar_co()
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
                vm.consultar_co();
                vm.calcular_porcentaje = function (totalPresupuesto, pptoMostrador, pptoExterno) {
                    var porcentajeMostrador = ((pptoMostrador * 100) / totalPresupuesto)
                }

                $("#div_presupuesto").hide();




                vm.consultar_presupuestos_co_mes_anio = function () {
                    vm.obtener_valor_fecha();

                    if (vm.obj_datos.mes < 0 || vm.obj_datos.mes == "Invalid date" || vm.obj_datos.mes == "" || vm.obj_datos.mes == undefined) {
                        toastr.warning('Ingrese la fecha')
                        $("#datepickerAnio").focus();
                        return;
                    }

                    if (vm.obj_datos.c_centro_operacion == null || vm.obj_datos.c_centro_operacion == "" || vm.obj_datos.c_centro_operacion == undefined) {
                        toastr.warning('Seleccione Centro de operacion')
                        $("#select_co").focus();
                        return;
                    }
                    if (vm.obj_datos.ano == null || vm.obj_datos.ano == "" || vm.obj_datos.ano == undefined) {
                        toastr.warning('Ingrese la fecha')
                        $("#datepickerAnio").focus();
                        return;
                    }

                    GestionPresupuestosMesPdvService.consultar_presupuestos_co_mes_anio(vm.obj_datos.c_centro_operacion, vm.obj_datos.ano, vm.obj_datos.mes)
                      .then(function (consultar_presupuestos_co_mes_anio) {
                          $("#div_presupuesto").show();
                          $("#btn_consultar").hide();
                          $("#div_button").show();
                          $("#div_modificacion").show();
                          document.getElementById("select_co").disabled = true;
                          document.getElementById("datepickerAnio").disabled = true;

                          if (consultar_presupuestos_co_mes_anio.data.length > 0 && consultar_presupuestos_co_mes_anio.data[0].length > 0) {
                              vm.obj_datos = consultar_presupuestos_co_mes_anio.data[0][0];
                              vm.obj_datos.fecha = (vm.obj_datos.mes + '/' + vm.obj_datos.ano)
                              vm.obj_datos.ultima_modificacion = (consultar_presupuestos_co_mes_anio.data[0][0].UserName + ' / ' + consultar_presupuestos_co_mes_anio.data[0][0].fh_ultima_modificacion);
                              toastr.info('Ya el registro tiene Información')
                          } else {
                              vm.obj_datos.vr_presupuesto_pv = 0;
                              vm.obj_datos.vr_ppto_vendedor_mostrador = 0;
                              vm.obj_datos.vr_ppto_vendedor_externo = 0;
                              vm.obj_datos.ultima_modificacion = "";
                              vm.obj_datos.sw_activo = true;
                              console.log("No se encontraron resultados");
                              vm.obj_datos.fecha = (vm.obj_datos.mes + '/' + vm.obj_datos.ano)
                              toastr.info('Ingrese los datos del presupuesto para el CO');
                          }
                      });
                };

                vm.consultar_presupuestos_co_anio_mes_a_mes = function () {
                    vm.obtener_valor_fecha();

                    GestionPresupuestosMesPdvService.consultar_presupuestos_co_anio_mes_a_mes(vm.obj_datos.c_centro_operacion, vm.obj_datos.ano)
                      .then(function (consultar_presupuestos_co_anio_mes_a_mes) {
                          if (consultar_presupuestos_co_anio_mes_a_mes.data.length > 0 && consultar_presupuestos_co_anio_mes_a_mes.data[0].length > 0) {
                              vm.array_consulta_co_mes_a_mes = consultar_presupuestos_co_anio_mes_a_mes.data[0];
                              $("#div_colunmna_consulta").attr("class", "col-md-4", "style", "margin-bottom: 10%; margin-top: 3%; align-content: center; text-align: center");
                          } else {
                              console.log("No se encontraron resultados");
                          }
                      });
                };


                $("span.help-block").hide();
                $("#div_button").hide(); div_modificacion
                $("#div_modificacion").hide();
                vm.calcular_presupuesto_pdv = function () {

                    var pptoMostrador = Number(vm.obj_datos.vr_ppto_vendedor_mostrador);
                    var pptoExterno = Number(vm.obj_datos.vr_ppto_vendedor_externo);
                    //(vm.obj_datos.vr_presupuesto_pv) = (Number(vm.obj_datos.vr_ppto_vendedor_mostrador) + Number(vm.obj_datos.vr_ppto_vendedor_externo));
                    vm.obj_datos.vr_presupuesto_pv = (pptoMostrador + pptoExterno);
                    var porcentajeMostrador = ((pptoMostrador * 100) / vm.obj_datos.vr_presupuesto_pv);
                    var porcentajeExterno = ((pptoExterno * 100) / vm.obj_datos.vr_presupuesto_pv);
                    $("#id_span_mostrador").parent().children("span").text('% ' + porcentajeMostrador.toFixed(2)).show();
                    $("#id_span_externo").parent().children("span").text('% ' + porcentajeExterno.toFixed(2)).show();

                };

                vm.limpiar_campos = function () {//limpia campos menos usuario actual
                    $("#div_colunmna_consulta").attr("class", "col-md-4 col-md-offset-4", "style", "margin-bottom: 10%; margin-top: 3%; align-content: center; text-align: center");
                    vm.obj_datos = "";
                    document.getElementById("select_co").disabled = false;
                    document.getElementById("datepickerAnio").disabled = false;
                    $("#div_presupuesto").hide();
                    $("#btn_consultar").show();
                    $("span.help-block").remove();
                    $("#div_button").hide();
                    $("#div_modificacion").hide(); select_co
                    vm.array_consulta_co_mes_a_mes = ""
                    vm.consultar_co();
                    vm.obj_datos.usuario_actual = loginService.UserData.cs_IdUsuario;


                };


                vm.insertar_presupuesto_mes = function () {
                    //validar
                    vm.obtener_valor_fecha();

                    if (vm.obj_datos.c_centro_operacion === "" || vm.obj_datos.c_centro_operacion === null || vm.obj_datos.c_centro_operacion === undefined) {
                        toastr.warning('Debe Ingresar el centro de operacion');
                        return;
                    }
                    if (vm.obj_datos.ano === "" || vm.obj_datos.ano === null || vm.obj_datos.ano === undefined) {
                        toastr.warning('Debe Ingresar el Año ');
                        return;
                    }
                    if (vm.obj_datos.mes === "" || vm.obj_datos.mes === null || vm.obj_datos.mes === undefined) {
                        toastr.warning('Debe Ingresar el Mes');
                        return;
                    }
                    vm.obj_datos.vr_presupuesto_pv = (Number(vm.obj_datos.vr_ppto_vendedor_mostrador) + Number(vm.obj_datos.vr_ppto_vendedor_externo));
                    Number(vm.obj_datos.vr_presupuesto_pv);
                    if (vm.obj_datos.vr_presupuesto_pv === "" || vm.obj_datos.vr_presupuesto_pv === null || vm.obj_datos.vr_presupuesto_pv == undefined || vm.obj_datos.vr_presupuesto_pv <= 0) {
                        toastr.warning('El total del presupuesto no puede igual a $0');
                        $("#text_ppto_mostrador").focus();
                        return;
                    }
                    vm.obj_datos.usuario_actual = loginService.UserData.cs_IdUsuario;

                    GestionPresupuestosMesPdvService.insertar_presupuesto_mes(vm.obj_datos)
                       .then(function (result) {
                           if (result.MSG === "GUARDADO") {
                               vm.consultar_presupuestos_co_mes_anio();
                               vm.consultar_presupuestos_co_anio_mes_a_mes();
                               setTimeout('document.location.reload()', 2000);
                               toastr.success('Registro guardado correctamente');

                           } else {
                               toastr.error(result.MSG);

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
                        if ($location.$$path == "/GestionPresupuestosMesPdv") {
                            $rootScope.$$childHead.showmodal = false;
                            $rootScope.actualPage = "/GestionPresupuestosMesPdv";
                            //vm.init();
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

