(function () {
    'use strict';

    angular.module('appmadecentro')

        .controller('GestionMayorDescuento'
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
                , 'GestionMayorDescuentoService'
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
                    , GestionMayorDescuentoService) {
                    var vm = $scope;
                    vm.init = function () {

                        $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                        $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                        //arrays
                        vm.array_get_planes_criterios                           = []; 
                        vm.array_get_lista_criterios_by_idPlan                  = [];
                        vm.array_get_validaciones_mayor_descuento_by_idcriterio = [];
                        vm.array_get_lista_criterios_grupos                     = [];
                        vm.array_get_lista_criterios_lineas                     = [];
                        vm.array_get_lista_criterios_sublineas                  = [];
                        
                       

                        //Objets
                        vm.obj_filtro = {                         
                        };

                        vm.obj_data = {
                        };

                        vm.obj_ctrl = {
                        };



                    /** Internal functions **/
                        vm.loadBasicFunctions = function () {
                            /** vm.loadBasicFunctions()
                                    * f_create:     20181219
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   
                                    * function:     Load the basic functions to start the app
                                    */
                            vm.get_planes_criterios();
                            vm.get_validaciones_mayor_descuento();

                            //Note: validar uso
                            //vm.get_lista_criterios();

                        };



                        vm.enableDisablePropertiesSwActive = function (fuctionX, value) {
                            /** vm.enableDisablePropertiesSwActive()
                                   * f_create:     20190101
                                   * f_update: 
                                   * create by:    ElkinGutierrex
                                   * conditions:   function(name), value
                                   * function:     Enable or disable propierties 
                                   */

                            let valueX = angular.copy(value);
                            
                            vm.obj_data.sw_grupo      = false;
                            vm.obj_data.sw_linea      = false;
                            vm.obj_data.sw_sublinea   = false;
                            vm.obj_data.sw_referencia = false;
                            
                            switch (funtionX) {
                                case 'sw_grupo':
                                    vm.obj_data.sw_grupo = valueX;
                                    break;
                                case 'sw_linea':
                                    vm.obj_data.sw_linea = valueX;
                                    break;
                                case 'sw_sublinea':
                                    vm.obj_data.sw_sublinea = valueX;
                                    break;
                                case 'sw_referencia':
                                    vm.obj_data.sw_referencia = valueX;
                                    break;
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

                            vm.obj_ctrl.disableAll           = false;
                            vm.obj_ctrl.disable_swActivoData = false;
                            vm.obj_ctrl.view_uploadFileCsv   = false;
                            vm.obj_ctrl.view_searchTable     = false;
                            vm.obj_ctrl.sw_modificarItem     = false;
                            vm.obj_ctrl.title_modal          = '';
                            

                            if (event  == "EDIT") {
                                vm.obj_ctrl.disableAll       = true;
                                vm.obj_ctrl.view_searchTable = true;
                                vm.obj_ctrl.sw_modificarItem = true;
                                vm.obj_ctrl.title_modal      = 'Modificar';

                            } else if (event == "NEW_ALL") {

                                item                                    = {};
                                vm.arreglocsv                           = [];
                                vm.restartCounter();
                                //vm.obj_ctrl.disable_centroOperacionData = false;
                                vm.obj_ctrl.disable_swActivoData        = true;
                                vm.obj_ctrl.sw_modificarItem            = false;
                                vm.obj_ctrl.title_modal                 = 'Adicionar';
                                item.sw_activo                          = true;

                            } else if (event == "NEW") {
                                item.clasificacion_referencia = '';
                                item.meses_inventario = 0;
                            } else if (event == "NEW_FILE") {                                
                                vm.obj_ctrl.view_uploadFileCsv = true;
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
                          //  vm.validateMonthsInventory();
                        };


                        
                        vm.openModal = function (modal) {
                            $('#' + modal).modal('show');
                        };



                        vm.closeModal = function (modal) {
                            $('#' + modal).modal('hide');
                        };



                        vm.clearSelect2 = function (id) {
                            $("#"+ id).select2("val", "");
                        };



                        vm.assignValuesObjCtrlCsv = function (value) {

                            switch (value) {

                                case 'd_plan':

                                    if (!vm.obj_filtro.id_plan) {
                                        toastr.error('Debe seleccionar un criterio valido!');
                                        return;
                                    } else {
                                        vm.obj_ctrl.d_plan = "";
                                        vm.array_get_planes_criterios.forEach(function (item) {
                                            if (item.id_plan == vm.obj_filtro.id_plan) {
                                                vm.obj_ctrl.d_plan = angular.copy(item.d_plan);
                                            }
                                        });
                                    }

                                    break;
                            }        
                        };



                        vm.assignValuesObjCtrl = function (item, event, modalX) {

                            vm.obj_data = {};

                            vm.obj_ctrl.disableAll = false;
                            vm.obj_ctrl.disable_swActivoData = false;

                            if (event == "NEW_ALL") {
                                item = {};
                                //vm.obj_ctrl.disable_centroOperacionData = false;
                                vm.obj_ctrl.disable_swActivoData = true;
                                item.sw_activo = true;
                            }                  

                        };



                        vm.validateMaximumDiscount = function () {

                            if (vm.obj_data.pj_dcto_pdv > vm.obj_ctrl.dcto_max_pv) {
                                vm.obj_data.pj_dcto_pdv = vm.obj_ctrl.dcto_max_pv;
                                toastr.error('El descuento de punto de venta no puede exceder el <b>' + vm.obj_ctrl.dcto_max_pv + ' % </b>');
                            }
                            if (vm.obj_data.pj_dcto_corporativo > vm.obj_ctrl.dcto_max_corporativo) {
                                vm.obj_data.pj_dcto_corporativo = vm.obj_ctrl.dcto_max_corporativo;
                                toastr.error('El descuento corporativo no puede exceder el <b>' + vm.obj_ctrl.dcto_max_corporativo + ' % </b>');
                            }

                        };



                        vm.searchErrors = function () {

                            //vm.arreglocsv = vm.arreglocsv.deleteColumnByName('ccRepetida');
                            vm.restartCounter();



                            for (var i = 0; i < vm.arreglocsv.length; i++) {
                                var referencia_i = vm.arreglocsv[i].referencia;

                                if (vm.arreglocsv[i].pj_dcto_pdv > vm.arreglocsv[i].pj_dcto_corporativo) {
                                    vm.arreglocsv[i].sw_error_dcto_mayor_pv = true;
                                }
                                if (vm.arreglocsv[i].pj_dcto_pdv > vm.obj_ctrl.dcto_max_pv ||
                                    vm.arreglocsv[i].pj_dcto_pdv < 0 ||
                                    !vm.arreglocsv[i].pj_dcto_pdv ||
                                    vm.arreglocsv[i].pj_dcto_pdv == isNaN) {
                                    vm.arreglocsv[i].sw_error_dcto_pv = true;
                                }
                                if (vm.arreglocsv[i].pj_dcto_corporativo > vm.obj_ctrl.dcto_max_corporativo ||
                                    vm.arreglocsv[i].pj_dcto_corporativo < 0 ||
                                   !vm.arreglocsv[i].pj_dcto_corporativo ||
                                    vm.arreglocsv[i].pj_dcto_corporativo == isNaN) {
                                    vm.arreglocsv[i].sw_error_dcto_corporativo = true;
                                }
                                if (!vm.arreglocsv[i].descripcion_referencia) {
                                    vm.arreglocsv[i].sw_error_referencia = true;
                                }

                                for (var k = i; k < vm.arreglocsv.length; k++) {
                                    var referencia_k = vm.arreglocsv[k].referencia;

                                    if (i != k) {
                                        vm.arreglocsv[i].sw_error_referencia_repetida = false;
                                        vm.arreglocsv[k].sw_error_referencia_repetida = false;
                                        // Buscar referencia Repetida
                                        if (referencia_i == referencia_k) {
                                            vm.arreglocsv[i].sw_error_referencia_repetida = true;
                                            vm.arreglocsv[k].sw_error_referencia_repetida = true;
                                        }
                                    }
                                    if (k == vm.arreglocsv.length - 1) {
                                        vm.arreglocsv.forEach((item) => {
                                            item.sw_error = false;
                                            if (item.sw_error_referencia_repetida ||
                                                item.sw_error_dcto_pv ||
                                                item.sw_error_dcto_corporativo ||
                                                item.sw_error_referencia ||
                                                item.sw_error_dcto_mayor_pv) {

                                                vm.obj_counter.total_errors++;
                                                item.sw_error = true;

                                                if (item.sw_error_referencia_repetida) {
                                                    vm.obj_counter.referencia_duplicate++;
                                                }
                                                if (item.sw_error_dcto_pv) {
                                                    vm.obj_counter.error_dcto_pv++;
                                                }
                                                if (item.sw_error_dcto_corporativo) {
                                                    vm.obj_counter.error_dcto_corporativo++;
                                                }
                                                if (item.sw_error_referencia) {
                                                    vm.obj_counter.error_referencia++;
                                                }
                                                if (item.sw_error_dcto_mayor_pv) {
                                                    vm.obj_counter.error_dcto_mayor_pv++;
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                            //$timeout(function () { vm.totalizar_datos(); }, 1);
                            //vm.totalizar_datos()

                        };



                        //Reiniciar contador
                        vm.restartCounter = function () {
                            vm.obj_counter = {
                                referencia_duplicate    : 0
                                , error_dcto_pv         : 0
                                , error_dcto_corporativo: 0
                                , error_referencia      : 0
                                , error_dcto_mayor_pv   : 0
                                , total_errors          : 0
                            };
                        };



                        //Eliminar todo el documento cargado
                        vm.deleteContent = function () {
                            vm.new_arreglocsv();
                            vm.objCtrlCsv = {};
                            const file = document.querySelector('.file');
                            file.value = '';
                        };



                        //Elimina la fila
                        vm.deleteRow = function (index) {

                            alertify.confirm("Esta seguro que desea eliminar esta fila.",
                                function () {
                                    alertify.success('Ok');
                                    vm.arreglocsv.splice(index, 1);
                                    let temporal = angular.copy(vm.arreglocsv);
                                    vm.arreglocsv = [];
                                    $timeout(() => {
                                        vm.$apply();
                                    }, 0);
                                    $timeout(function () {
                                        vm.arreglocsv = temporal;
                                        vm.searchErrors();
                                    }, 10);
                                },
                                function () {
                                    alertify.error('Cancelado');
                                });
                        };



                    /** External functions **/
                        vm.get_planes_criterios = function () {
                            /** vm.get_planes_criterios()
                                 * f_create:     20181228
                                 * f_update: 
                                 * create by:    ElkinGutierrex
                                 * conditions:   
                                 * function:     
                                 */
                            GestionMayorDescuentoService.get_planes_criterios()
                                .then(function (get_planes_criterios) {
                                    if (!get_planes_criterios) {
                                        toastr.error("No hay información inicial disponible!");
                                    } else if (get_planes_criterios.data.length > 0 && get_planes_criterios.data[0].length > 0) {
                                        vm.array_get_planes_criterios = get_planes_criterios.data[0];
                                        $("#selectPlan").select2({});
                                        $("#selectCriterio").select2({});
                                    } else {
                                        console.log("No se encontrarón criterios");
                                    }
                                })
                                .catch(function (get_centros_operacion) {
                                    toastr.warning("Problemas de conexión con la API");
                                    callback(get_centros_operacion);
                                });
                        };



                        vm.get_lista_criterios_by_idPlan = function () {
                            /** vm.get_lista_criterios_by_idPlan()
                                * f_create:     20181228
                                * f_update: 
                                * create by:    ElkinGutierrex
                                * conditions:   
                                * function:     
                                */

                            if (!vm.obj_filtro.id_plan) {
                                toastr.error('Debe seleccionar un criterio valido!');
                                return;
                            }

                            vm.obj_filtro.id_criterio = '';
                            vm.clearSelect2('selectCriterio');

                            vm.assignValuesObjCtrlCsv('d_plan');

                            if (!vm.obj_filtro.id_plan != 'REF') {
                                GestionMayorDescuentoService.get_lista_criterios_by_idPlan(vm.obj_filtro.id_plan)
                                .then(function (get_lista_criterios_by_idPlan) {
                                    if (!get_lista_criterios_by_idPlan) {
                                        toastr.error("No hay información inicial disponible!");
                                    } else if (get_lista_criterios_by_idPlan.data.length > 0 && get_lista_criterios_by_idPlan.data[0].length > 0) {
                                        vm.array_get_lista_criterios_by_idPlan = get_lista_criterios_by_idPlan.data[0];
                                        

                                    } else {
                                        console.log("No se encontrarón criterios");
                                    }
                                })
                                .catch(function (get_centros_operacion) {
                                    toastr.warning("Problemas de conexión con la API");
                                    callback(get_centros_operacion);
                                });
                            }

                        };



                        vm.get_lista_criterios = function () {
                            /** vm.get_lista_criterios()
                                * f_create:     20181228
                                * f_update: 
                                * create by:    ElkinGutierrex
                                * conditions:   
                                * function:     
                                */ 
                            
                                GestionMayorDescuentoService.get_lista_criterios()
                                    .then(function (get_lista_criterios) {
                                        if (!get_lista_criterios) {
                                            toastr.error("No hay información inicial disponible!");
                                        } else if (get_lista_criterios.data.length > 0 && get_lista_criterios.data[0].length > 0) {
                                            vm.array_get_lista_criterios_grupos    = get_lista_criterios.data[0];
                                            vm.array_get_lista_criterios_lineas    = get_lista_criterios.data[1];
                                            vm.array_get_lista_criterios_sublineas = get_lista_criterios.data[2];


                                        } else {
                                            console.log("No se encontrarón criterios");
                                        }
                                    })
                                    .catch(function (get_centros_operacion) {
                                        toastr.warning("Problemas de conexión con la API");
                                        callback(get_centros_operacion);
                                    });
                           

                        };



                        vm.get_validaciones_mayor_descuento_by_idcriterio = function () {

                            vm.obj_ctrl.view_uploadFileCsv  = false;
                            vm.obj_ctrl.view_searchTable    = false;

                            vm.array_get_validaciones_mayor_descuento_by_idcriterio = [];

                            GestionMayorDescuentoService.get_validaciones_mayor_descuento_by_idcriterio(vm.obj_filtro)
                                .then(function (get_validaciones_mayor_descuento_by_idcriterio) {
                                    if (!get_validaciones_mayor_descuento_by_idcriterio) {
                                        toastr.error("No hay información inicial disponible!");
                                    } else if (get_validaciones_mayor_descuento_by_idcriterio.data.length > 0 && get_validaciones_mayor_descuento_by_idcriterio.data[0].length > 0) {
                                        vm.array_get_validaciones_mayor_descuento_by_idcriterio = get_validaciones_mayor_descuento_by_idcriterio.data[0];
                                        vm.obj_ctrl.view_searchTable = true;
                                    } else {
                                        console.log("No se encontrarón datos");
                                        toastr.error("No se encontrarón datos");
                                    }
                                })
                                .catch(function (get_centros_operacion) {
                                    toastr.warning("Problemas de conexión con la API");
                                    callback(get_centros_operacion);
                                });

                        };
                                               


                        vm.get_validaciones_mayor_descuento = function () {
                            /** vm.get_validaciones_mayor_descuento()
                                    * f_create:     20181228
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   
                                    * function:     
                                    */

                            GestionMayorDescuentoService.get_validaciones_mayor_descuento()
                                .then(function (get_validaciones_mayor_descuento) {
                                    if (!get_validaciones_mayor_descuento) {
                                        toastr.error("No hay información inicial disponible!");
                                    } else if (get_validaciones_mayor_descuento.data.length > 0 && get_validaciones_mayor_descuento.data[0].length > 0) {
                                        _.extend(vm.obj_ctrl, get_validaciones_mayor_descuento.data[0][0]);

                                    } else {
                                        console.log("No se encontrarón datos");
                                        toastr.error("No se encontrarón datos");
                                    }
                                })
                                .catch(function (get_centros_operacion) {
                                    toastr.warning("Problemas de conexión con la API");
                                    callback(get_centros_operacion);
                                });
                        };



                        vm.get_producto_by_referencia = function (obj) {
                            /** vm.get_producto_by_referencia()
                                    * f_create:     20181228
                                    * f_update: 
                                    * create by:    ElkinGutierrex
                                    * conditions:   
                                    * function:     
                                    */
                            obj.descripcion_referencia = '';

                            if (obj.referencia.length < 4) {
                                toastr.info('Ingrese la referencia');
                                return;
                            }

                            let objTemp = {};

                            objTemp = angular.copy(obj);
                            
                            GestionMayorDescuentoService.get_producto_by_referencia(objTemp.referencia)
                                .then(function (get_producto_by_referencia) {
                                    if (!get_producto_by_referencia) {
                                        toastr.error("No hay información inicial disponible!");
                                    } else if (get_producto_by_referencia.data.length > 0 && get_producto_by_referencia.data[0].length > 0) {
                                        _.extend(obj , get_producto_by_referencia.data[0][0]);
                                       
                                    } else {
                                        console.log("No se encontro referencia, verifique");
                                        toastr.warning("No se encontro referencia, verifique");
                                    }
                                })
                                .catch(function (get_centros_operacion) {
                                    toastr.warning("Problemas de conexión con la API");
                                    callback(get_centros_operacion);
                                });

                            
                        };



                        vm.get_producto_by_referencia_csv = function () {

                            //contador
                            var countList = vm.arreglocsv.length;

                            for (var i = 0; i < vm.arreglocsv.length; i++) {

                                if (vm.arreglocsv[i].sw_activo == 1) {
                                    vm.arreglocsv[i].sw_activo = true;
                                } else {
                                    vm.arreglocsv[i].sw_activo = false;
                                }
                                /*closure*/
                                (function (index) {

                                    if (vm.arreglocsv[index].referencia != "") {
                                        GestionMayorDescuentoService.get_producto_by_referencia(vm.arreglocsv[index].referencia)
                                            .then(function (data) {
                                                if (data.data.length > 0 && data.data[0].length > 0) {

                                                    //asignamos los datos a las propiedades 
                                                    _.extend(vm.arreglocsv[index], data.data[0][0]);
                                                    countList--;
                                                } else {
                                                    countList--;
                                                }
                                                if (countList === 0) {
                                                    vm.searchErrors();
                                                }
                                             
                                            });
                                    }
                                }(i));

                            }
                            //vm.objDinamic.ano = (_.uniq(arreglocsv, function (x) { return x.ano; })[0].ano)
                            //vm.add_info_array();
                        };

                        // Upload file .csv
                        // add UploadFilecsv
                        vm.new_arreglocsv = function () {
                            vm.arreglocsv = [];
                        };



                        //Abrir Documento
                        document.getElementById("openFile").addEventListener('change', function () {
                            var fr = new FileReader();
                            fr.onload = function () {
                                var contenido = document.getElementById("fileContents").textContent = this.result;

                                //limpiar array
                                // vm.arreglocsv = []
                                vm.new_arreglocsv();

                                //separa objetos por salto de linea
                                vm.separata = contenido.split("\n");

                                //asignar cabecera los separa por ',' 
                                var cabecera = vm.separata[0].split(';');

                                //validar asignacion de nombres de cabecera
                                if (cabecera[0] != "item") {
                                    cabecera[0] = "item";
                                }
                                //if (cabecera[1] != "c_grupo") {
                                //    cabecera[1] = "c_grupo";
                                //}
                                //if (cabecera[2] != "c_linea") {
                                //    cabecera[2] = "c_linea";
                                //}
                                //if (cabecera[3] != "c_sublinea") {
                                //    cabecera[3] = "c_sublinea";
                                //}
                                if (cabecera[1] != "referencia") {
                                    cabecera[1] = "referencia";
                                }
                                if (cabecera[2] != "pj_dcto_pdv") {
                                    cabecera[2] = "pj_dcto_pdv";
                                }
                                if (cabecera[3] != "pj_dcto_corporativo") {
                                    cabecera[3] = "pj_dcto_corporativo";
                                }
                                if (cabecera[4] != "sw_activo") {
                                    cabecera[4] = "sw_activo";
                                }

                                //quitar posicion de cabecera (Elimina la posicion [0], e inicia el arreglo desde la posicion[1])
                                vm.separata.splice(0, 1);

                                //var arreglocsv = [];
                                for (var j = 0; j < vm.separata.length; j++) {
                                    var objetojson = {};
                                    var item = vm.separata[j].split(';');
                                    for (var i = 0; i < cabecera.length; i++) {
                                        //if (i === 2) {

                                        //    objetojson[cabecera[i]] = item[i];

                                        //} else {

                                        //    //if (item[i] != '' && item[i] != undefined && item[i] != NaN) {
                                        //    //    var string = item[i]
                                        //    //    //buscar simbolos para removerlos  y convertir ese string en numero entero
                                        //    //    item[i] = parseInt(string.replace(/([.*+?^${}()|\[\]\/\\])/g, ""));
                                        //    //}

                                        //    objetojson[cabecera[i]] = item[i];
                                        //}
                                        objetojson[cabecera[i]] = item[i];
                                    }
                                    if (objetojson.referencia) {

                                        vm.arreglocsv.push(objetojson);

                                    }
                                }
                                vm.objCtrlCsv = {};
                                //quitar la última posición (que queda en blanco)
                                var x = (vm.arreglocsv.length - 1);
                                if (!vm.arreglocsv[x].item) {
                                    vm.arreglocsv.splice(x);
                                }
                                console.log(vm.arreglocsv);                               

                                //truquiño: para actualizar los objetos del angular siempre dentro del timeout para que no reviente: by chepe
                                $timeout(() => {
                                    vm.$apply();
                                }, 0);
                               
                                vm.get_producto_by_referencia_csv(vm.arreglocsv);
                            };
                           fr.readAsText(this.files[0]);
                        });



                        // Obj : Objeto
                        vm.objCount = {};
                        vm.objCtrlCsv = { swCsv: false };  
                                                                     


                        vm.insert_validaciones_mayor_descuento = function () {

                            let objdata = {};

                            let arrayTemp = [];

                            let varNull = '-';

                            if (!vm.arreglocsv || vm.arreglocsv.length == 0 || vm.obj_ctrl.sw_modificarItem) {
                                if (!vm.obj_data.descripcion_referencia) {
                                    toastr.error('La referencia no es valida, verifique la información');
                                    return;
                                }
                                if (!vm.obj_data.pj_dcto_pdv && vm.obj_data.pj_dcto_pdv !== 0) {
                                    toastr.error('Digite un valor valido en descuento pv');
                                    return;
                                }
                                if (!vm.obj_data.pj_dcto_corporativo && vm.obj_data.pj_dcto_corporativo !== 0) {
                                    toastr.error('Digite un valor valido en descuento corporativo');
                                    return;
                                }
                                if (vm.obj_data.pj_dcto_pdv > vm.obj_ctrl.dcto_max_pv) {
                                    toastr.error('El descuento de punto de venta no debe superar el ' + vm.obj_ctrl.dcto_max_pv + '%');
                                    return;
                                }
                                if (vm.obj_data.pj_dcto_corporativo > vm.obj_ctrl.dcto_max_corporativo) {
                                    toastr.error('El descuento de punto de venta no debe superar el ' + vm.obj_ctrl.dcto_max_corporativo + '%');
                                    return;
                                }
                                if (vm.obj_data.pj_dcto_pdv > vm.obj_data.pj_dcto_corporativo) {
                                    toastr.error('El descuento de punto de venta no debe superar el descuento corporativo');
                                    return;
                                }

                                arrayTemp.push(vm.obj_data);

                            } else if (vm.arreglocsv.length > 0) {
                                arrayTemp = vm.arreglocsv;
                                if (vm.obj_counter.total_errors > 0) {
                                    toastr.error('Existen errores en la información adjunta, verifique la información!');
                                    return;
                                }

                            } else {
                                toastr.error('No hay datos para guardar!');
                                return;
                            }

                            arrayTemp.forEach((item) => {
                                item.user = loginService.UserData.cs_IdUsuario;
                                if (!item.c_grupo) {
                                    item.c_grupo = varNull;
                                }
                                if (!item.c_linea) {
                                    item.c_linea = varNull;
                                }
                                if (!item.c_sublinea) {
                                    item.c_sublinea = varNull;
                                }
                                if (!item.referencia) {
                                    item.referencia = varNull;
                                }

                            });

                            objdata = {
                                array: arrayTemp
                            };

                            GestionMayorDescuentoService.insert_validaciones_mayor_descuento(objdata)
                                .then(function (result) {
                                    if (result.MSG === "GUARDADO") {
                                        toastr.success('Registro guardado correctamente.');
                                        vm.obj_data = {};
                                        vm.obj_data.sw_activo = true;
                                        vm.deleteContent();
                                        $timeout(() => {
                                            vm.$apply();
                                        }, 0);
                                        if (!vm.obj_ctrl.sw_modificarItem) {
                                            console.log('Se agregarón nuevos items');

                                        } else {
                                            vm.closeModal('ModalAddOrModify');
                                            console.log('Se modificarón algunos items');
                                            vm.get_validaciones_mayor_descuento_by_idcriterio();
                                            vm.obj_ctrl.sw_modificarItem = false;
                                        }


                                    } else {
                                        toastr.warning('¡Error en guardado!');
                                        console.log(result.MSG);
                                    }
                                });

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
                                if ($location.$$path == "/GestionMayorDescuentos") {
                                    $rootScope.$$childHead.showmodal = false;
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

