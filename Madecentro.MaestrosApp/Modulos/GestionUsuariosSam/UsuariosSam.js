
(function () {
    'use strict';

    angular.module('appmadecentro').controller('UsuariosSam', [
       '$modal', '$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'GestionUsuSamService', function ($modal, $scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, GestionUsuSamService) {
           var vm = $scope;

           vm.init = function () {

               //AbrirImagen modal
               vm.openmodal_usuarios_sam = function () {
                   angular.element(document).ready(function () {
                       $("#modal_gestion_usuarios_sam").modal(
                           {
                               show: true,
                               backdrop: 'static',
                               keyboard: false
                           });
                   });
               };
               vm.openmodal_usuarios_sam();

               //cerrar modal
               vm.cerrar_modal_ususarios_sam = function () {
                   $("#modal_gestion_usuarios_sam").modal('hide');
                   vm.RedirectTo('/Maestros');

                   //RedirectTo('./Maestros');
               };


               //objetos
               vm.obj_usuario_sam = {
                   correo_usuario_sam: ""
               };

               vm.obj_update_usuario = {};
               vm.obj_insert_usuario = {

                   id_usuario: "",
                   rol: "",
                   sw_activo: true,
                   sw_vendedor_externo: false,
                   sw_vendedor_ext_ppto: false,
                   cs_id_Usuario: loginService.UserData.cs_IdUsuario

               };
               vm.objCentrosOperaciones = {
                   ArrayCentrosOperaciones: []
               };
               vm.obj_add_sucursal = {
                   id_co: "",
                   c_usu: "",
                   sw_activo: true,
                   cs_id_Usuario: loginService.UserData.cs_IdUsuario
               };
               vm.obj_get_sucursal_codigo = {
                   codigo_usuario: ""

               }
               //pruebas
               vm.obj_update_sucursal = {
                   array_update_usucural: "",
                   cs_id_Usuario: loginService.UserData.cs_IdUsuario
               };
               //vm.array_usuario_sam = [];
               vm.array_roles = [];

               //array sucursales usuario
               vm.array_sucursales_usuario = [];
               vm.arrayxx = [];

               //buscar usuario ingresado
               vm.buscar_usuario_sam = function () {
                   if (vm.obj_usuario_sam.correo_usuario_sam === "undefined") {
                       toastr.warning('Debe ingresar correo del usuario');
                       return;
                   }
                   GestionUsuSamService.buscar_usuario_sam(vm.obj_usuario_sam.correo_usuario_sam)
                          .then(function (usuario_sam) {
                              if (usuario_sam.data.length > 0 && usuario_sam.data[0].length > 0) {
                                  //vm.array_usuario_sam = usuario_sam.data[0];
                                  vm.obj_update_usuario = usuario_sam.data[0][0];
                                  vm.obj_get_sucursal_codigo.codigo_usuario = usuario_sam.data[0][0].codigoUsuario;
                                  //vm.obj_usuario_sam = vm.array_usuario_sam.slice();
                                  //vm.objxxx = vm.array_usuario_sam.slice();
                                  vm.show_update_usuario = 1;
                                  vm.show_insert_usuario = 0;
                                  vm.get_id_usuario();
                                  vm.get_sucursales_usuario();
                                  vm.get_centro_operativo();
                                  // vm.get_sucursales_usuario();

                              } else {
                                  console.log("No se encontro registro de usuario  ");
                                  // toastr.info('No se encontraron datos resgistrados ');
                                  vm.show_update_usuario = 0;
                                  vm.show_insert_usuario = 1;
                                  vm.get_id_usuario();
                                  vm.get_centro_operativo();
                              }
                          });

               };

               //traer el codigo 
               vm.get_id_usuario = function () {
                   GestionUsuSamService.get_id_usuario(vm.obj_usuario_sam.correo_usuario_sam)
                          .then(function (get_usuario) {
                              if (get_usuario.data.length > 0 && get_usuario.data[0].length > 0) {

                                  vm.obj_insert_usuario.id_usuario = get_usuario.data[0][0].c_usuario;

                                  vm.obj_add_sucursal.c_usu = angular.copy(vm.obj_insert_usuario.id_usuario);
                                  vm.obj_get_sucursal_codigo.codigo_usuario = get_usuario.data[0][0].c_usuario;

                                  //vm.insert_rol_usuario();

                              } else {
                                  console.log("No se encontro registro de usuario  ");
                                  toastr.warning(' Favor crear el usuario en la aplicación respectiva ');
                                  vm.show_update_usuario = 0;
                                  vm.show_insert_usuario = 0;

                              }
                          });
               };

               //get sucursal x codigo_usuario
               vm.get_sucursales_usuario = function () {
                   vm.array_sucursales_usuario = [];
                   GestionUsuSamService.get_sucursales_usuario(vm.obj_get_sucursal_codigo.codigo_usuario)
                             .then(function (sucursales_usu) {
                                 if (sucursales_usu.data.length > 0 && sucursales_usu.data[0].length > 0) {
                                     vm.array_sucursales_usuario = sucursales_usu.data[0];
                                     vm.obj_update_sucursal.array_update_usucural = vm.array_sucursales_usuario;
                                     vm.show_tabla_sucursales = 1;


                                 } else {
                                     console.log("No se encontro sucursales asociadas al usuario");
                                     toastr.info("No se encontro sucursales asociadas al usuario");
                                     vm.show_tabla_sucursales = 0;
                                     vm.show_add_secursal = 0;

                                 }
                             });
               };

               //update sw sucursal obj_update_sucursal
               vm.update_sw_sucursal = function () {
                   if (vm.obj_update_sucursal.array_update_usucural === "") {

                       toastr.warning('El usuario debe tener al menos una sucursal asignada');
                       return;
                   }
                   vm.update_rol_usuario();
                   GestionUsuSamService.update_sw_sucursal(vm.obj_update_sucursal)
                       .then(function (result) {
                           if (result.MSG === "GUARDADO") {
                               console.log(" modificación almacenada  correctamente");

                           } else {
                               toastr.warning(result.MSG);
                           }
                       });
               };

               //get usuarios para insert
               vm.get_usuarios = function () {

               };

               //get roles
               vm.get_roles = function () {
                   GestionUsuSamService.get_roles()
                         .then(function (roles) {
                             if (roles.data.length > 0 && roles.data[0].length > 0) {
                                 vm.array_roles = roles.data[0];
                                 vm.obj_usuario_sam = vm.array_usuario_sam;


                             } else {
                                 console.log("No se encontro roles");

                             }
                         });

               };

               vm.get_roles();

               //get centro operación 
               vm.get_centro_operativo = function () {
                   GestionUsuSamService.get_centro_operativo()
                         .then(function (co) {
                             if (co.data.length > 0 && co.data[0].length > 0) {
                                 vm.objCentrosOperaciones.ArrayCentrosOperaciones = co.data[0];

                                 $timeout(function () {
                                     $("#mySelCO").select2({

                                     });
                                 }, 50);

                                 $timeout(function () {
                                     $("#co").select2({

                                     });
                                 }, 50);

                             } else {
                                 console.log("No se encontro roles");

                             }
                         });

               };

               //insert roles usuario
               vm.insert_rol_usuario = function () {

                   if (vm.obj_insert_usuario.rol === "") {
                       toastr.warning(' Debe seleccionar un rol ');
                       return;
                   }
                   if (vm.obj_add_sucursal.id_co === "") {
                       toastr.warning('Debe Seleccionar Un Centro Operativo ');
                       return;
                   }
                   vm.insert_sucursal();
                   GestionUsuSamService.insert_rol_usuario(vm.obj_insert_usuario)
                   .then(function (result) {

                       if (result.MSG === "GUARDADO") {

                           toastr.success('Registro almacenado correctamente');
                           vm.cerrar_modal_ususarios_sam();
                           vm.RedirectTo('\Maestros');
                       } else {
                           toastr.warning(result.MSG);
                       }
                   });
               };

               //insert sucursal 
               vm.insert_sucursal = function () {

                   if (vm.obj_add_sucursal.id_co === "") {
                       toastr.warning('Debe Seleccionar Un Centro Operativo ');
                       return;
                   }
                   GestionUsuSamService.insert_sucursal(vm.obj_add_sucursal)
                   .then(function (result) {
                       if (result.MSG === "GUARDADO") {

                           console.log('Registro almacenado correctamente');
                           toastr.success('Sucursal almacenada correctamente');

                           vm.show_tabla_sucursales = 1;
                           vm.show_add_secursal = 1;
                           vm.get_sucursales_usuario();


                       } else {
                           toastr.warning(result.MSG);
                       }
                   });
               };

               //modificar roles usuario
               vm.update_rol_usuario = function () {

                   if (vm.obj_update_usuario.c_rol_id === "") {
                       toastr.warning('Debe Seleccionar rol ');
                       return;
                   }
                   vm.obj_update_usuario.cs_id_usuario = loginService.UserData.cs_IdUsuario;
                   console.log(vm.obj_update_usuario);
                   //return;
                   GestionUsuSamService.update_rol_usuario(vm.obj_update_usuario)
                       .then(function (result) {
                           if (result.MSG === "GUARDADO") {
                               toastr.success('Registro almacenado correctamente');
                               vm.cerrar_modal_ususarios_sam();
                               vm.RedirectTo('/Maestros');
                           } else {
                               toastr.warning(result.MSG);
                           }
                       });
               };

               //mostrar agregar sucursal 
               vm.mostrar_add_sucural = function () {
                   vm.show_tabla_sucursales = 0;
                   vm.show_add_secursal = 0;

               };

               //volver a mostrar la tabla
               vm.volver_sucursales = function () {
                   vm.show_tabla_sucursales = 1;
                   vm.show_add_secursal = 1;
               };

               //ruteo de paginas 
               vm.RedirectTo = function (pathname) {
                   $location.path(pathname);
                   $rootScope.actualPage = pathname;
               };
           };


           vm.init();
       }]);
}());




