
(function () {
    'use strict';

    angular.module('appmadecentro')
        .controller('MesesInventario'
            , ['$scope'
                , '$http'
                , '$upload'
                , 'TreidConfigSrv'
                , 'loginService'
                , '$timeout'
                , '$q'
                , '$location'
                , '$compile'
                , '$cookieStore'
                , '$rootScope'
                , '$templateCache'
                , 'datepickerPopupConfig'
                , 'ngProgressFactory'
                , 'blockUI'
                , 'MesesInventarioService'
                , function ($scope
                    , $http
                    , $upload
                    , TreidConfigSrv
                    , loginService
                    , $timeout
                    , $q
                    , $location
                    , $compile
                    , $cookieStore
                    , $rootScope
                    , $templateCache
                    , datepickerPopupConfig
                    , ngProgressFactory
                    , blockUI
                    , MesesInventarioService) {
                    var vm = $scope;
                    vm.init = function () {

                        $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                        $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                        //arrays
                        vm.array_get_meses_inventario_cgrupo_and_or_co = [];
                        vm.array_get_grupos_productos = [];

                        //
                        vm.array_get_centros_operacion = [];

                        //Objets

                        vm.obj_filtro = {
                            c_grupo_referencia: "",
                            calificacion: "",
                            sw_centro_operacion: true
                        };

                        vm.obj_data = {
                            sw_centro_operacion: true
                        };

                        vm.obj_ctrl = {
                            disableAll: false
                            , viewCentroOperacion: false
                            , topeMeses : 12
                        };

                        //VERIFICAR DESUSO
                        vm.obj_upd_meses_inv = {
                            array_upd_meses_inv: "",
                            cs_id_Usuario: loginService.UserData.cs_IdUsuario
                        };


                        vm.array_clasificacion = [
                              { clasificacion_referencia: 'A' }
                            , { clasificacion_referencia: 'B' }
                            , { clasificacion_referencia: 'C' }
                        ];



                        vm.loadBasicFunctions = function () {
                            /** vm.loadBasicFunctions()
                                    * f_create:     20181219
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   
                                    * function:     Load the basic functions to start the app
                                    */
                            vm.get_centros_operacion();
                            vm.get_grupos_productos();
                        };



                        vm.get_centros_operacion = function () {
                            /** vm.get_centros_operacion()
                                    * f_create:     20181219
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   
                                    * function:     DB: Select the active operation centers (centros de operacion)
                                    */
                            MesesInventarioService.get_centros_operacion()
                                .then(function (get_centros_operacion) {
                                    if (!get_centros_operacion) {
                                        toastr.error("No hay centro de operación disponibles!");
                                    } else if (get_centros_operacion.data[0].length) {
                                        vm.array_get_centros_operacion = get_centros_operacion.data[0];
                                    }
                                })
                                .catch(function (get_centros_operacion) {
                                    toastr.warning("Problemas de conexión con la API");
                                    callback(get_centros_operacion);
                                });
                        };



                        vm.get_grupos_productos = function () {
                            /** vm.get_grupos_productos()
                                    * f_create:     20181219
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   
                                    * function:     DB: Select the groups of the products   
                                    */
                            MesesInventarioService.get_grupos_productos()
                                .then(function (get_grupos_productos) {
                                    if (!get_grupos_productos) {
                                        toastr.error("No hay grupos disponibles!");
                                    } else if (get_grupos_productos.data.length > 0 && get_grupos_productos.data[0].length > 0) {
                                        vm.array_get_grupos_productos = get_grupos_productos.data[0];

                                    } else {
                                        console.log("No se encontro GRUPOS");
                                    }
                                })
                                .catch(function (get_centros_operacion) {
                                    toastr.warning("Problemas de conexión con la API");
                                    callback(get_centros_operacion);
                                });
                        };



                        vm.get_meses_inventario_cgrupo_and_or_co = function () {
                            /** vm.get_meses_inventario_cgrupo_and_or_co()
                                    * f_create:     20181219
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   sw_centro_operacion, c_centro operacion(optional), c_grupo_referencia
                                    * function:     DB: Select acoording to the needs the existing values in the tables that handle this information.
                                    */

                            vm.array_get_meses_inventario_cgrupo_and_or_co = [];
                            vm.obj_ctrl.viewCentroOperacion = false;

                            if (!vm.obj_filtro.sw_centro_operacion) {
                                vm.obj_filtro.sw_centro_operacion = false;
                                vm.obj_filtro.c_centro_operacion = '';

                            } else {
                                if (!vm.obj_filtro.c_centro_operacion) {
                                    toastr.error('debe desactivar o seleccionar el centro de operación');
                                    return;
                                }
                                //else {
                                //    vm.obj_data.c_centro_operacion = vm.obj_filtro.c_centro_operacion;
                                //    vm.obj_data.d_centro_operacion = vm.obj_filtro.d_centro_operacion;
                                //}
                            }

                            if (!vm.obj_filtro.c_grupo_referencia) {
                                vm.obj_filtro.c_grupo_referencia = '';
                            }

                            MesesInventarioService.get_meses_inventario_cgrupo_and_or_co(vm.obj_filtro)
                                .then(function (get_meses_inventario_cgrupo_and_or_co) {
                                    if (!get_meses_inventario_cgrupo_and_or_co) {
                                        toastr.warning("No hay registros disponibles!");
                                    } else if (get_meses_inventario_cgrupo_and_or_co.data.length > 0 && get_meses_inventario_cgrupo_and_or_co.data[0].length > 0) {
                                        vm.array_get_meses_inventario_cgrupo_and_or_co = get_meses_inventario_cgrupo_and_or_co.data[0];
                                        vm.assingValuesCentroOperacion();
                                        if (vm.obj_filtro.sw_centro_operacion) { 
                                            vm.obj_ctrl.viewCentroOperacion = true;
                                            vm.array_get_centros_operacion.forEach(function (x) {
                                                if (x.c_centro_operacion == vm.obj_filtro.c_centro_operacion) {
                                                    vm.obj_filtro.d_centro_operacion = angular.copy(x.d_centro_operacion);
                                                }
                                            });                                            
                                        }
                                        //vm.obj_upd_meses_inv.array_upd_meses_inv = vm.array_get_meses_inventario_cgrupo_and_or_co;
                                    } else {
                                        alertify.confirm("No se encontraron registros, desea insertar información?.",
                                            function () {
                                                alertify.success('Ok');
                                                vm.cloneInformation(vm.obj_filtro, 'NEW', 'ModalAddItemMesesInv');
                                            },
                                            function () {
                                                alertify.error('Cancelar');
                                            });


                                        console.log("No se encontro MESES DE INVENTARIO SUGERIDO");
                                    }
                                })
                                .catch(function (get_centros_operacion) {
                                    toastr.warning("Problemas de conexión con la API");
                                    callback(get_centros_operacion);
                                });
                        };



                        vm.assingValuesCentroOperacion = function () {
                            /** vm.assingValuesCentroOperacion()
                                    * f_create:     20181219
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   
                                    * function:     internal management of information for operations centers (centros de operación).
                                    */
                            if (!vm.obj_filtro.sw_centro_operacion) {
                                vm.obj_data.c_centro_operacion = null;
                                vm.obj_data.d_centro_operacion = null;
                            } else if (!vm.obj_filtro.c_centro_operacion) {
                                toastr.error("Debe seleccionar un centro de operación o desactivarlo!");
                            } else {
                                vm.array_get_centros_operacion.forEach(function (item) {
                                    if (item.c_centro_operacion == vm.obj_filtro.c_centro_operacion) {
                                        vm.obj_data.c_centro_operacion = item.c_centro_operacion;
                                        vm.obj_data.d_centro_operacion = item.d_centro_operacion;
                                    }
                                });
                            }

                        };



                        vm.cloneInformation = function (item, event, modalX) {
                            /** vm.cloneInformation()
                                   * f_create:     20181219
                                   * f_update: 
                                   * create by:    ElkinGutierrex
                                   * conditions:   item(object), event, modalx(modalName)
                                   * function:     Duplicate the information required according to the requested event.
                                   */

                            vm.obj_data = {};

                            vm.obj_ctrl.disableAll = false;

                            if (event == "EDIT") {
                                vm.obj_ctrl.disableAll = true;

                                //EventX = "disabled";

                                if (!item.c_centro_operacion) {
                                    item.sw_centro_operacion = false;

                                } else {
                                    item.sw_centro_operacion = true;
                                }
                            } else if (event == "NEW_ALL") {
                                item = {};
                                vm.obj_ctrl.disable_centroOperacionData = false;
                                item.sw_centro_operacion = true;
                            } else if (event == "NEW") {
                                item.clasificacion_referencia = '';
                                item.meses_inventario = 0;
                            }

                            vm.obj_data = angular.copy(item);

                            $timeout(function () {
                                //Clone information    
                                if (!modalX) {
                                    console.log('Se clono la información');
                                } else {
                                    vm.openModal(modalX);
                                    console.log('Se clono la información y se abre modal');
                                }
                            }, 300);
                            vm.validateMonthsInventory();
                        };



                        vm.openModal = function (modal) {
                            $('#' + modal).modal('show');
                        };



                        vm.closeModal = function (modal) {
                            $('#' + modal).modal('hide');
                        };



                        vm.enableDisablePropertiesSwActive = function (selectName, swValue, ) {
                            /** vm.enableDisablePropertiesSwActive()
                                    * f_create:     20181219
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   selectName, swValue
                                    * function:     
                                    */

                            ////Desabilitar El select
                            //$('#' + selectName).prop("disabled", !swValue);                            
                                                   
                            // limpiar campos centro de operación
                            switch (selectName) {
                                case 'selectCentroOperacionData':
                                    vm.obj_data.c_centro_operacion = '';
                                    vm.obj_ctrl.disable_centroOperacionData = !swValue;
                                    break;
                                case 'selectCentroOperacionFiltro':
                                    vm.obj_filtro.c_centro_operacion = '';
                                    vm.obj_ctrl.disable_centroOperacionFiltro = !swValue;
                                    break;
                            } 

                            if (!swValue) {
                                toastr.info('Acaba de deshabilitar el centro de operación!');
                            } else {
                                toastr.info('Acaba de habilitar el centro de operacion, es necesario seleccionarlo!');
                            }


                            //$('#' + selectName).val('', true);
                        };
                        


                        vm.validateMonthsInventory = function () {
                            /** vm.validateMonthsInventory()
                               * f_create:     20181219
                               * f_update: 
                               * create by:    ElkinGutierrex
                               * conditions:   
                               * function:     Verify that the requested information of the months does not exceed the limit.
                               */

                            if (!vm.obj_data.meses_inventario || vm.obj_data.meses_inventario < 0) {
                                vm.obj_data.meses_inventario = 0.0;
                            }
                            if (vm.obj_data.meses_inventario > vm.obj_ctrl.topeMeses) {
                                vm.obj_data.meses_inventario = vm.obj_ctrl.topeMeses;
                                toastr.error('No debe ser superior a ' + vm.obj_ctrl.topeMeses + ' meses');
                            }
                        };



                        vm.insert_meses_inventario_grupo_referencia = function () {
                            /** vm.insert_meses_inventario_grupo_referencia()
                                    * f_create:     20181219
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   
                                    * function:     DB: Save the information
                                    */

                            //Check that the data is well completed
                            if (!vm.obj_data.sw_centro_operacion) {
                                vm.obj_data.c_centro_operacion = 'NO';
                                vm.obj_data.d_centro_operacion = null;
                            } else {
                                if (!vm.obj_data.c_centro_operacion) {
                                    toastr.error('Debe seleccionar un centro de operacion valido!');
                                    return;
                                }
                            }

                            if (!vm.obj_data.c_grupo_referencia) {
                                toastr.error('Debe seleccionar un grupo valido');
                                return;
                            }

                            if (!vm.obj_data.clasificacion_referencia) {
                                toastr.error('Debe seleccionar una clasificación valida');
                                return;
                            }

                            if (!vm.obj_data.clasificacion_referencia) {
                                toastr.error('Debe seleccionar una clasificación valida');
                                return;
                            }

                            if (!vm.obj_data.meses_inventario && vm.obj_data.meses_inventario != 0) {
                                toastr.error('Los meses inventario deben estar en un rango entre 0 y 99.9 meses');
                                return;
                            }

                            vm.obj_data.user = loginService.UserData.cs_IdUsuario;

                            alertify.confirm('Esta seguro de que desea grabar la información?',
                                function () {
                                    MesesInventarioService.insert_meses_inventario_grupo_referencia(vm.obj_data)
                                        .then(function (result) {
                                            if (result.MSG == "GUARDADO") {
                                                toastr.success('Almacenamiento satisfactorio!');
                                                vm.obj_filtro = angular.copy(vm.obj_data);
                                                vm.get_meses_inventario_cgrupo_and_or_co();
                                                vm.closeModal('ModalAddItemMesesInv');

                                            } else {
                                                toastr.warning(result.MSG);
                                            }
                                        });
                                    $timeout(function () {
                                        vm.$apply();
                                    });

                                },
                                function () {
                                    console.log("Canceló");
                                    return;
                                }
                            );
                        };                     


                    
                        vm.loadBasicFunctions();


                        vm.RedirectTo = function (pathname) {
                            $location.path(pathname);
                            $rootScope.actualPage = pathname;
                        };

                        vm.cookieUser = {};
                        vm.cookieUser = $cookieStore.get('serviceLogIn');
                        if (vm.cookieUser != null) {
                            if (vm.cookieUser.hasSession && vm.cookieUser.UserData.cs_IdUsuario == loginService.UserData.cs_IdUsuario) {
                                if ($location.$$path == "/GestionDescuentos") {
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


                    vm.init();
                }]);
}());

