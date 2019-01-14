
(function () {
    'use strict';

    angular.module('appmadecentro')
        .controller('GestionBodegasPdvCtrl', ['$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'ngProgressFactory', 'blockUI', 'GestionBodegasPdvService', function ($scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, ngProgressFactory, blockUI, GestionBodegasPdvService) {
            var vm = $scope;
            vm.init = function () {

                $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                $(document).ready(function () {
                    $(".js-example-basic-single").select2();
                });


                //Array
                vm.array_consultar_co = [];
                vm.array_insertar_bodega = [];
                vm.lista_bodegas = [];
               
             
                //objects
             
                vm.obj_insertar_bodega =
               {
               };

                vm.obj_consultar_co =
                {
                };
                vm.obj_modificar_bodega =
            {
            };

                //functions

                //Esconder Botones

                vm.visible = function() {
                    vm.show_btn_cancelar = 1;
                    vm.show_tabla = 1;
                };

                //limpiar CO
                vm.limpiar_co = function() {
                    vm.obj_consultar_co =
                    {
                        centro_operacion: ''
                    };
                    vm.consultar_co();
                    vm.show_tabla = 0;
                    vm.show_tabla = 0;
                };

                vm.mostrar_guardar_cambios = function () {
                    vm.show_guardar_cambios = 1;
                };

                //cerrar modal
                vm.cerrar_modal_insertar_bodega = function() {
                    $("#modal_insertar_bodega").modal('hide');
                    vm.obj_consultar_co.bodega = '';
                };


                vm.consultar_co = function () {
                    GestionBodegasPdvService.consultar_co()
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
                
                
           vm.consultar_bodegas = function () {
               vm.array_insertar_bodega = '';
               GestionBodegasPdvService.consultar_bodegas(vm.obj_consultar_co.centro_operacion)
                    .then(function (consultar_bodegas) {
                        if (vm.obj_consultar_co.centro_operacion === "" || vm.obj_consultar_co.centro_operacion === null || vm.obj_consultar_co.centro_operacion === undefined) {
                            toastr.warning('Debe seleccionar el centro de operacion');
                            return;
                        }
                       if (consultar_bodegas.data.length > 0 && consultar_bodegas.data[0].length > 0) {
                           vm.visible();
                           vm.show_btn_agregar_bodega = 1
                           vm.array_insertar_bodega = consultar_bodegas.data[0];
                       } else {
                           vm.show_tabla = 0;
                           toastr.error("No se se encontraron bodegas asignadas al CO: " + vm.obj_consultar_co.centro_operacion);
                           vm.show_btn_agregar_bodega = 1;
                        }
                    });
               console.log(vm.array_insertar_bodega);
           };

                
           vm.consultar_lista_bodegas = function () {
               GestionBodegasPdvService.consultar_lista_bodegas()
                     .then(function (consultar_lista_bodegas) {
                         if (consultar_lista_bodegas.data.length > 0 && consultar_lista_bodegas.data[0].length > 0) {
                             vm.array_lista_bodegas = consultar_lista_bodegas.data[0];
                             
                             $timeout(function () {
                                 $("#select_lista_bodegas").select2({

                                 });
                             }, 50);


                         } else {
                             console.log("No se encontro bodegas");
                             vm.show_btn_agregar_bodega = 1;
                         }
                     });
           };
           
         
                //insertar bodega
           vm.insertar_bodega = function () {
               //validar
               if (vm.obj_consultar_co.centro_operacion === "" || vm.obj_consultar_co.centro_operacion === null || vm.obj_consultar_co.centro_operacion === undefined) {
                   toastr.warning('Debe Ingresar el centro de operacion');
                   return false;
               }
               if (vm.obj_consultar_co.bodega === "" || vm.obj_consultar_co.bodega === null || vm.obj_consultar_co.bodega === undefined) {
                   toastr.warning('Debe Ingresar la bodega para asignarle al CO: '+ vm.obj_consultar_co.centro_operacion +'');
                   return false;
               }
               
               vm.obj_consultar_co.log_insert = loginService.UserData.cs_IdUsuario;
               vm.obj_consultar_co.sw_activo = true;
               console.log(vm.obj_consultar_co);
                   
               GestionBodegasPdvService.insertar_bodega(vm.obj_consultar_co)
                  .then(function (result) {
                      if (result.MSG === "GUARDADO") {
                          toastr.success('Registro guardado correctamente');
                          vm.cerrar_modal_insertar_bodega();
                          //location.reload();//Actualizar
                          vm.consultar_bodegas();

                      } else {
                          toastr.error(result.MSG);
                          
                      }
                  });
        
           };

           vm.modificar_estado_bodega = function (item) {
               vm.obj_modificar_bodega.cs_id_puntos_ventas_bodegas = item.cs_id_puntos_ventas_bodegas;
               vm.obj_modificar_bodega.sw_activo = item.sw_activo;
               vm.obj_modificar_bodega.log_update = loginService.UserData.cs_IdUsuario;
               console.log(vm.obj_modificar_bodega);
               //return;
               GestionBodegasPdvService.modificar_estado_bodega(vm.obj_modificar_bodega)
                   .then(function (result) {
                       if (result.MSG === "GUARDADO") {
                          
                           vm.consultar_lista_bodegas();
                           //$("#modal_insertar_bodega").modal('hide');
                           toastr.success('Registro almacenado correctamente');
                           //vm.RedirectTo('/Maestros');
                           vm.consultar_lista_bodegas();
                       } else {
                           toastr.warning(result.MSG);
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
                        if ($location.$$path == "/GestionBodegasPdv") {
                            $rootScope.$$childHead.showmodal = false;
                            $rootScope.actualPage = "/GestionBodegasPdv";
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

