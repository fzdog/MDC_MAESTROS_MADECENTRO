
(function() {
    'use strict';

    angular.module('appmadecentro')
        .controller('GestionPlazas', [
            '$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'ngProgressFactory', 'blockUI', function($scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, ngProgressFactory, blockUI) {

                var vm = $scope;

                vm.init = function() {

                    /*manejo de la barra ppal*/
                    $rootScope.itemInicio.value = 0;
                    $rootScope.maestro_dctos.value = 0;
                    $rootScope.maestro_dctos.seleccionado = false;
                    $rootScope.maestro_plazas.value = 1;
                    $rootScope.maestro_plazas.seleccionado = true;
                    $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                    $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                    toastr.options = {
                        closeButton: true,
                        debug: false,
                        newestOnTop: false,
                        //progressBar: true,
                        positionClass: "toast-top-right",
                        preventDuplicates: false,
                        onclick: null,
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        timeOut: "5000",
                    };

                    /*control de teclas*/
                    //$(document).unbind('keydown').bind('keydown', function (event) {
                    //    if (event.originalEvent.keyIdentifier == "U+0009")
                    //        alert("dio tab!");
                    //});

                    $rootScope.progressbar.reset();


                    vm.filtroPersona = "";

                    vm.isCollapsed = true;

                    vm.CentroOperacion = {
                        abierto: false
                    };

                    vm.CentroCostos = {
                        abierto: false
                    };

                    vm.verDetalleSalario = false;
                    $("#menu-toggle").on("click", function(e) {
                        e.preventDefault();
                        $("#wrapperPL").toggleClass("toggled");
                    });

                    //vm.numLimit = 15;

                    /****** ModuloCreacionEmpleado *******/
                    vm.objGestionPlazas = {

                    };
                    vm.ArrayCompanias = [];
                    vm.Arrayplazas = [];
                    vm.numLimit = 10;
                    vm.index_Elementos_Inyectados = [];
                    vm.inicializarElementos = function(registro, plaza) {
                        var selectID = "#EmpleadoAsignado" + plaza;
                        $(selectID).select2();

                        $timeout(function() {
                            $rootScope.$apply(function() {
                                $(selectID).select2("val", registro.cedula.toString());
                            });

                        }, 90);
                    };

                    /*OBJETO CON TODOS LOS FILTROS */
                    vm.objFiltrosPlaza =
                    {
                        c_plaza: 0,
                        idCO: null,
                        idCC: null,
                        cedEmpleado: null,
                        id_Gerencia: null,
                        id_compania: null,
                        id_cargo: null,
                        sw_activo: true
                    };
                    /*OBJETO CON TODOS LOS FILTROS */

                    vm.arrayDatosPlazas = [];
                    vm.arrayContadorPlazas = [];
                    vm.getResumenPlazas = function() {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getResumenPlazas/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                $timeout(function() {
                                    $rootScope.$apply(function() {
                                        vm.arrayContadorPlazas = result.data.data[0][0];
                                    });
                                }, 0);

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    $("#seleccion_Cargos").on("change", function(e) {
                        if (e.val == "") {
                            vm.objFiltrosPlaza.id_cargo = null;
                        } else {
                            var Cargo = JSON.parse(e.val);
                            vm.objFiltrosPlaza.id_cargo = Cargo.c_cargo;
                        }
                    });
                    vm.get_posicion_by_id = function() {
                        if (vm.objFiltrosPlaza.c_plaza != 0) {
                            $rootScope.progressbar.start();
                            $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_plaza_by_id/" + vm.objFiltrosPlaza.c_plaza).
                                then(function(result) {
                                    if (result === null)
                                        return;
                                    if (result.data === null)
                                        return;
                                    if (result.data.data[0].length < 1) {
                                        toastr.error('No se encontró posición con el código ' + vm.objFiltrosPlaza.c_plaza);
                                        $rootScope.progressbar.reset();
                                        return;
                                    }
                                    vm.arrayDatosPlazas = result.data.data[0];
                                    vm.getTiposContratos();
                                    $rootScope.progressbar.complete();
                                    vm.creacion_plaza.value = false;
                                }).catch(function(data) {
                                    $scope.Error.value = true;
                                });
                        } else {
                            toastr.error('Debe ingresar un código de posición válido');
                        }
                    };

                    vm.buscarPlaza = function() {
                        vm.creacion_plaza.value = false;

                        if (vm.objFiltrosPlaza.id_Gerencia == null || vm.objFiltrosPlaza.id_Gerencia == "null") {
                            toastr.error('Debe seleccionar una gerencia');
                            return;
                        }

                        vm.objFiltrosPlaza.idCO = vm.filtro_centro_operacion;
                        vm.objFiltrosPlaza.idCC = vm.filtro_idCentroCostos;

                        $rootScope.progressbar.start();
                        if (vm.objFiltrosPlaza.cedEmpleado == "")
                            vm.objFiltrosPlaza.cedEmpleado = null;

                        if (vm.filtro_centro_operacion == "" || vm.filtro_centro_operacion == undefined)
                            vm.objFiltrosPlaza.idCO = null;

                        if (vm.filtro_idCentroCostos == "" || vm.filtro_idCentroCostos == undefined)
                            vm.objFiltrosPlaza.idCC = null;

                        $scope.objectDialog.LoadingDialog('Consultando posiciones...');
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "buscarPlaza_filtro/"
                                + vm.objFiltrosPlaza.idCO
                                + "/" + vm.objFiltrosPlaza.idCC
                                + "/" + vm.objFiltrosPlaza.cedEmpleado
                                + "/" + vm.objFiltrosPlaza.id_Gerencia
                                + "/" + vm.objFiltrosPlaza.id_compania
                                + "/" + vm.objFiltrosPlaza.id_cargo
                                + "/" + vm.objFiltrosPlaza.sw_activo).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $scope.objectDialog.HideDialog();
                                    toastr.error('No se encontró un registro que coincida');
                                    vm.arrayDatosPlazas = [];
                                    $rootScope.progressbar.reset();
                                    return;
                                }
                                vm.arrayDatosPlazas = result.data.data[0];
                                vm.getTiposContratos();

                                $rootScope.progressbar.complete();

                                //$timeout(function() {
                                //    $rootScope.$apply(function() {
                                //        $("#app-outer-container")[0].scrollTop = 0;
                                //    });
                                //}, 0);
                                $scope.objectDialog.HideDialog();
                                vm.creacion_plaza.value = false;
                            }).catch(function(data) {
                                $scope.Error.value = true;
                                $scope.objectDialog.HideDialog();
                            });
                    };

                    vm.arrayPersonas = [];
                    vm.getPersonas = function() {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getPersonas/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    toastr.error('No se encontró registro en getPersonas');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.arrayPersonas = result.data.data[0];

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.ArrayCentroOperativo = [];
                    vm.getCentroOperacion_filtro = function() {

                        if (vm.filtro_centro_operacion == "" || vm.filtro_centro_operacion == undefined) {
                            //toastr.error('Debe ingresar una palabra clave!');
                            return;
                        }
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCentroOperativo_filtro/" + vm.filtro_centro_operacion).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    vm.CentroOperacion.abierto = false;
                                    vm.ArrayCentroOperativo = [];
                                    toastr.error('No se encontraron resultados con la palabra clave [ ' + vm.filtro_centro_operacion + ' ]');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayCentroOperativo = result.data.data[0];

                                vm.CentroOperacion.abierto = true;
                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.cargarCO = function(item) {
                        vm.filtro_centro_operacion = item.c_centro_operacion;
                        vm.objFiltrosPlaza.idCO = item.c_centro_operacion;
                        vm.CentroOperacion.abierto = false;
                    };

                    vm.ArrayGerencias = [];
                    vm.getGerencias = function() {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getGerencias/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayGerencias = result.data.data[0];

                                $timeout(function() {
                                    $("#seleccion_Gerencias").select2({
                                        placeholder: "Buscar gerencia",
                                        allowClear: true
                                    });
                                }, 0);

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.ArrayCentrosCostos = [];
                    vm.getCentroCostos_filtro = function() {
                        if (vm.filtro_idCentroCostos == "" || vm.filtro_idCentroCostos == undefined) {
                            //toastr.error('Debe ingresar una palabra clave!');
                            return;
                        }
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCentroCostos_filtro/" + vm.filtro_idCentroCostos).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    vm.CentroCostos.abierto = false;
                                    vm.ArrayCentrosCostos = [];
                                    toastr.error('No se encontraron resultados con la palabra clave [ ' + vm.filtro_idCentroCostos + ' ]');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayCentrosCostos = result.data.data[0];

                                vm.CentroCostos.abierto = true;
                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.cargarCC = function(item) {
                        vm.filtro_idCentroCostos = item.f284_id;
                        vm.objFiltrosPlaza.idCC = item.f284_id;
                        vm.CentroCostos.abierto = false;
                    };

                    vm.ArrayCargos = [];
                    vm.getCargos = function() {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCargos/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayCargos = result.data.data[0];

                                $("#seleccion_Cargos").select2({
                                    placeholder: "Buscar cargos",
                                    allowClear: true
                                });

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.GetCompanias = function() {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCompanias/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayCompanias = result.data.data[0];

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.ArraySedesUbicacion = [];
                    vm.GetSedesUbicacion = function() {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getSedesUbicacion/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArraySedesUbicacion = result.data.data[0];

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.array_zonas = [];
                    vm.get_zonas = function() {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_zonas/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $rootScope.progressbar.reset();
                                    return;
                                }
                                vm.array_zonas = result.data.data[0];
                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.ArrayTiposContratos = [];
                    vm.getTiposContratos = function() {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getTiposContratos/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayTiposContratos = result.data.data[0];

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    /*al darle al boton mas informacion, cargar las informacion es los campos del collapse*/
                    vm.infoComplementaria = {
                        //c_plaza: "",
                        //CO: "",
                        //d_compania: "",
                        //cedula_jefe_inmediato: "",
                        //CC: "",
                        //d_cargo: "",
                        //salario: ""

                    };

                    vm.companiaEmpleado = {};
                    vm.ubicacion_empleado = {};
                    vm.zona_empleado = {};
                    vm.pnlInfoAdd = {};
                    vm.cargarInfoAddEmpleado = function(itemEmpleado, itemIndex) {
                        $scope.objectDialog.LoadingDialog('Cargando informacion...');
                        vm.arrayEmpleadosCargo = [];
                        vm.GetSedesUbicacion();
                        vm.get_zonas();

                        vm.companiaEmpleado[itemIndex] = {};
                        vm.ubicacion_empleado[itemIndex] = {};
                        vm.zona_empleado[itemIndex] = {};
                        vm.pnlInfoAdd[itemIndex] = {
                            showInformacionAdicional: false
                        };

                        vm.pnlInfoAdd[itemIndex].showInformacionAdicional = true;

                        vm.infoComplementaria[itemIndex] = {
                            c_plaza: "",
                            d_plaza: "",
                            sw_activo: false,
                            idCO: "",
                            CO: "",
                            c_zona_CO: "",
                            c_area: "",
                            c_compania: "",
                            c_sede_ubicacion: "",
                            d_compania: "",
                            c_plaza_padre: "",
                            cedula_jefe_inmediato: "",
                            nombre_jefe_inmediato: "",
                            idCC: "",
                            CC: "",
                            c_cargo: "",
                            d_cargo: "",
                            swEstrategico: false,
                            swOperativo: false,

                            salario: "0",
                            cedula: "",
                            empleado: "",
                            //c_tipo_contrato: "",
                            d_tipo_contrato: "",

                            /*detalle salario*/
                            comision_promedio: 0,
                            bono_comision: 0,
                            bono_aux_rodamiento: 0,
                            bono_desalarisado: 0,
                            aux_rodamiento_nomina: 0,
                            desalarisado_pactado: 0,
                            obs_salariales: "",
                            logUpdate: loginService.UserData.cs_IdUsuario
                        };

                        vm.infoComplementaria[itemIndex].c_plaza = itemEmpleado.c_plaza;
                        vm.infoComplementaria[itemIndex].d_plaza = itemEmpleado.d_plaza;
                        vm.infoComplementaria[itemIndex].c_area = itemEmpleado.c_area;
                        vm.infoComplementaria[itemIndex].sw_activo = itemEmpleado.sw_activo;
                        vm.infoComplementaria[itemIndex].idCO = itemEmpleado.c_centro_operacion;
                        vm.infoComplementaria[itemIndex].CO = itemEmpleado.f285_descripcion;

                        if (itemEmpleado.c_zona != null && itemEmpleado.c_zona != "")
                            vm.infoComplementaria[itemIndex].c_zona_CO = itemEmpleado.c_zona.toString();
                        else
                            vm.infoComplementaria[itemIndex].c_zona_CO = "";

                        vm.infoComplementaria[itemIndex].d_compania = itemEmpleado.d_compania;
                        vm.infoComplementaria[itemIndex].c_plaza_padre = itemEmpleado.c_plaza_padre;
                        vm.infoComplementaria[itemIndex].cedula_jefe_inmediato = itemEmpleado.cedula_jefe_inmediato;
                        //vm.infoComplementaria[itemIndex].c_tipo_contrato = itemEmpleado.c_tipo_contrato;
                        vm.infoComplementaria[itemIndex].c_cargo = itemEmpleado.c_cargo;
                        vm.infoComplementaria[itemIndex].idCC = itemEmpleado.c_centro_costos;
                        vm.infoComplementaria[itemIndex].CC = itemEmpleado.f284_descripcion;
                        vm.infoComplementaria[itemIndex].cedula = itemEmpleado.cedula;

                        /*detalles del salario*/
                        if (itemEmpleado.comision_promedio != null)
                            itemEmpleado.comision_promedio = itemEmpleado.comision_promedio.toString();

                        if (itemEmpleado.bono_comision != null)
                            itemEmpleado.bono_comision = itemEmpleado.bono_comision.toString();

                        if (itemEmpleado.bono_aux_rodamiento != null)
                            itemEmpleado.bono_aux_rodamiento = itemEmpleado.bono_aux_rodamiento.toString();

                        if (itemEmpleado.bono_desalarizado != null)
                            itemEmpleado.bono_desalarizado = itemEmpleado.bono_desalarizado.toString();

                        if (itemEmpleado.aux_rodamiento_nomina != null)
                            itemEmpleado.aux_rodamiento_nomina = itemEmpleado.aux_rodamiento_nomina.toString();

                        if (itemEmpleado.desalarizado_pactado != null)
                            itemEmpleado.desalarizado_pactado = itemEmpleado.desalarizado_pactado.toString();

                        if (itemEmpleado.salario != null)
                            itemEmpleado.salario = itemEmpleado.salario.toString();

                        vm.infoComplementaria[itemIndex].salario = itemEmpleado.salario;
                        vm.infoComplementaria[itemIndex].comision_promedio = itemEmpleado.comision_promedio;
                        vm.infoComplementaria[itemIndex].bono_comision = itemEmpleado.bono_comision;
                        vm.infoComplementaria[itemIndex].bono_aux_rodamiento = itemEmpleado.bono_aux_rodamiento;
                        vm.infoComplementaria[itemIndex].bono_desalarisado = itemEmpleado.bono_desalarizado;
                        vm.infoComplementaria[itemIndex].aux_rodamiento_nomina = itemEmpleado.aux_rodamiento_nomina;
                        vm.infoComplementaria[itemIndex].desalarisado_pactado = itemEmpleado.desalarizado_pactado;
                        vm.infoComplementaria[itemIndex].obs_salariales = itemEmpleado.obs_salariales;

                        if (itemEmpleado.primer_nombreEmpl == "" || itemEmpleado.primer_nombreEmpl == null)
                            vm.infoComplementaria[itemIndex].empleado = "Empleado no asignado";
                        else
                            vm.infoComplementaria[itemIndex].empleado = itemEmpleado.primer_nombreEmpl + ' ' + itemEmpleado.segundo_nombreEmpl + ' ' + itemEmpleado.primer_apellidoEmpl + ' ' + itemEmpleado.segundo_apellidoEmpl;

                        if (itemEmpleado.primer_nombre == "" || itemEmpleado.primer_nombre == null)
                            vm.infoComplementaria[itemIndex].nombre_jefe_inmediato = "Jefe no asignado";
                        else
                            vm.infoComplementaria[itemIndex].nombre_jefe_inmediato = itemEmpleado.primer_nombre + ' ' + itemEmpleado.segundo_nombre + ' ' + itemEmpleado.primer_apellido + ' ' + itemEmpleado.segundo_apellido;


                        vm.infoComplementaria[itemIndex].c_sede_ubicacion = itemEmpleado.c_sede_ubicacion;


                        //var pos;
                        //for (var i = 0; i < vm.ArrayTiposContratos.length; i++) {
                        //    if (vm.ArrayTiposContratos[i].c_tipo_contrato == itemEmpleado.c_tipo_contrato)
                        //        pos = i;
                        //}
                        //vm.tipoContratoEmpleado[itemIndex] = vm.ArrayTiposContratos[pos];

                        var posCompania;
                        for (var i = 0; i < vm.ArrayCompanias.length; i++) {
                            if (vm.ArrayCompanias[i].c_compania == itemEmpleado.c_compania)
                                posCompania = i;
                        }

                        vm.companiaEmpleado[itemIndex] = vm.ArrayCompanias[posCompania];

                        $timeout(function() {
                            vm.$apply();
                        }, 1);

                        /*select que muestra el cargo del empleado*/
                        var selectID = "#CargoEmpleadoAsignado" + itemEmpleado.c_plaza;
                        $timeout(function() {
                            $(selectID).select2({
                                allowClear: true
                            });
                        }, 90);

                        $timeout(function() {
                            $rootScope.$apply(function() {
                                $(selectID).select2("val", itemEmpleado.c_cargo.toString());
                            });
                        }, 90);

                        $timeout(function() {
                            vm.get_tipo_cargo(itemIndex, itemEmpleado);
                        }, 120);
                        /*saber el tipo de cargo*/

                        /*select que muestra el cargo del jefe inmediato*/
                        var selectIDjefe = "#CargoJefeDirecto" + itemEmpleado.c_plaza;
                        $timeout(function() {
                            $(selectIDjefe).select2({
                                allowClear: true
                            });
                        }, 90);

                        $timeout(function() {
                            $rootScope.$apply(function() {
                                $(selectIDjefe).select2("val", itemEmpleado.c_cargoJefe.toString());
                            });
                        }, 90);

                        $timeout(function() {
                            vm.$apply();
                        }, 1);
                        $scope.objectDialog.HideDialog();
                    };

                    /*busca informacion para la zona de infromacion complementaria*/
                    vm.ArrayCentrosCostosInfoUser = [];

                    vm.CentroOperacionInfoUser = {
                        abierto: false
                    };

                    vm.CentroCostosInfoUser = {
                        abierto: false
                    };
                    vm.getCentroCostosInfoUser = function(filtroIdCentroCostosComplementaria) {
                        if (filtroIdCentroCostosComplementaria == "" || filtroIdCentroCostosComplementaria == undefined) {
                            toastr.error('Debe ingresar una palabra clave!');
                            return;
                        }

                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCentroCostos_filtro/" + filtroIdCentroCostosComplementaria).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    vm.CentroCostosInfoUser.abierto = false;
                                    vm.ArrayCentrosCostos = [];
                                    toastr.error('No se encontraron resultados con la palabra clave [ ' + filtroIdCentroCostosComplementaria + ' ]');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayCentrosCostosInfoUser = result.data.data[0];

                                vm.CentroCostosInfoUser.abierto = true;
                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };
                    vm.cargarCCInfoUser = function(index, item) {
                        vm.infoComplementaria[index].CC = item.f284_id;
                        vm.infoComplementaria[index].idCC = item.f284_id;

                        vm.CentroCostosInfoUser.abierto = false;
                    };

                    vm.ArrayCentroOperativoInfoUser = [];
                    vm.getCentroOperacionInfoUser = function(filtroIdCentroOperacionComplementaria) {

                        if (filtroIdCentroOperacionComplementaria == "" || filtroIdCentroOperacionComplementaria == undefined) {
                            toastr.error('Debe ingresar una palabra clave!');
                            return;
                        }
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCentroOperativo_filtro/" + filtroIdCentroOperacionComplementaria).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    vm.CentroOperacionInfoUser.abierto = false;
                                    vm.ArrayCentroOperativo = [];
                                    toastr.error('No se encontraron resultados con la palabra clave [ ' + filtroIdCentroOperacionComplementaria + ' ]');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayCentroOperativoInfoUser = result.data.data[0];

                                vm.CentroOperacionInfoUser.abierto = true;
                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.cargarCOInfoUser = function(index, item) {
                        vm.infoComplementaria[index].CO = item.c_centro_operacion;
                        vm.infoComplementaria[index].idCO = item.c_centro_operacion;
                        vm.CentroOperacionInfoUser.abierto = false;
                    };

                    /*buscar empleados para posible asignacion de plaza*/
                    vm.busquedaEmpleado = {
                        abierto: false
                    };

                    vm.ArrayDatosEmpleadoBusqueda = [];
                    vm.buscarEmpleado = function(filtroEmpleado) {
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "buscarEmpleado_inactivo/" + filtroEmpleado).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    vm.busquedaEmpleado.abierto = false;
                                    vm.ArrayCentroOperativo = [];
                                    toastr.error('No se encontraron resultados con la palabra clave [ ' + filtroEmpleado + ' ]');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayDatosEmpleadoBusqueda = result.data.data[0];
                                vm.busquedaEmpleado.abierto = true;
                                vm.creacion_plaza.value = false;
                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.cargarEmpleadoFiltro = function(index, item) {

                        vm.infoComplementaria[index].cedula = item.cedula;
                        vm.infoComplementaria[index].empleado = item.primer_nombre + ' ' + item.segundo_nombre + ' ' + item.primer_apellido + ' ' + item.segundo_apellido;

                        vm.busquedaEmpleado.abierto = false;
                    };

                    vm.eliminarEmpleadoPlaza = function(itemIndex, option) {
                        alertify.confirm("",
                                function() {
                                    vm.infoComplementaria[itemIndex].cedula = null;
                                    vm.infoComplementaria[itemIndex].empleado = null;

                                    $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "deleteEmpleadoPlaza/" + option.cedula + "/" + loginService.UserData.cs_IdUsuario).
                                        then(function(result) {
                                            if (result === null) {
                                                vm.objectDialog.AlertDialog(result.data.message);
                                                return;
                                            }
                                            if (result.data === null) {
                                                vm.objectDialog.AlertDialog(result.data.message);
                                                return;
                                            }

                                            if (result.data.name == "RequestError") {
                                                vm.objectDialog.AlertDialog(result.data.message);
                                                return;
                                            }

                                            if (result.data.MSG == "GUARDADO") {
                                                toastr.success('Registro retirado correctamente');
                                            } else {
                                                toastr.warning(result.data.MSG);
                                                return;
                                            }


                                        }).catch(function(data) {
                                            $scope.Error.value = true;
                                        });
                                },
                                function() {
                                    console.log("cancelo");
                                    return;
                                }).setHeader('<strong style="font-size: large;">Confirmación</strong>')
                            .setContent(' <div id="msgConfirm">' +
                                '<div class="row">' +
                                '<span>Va a eliminar el empleado de la plaza: <strong style="font-size: larger;">' + vm.infoComplementaria[itemIndex].d_plaza + '</strong></span><br />' +
                                '<span>Éste empleado quedará inactivo. Desea continuar?</span><br />' +
                                '</div>' +
                                '</div>');
                        //var respuesta = confirm('Va a eliminar el empleado de la plaza ' + vm.infoComplementaria[itemIndex].d_plaza + '.\n Éste empleado quedará inactivo.\n Desea continuar?');
                        //if (respuesta) {
                        //    console.log("aceptó");
                        //} else {
                        //    console.log("canceló");
                        //    return;
                        //}


                    };

                    vm.get_tipo_cargo = function(index, item) {
                        var selectID = "#CargoEmpleadoAsignado" + item.c_plaza;

                        var c_cargo = $(selectID)[0].value;

                        for (var i = 0; i < vm.ArrayCargos.length; i++) {
                            if (vm.ArrayCargos[i].c_cargo == c_cargo) {

                                if (vm.ArrayCargos[i].sw_administrativo) {
                                    vm.infoComplementaria[index].swEstrategico = true;
                                    vm.infoComplementaria[index].swOperativo = false;
                                } else {
                                    vm.infoComplementaria[index].swEstrategico = false;
                                    vm.infoComplementaria[index].swOperativo = true;
                                }

                            }
                        }
                    };

                    vm.modificarPlaza = function(index, item) {

                        var selectID = "#CargoEmpleadoAsignado" + item.c_plaza;
                        var selectIDjefe = "#CargoJefeDirecto" + item.c_plaza;

                        var algo = $(selectIDjefe)[0].value;
                        vm.infoComplementaria[index].c_cargo = $(selectID)[0].value;


                        vm.infoComplementaria[index].c_compania = vm.companiaEmpleado[index].c_compania;
                        vm.infoComplementaria[index].d_compania = vm.companiaEmpleado[index].d_compania;

                        //vm.infoComplementaria[index].c_tipo_contrato = vm.tipoContratoEmpleado[index].c_tipo_contrato;
                        //vm.infoComplementaria[index].d_tipo_contrato = vm.tipoContratoEmpleado[index].d_tipo_contrato;


                        if (vm.infoComplementaria[index].d_plaza == "") {
                            toastr.warning("Debe ingresar un nombre para la posición");
                            return;
                        }
                        if (vm.infoComplementaria[index].idCO == "") {
                            toastr.warning("Debe seleccionar un centro de operación");
                            return;
                        }
                        if (vm.infoComplementaria[index].idCC == "") {
                            toastr.warning("Debe seleccionar un centro de costos");
                            return;
                        }

                        if (vm.infoComplementaria[index].c_zona_CO == "" || vm.infoComplementaria[index].c_zona_CO == null) {
                            toastr.warning("Debe seleccionar una zona válida");
                            return;
                        }
                        if (vm.infoComplementaria[index].c_sede_ubicacion == "" || vm.infoComplementaria[index].c_sede_ubicacion == null) {
                            toastr.warning("Debe seleccionar una ubicación válida");
                            return;
                        }
                        if (vm.infoComplementaria[index].c_plaza_padre == null || vm.infoComplementaria[index].c_plaza_padre == "") {
                            toastr.warning("Debe seleccionar el cargo del jefe inmediato");
                            return;
                        }

                        if (vm.infoComplementaria[index].c_cargo == "") {
                            toastr.warning("Debe seleccionar un cargo para el empleado");
                            return;
                        }
                        if (vm.infoComplementaria[index].c_area == "null") {
                            toastr.warning("Debe seleccionar una gerencia");
                            return;
                        }

                        if (vm.infoComplementaria[index].salario == "") {
                            vm.infoComplementaria[index].salario = "0";
                        }

                        if (vm.infoComplementaria[index].cedula == "" || vm.infoComplementaria[index].cedula == null) {
                            if (vm.infoComplementaria[index].sw_activo) {
                                alertify.confirm("",
                                        function() {
                                            updateDataPlaza(index);
                                        },
                                        function() {
                                            console.log("cancelo");
                                            return;
                                        }).setHeader('<strong style="font-size: large;">Confirmación</strong>')
                                    .setContent(' <div id="msgConfirm">' +
                                        '<div class="row">' +
                                        '<span>No existe un empleado para la plaza: <strong style="font-size: larger;">' + vm.infoComplementaria[index].d_plaza + '</strong></span><br />' +
                                        '<span>Ésta quedará vacante. Desea continuar ?</span><br />' +
                                        '</div>' +
                                        '</div>');
                                //var respuesta = confirm('No existe un empleado para la plaza.\n La plaza ' + vm.infoComplementaria[index].d_plaza + ' quedará vacante.\n Desea continuar?');
                                //if (respuesta) {
                                //    console.log("aceptó");
                                //} else {
                                //    console.log("canceló");
                                //    return;
                                //}
                            } else {
                                /*actualizamos la plaza como inactiva, la cual no tendra empleado asignado*/
                                updateDataPlaza(index);
                            }
                        } else {
                            if (!vm.infoComplementaria[index].sw_activo) {
                                toastr.warning("No puede inactivar la posición si tiene empleado asignado!");
                                return;
                            } else {
                                updateDataPlaza(index);
                            }
                        }
                        //console.log(vm.infoComplementaria[index]);
                        //$http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "updateDataPlaza/", JSON.stringify(vm.infoComplementaria[index])).
                        //    then(function (result) {
                        //        if (result === null) {
                        //            vm.objectDialog.AlertDialog(result.data.message);
                        //            return;
                        //        }
                        //        if (result.data === null) {
                        //            vm.objectDialog.AlertDialog(result.data.message);
                        //            return;
                        //        }

                        //        if (result.data.name == "RequestError") {
                        //            vm.objectDialog.AlertDialog(result.data.message);
                        //            return;
                        //        }

                        //        if (result.data.MSG == "GUARDADO") {
                        //            toastr.success('Plaza actualizada correctamente');
                        //            vm.init();
                        //        } else {
                        //            toastr.warning(result.data.MSG);
                        //            return;
                        //        }


                        //    }).catch(function (data) {
                        //        $scope.Error.value = true;
                        //    });
                    };

                    function updateDataPlaza(index) {
                        console.log(vm.infoComplementaria[index]);
                        $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "updateDataPlaza/", JSON.stringify(vm.infoComplementaria[index])).
                            then(function(result) {
                                if (result === null) {
                                    vm.objectDialog.AlertDialog(result.data.message);
                                    return;
                                }
                                if (result.data === null) {
                                    vm.objectDialog.AlertDialog(result.data.message);
                                    return;
                                }

                                if (result.data.name == "RequestError") {
                                    vm.objectDialog.AlertDialog(result.data.message);
                                    return;
                                }

                                if (result.data.MSG == "GUARDADO") {
                                    toastr.success('Plaza actualizada correctamente');
                                    vm.init();
                                } else {
                                    toastr.warning(result.data.MSG);
                                    return;
                                }


                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    }

                    vm.RedirectTo = function(pathname, idFormulario) {
                        $location.path(pathname);
                        $rootScope.actualPage = pathname;

                    };

                    vm.getResumenPlazasGerencia = function() {

                        if (vm.objFiltrosPlaza.id_Gerencia == "null") {
                            /**traer el resumen normal*/
                            vm.getResumenPlazas();
                        }

                        if (vm.objFiltrosPlaza.id_Gerencia != "null" && vm.objFiltrosPlaza.id_Gerencia != null) {
                            $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getResumenPlazas_filtro/" + vm.objFiltrosPlaza.id_Gerencia).
                                then(function(result) {
                                    if (result === null)
                                        return;
                                    if (result.data === null)
                                        return;
                                    if (result.data.data[0].length < 1) {
                                        $rootScope.progressbar.reset();
                                        return;
                                    }

                                    $timeout(function() {
                                        $rootScope.$apply(function() {
                                            vm.arrayContadorPlazas = result.data.data[0][0];
                                        });
                                    }, 0);


                                    $rootScope.progressbar.complete();
                                }).catch(function(data) {
                                    $scope.Error.value = true;
                                });
                        }

                    };

                    vm.LimpiarFiltros = function () {
                        vm.creacion_plaza.value = false;
                        vm.objFiltrosPlaza.id_Gerencia = "null";
                        vm.objFiltrosPlaza.id_compania = "null";
                        vm.objFiltrosPlaza.id_cargo = null;
                        vm.objFiltrosPlaza.cedEmpleado = null;
                        vm.objFiltrosPlaza.idCC = null;
                        vm.objFiltrosPlaza.idCO = null;
                        vm.objFiltrosPlaza.c_plaza = 0;
                        vm.filtro_centro_operacion = "";
                        vm.filtro_idCentroCostos = "";
                        $("#seleccion_Cargos").select2("val", "");

                        vm.arrayDatosPlazas = [];

                        $timeout(function() {
                            vm.$apply();
                        }, 1);
                        if (vm.objFiltrosPlaza.id_Gerencia == "null") {
                            /**traer el resumen normal*/
                            vm.getResumenPlazas();
                        }

                    };

                    vm.arrayEmpleadosCargo = [];
                    vm.mostrar_tabla_empleados_cargo = false;
                    vm.get_nombre_jefe_inmediato = function(index, item) {
                        var selectID = "#CargoJefeDirecto" + item.c_plaza;
                        var c_cargo = $(selectID)[0].value;

                        if (c_cargo != "") {
                            $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_empleados_cargo/" + c_cargo).
                                then(function(result) {
                                    if (result === null)
                                        return;
                                    if (result.data === null)
                                        return;
                                    if (result.data.data[0].length < 1) {
                                        toastr.warning('No se encontraron empleados asignados al cargo');
                                        $rootScope.progressbar.reset();
                                        return;
                                    }

                                    vm.arrayEmpleadosCargo = result.data.data[0];
                                    vm.infoComplementaria[index].nombre_jefe_inmediato = "";

                                    if (vm.arrayEmpleadosCargo.length < 2) {
                                        vm.infoComplementaria[index].nombre_jefe_inmediato = vm.arrayEmpleadosCargo[0].nom_empl;
                                        vm.infoComplementaria[index].c_plaza_padre = vm.arrayEmpleadosCargo[0].c_plaza;
                                        vm.infoComplementaria[index].cedula_jefe_inmediato = vm.arrayEmpleadosCargo[0].cedula;
                                    }


                                    //vm.mostrar_tabla_empleados_cargo = true;

                                    $rootScope.progressbar.complete();
                                }).catch(function(data) {
                                    $scope.Error.value = true;
                                });
                        } else {
                            vm.infoComplementaria[index].nombre_jefe_inmediato = "";
                            vm.infoComplementaria[index].c_plaza_padre = "";
                            vm.infoComplementaria[index].cedula_jefe_inmediato = "";
                        }
                    };


                    vm.cargarJefeInmediato = function(index, item) {
                        vm.infoComplementaria[index].nombre_jefe_inmediato = item.nom_empl;
                        vm.infoComplementaria[index].c_plaza_padre = item.c_plaza;
                        vm.infoComplementaria[index].cedula_jefe_inmediato = item.cedula;

                        document.getElementById("input_nombre_jefe").focus();

                        $timeout(function() {
                            document.getElementById("input_nombre_jefe").focus();
                        }, 300);
                    };
                    /******************************************creacion de plazas*/
                    vm.obj_nueva_plaza = {
                        c_plaza: "",
                        d_plaza: "",
                        c_compania: 0,
                        cedula: null,
                        cedula_jefe_inmediato: null,
                        c_area: 0,
                        c_centro_operacion: "",
                        c_centro_costos: "",
                        c_cargo: "",
                        c_sede_ubicacion: "",
                        c_zona_CO: "",
                        swEstrategico: false,
                        swOperativo: false,
                        c_cargo_jefe: "",
                        nombre_jefe_inmediato: "",
                        //c_tipo_contrato: 0,
                        salario: "0",
                        c_plaza_padre: null,
                        sw_vacante: true,
                        sw_activo: true,

                        /*detalle salario*/
                        comision_promedio: "0",
                        bono_comision: "0",
                        bono_aux_rodamiento: "0",
                        bono_desalarisado: "0",
                        aux_rodamiento_nomina: "0",
                        desalarisado_pactado: "0",
                        obs_salariales: "",

                        log_insert: parseInt(loginService.UserData.cs_IdUsuario)
                    };


                    vm.creacion_plaza = {
                        value: false
                    };
                    vm.crear_plaza = function() {
                        vm.limpiar_campos_nueva_plaza();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_codigo_plaza/").
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.obj_nueva_plaza.c_plaza = result.data.data[0][0].cs_plaza;
                                vm.creacion_plaza.value = true;
                                vm.getTiposContratos();
                                vm.GetSedesUbicacion();
                                vm.get_zonas();

                                $timeout(function() {
                                    $("#cargos_nueva_plaza").select2({
                                        placeholder: "Buscar cargos",
                                        allowClear: true
                                    });
                                }, 0);

                                $timeout(function() {
                                    $("#CargoJefeDirecto_nueva_plaza").select2({
                                        placeholder: "Buscar cargos",
                                        allowClear: true
                                    });
                                }, 0);

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });


                    };

                    $("#cargos_nueva_plaza").on("change", function(e) {
                        if (e.val == "") {
                            vm.obj_nueva_plaza.c_cargo = "";
                            vm.obj_nueva_plaza.swEstrategico = false;
                            vm.obj_nueva_plaza.swOperativo = false;
                            $timeout(function() {
                                $rootScope.$apply(); //this triggers a $digest
                            }, 1);
                        } else {
                            var Cargo = JSON.parse(e.val);
                            vm.obj_nueva_plaza.c_cargo = Cargo.c_cargo;

                            if (Cargo.sw_administrativo) {
                                vm.obj_nueva_plaza.swEstrategico = true;
                                vm.obj_nueva_plaza.swOperativo = false;
                            } else {
                                vm.obj_nueva_plaza.swOperativo = true;
                                vm.obj_nueva_plaza.swEstrategico = false;
                            }
                            $timeout(function() {
                                $rootScope.$apply(); //this triggers a $digest
                            }, 1);
                        }
                    });
                    $("#CargoJefeDirecto_nueva_plaza").on("change", function(e) {
                        if (e.val == "") {
                            vm.obj_nueva_plaza.c_cargo_jefe = "";
                            $timeout(function() {
                                $rootScope.$apply(); //this triggers a $digest
                            }, 1);
                        } else {
                            vm.obj_nueva_plaza.c_cargo_jefe = e.val;
                            vm.get_nombre_jefe_inmediato_nueva_plaza(vm.obj_nueva_plaza.c_cargo_jefe);
                            $timeout(function() {
                                $rootScope.$apply(); //this triggers a $digest
                            }, 1);
                        }
                    });

                    vm.mostrar_tabla_empleados_cargo = false;
                    vm.get_nombre_jefe_inmediato_nueva_plaza = function(c_cargo) {

                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_empleados_cargo/" + c_cargo).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    toastr.warning('No se encontraron empleados asignados al cargo');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.arrayEmpleadosCargo = result.data.data[0];
                                vm.obj_nueva_plaza.nombre_jefe_inmediato = "";
                                if (vm.arrayEmpleadosCargo.length < 2) {
                                    vm.obj_nueva_plaza.nombre_jefe_inmediato = vm.arrayEmpleadosCargo[0].nom_empl;
                                    vm.obj_nueva_plaza.c_plaza_padre = vm.arrayEmpleadosCargo[0].c_plaza;
                                    vm.obj_nueva_plaza.cedula_jefe_inmediato = vm.arrayEmpleadosCargo[0].cedula;
                                }


                                //vm.mostrar_tabla_empleados_cargo = true;

                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });

                    };

                    vm.cargarJefeInmediato_nueva_plaza = function(item) {
                        vm.obj_nueva_plaza.nombre_jefe_inmediato = item.nom_empl;
                        vm.obj_nueva_plaza.c_plaza_padre = item.c_plaza;
                        vm.obj_nueva_plaza.cedula_jefe_inmediato = item.cedula;

                        document.getElementById("input_nombre_jefe_new_pl").focus();

                        $timeout(function() {
                            document.getElementById("input_nombre_jefe_new_pl").focus();
                        }, 300);
                    };

                    vm.CentroOperacion_nueva_plaza = {
                        abierto: false
                    };

                    vm.getCentroOperacion_filtro_nueva_plaza = function() {

                        if (vm.filtro_centro_operacion_nueva_plaza == "" || vm.filtro_centro_operacion_nueva_plaza == undefined) {
                            toastr.error('Debe ingresar una palabra clave!');
                            return;
                        }

                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCentroOperativo_filtro/" + vm.filtro_centro_operacion_nueva_plaza).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    vm.CentroOperacion_nueva_plaza.abierto = false;
                                    vm.ArrayCentroOperativo = [];
                                    toastr.error('No se encontraron resultados con la palabra clave [ ' + vm.filtro_centro_operacion_nueva_plaza + ' ]');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayCentroOperativo = result.data.data[0];

                                vm.CentroOperacion_nueva_plaza.abierto = true;
                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.cargarCO_nueva_plaza = function(item) {
                        vm.filtro_centro_operacion_nueva_plaza = item.c_centro_operacion;
                        vm.obj_nueva_plaza.c_centro_operacion = item.c_centro_operacion;
                        vm.CentroOperacion_nueva_plaza.abierto = false;
                    };

                    vm.CentroCostos_nueva_plaza = {
                        abierto: false
                    };

                    vm.ArrayCentrosCostos = [];
                    vm.getCentroCostos_filtro_nueva_plaza = function() {
                        if (vm.filtro_idCentroCostos_nueva_plaza == "" || vm.filtro_idCentroCostos_nueva_plaza == undefined) {
                            toastr.error('Debe ingresar una palabra clave!');
                            return;
                        }
                        $rootScope.progressbar.start();
                        $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCentroCostos_filtro/" + vm.filtro_idCentroCostos_nueva_plaza).
                            then(function(result) {
                                if (result === null)
                                    return;
                                if (result.data === null)
                                    return;
                                if (result.data.data[0].length < 1) {
                                    vm.CentroCostos_nueva_plaza.abierto = false;
                                    vm.ArrayCentrosCostos = [];
                                    toastr.error('No se encontraron resultados con la palabra clave [ ' + vm.filtro_idCentroCostos_nueva_plaza + ' ]');
                                    $rootScope.progressbar.reset();
                                    return;
                                }

                                vm.ArrayCentrosCostos = result.data.data[0];

                                vm.CentroCostos_nueva_plaza.abierto = true;
                                $rootScope.progressbar.complete();
                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.cargarCC_nueva_plaza = function(item) {
                        vm.filtro_idCentroCostos_nueva_plaza = item.f284_id;
                        vm.obj_nueva_plaza.c_centro_costos = item.f284_id;
                        vm.CentroCostos_nueva_plaza.abierto = false;
                    };

                    vm.guardar_plaza = function() {
                        if (vm.obj_nueva_plaza.c_plaza == "") {
                            toastr.warning("Codigo de plaza no valido");
                            return;
                        }
                        if (vm.obj_nueva_plaza.d_plaza == "") {
                            toastr.warning("Debe ingresar un nombre de plaza");
                            return;
                        }
                        if (vm.obj_nueva_plaza.c_compania == 0) {
                            toastr.warning("Debe seleccionar una compañia");
                            return;
                        }
                        if (vm.obj_nueva_plaza.c_area == 0) {
                            toastr.warning("Debe seleccionar una gerencia");
                            return;
                        }
                        if (vm.obj_nueva_plaza.c_sede_ubicacion == "") {
                            toastr.warning("Debe seleccionar una ubicación");
                            return;
                        }
                        if (vm.obj_nueva_plaza.c_zona_CO == "") {
                            toastr.warning("Debe seleccionar una zona");
                            return;
                        }
                        if (vm.obj_nueva_plaza.c_centro_operacion == "") {
                            toastr.warning("Debe ingresar un centro de operación");
                            return;
                        }
                        if (vm.obj_nueva_plaza.c_centro_costos == "") {
                            toastr.warning("Debe ingresar un centro de costos");
                            return;
                        }
                        if (vm.obj_nueva_plaza.c_cargo == "") {
                            toastr.warning("Debe seleccionar un cargo");
                            return;
                        }
                        if (vm.obj_nueva_plaza.c_cargo_jefe == "" || vm.obj_nueva_plaza.c_cargo_jefe == null) {
                            toastr.warning("Debe seleccionar el cargo del jefe inmediato");
                            return;
                        }

                        //if (vm.obj_nueva_plaza.salario == "") {
                        //    toastr.warning("Ingrese el salario de la plaza");
                        //    return;
                        //}

                        vm.obj_nueva_plaza.d_plaza = vm.obj_nueva_plaza.d_plaza.toUpperCase();
                        vm.obj_nueva_plaza.c_compania = parseInt(vm.obj_nueva_plaza.c_compania);
                        vm.obj_nueva_plaza.c_area = parseInt(vm.obj_nueva_plaza.c_area);
                        vm.obj_nueva_plaza.c_sede_ubicacion = parseInt(vm.obj_nueva_plaza.c_sede_ubicacion);
                        //vm.obj_nueva_plaza.c_zona_CO = parseInt(vm.obj_nueva_plaza.c_zona_CO);
                        //vm.obj_nueva_plaza.c_tipo_contrato = parseInt(vm.obj_nueva_plaza.c_tipo_contrato);

                        /*upper a campos de texto*/
                        console.log(vm.obj_nueva_plaza);
                        $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "crear_plaza/", JSON.stringify(vm.obj_nueva_plaza)).
                            then(function(result) {
                                if (result === null) {
                                    vm.objectDialog.AlertDialog(result.data.message);
                                    return;
                                }
                                if (result.data === null) {
                                    vm.objectDialog.AlertDialog(result.data.message);
                                    return;
                                }

                                if (result.data.name == "RequestError") {
                                    vm.objectDialog.AlertDialog(result.data.message);
                                    return;
                                }

                                if (result.data.MSG == "GUARDADO") {
                                    toastr.success('Plaza almacenada correctamente');
                                    //vm.limpiar_campos_nueva_plaza();
                                } else {
                                    toastr.warning(result.data.MSG);
                                    return;
                                }

                            }).catch(function(data) {
                                $scope.Error.value = true;
                            });
                    };

                    vm.limpiar_campos_nueva_plaza = function() {
                        vm.obj_nueva_plaza.c_plaza = "";
                        vm.obj_nueva_plaza.d_plaza = "";
                        vm.obj_nueva_plaza.c_compania = 0;
                        vm.obj_nueva_plaza.cedula = null;
                        vm.obj_nueva_plaza.cedula_jefe_inmediato = null;
                        vm.obj_nueva_plaza.c_area = 0;
                        vm.obj_nueva_plaza.c_centro_operacion = "";
                        vm.obj_nueva_plaza.c_centro_costos = "";
                        vm.obj_nueva_plaza.c_cargo = "";
                        //vm.obj_nueva_plaza.c_tipo_contrato = 0;
                        vm.obj_nueva_plaza.salario = "0";
                        vm.obj_nueva_plaza.c_plaza_padre = null;
                        vm.obj_nueva_plaza.sw_vacante = true;
                        vm.obj_nueva_plaza.sw_activo = true;
                        vm.filtro_centro_operacion_nueva_plaza = "";
                        vm.filtro_idCentroCostos_nueva_plaza = "";
                        vm.obj_nueva_plaza.nombre_jefe_inmediato = "";
                        vm.obj_nueva_plaza.c_zona_CO = "";
                        vm.obj_nueva_plaza.c_sede_ubicacion = "";
                        vm.obj_nueva_plaza.swEstrategico = false;
                        vm.obj_nueva_plaza.swOperativo = false;

                        vm.obj_nueva_plaza.comision_promedio = "0";
                        vm.obj_nueva_plaza.bono_comision = "0";
                        vm.obj_nueva_plaza.bono_aux_rodamiento = "0";
                        vm.obj_nueva_plaza.bono_desalarisado = "0";
                        vm.obj_nueva_plaza.aux_rodamiento_nomina = "0";
                        vm.obj_nueva_plaza.desalarisado_pactado = "0";
                        vm.obj_nueva_plaza.obs_salariales = "";

                        $("#cargos_nueva_plaza").select2("val", "");
                        $("#CargoJefeDirecto_nueva_plaza").select2("val", "");
                        vm.arrayDatosPlazas = [];

                        $timeout(function() {
                            vm.$apply();
                        }, 1);
                    };

                    vm.getResumenPlazas();
                    vm.getGerencias();
                    vm.getCargos();
                    vm.GetCompanias();
                };
                vm.cookieUser = {};
                vm.cookieUser = $cookieStore.get('serviceLogIn');

                if (vm.cookieUser != null) {
                    if (vm.cookieUser.hasSession && vm.cookieUser.UserData.cs_IdUsuario == loginService.UserData.cs_IdUsuario) {

                        if ($location.$$path == "/GestionPlazas") {

                            if (!_.isNull($rootScope.listEncabezadoMaestros) && !_.isUndefined($rootScope.listEncabezadoMaestros)) {

                                var listMaestros = [];
                                for (var j = 0; j < $rootScope.listEncabezadoMaestros.length; j++) {

                                    for (var k = 0; k < $rootScope.listEncabezadoMaestros[j].listMaestros.length; k++) {
                                        listMaestros.push($rootScope.listEncabezadoMaestros[j].listMaestros[k]);
                                    }
                                }

                                var dataMaestro = listMaestros.filter(function (item) { return item.path == $location.$$path; });

                                var dataPermisosEncabezado = $rootScope.array_apps_disponibles.filter(function (item) {
                                    return parseInt(item.cs_id_opcion_aplicacion) === parseInt(dataMaestro[0].c_encabezado);
                                });

                                if (dataPermisosEncabezado.length !== 0) {
                                    $rootScope.$$childHead.showmodal = false;
                                    $rootScope.actualPage = "/GestionPlazas";
                                    vm.init();
                                } else {
                                    toastr.warning("El usuario no tiene asignados los permisos para acceder a este maestro.");
                                    $rootScope.$$childHead.showmodal = true;
                                    vm.RedirectTo('/');
                                    return;
                                }

                            } else {
                                $location.path('/Maestros');
                                return;
                            }
                        }

                    } else {
                        $rootScope.$$childHead.showmodal = true;
                        vm.RedirectTo('/');
                    }
                } else {
                    vm.RedirectTo('/');
                    $rootScope.$$childHead.showmodal = true;
                }
            }
        ]);
}());

