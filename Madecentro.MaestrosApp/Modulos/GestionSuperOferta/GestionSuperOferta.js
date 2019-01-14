(function () {
    'use strict';

    angular.module('appmadecentro')

    .controller('GestionSuperOferta'
        , ['$scope'
            , '$http'
            , '$upload'
            , 'TreidConfigSrv'
            , 'loginService'
            , '$timeout'                
            , '$location'                
            , '$cookieStore'
            , '$rootScope'
            , '$templateCache'                
            , 'ngProgressFactory'
            , 'blockUI'
            , 'GestionMayorDescuentoService'
            , 'GestionSuperOfertaService'
            , function ($scope
                , $http
                , $upload
                , TreidConfigSrv
                , loginService
                , $timeout                    
                , $location                    
                , $cookieStore
                , $rootScope
                , $templateCache                    
                , ngProgressFactory
                , blockUI
                , GestionMayorDescuentoService
                , GestionSuperOfertaService) {
                var vm = $scope;
                vm.init = function () {

                    $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                    $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                    //Objets                        

                    vm.obj_data = {
                    };

                    vm.obj_ctrl = {
                    };

                /** Internal functions **/
                    vm.loadBasicFunctions = function () {
                        /** vm.loadBasicFunctions()
                                * f_create:     20190110
                                * f_update: 
                                * create by:    FerneyderCubides
                                * conditions:   
                                * function:     Load the basic functions to start the app
                                */
                            

                    };
            
                    vm.openModal = function (modal) {
                        $('#' + modal).modal('show');
                    };

                    vm.closeModal = function (modal) {
                        $('#' + modal).modal('hide');
                    };                                                                 

                       
                    vm.searchErrors = function () {

                        vm.restartCounter();

                        for (var i = 0; i < vm.arreglocsv.length; i++) {
                            var referencia_i = vm.arreglocsv[i].referencia;
                                                          
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
                                            item.sw_error_referencia) {

                                            vm.obj_counter.total_errors++;
                                            item.sw_error = true;

                                            if (item.sw_error_referencia_repetida) {
                                                vm.obj_counter.referencia_duplicate++;
                                            }
                                               
                                            if (item.sw_error_referencia) {
                                                vm.obj_counter.error_referencia++;
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    };

                    //Reiniciar contador
                    vm.restartCounter = function () {
                        vm.obj_counter = {
                            referencia_duplicate    : 0                                                               
                            , error_referencia      : 0
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
                                alertify.success('Fila Eliminada');
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
                            
                        GestionSuperOfertaService.get_producto_by_referencia(objTemp.referencia)
                            .then(function (get_producto_by_referencia) {
                                    
                                if (!get_producto_by_referencia) {
                                    toastr.error("No hay información inicial disponible!");
                                } else if (get_producto_by_referencia.data.length > 0 && get_producto_by_referencia.data[0].length > 0) {
                                    _.extend(obj , get_producto_by_referencia.data[0][0]);
                                       
                                } else {
                                    console.log("No se encontro referencia, por favor verifique");
                                    toastr.warning("No se encontro referencia, por favor verifique");
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

                            (function (index) {

                                if (vm.arreglocsv[index].referencia != "") {
                                    GestionSuperOfertaService.get_producto_by_referencia(vm.arreglocsv[index].referencia)
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
                    };

                    // Upload file .csv
                    // add UploadFilecsv
                    vm.new_arreglocsv = function () {
                        vm.arreglocsv = [];
                    };

                    //Abrir Documento FHER
                    document.getElementById("openFile").addEventListener('change', function () {
                        var fr = new FileReader();
                        fr.onload = function () {
                            var contenido = document.getElementById("fileContents").textContent = this.result;
                                
                            //limpiar array                                
                            vm.new_arreglocsv();

                            //separa objetos por salto de linea
                            vm.separata = contenido.split("\n");

                            //asignar cabecera los separa por ',' 
                            var cabecera = vm.separata[0].split(';');

                            //validar asignacion de nombres de cabecera
                                
                            if (cabecera[0] != "referencia") {
                                cabecera[0] = "referencia";
                            }
                                

                            //quitar posicion de cabecera (Elimina la posicion [0], e inicia el arreglo desde la posicion[1])
                            vm.separata.splice(0, 1);

                            for (var j = 0; j < vm.separata.length; j++) {
                                var objetojson = {};
                                var item = vm.separata[j].split(';');
                                for (var i = 0; i < cabecera.length; i++) {
                                    objetojson[cabecera[i]] = item[i];
                                }
                                if (objetojson.referencia) {
                                    vm.arreglocsv.push(objetojson);
                                }
                            }
                            vm.objCtrlCsv = {};                               

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
                                                                     
                    vm.insert_gestion_super_oferta = function () {

                        let objdata = {};
                        let arrayTemp = [];
                        let varNull = '-';

                        if (!vm.arreglocsv || vm.arreglocsv.length == 0 || vm.obj_ctrl.sw_modificarItem) {
                            if (!vm.obj_data.descripcion_referencia) {
                                toastr.error('La referencia no es valida, verifique la información');
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
                            item.sw_activo = 1;                              

                        });

                        objdata = {
                            array: arrayTemp
                        };

                        GestionSuperOfertaService.insert_gestion_super_oferta(objdata)
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
                            if ($location.$$path == "/GestionSuperOferta") {
                                $rootScope.$$childHead.showmodal = false;
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

