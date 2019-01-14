
(function() {
    'use strict';

    angular.module('appmadecentro')
        .controller('UsuariosTransporte', UsuariosTransporte);

    UsuariosTransporte.$inject = ['gestionPersonasService', '$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'ngProgressFactory', 'blockUI'];

    function UsuariosTransporte(gestionPersonasService, $scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, ngProgressFactory, blockUI) {

        var vm = $scope;

        vm.init = function () {
            //#region Atributos
            /*manejo de la barra ppal*/
            $rootScope.itemInicio.value            = 0;
            $rootScope.maestro_dctos.value         = 0;
            $rootScope.maestro_dctos.seleccionado  = false;
            $rootScope.maestro_plazas.value        = 0;
            $rootScope.maestro_plazas.seleccionado = false;
            $rootScope.log_usuario.nombre          = loginService.UserData.Usuario;
            $rootScope.log_usuario.cargo           = loginService.UserData.d_cargo;
            vm.retirar_empleado = {
                value: false
            }
            /*comprobamos que app con maestros tiene disponible el usuario*/
            vm.array_apps_disponibles = [];
            var dt = new Date();
            vm.CentroOperacion = {
                abierto: false
            };
            vm.CentroCostos = {
                abierto: false
            };
            vm.showMaestrosTimeter      = true;
            vm.showMaestrosEvaluaciones = true;
        
            vm.CrearUsuario             = 0;
            vm.isCollapsed              = false;

            vm.crear = {
                value: true
            };
            vm.modificar = {
                value: false
            };
 
            vm.disable_ChkswActivo = true;
       
            //vm.internalControl.showform     = false;
            vm.tooltipMsg = {
                ErrMsg: "",
                template1Error: "<div style='background: red;border: 1px solid red;border-radius: 4px;padding-left: 4px;padding-right: 4px;'>",
                template1Errorend: "</div>"
            };
       
            vm.direccionResult      = null;
            vm.show_nuevo_dominio   = false;

            
            $timeout(function () {
                $("#input_find_person").keypress(function (e) {
                    // handle the key event
                    if (e.which === 13) {
                        vm.buscarEmpleado();
                    }
                });
            }, 300);

            var scrollButton = $('#scroll-top');
            $("#app-outer-container").scroll(function () {
                if ($(this).scrollTop() >= 200) {
                    scrollButton.fadeIn(80);
                } else {
                    scrollButton.fadeOut(500);
                }
            });
            scrollButton.click(function () {
                $("#app-outer-container").animate({
                    scrollTop: 0
                }, 120);
            });
          
   
            $("#menu-toggle").on("click", function (e) {
                e.preventDefault();
                $("#wrapperPL").toggleClass("toggled");
                document.getElementById("input_find_person").focus();
                $timeout(function () {
                    document.getElementById("input_find_person").focus();
                }, 300);
            });
            $("#seleccion_Gerencias").on("change", function (e) {
                if (e.val == "") {
                    vm.objFiltrosPlaza.gerencia = null;
                } else {
                    var gerencia = JSON.parse(e.val);
                    vm.objFiltrosPlaza.gerencia = gerencia.cs_IdArea.toString();
                }
            });
            $("#seleccion_Cargos").on("change", function (e) {
                if (e.val == "") {
                    vm.objFiltrosPlaza.Cargo = null;
                } else {
                    var Cargo = JSON.parse(e.val);
                    vm.objFiltrosPlaza.Cargo = Cargo.c_cargo;
                }
            });


            $("#searchclearUsuario").click(function () {
                vm.LimpiarCampos();
            });
            //#endregion   
       

            //NUEVA LOGICA TRANSPORTE  

            vm.objGestionUsuarios = {
                documento       : "",
                Nombres         : "",
                Apellidos       : "",
                Cargo           : "",
                telefono        : "",
                usuario         : "",
                contrasena      : "",
                c_transportadora: "",
                swActivo        : true,
                logInsert       : loginService.UserData.cs_IdUsuario,
                correo:""
            };


            vm.arrayTransportadoras = [];
            vm.ArrayDatosUsuarios   = [];

            vm.filtroPersona= "";

            vm.validar_existencia_cedula= function() {

                if (vm.objGestionUsuarios.documento != "") {
                    if (parseInt(vm.objGestionUsuarios.documento.length) > 12)
                        toastr.error('La cédula debe contener máximo 12 digitos');

                    $http.get(TreidConfigSrv.ApiUrls.UrlGestionTransporte + "validar_existencia_cedula/" + vm.objGestionUsuarios.documento).
                        then(function(result) {
                            if (result                     === null)
                                return;
                            if (result.data                === null)
                                return;
                            if (result.data.data[0].length > 0) {
                                toastr.error('La cédula ' + vm.objGestionUsuarios.documento + " ya se encuentra registrada");
                                $rootScope.progressbar.reset();
                                return;
                            }

                            $rootScope.progressbar.complete();
                        }).catch(function(data) {
                            vm.Error.value                 = true;
                        });
                }

            };

            vm.GuardarUusario= function () {

                //if (vm.objGestionUsuarios.documento        === "") {
                //    toastr.warning("Debe ingresar un número de documento válido");
                //    return;
                //}

                if (vm.objGestionUsuarios.documento === "" || _.isNull(vm.objGestionUsuarios.documento)) {
                    vm.objGestionUsuarios.documento = null;
                } else {
                    /*validamos el length del telefono*/
                    var lenghtDoc = vm.objGestionUsuarios.documento.length;

                    if (lenghtDoc > 12) {
                        toastr.warning("El documento  debe tener máximo 12 digitos");
                        return;
                    }
                }



                if (parseInt(vm.objGestionUsuarios.documento.length) > 12) {
                    toastr.warning("El documento debe contener máximo 12 digitos");
                    return;
                }
                if (vm.objGestionUsuarios.Nombres          === "") {
                    toastr.warning("Debe ingresar los nombres del usuario");
                    return;
                }

                if (vm.objGestionUsuarios.Apellidos        === "") {
                    toastr.warning("Debe ingresar los apellidos del usuario");
                    return;
                }

                if (vm.objGestionUsuarios.Cargo            === "") {
                    toastr.warning("Debe ingresar un cargo");
                    return;
                }

                if (vm.objGestionUsuarios.usuario          === "") {
                    toastr.warning("Debe ingresar un nombre de usuario");
                    return;
                }

                if (vm.objGestionUsuarios.telefono === "" || _.isNull(vm.objGestionUsuarios.telefono)) {
                    vm.objGestionUsuarios.telefono = null;
                } else {
                    /*validamos el length del telefono*/
                    var lenghtTelefono = vm.objGestionUsuarios.telefono.length;

                    if (lenghtTelefono > 10) {
                        toastr.warning("El telefono  debe tener máximo 10 digitos");
                        return;
                    }
                }


                if (vm.objGestionUsuarios.contrasena       === "") {
                    toastr.warning("Debe ingresar una contraseña");
                    return;
                }

                if (vm.objGestionUsuarios.c_transportadora === "") {
                    toastr.warning("Debe seleccionar una transportadora");
                    return;
                }
      

                if (vm.objGestionUsuarios.correo === "" || _.isNull(vm.objGestionUsuarios.correo)) {
                    toastr.warning('Debe Ingresar el correo');
                    return;
                }

                if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(vm.objGestionUsuarios.correo)) {
                    console.log("La dirección de email " + vm.objGestionUsuarios.correo + " es correcta!.");
                } else {
                    toastr.warning("La dirección de email: " + vm.objGestionUsuarios.correo + " es incorrecta!.");
                    return;
                }

                $http.post(TreidConfigSrv.ApiUrls.UrlGestionTransporte + "insertUsuario/", JSON.stringify(vm.objGestionUsuarios)).
           then(function (result) {
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
                   toastr.success('Registro almacenado correctamente');
                   vm.LimpiarCampos();
                   vm.ArrayDatosUsuarios = [];

                   vm.filtroPersona = "";

               } else {
                   toastr.warning(result.data.MSG);
                   return;
               }
           }).catch(function (data) {
               vm.Error.value = true;
           });




            };

            vm.getTransportadoras= function () {
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlGestionTransporte + "getTransportadoras/").
                    then(function (result) {
                        if (result                         === null)
                            return;
                        if (result.data                    === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.arrayTransportadoras            = result.data.data[0];
                     
                        $rootScope.progressbar.complete();
                    }).catch(function (data) {
                        vm.Error.value                     = true;
                    });
            };

            vm.getTransportadoras();

            vm.LimpiarCampos = function () {

                //vm.ArrayDatosUsuarios = [];
                //vm.filtroPersona = "";

                vm.modificar.value = false;
                vm.isCollapsed     = false;

                vm.objGestionUsuarios = {
                    documento       : "",
                    Nombres         : "",
                    Apellidos       : "",
                    Cargo           : "",
                    telefono        : "",
                    usuario         : "",
                    contrasena      : "",
                    c_transportadora: "",
                    swActivo        : true,
                    logInsert       : loginService.UserData.cs_IdUsuario,
                    correo          :""
            };

          

            };

            vm.buscarUsuario = function () {
                vm.ArrayDatosUsuarios = [];
                vm.LimpiarCampos();
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlGestionTransporte + "buscarUsuario/" + vm.filtroPersona).
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            toastr.error('No se encontró registro con ' + vm.filtroPersona);
                            /*desactivar botones para modificar el usuario*/
                            vm.modificar.value                     = false;
                           
                            vm.objGestionUsuarios = {
                                documento       : "",
                                Nombres         : "",
                                Apellidos       : "",
                                Cargo           : "",
                                telefono        : "",
                                usuario         : "",
                                contrasena      : "",
                                c_transportadora: "",
                                swActivo        : true,
                                logInsert: loginService.UserData.cs_IdUsuario,
                                correo:""
                            };
                            
                            vm.disable_ChkswActivo = true;
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.ArrayDatosUsuarios = result.data.data[0];
           
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };

            vm.cargarUsuario = function (registro) {

                vm.objGestionUsuarios = {
                    documento       : "",
                    Nombres         : "",
                    Apellidos       : "",
                    Cargo           : "",
                    telefono        : "",
                    usuario         : "",
                    contrasena      : "",
                    c_transportadora: "",
                    swActivo        : true,
                    logInsert: loginService.UserData.cs_IdUsuario,
                    correo:""
                };


                /*activar botones para modificar el usuario*/
                vm.modificar.value                     = true;
                vm.disable_ChkswActivo                 = false;
                vm.objGestionUsuarios.documento        = registro.documento;
                vm.objGestionUsuarios.Nombres          = registro.nombres;
                vm.objGestionUsuarios.Apellidos = registro.apellidos;
                vm.objGestionUsuarios.Cargo            = registro.d_cargo;
                vm.objGestionUsuarios.telefono         = registro.telefono;
                vm.objGestionUsuarios.usuario          = registro.user_name;
                vm.objGestionUsuarios.contrasena = registro.contrasena;
                vm.objGestionUsuarios.c_transportadora = registro.c_transportadora;
                vm.objGestionUsuarios.swActivo = registro.sw_activo;
                vm.objGestionUsuarios.correo = registro.correo;
 
                //vm.objGestionEmpleados.fhIngreso = moment(registro.f_ingreso).format("DD/MMMM/YYYY");
            
                $timeout(function () {
                    $("#app-outer-container").animate({
                        scrollTop: 0
                    }, 120);
                }, 500);

                $timeout(function () {
                    vm.$apply();
                }, 100);
            };

            vm.updateUsuario = function () {


                if (vm.objGestionUsuarios.documento === "" || _.isNull(vm.objGestionUsuarios.documento)) {
                    vm.objGestionUsuarios.documento = null;
                } else {
                    /*validamos el length del telefono*/
                    var lenghtDoc = vm.objGestionUsuarios.documento.length;

                    if (lenghtDoc > 12) {
                        toastr.warning("El documento  debe tener máximo 12 digitos");
                        return;
                    }
                }



                //if (vm.objGestionUsuarios.documento === "") {
                //    toastr.warning("Debe ingresar un número de documento válido");
                //    return;
                //}
                if (parseInt(vm.objGestionUsuarios.documento.length) > 12) {
                    toastr.warning("El documento debe contener máximo 12 digitos");
                    return;
                }
                if (vm.objGestionUsuarios.Nombres === "") {
                    toastr.warning("Debe ingresar los nombres del usuario");
                    return;
                }

                if (vm.objGestionUsuarios.Apellidos === "") {
                    toastr.warning("Debe ingresar los apellidos del usuario");
                    return;
                }

                if (vm.objGestionUsuarios.Cargo === "") {
                    toastr.warning("Debe ingresar un cargo");
                    return;
                }

                if (vm.objGestionUsuarios.usuario === "") {
                    toastr.warning("Debe ingresar un nombre de usuario");
                    return;
                }

                if (vm.objGestionUsuarios.contrasena === "") {
                    toastr.warning("Debe ingresar una contraseña");
                    return;
                }

                if (vm.objGestionUsuarios.c_transportadora === "") {
                    toastr.warning("Debe seleccionar una transportadora");
                    return;
                }


                if (vm.objGestionUsuarios.correo === "" || _.isNull(vm.objGestionUsuarios.correo)) {
                    toastr.warning('Debe Ingresar el correo');
                    return;
                }
                if (vm.objGestionUsuarios.telefono === "" || _.isNull(vm.objGestionUsuarios.telefono)) {
                    vm.objGestionUsuarios.telefono = null;
                } else {
                    /*validamos el length del telefono*/
                    var lenghtTelefono = vm.objGestionUsuarios.telefono.length;

                    if (lenghtTelefono > 10) {
                        toastr.warning("El telefono  debe tener máximo 10 digitos");
                        return;
                    }
                }


                $http.post(TreidConfigSrv.ApiUrls.UrlGestionTransporte + "updateUsuario/", JSON.stringify(vm.objGestionUsuarios)).
                      then(function (result) {
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
                              toastr.success('Registro almacenado correctamente');
                              vm.LimpiarCampos();
                              vm.ArrayDatosUsuarios = [];

                              vm.filtroPersona = "";

                          } else {
                              toastr.warning(result.data.MSG);
                              return;
                          }
                      }).catch(function (data) {
                          vm.Error.value = true;
                      });

            };
      
        };
        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('serviceLogIn');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && vm.cookieUser.UserData.cs_IdUsuario == loginService.UserData.cs_IdUsuario) {

                if ($location.$$path == "/UsuariosTransporte") {

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
                            $rootScope.actualPage = "/UsuariosTransporte";
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
}());

