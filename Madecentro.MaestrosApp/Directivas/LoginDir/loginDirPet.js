/// <reference path="LoginDirective.html" />
/// <reference path="LoginDirective.html" />
(function () {

    'use strict';

    angular.module('appmadecentro').directive('loginControl', ['loginService', '$location', '$http', 'TreidConfigSrv', '$rootScope', '$cookieStore', '$route', '$routeParams', '$timeout', function (loginService, $location, $http, TreidConfigSrv, $rootScope, $cookieStore, $route, $routeParams, $timeout) {
        return {
            restrict: 'A',
            templateUrl: 'Directivas/LoginDir/LoginDirective.html',
            link: function (scope, elemto, attrs) {
                scope.objectDialog = {};

                scope.Error = {
                    value: false
                };
                
                scope.showmodal = false;


                $rootScope.Img_Perfil = {
                    ruta: ""
                };

                $rootScope.NombreUsuarioSesion = {
                    nombre: ""
                };

                $rootScope.log_usuario = {
                    nombre: "",
                    cargo: ""
                };

                $rootScope.ShowCambiarPassword = {
                    value: false
                };

                $rootScope.CerrarSession = {
                    value: false
                };

                scope.loginServicetmp = {};

                if (!loginService.hasSession) {
                    scope.result = {};
                    scope.credentials = {
                        //username: '',
                        //password: ''
                        username: '',
                        password: ''
                    };

                    scope.Forgot = {
                        username: '',
                        email: ''
                    };

                    scope.GetService = function (Url, DTO) {
                        $http.post(Url + "Post", JSON.stringify(DTO), {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).success(function (data) {
                            scope.objectDialog.AlertDialog("La contraseña fué enviada a su correo exitosamente...");
                        }).error(function (data) {
                            scope.objectDialog.AlertDialog("Ocurriò un error enviando el correo, intèntelo nuevamente");
                        });
                    };

                    //scope.verificardo = loginService.verificarsession();

                    if (!loginService.hasSession) {

                        $rootScope.DominioApp = {
                            value: ""
                        };

                        if (/ForgotPassword/.test($location.$$url)) {
                            scope.this.showmodal = false;
                            scope.$parent.$$childHead.mostrarMenu = true;
                            scope.$parent.$$childHead.valido = true;
                        } else {
                            scope.showmodal = true;
                            scope.showlogin = true;
                        }

                    }

                    scope.login = function (credentials) {
                        scope.Error.value = false;
                        scope.objectDialog.LoadingDialog('Ingresando...');
                        if (scope.credentials.username != "" && scope.credentials.password != "") {
                            scope.logearUsuario(credentials);
                            scope.credentials.password = "";
                        } else {
                            scope.objectDialog.HideDialog();
                            scope.Error.value = true;
                            if (scope.credentials.password == "") {
                                scope.msgLogin = "Ingrese una contraseña";
                            }


                            if (scope.credentials.username == "") {
                                scope.credentials.password = '';
                                scope.msgLogin = "Ingrese un correo";
                            }

                            //scope.credentials.username = '';

                        }
                    };
                    scope.logearUsuario = function (credenciales) {

                        $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "login", JSON.stringify(credenciales), {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (result) {
                            console.log('valor del result.Msg ' + result.data.MSG);
                            if (result.data.MSG == "OK") {

                                $rootScope.DominioApp.value = TreidConfigSrv.variables.Dominio;
                                loginService.UserData.DominioApp = TreidConfigSrv.variables.Dominio;

                                console.log('el login fue correcto');

                                if (result.data.data.length > 0) {

                                    loginService.hasSession = true;
                                    scope.guardarCookie();

                                    loginService.UserData.cs_IdUsuario = result.data.data[0][0].cs_IdUsuario;
                                    loginService.UserData.cedula = result.data.data[0][0].cedula;
                                    loginService.UserData.Usuario = result.data.data[0][0].Usuario,
                                    loginService.UserData.PrimerApellido = result.data.data[0][0].PrimerApellido,
                                    loginService.UserData.PrimerNombre = result.data.data[0][0].PrimerNombre,
                                    loginService.UserData.UserName = result.data.data[0][0].UserName,
                                    loginService.UserData.Telefono = result.data.data[0][0].Telefono,
                                    loginService.UserData.Celular = result.data.data[0][0].Celular,
                                    loginService.UserData.sw_cambiar_clave = result.data.data[0][0].sw_cambiar_clave;
                                    loginService.UserData.Nombre_FotoPerfil = result.data.data[0][0].Nombre_FotoPerfil;
                                    loginService.UserData.ext_FotoPerfil = result.data.data[0][0].Ext_FotoPerfil;
                                    loginService.UserData.Ruta_FotoPerfil = result.data.data[0][0].Ruta_FotoPerfil;
                                    loginService.UserData.d_cargo = result.data.data[0][0].d_cargo;

                                    loginService.UserData.FotoPerfil = $rootScope.DominioApp.value + loginService.UserData.Ruta_FotoPerfil + loginService.UserData.Nombre_FotoPerfil + loginService.UserData.ext_FotoPerfil;

                                    $rootScope.Img_Perfil.ruta = loginService.UserData.FotoPerfil;

                                    $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
                                    $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

                                    if (loginService.UserData.sw_cambiar_clave == "true") {
                                        $rootScope.ShowCambiarPassword.value = true;
                                    }

                                    scope.guardarCookie();
                                    //TODO(Jose): configurar la variable mostrar menú
                                    scope.this.showmodal = false;
                                    scope.$parent.$$childHead.mostrarMenu = true;
                                    scope.$parent.$$childHead.valido = true;
                                    scope.objectDialog.HideDialog();

                                    //if ($location.$$url == "/") {
                                        $location.path('/Maestros');

                                    //} else {
                                    //    $location.path($location.$$url);
                                    //}
                                }
                                else {
                                    scope.msgLogin = " La combinación de correo y contraseña no es correcta.";
                                    scope.Error.value = true;
                                    $rootScope.$$childHead.showmodal = true;
                                    scope.objectDialog.HideDialog();
                                }
                                //$rootScope.$$childHead.showmodal = false;
                            } else {
                                scope.Error.value = true;
                                scope.objectDialog.HideDialog();
                                //scope.objectDialog.AlertDialog(result.Msg);
                            }

                        }).catch(function (data) {

                            scope.Error.value = true;
                            scope.msgLogin = "Error de protocolo HTTPS ó de la conexion de la web api";

                            scope.objectDialog.HideDialog();

                            $rootScope.$$childHead.showmodal = true;


                        });
                    };

                    scope.ForgotPasswd = function () {
                        scope.showlogin = false;
                    };


                    scope.Cancel = function () {
                        scope.Error.value = false;
                        scope.showlogin = true;
                    };

                    //Olvido Contrasena
                    scope.RecuperarPass = function () {
                        scope.showlogin = false;
                        scope.frmRecuperarPass = true;

                    };

                    scope.CancelarRecuperarPass = function () {
                        scope.showlogin = true;
                        scope.frmRecuperarPass = false;

                    };

                    scope.Accept = function (Forgot) {
                        if (Forgot.email) {

                            scope.objectDialog.LoadingDialog('Enviando correo...');
                            var Forgot = {
                                email: Forgot.email
                            };

                            $http.post(TreidConfigSrv.ApiUrls.UrlForgotPassword + "ForgotPassword/", JSON.stringify(Forgot), {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (result) {

                                if (result.Msg == "Correo Enviado") {
                                    scope.showlogin = true;
                                    scope.frmRecuperarPass = false;
                                    scope.objectDialog.HideDialog();
                                } else {
                                    scope.objectDialog.AlertDialog(result.Msg);
                                    //scope.objectDialog.HideDialog();
                                }
                            }).error(function (data) {

                            });


                        } else {
                            scope.objectDialog.AlertDialog("Ingrese su email...");
                        }
                    };

                    scope.RegistroUser = function () {
                        $location.path('/registoUsr');
                    };

                } else {
                    scope.showmodal = false;
                }


                scope.guardarCookie = function () {
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 15);
                    
                    $cookieStore.put('serviceLogIn', loginService,
                        {
                            expires: expireDate
                        });
                };

                scope.leerCookie = function () {
                    scope.loginServicetmp = $cookieStore.get('serviceLogIn');
                    if (!angular.isUndefined(scope.loginServicetmp)) {
                        if (!angular.isUndefined(scope.loginServicetmp.hasSession)) {

                            loginService.UserData = angular.copy(scope.loginServicetmp.UserData);
                            loginService.hasSession = scope.loginServicetmp.hasSession;
                            $rootScope.Img_Perfil.ruta = scope.loginServicetmp.UserData.FotoPerfil;
                            $rootScope.NombreUsuarioSesion.nombre = scope.loginServicetmp.UserData.Usuario;
                            $rootScope.DominioApp.value = scope.loginServicetmp.UserData.DominioApp;

                            if (scope.loginServicetmp.UserData.sw_cambiar_clave == 1) {
                                $rootScope.ShowCambiarPassword.value = true;
                            }


                            scope.this.showmodal = false;
                            scope.$parent.$$childHead.mostrarMenu = true;
                            scope.$parent.$$childHead.valido = true;
                            //if ($location.$$url == "/") {
                            //    $location.path('/Maestros');
                            //} else {
                            //    $location.path($location.$$url);
                            //}
                            $location.path('/Maestros');

                        }
                    }
                };

                //scope.$on('Login:End', function(event, MsgError, LoginOk) {
                //    if (LoginOk) {
                //        scope.objectDialog.HideDialog();
                //        scope.guardarCookie();
                //    } else {
                //        scope.objectDialog.AlertDialog(MsgError);
                //    }
                //});

                scope.leerCookie();

            }
        };
    }]);
}());
