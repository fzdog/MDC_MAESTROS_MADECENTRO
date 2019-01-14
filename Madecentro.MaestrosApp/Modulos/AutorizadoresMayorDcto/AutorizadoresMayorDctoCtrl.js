
(function () {
    'use strict';

    angular.module('appmadecentro')
        .controller('AutorizadoresMayorDctoCtrl', ['$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'ngProgressFactory', 'blockUI', 'AutorizadoresMayorDctoService', function ($scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, ngProgressFactory, blockUI, AutorizadoresMayorDctoService) {
            var vm = $scope;
            vm.init = function () {

                $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                $(document).ready(function () {
                    $(".js-example-basic-single").select2();
                });


                //Array
                vm.array_lista_zonas = [];
                vm.array_lista_grupos = [];
                vm.array_lista_lineas = [];
                vm.array_permisos_por_usuario_grupo = [];
                vm.array_permisos_por_usuario_linea = [];

                //objects
                vm.obj_datos = {
                    log_update: loginService.UserData.cs_IdUsuario
                };

                vm.obj_usuarios_autorizados_dcto_grupo = {
                };

                vm.obj_usuarios_autorizados_dcto_linea = {

                };

                vm.obj_user_name = {

                };

                vm.obj_permisos_por_usuario = {

                };

                vm.obj_permisos_por_usuario_grupo = {
                };

                vm.obj_modifico = {
                    log_update: loginService.UserData.cs_IdUsuario
                };

                //vm.obj_cambio_usuario = {
                //};



                //functions

                vm.show_div_zona = 1;//carga por defecto

                vm.ver_consulta_zona = function () {
                    vm.show_div_zona = 1;
                    vm.show_div_usuario = 0;
                    $("#div_tablas_permisos").hide();
                    $("#div_resultado_zona").show();

                };
                vm.ver_consulta_usuario = function () {
                    vm.show_div_usuario = 1;
                    vm.show_div_zona = 0;
                    $("#div_tablas_permisos").show();
                    $("#div_resultado_zona").hide();

                };

                $("#ico_minus_linea").hide();
                $("#div_textarea_grupo").hide();
                $("#div_textarea_linea").hide();

                vm.mostrar_select_linea = function () {
                    vm.show_select_linea = 1;
                    $("#ico_plus_linea").hide();
                    $("#ico_minus_linea").show();
                };

                vm.ocultar_select_linea = function () {
                    vm.show_select_linea = 0;
                    $("#ico_minus_linea").hide();
                    $("#ico_plus_linea").show();
                    vm.obj_datos.linea = "";
                    $("#div_textarea_linea").hide();

                };

                vm.ocultar_textarea = function () {
                    $("#div_textarea_grupo").hide();
                    $("#div_textarea_linea").hide();
                    vm.obj_usuarios_autorizados_dcto_grupo.aprobadores = "";
                    vm.obj_usuarios_autorizados_dcto_linea.aprobadores = "";
                    

                };


                //consultar las zonas

                vm.consultar_zonas = function () {
                  // vm.ocultar_textarea();
                    AutorizadoresMayorDctoService.consultar_zonas()
                          .then(function (consultar_zonas) {
                              if (consultar_zonas.data.length > 0 && consultar_zonas.data[0].length > 0) {
                                  vm.array_lista_zonas = consultar_zonas.data[0];

                                  //$timeout(function () {
                                  //    $("#select_zonas").select2({

                                  //    });
                                  //}, 50);

                              } else {
                                  console.log("No se encontro Zonas");
                              }
                          });
                };
                vm.consultar_zonas();

                vm.consultar_grupos = function () {
                             // vm.ocultar_textarea();
                    AutorizadoresMayorDctoService.consultar_grupos()
                          .then(function (consultar_grupos) {
                              if (consultar_grupos.data.length > 0 && consultar_grupos.data[0].length > 0) {
                                  vm.array_lista_grupos = consultar_grupos.data[0];

                              } else {
                                  console.log("No se encontro Grupos");
                              }
                          });
                };


                vm.consultar_lineas = function () {
                   // vm.ocultar_textarea()
                    AutorizadoresMayorDctoService.consultar_lineas(vm.obj_datos.grupo)
                          .then(function (consultar_lineas) {
                              if (consultar_lineas.data.length > 0 && consultar_lineas.data[0].length > 0) {
                                  vm.array_lista_lineas = consultar_lineas.data[0];
                                  //$timeout(function () {
                                  //    $("#select_lineas").select2({
                                  //    });
                                  //}, 50);
                              } else {
                                  console.log("No se encontro Zonas");
                              }
                          });
                };

                vm.boton_busqueda_zonas_grupos_lineas = function () {
                    if (vm.obj_datos.zona_sucursal == null || vm.obj_datos.zona_sucursal < 0 || vm.obj_datos.zona_sucursal == undefined || vm.obj_datos.zona_sucursal == isNaN) {
                        toastr.warning('Seleccione zona')
                        $("#select_zonas").focus();
                        return;
                    };
                    if (vm.obj_datos.grupo == null || vm.obj_datos.grupo == 0 || vm.obj_datos.grupo == undefined || vm.obj_datos.grupo == isNaN) {
                        toastr.warning('Seleccione grupo')
                        $("#select_grupos").focus();
                        return;
                    };
                    if (vm.obj_datos.linea == null || vm.obj_datos.linea == 0 || vm.obj_datos.linea == undefined || vm.obj_datos.linea == isNaN) {
                        toastr.info('Puede filtrar por linea')
                        $("#select_linea").focus();
                        vm.usuarios_autorizados_dcto_grupo();
                        $("#div_textarea_grupo").show();
                    } else {
                        vm.usuarios_autorizados_dcto_linea();
                        vm.usuarios_autorizados_dcto_grupo();
                        $("#div_textarea_grupo").show();
                        $("#div_textarea_linea").show();
                    }
                };

                vm.usuarios_autorizados_dcto_grupo = function () {
                    vm.obj_usuarios_autorizados_dcto_grupo = "";
                    AutorizadoresMayorDctoService.usuarios_autorizados_dcto_grupo(vm.obj_datos.zona_sucursal, vm.obj_datos.grupo)
                          .then(function (usuarios_autorizados_dcto_grupo) {
                              if (usuarios_autorizados_dcto_grupo.data.length > 0 && usuarios_autorizados_dcto_grupo.data[0].length > 0) {
                                  vm.obj_usuarios_autorizados_dcto_grupo = usuarios_autorizados_dcto_grupo.data[0][0];
                                  vm.show_resultado_dcto_grupo = 1;
                              } else {
                                  console.log("No se encontro Usuarios autorizados para dcto por grupo");
                                  vm.show_resultado_dcto_grupo = 0;
                              }
                          });
                };

                vm.usuarios_autorizados_dcto_linea = function () {
                    vm.obj_usuarios_autorizados_dcto_linea = "";
                    AutorizadoresMayorDctoService.usuarios_autorizados_dcto_linea(vm.obj_datos.zona_sucursal, vm.obj_datos.grupo, vm.obj_datos.linea)
                          .then(function (usuarios_autorizados_dcto_linea) {
                              if (usuarios_autorizados_dcto_linea.data.length > 0 && usuarios_autorizados_dcto_linea.data[0].length > 0) {
                                  vm.obj_usuarios_autorizados_dcto_linea = usuarios_autorizados_dcto_linea.data[0][0];
                                  console.log(vm.obj_usuarios_autorizados_dcto_linea);
                                  vm.show_resultado_dcto_linea = 1;
                              } else {
                                  console.log("No se encontro Usuarios autorizados para dcto por linea");
                                  vm.show_resultado_dcto_linea = 0;
                              }
                          });
                };


                $("span.help-block").hide();
                $("label.help-block").hide();
                $("#icono_texto").remove();

                vm.ocultar_help_block = function () {
                    $("span.help-block").hide();
                    vm.show_btn_permiso_users = 0;
                    vm.show_btn_limpiar_users = 0;
                };

                vm.user_name_verificado = function (nombre, idTexto) { // se recibe el objeto y se le da nombre: "cualquiera"
                    $("#icono_texto").remove();
                    vm.ocultar_help_block();
                    $("#" + idTexto).parent().children("span").text(nombre).show(); //se imprime dentro del texto el arreglo "nombre"
                    $("#" + idTexto).parent().attr("class", "form-group has-succes has-feedback");
                    $("#" + idTexto).parent().append("<span id='icono_texto' class='glyphicon glyphicon-ok form-control-feedback'></span>");
                    vm.show_btn_permiso_users = 1;
                    vm.show_btn_limpiar_users = 1;
                };

                vm.user_name_invalido = function (idTexto) {
                    $("#icono_texto").remove();
                    vm.ocultar_help_block();
                    $("#" + idTexto).parent().children("span").text("No se encontro registro").show();
                    $("#" + idTexto).parent().append("<span id='icono_texto' class='glyphicon glyphicon-remove form-control-feedback'></span>");
                    $("#" + idTexto).parent().attr("class", "form-group has-error has-feedback");
                    vm.show_btn_limpiar_users = 1;
                    vm.show_btn_permiso_users = 0;
                    console.log("No se encontro UserName " + vm.obj_datos.correo_electronico + "");
                };

                vm.limpiar_usuario = function () {
                    $("#icono_texto").remove();
                    vm.obj_datos.correo_electronico = "";
                    vm.ocultar_help_block();
                    vm.obj_usuarios_autorizados_dcto_grupo.usuario = "";
                    vm.obj_usuarios_autorizados_dcto_grupo.nuevo_usuario = "";

                };
                vm.limpiar_usuario_de_cambio = function () {
                    vm.obj_datos.nuevo_usuario_remplazo = "";
                    $("#icono_texto").remove();
                    vm.ocultar_help_block();


                };

                vm.facadeAutorizar = function () {
                    //mirar que se ve va a ejecutar
                    switch (vm.nombreFacade) {
                        case "Agregar nuevo autorizador mayor dscto GRUPO":
                            vm.autorizar_usuario_dcto_grupo();
                            break;
                        case "Agregar nuevo autorizador mayor dscto LINEA":
                            vm.autorizar_usuario_dcto_linea();
                            break;
                        case "Remplazar autorizador mayor dscto GRUPO":
                            vm.remplazar_usuario_grupo();
                            break;
                        case "Remplazar autorizador mayor dscto LINEA":
                            vm.remplazar_usuario_linea();
                            break;
                        case "Remplazar autorizador por nuevo autorizador mayor dscto":
                            if (vm.obj_datos.nuevo_usuario_remplazo == "" || vm.obj_datos.nuevo_usuario_remplazo == 0 || vm.obj_datos.nuevo_usuario_remplazo == undefined || vm.obj_datos.nuevo_usuario_remplazo == null) {
                                toastr.warning('Ingrese el nuevo Usuario')
                                $("#txt_remplazo_nuevo_usuario").focus();
                                return;
                            };
                            var i = 0;
                            var sw_activos = "";
                            for (i = 0; i < vm.array_permisos_por_usuario_grupo.length; i++) {
                                if (vm.array_permisos_por_usuario_grupo[i].sw_cambiar_autorizador_grupo == true) {
                                    sw_activos = 1;
                                    break;
                                }
                            };
                            for (i = 0; i < vm.array_permisos_por_usuario_linea.length; i++) {
                                if (vm.array_permisos_por_usuario_linea[i].sw_cambiar_autorizador_grupo == true) {
                                    sw_activos = 1;
                                    break;
                                }
                            };
                            if (sw_activos != 1) {
                                toastr.warning('No hay items seleccionados');
                                return;
                            };
                            vm.remplazar_autorizador_por_autorizador_linea();
                            vm.remplazar_autorizador_por_autorizador_grupo();
                            break;
                    }

                };


                vm.nombreFacade = "";

                vm.asignarFacade = function (nombre) {
                    vm.nombreFacade = nombre;
                }

                //verifica que el correo electronico si se encuentre registrado en la base de datos M_USUARIOS
                vm.verificar_user_name = function (idTexto) {
                    if (vm.obj_datos.correo_electronico == "" || vm.obj_datos.correo_electronico == null || vm.obj_datos.correo_electronico == undefined || vm.obj_datos.correo_electronico == isNaN || vm.obj_datos.correo_electronico < 0) {
                        toastr.info('Debe llenar los campos requeridos')
                        $("#icono_texto").remove();
                        $("#" + idTexto).parent().children("span").hide();
                        return;
                    };
                    AutorizadoresMayorDctoService.verificar_user_name(vm.obj_datos.correo_electronico)
                   .then(function (verificar_user_name) {
                       if (verificar_user_name.data.length > 0 && verificar_user_name.data[0].length > 0) {
                           vm.obj_user_name = verificar_user_name.data[0][0];
                           vm.user_name_verificado(vm.obj_user_name.nombre_completo_usuario, idTexto);//se pasa  el objeto a la funcion entre parentesis
                       } else {
                           vm.user_name_invalido(idTexto);
                           vm.show_btn_permiso_users = 0;
                       }
                   });
                };

                vm.verificar_duplicados = function (usuario, u_autorizados, mensaje, idTexto) {
                    mensaje = mensaje;
                    u_autorizados = u_autorizados.toLowerCase();
                    usuario = usuario.toLowerCase();//usuario a cambiar
                    // usuarios autorizados para grupo determinado
                    var busqueda = (u_autorizados.search(usuario));
                    if (busqueda < 0) {
                        return false;
                    } else {
                        toastr.error('Error, el Usuario: <b>' + usuario + '</b> ya se encuentra autorizado' + mensaje);
                        $("#" + idTexto).focus();

                        return true;
                    }

                };


                vm.autorizar_usuario_dcto_linea = function () {
                    var mensaje = (' en la linea seleccionada');

                    vm.obj_datos.c_id_m_aprobadores_zonas_grupos_lineas = vm.obj_usuarios_autorizados_dcto_linea.c_id_m_aprobadores_zonas_grupos_lineas;

                    if (vm.obj_usuarios_autorizados_dcto_linea.aprobadores == null || vm.obj_usuarios_autorizados_dcto_linea.aprobadores == "" || vm.obj_usuarios_autorizados_dcto_linea.aprobadores == undefined) {
                        vm.obj_datos.aprobadores = vm.obj_datos.correo_electronico;
                    } else if (vm.verificar_duplicados(vm.obj_datos.correo_electronico, vm.obj_usuarios_autorizados_dcto_linea.aprobadores, mensaje, 'txt_autorizar_usuario_grupo')) {
                        return;
                    } else {
                        vm.obj_datos.aprobadores = (vm.obj_usuarios_autorizados_dcto_linea.aprobadores + "," + vm.obj_datos.correo_electronico);
                    };
                    AutorizadoresMayorDctoService.autorizar_usuario_dcto_linea(vm.obj_datos)
                    .then(function (result) {
                        if (result.MSG === "GUARDADO") {
                            vm.usuarios_autorizados_dcto_linea();
                            toastr.success('Registro guardado correctamente');
                        } else {
                            toastr.warning('Algo no esta bien');
                            console.warning(result.MSG);
                        }
                    });
                };


                //actualiza los usuarios para realizar dctos
                vm.autorizar_usuario_dcto_grupo = function () {
                    var mensaje = (' en el grupo seleccionado');

                    vm.obj_datos.c_id_m_aprobadores_zonas_grupos = vm.obj_usuarios_autorizados_dcto_grupo.c_id_m_aprobadores_zonas_grupos;

                    if (vm.obj_usuarios_autorizados_dcto_grupo.aprobadores == null || vm.obj_usuarios_autorizados_dcto_grupo.aprobadores == "" || vm.obj_usuarios_autorizados_dcto_grupo.aprobadores == undefined || vm.obj_usuarios_autorizados_dcto_grupo.aprobadores == isNaN) {
                        vm.obj_datos.aprobadores = vm.obj_datos.correo_electronico;
                    } else if (vm.verificar_duplicados(vm.obj_datos.correo_electronico, vm.obj_usuarios_autorizados_dcto_grupo.aprobadores, mensaje, 'txt_autorizar_usuario_grupo')) {
                        return;
                    } else {
                        vm.obj_datos.aprobadores = (vm.obj_usuarios_autorizados_dcto_grupo.aprobadores + "," + vm.obj_datos.correo_electronico);
                        toastr.info(vm.obj_datos.aprobadores);
                    };
                    AutorizadoresMayorDctoService.autorizar_usuario_dcto_grupo(vm.obj_datos)
                       .then(function (result) {
                           if (result.MSG === "GUARDADO") {
                               vm.usuarios_autorizados_dcto_grupo();
                               toastr.success('Registro guardado correctamente');
                           } else {
                               toastr.warning('Algo no esta bien');
                               console.warning(result.MSG);
                           }
                       });
                };

                vm.mostrar_texto = function () {
                    vm.show_txt_permiso = 1;
                    vm.show_txt_permiso2 = 0;
                };

                vm.ocultar_texto = function () {
                    vm.show_txt_permiso = 0;
                    vm.show_txt_permiso2 = 0;
                };

                vm.consultar_permisos_por_usuario_grupo = function () {
                    vm.ocultar_texto();
                    if (vm.obj_datos.correo_electronico === null || vm.obj_datos.correo_electronico === "" || vm.obj_datos.correo_electronico === undefined) {
                        toastr.warning('¡Ingrese un usuario valido!')
                        $("#txt_consultar_permisos_usuario").focus();
                        return;
                    }
                    vm.obj_permisos_por_usuario.user_name = vm.obj_datos.correo_electronico;
                    AutorizadoresMayorDctoService.consultar_permisos_por_usuario_grupo(vm.obj_permisos_por_usuario.user_name)
                          .then(function (consultar_permisos_por_usuario_grupo) {
                              if (consultar_permisos_por_usuario_grupo.data.length > 0 && consultar_permisos_por_usuario_grupo.data[0].length > 0) {
                                  vm.array_permisos_por_usuario_grupo = consultar_permisos_por_usuario_grupo.data[0];
                                  vm.mostrar_texto();
                              } else {
                                  console.log("No se encontro permiso para el usuario en los Grupos");
                                  vm.show_txt_permiso2 = 1;
                              }
                          });
                };

                vm.consultar_permisos_por_usuario_lineas = function () {
                    vm.ocultar_texto();
                    if (vm.obj_datos.correo_electronico === null || vm.obj_datos.correo_electronico === "" || vm.obj_datos.correo_electronico === undefined) {
                        toastr.warning('¡Ingrese un usuario valido!')
                        $("#txt_consultar_permisos_usuario").focus();
                        return;
                    }
                    AutorizadoresMayorDctoService.consultar_permisos_por_usuario_lineas(vm.obj_permisos_por_usuario.user_name)
                          .then(function (consultar_permisos_por_usuario_lineas) {
                              if (consultar_permisos_por_usuario_lineas.data.length > 0 && consultar_permisos_por_usuario_lineas.data[0].length > 0) {
                                  vm.array_permisos_por_usuario_linea = consultar_permisos_por_usuario_lineas.data[0];
                                  vm.mostrar_texto();
                              } else {
                                  console.log("No se encontro permiso para el usuario en las lineas");
                                  vm.show_txt_permiso2 = 1;
                              }
                          });
                };

                vm.verificar_formato_del_correo = function (idTexto) {//solo verifica que el correo sea ingresado de la forma correcta para buscarlo, No consulta si esta registrado o no.
                    var valor = document.getElementById("txt_cambio_usuario").value;

                    if (utils.checkEmail(valor)) {
                        $("#icono_texto").remove();
                        vm.ocultar_help_block();
                        //$("#" + idTexto).parent().children("span").text("ok").show();
                        //$("#" + idTexto).parent().attr("class", "form-group has-sucess has-feedback");
                        $("#" + idTexto).parent().append("<span id='icono_texto' class='glyphicon glyphicon-ok form-control-feedback'></span>");

                        return true;
                    } else {
                        $("#icono_texto").remove();
                        vm.ocultar_help_block();
                        $("#" + idTexto).parent().children("span").text("El correo no esta en un formato valido").show();
                        $("#" + idTexto).parent().append("<span id='icono_texto' class='glyphicon glyphicon-remove form-control-feedback'></span>");
                        $("#" + idTexto).parent().attr("class", "form-group has-error has-feedback");
                        vm.show_btn_limpiar_users = 1;
                        vm.show_btn_permiso_users = 0;

                        return false;
                    }
                };

                vm.temporal_verificar_correos = function (idTexto) {

                    vm.obj_datos.correo_electronico = vm.obj_usuarios_autorizados_dcto_grupo.nuevo_usuario;
                    vm.verificar_user_name(idTexto);
                };




                vm.remplazar_usuario_grupo = function () {//remplaza los usuarios en un grupo determinado (solo en un grupo determinado)
                    var mensaje = (' en el grupo seleccionado');
                    var usuario = vm.obj_usuarios_autorizados_dcto_grupo.usuario.toLowerCase();//usuario a cambiar
                    var nuevo_usuario = vm.obj_usuarios_autorizados_dcto_grupo.nuevo_usuario.toLowerCase();
                    var u_autorizados = vm.obj_usuarios_autorizados_dcto_grupo.aprobadores.toLowerCase();// usuarios autorizados para grupo determinado
                    var busqueda = (u_autorizados.search(usuario));

                    if (usuario == "" || usuario == null || usuario == undefined || usuario == isNaN) {
                        toastr.warning("Debe ingresar el correo valido que desea cambiar");
                        $("#txt_cambio_usuario").focus();
                        return;
                    };
                    if (busqueda < 0) {//si no se encontro el usuario que se queiere cambiar
                        toastr.warning(" No se encontro usuario: <b>" + usuario + "</b> verifique!! ");
                        $("#txt_cambio_usuario").focus();
                        return;
                    };
                    if (vm.verificar_duplicados(nuevo_usuario, u_autorizados, mensaje, 'txt_cambio_nuevo_usuario')) {
                        return;
                    };
                    //var u_autorizados = vm.obj_usuarios_autorizados_dcto_grupo.aprobadores;
                    vm.obj_usuarios_autorizados_dcto_grupo.aprobadores = u_autorizados.replace(usuario, nuevo_usuario);

                    AutorizadoresMayorDctoService.remplazar_usuario_grupo(vm.obj_usuarios_autorizados_dcto_grupo)
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

                vm.remplazar_usuario_linea = function () {//remplaza los usuarios en un grupo determinado (solo en un grupo determinado)
                    var mensaje = (' en la linea seleccionado');
                    var usuario = vm.obj_usuarios_autorizados_dcto_grupo.usuario;//usuario a cambiar
                    var nuevo_usuario = vm.obj_usuarios_autorizados_dcto_grupo.nuevo_usuario.toLowerCase();
                    var u_autorizados = vm.obj_usuarios_autorizados_dcto_linea.aprobadores.toLowerCase();// usuarios autorizados para grupo determinado
                    var busqueda = (u_autorizados.search(usuario));

                    if (usuario == "" || usuario == null || usuario == undefined || usuario == isNaN) {
                        toastr.warning("Debe ingresar el correo valido que desea cambiar");
                        $("#txt_cambio_usuario").focus();
                        return;
                    };
                    if (busqueda < 0) {//si no se encontro el usuario que se queiere cambiar
                        toastr.warning(" No se encontro usuario: <b>" + usuario + "</b> verifique!! ");
                        $("#txt_cambio_usuario").focus();
                        return;
                    };

                    if (vm.verificar_duplicados(nuevo_usuario, u_autorizados, mensaje, 'txt_cambio_nuevo_usuario')) {
                        return;
                    };
                    //var u_autorizados = vm.obj_usuarios_autorizados_dcto_grupo.aprobadores;
                    vm.obj_usuarios_autorizados_dcto_linea.aprobadores = u_autorizados.replace(usuario, nuevo_usuario);

                    AutorizadoresMayorDctoService.remplazar_usuario_linea(vm.obj_usuarios_autorizados_dcto_linea)
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


                vm.temporal_verificar_correos_remplazo = function (idTexto) {
                    vm.verificar_user_name(idTexto, vm.obj_datos.correo_electronico = vm.obj_datos.nuevo_usuario_remplazo);
                };

                vm.remplazar_autorizador_por_autorizador_grupo = function () {
                    //var u_autorizados = vm.array_permisos_por_usuario_grupo;
                    var usuario = vm.obj_permisos_por_usuario.user_name.toLowerCase();
                    var nuevo_usuario = vm.obj_datos.nuevo_usuario_remplazo.toLowerCase();

                    var i = "";
                    for (i = 0; i < vm.array_permisos_por_usuario_grupo.length; i++) {
                        if (vm.array_permisos_por_usuario_grupo[i].sw_cambiar_autorizador_grupo == true) {
                            var item = vm.array_permisos_por_usuario_grupo[i];
                            vm.array_permisos_por_usuario_grupo[i].log_update = loginService.UserData.cs_IdUsuario;
                            vm.array_permisos_por_usuario_grupo[i].aprobadores = item.aprobadores.replace(usuario, nuevo_usuario);
                            AutorizadoresMayorDctoService.remplazar_autorizador_por_autorizador_grupo(vm.array_permisos_por_usuario_grupo[i])
                               .then(function (result) {
                                   if (result.MSG === "GUARDADO") {
                                       setTimeout('document.location.reload()', 2000);
                                       toastr.success('Registro guardado correctamente');
                                   } else {
                                       toastr.warning('Algo no esta bien');
                                       console.warning(result.MSG);
                                   }
                               });
                        } else {
                            i = i++;
                        }
                    }
                };

                vm.remplazar_autorizador_por_autorizador_linea = function () {
                    var usuario = vm.obj_permisos_por_usuario.user_name.toLowerCase();
                    var nuevo_usuario = vm.obj_datos.nuevo_usuario_remplazo.toLowerCase();

                    var i = "";
                    for (i = 0; i < vm.array_permisos_por_usuario_linea.length; i++) {
                        if (vm.array_permisos_por_usuario_linea[i].sw_cambiar_autorizador_grupo == true) {
                            var item = vm.array_permisos_por_usuario_linea[i];
                            vm.array_permisos_por_usuario_linea[i].log_update = loginService.UserData.cs_IdUsuario;
                            vm.array_permisos_por_usuario_linea[i].aprobadores = item.aprobadores.replace(usuario, nuevo_usuario);
                            AutorizadoresMayorDctoService.remplazar_autorizador_por_autorizador_linea(vm.array_permisos_por_usuario_linea[i])
                               .then(function (result) {
                                   if (result.MSG === "GUARDADO") {
                                       setTimeout('document.location.reload()', 2000);
                                       toastr.success('Registro guardado correctamente');
                                   } else {
                                       toastr.warning('Algo no esta bien');
                                       console.warning(result.MSG);
                                   }
                               });
                        } else {
                            i = i++;
                        }
                    }
                };



                vm.RedirectTo = function (pathname) {
                    $location.path(pathname);
                    $rootScope.actualPage = pathname;
                };

                vm.cookieUser = {};
                vm.cookieUser = $cookieStore.get('serviceLogIn');
                if (vm.cookieUser != null) {
                    if (vm.cookieUser.hasSession && vm.cookieUser.UserData.cs_IdUsuario == loginService.UserData.cs_IdUsuario) {
                        if ($location.$$path == "/AutorizadoresMayorDcto") {
                            $rootScope.$$childHead.showmodal = false;
                            $rootScope.actualPage = "/AutorizadoresMayorDcto";
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

