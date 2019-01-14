
(function () {
    'use strict';

    angular.module('appmadecentro')
        .controller('GestionDescuentos', GestionDescuentos);

    GestionDescuentos.$inject = ['$scope', '$http', 'TreidConfigSrv', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', 'gestionDescuentosService'];

    function GestionDescuentos($scope, $http, TreidConfigSrv, loginService, $timeout, $location, $cookieStore, $rootScope, gestionDescuentosService) {
        var vm = $scope;
        vm.init = function () {
            /*manejo de la barra ppal*/
            $rootScope.itemInicio.value = 0;
            $rootScope.maestro_dctos.value = 1;
            $rootScope.maestro_dctos.seleccionado = true;
            $rootScope.maestro_plazas.value = 0;
            $rootScope.maestro_plazas.seleccionado = false;
            $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
            $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;

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

            /*mensajes de notificacion*/
            toastr.options = {
                closeButton: true,
                debug: false,
                newestOnTop: false,
                //progressBar: true,
                positionClass: "toast-bottom-left",
                preventDuplicates: true,
                onclick: null,
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                timeOut: "5000",
            };
            vm.showGrupos = {
                value: false
            };
            vm.showLineas = {
                value: false
            };
            vm.showSubLineas = {
                value: false
            };
            vm.showProveedores = {
                value: false
            };
            vm.ocultarFiltros = {
                value: false
            };
            vm.objFiltrosReferencias = {
                c_referencia: "",
                idCO: null
            };
            vm.ArrayGruposProductos = [];
            vm.ArrayLineasProductos = [];
            vm.ArraySubLineasProductos = [];
            vm.mostrar_btn_guardar = {
                value: false
            };
            vm.filtroCiudad = "";
            vm.ciudades = { abierto: false };
            vm.centros_operacion = { abierto: false };
            vm.categograma = { abierto: false };
            vm.array_ciudades = [];
            vm.mostrartabla = 0;
            vm.ArrayCentroOperativo = [];
            vm.showCiudades = true;
            vm.show_centro_operacion = true;
            vm.show_check_todos = { value: false };
            vm.ArrayReferenciasProductos = [];
            vm.sw = false;
            vm.ArrayReferenciasProductos_Original = [];
            vm.referencias_actualizadas = [];
            /*aplicar dctos globales*/
            vm.dcto_sugerido_global = 0;
            vm.dcto_maximo_global = 0;
            vm.apps_maestros = {
                id_appTickets: 1,
                show_appTickets: false,
                id_appGHumana: 2,
                show_appGHumana: false,
                id_appDescuentos: 3,
                show_appDescuentos: false
            };
            $("#btnFiltros").click(function (e) {
                if (!vm.ocultarFiltros.value) {
                    vm.ocultarFiltros.value = true;
                    document.getElementById("page-wrapper").style["margin-left"] = "0px";
                } else {
                    vm.ocultarFiltros.value = false;
                    document.getElementById("page-wrapper").style["margin"] = '0 0 0 355px';
                }
            });
            vm.objFiltrosRef = {
                sw_activo: false,
                sw_todo: true
            };
            $("#swTodos_filtro").on("click", function () {
                if ($("#swTodos_filtro")[0].checked) {
                    $("#chkDctoActivo_filtro")[0].disabled = true;
                    $("#lbl_dcto_activo")[0].style.color = "#C6C6C6";
                } else {
                    $("#chkDctoActivo_filtro")[0].disabled = false;
                    $("#lbl_dcto_activo")[0].style.color = "black";
                }

            });
            $("#chkDctoActivo_filtro")[0].disabled = true;
            $("#lbl_dcto_activo")[0].style.color = "#C6C6C6";
            /*MOSTRAR HORA ACTUAL EN PANTALLA*/

            function startTime() {
                moment.locale("es");
                var dia = moment().format("LL");
                var hora = moment().format("hh:mm:ss A");
                vm.tiempo = dia + " " + hora;
                document.getElementById('txt').innerHTML = dia + " " + hora;
                var t = setTimeout(function () {
                    startTime();
                }, 500);
            }
            //#region *** CATEGOGRAMA ***

            /*objetos*/
            vm.obj_filtro_por_referencia = {
                filtro_por_referencia: ""
            };
            vm.collapse_referencias = {
                abierto: true
            }
            vm.obj_filtro_proveedores = {
                grupos_seleccionados: "",
                lineas_seleccionadas: "",
                subLineas_seleccionadas: "",
                referencias_seleccionadas: ""
            };

            /*arrays*/
            vm.referencias_filtradas = [];
            /*array's donde almaceno lo que selecciono en el categograma*/
            vm.ac_grupos_seleccionados = [];
            vm.ac_lineas_seleccionadas = [];
            vm.ac_sublineas_seleccionadas = [];
            vm.ac_referencias_seleccionadas = [];
            vm.ac_proveedores_seleccionados = [];

            /*VISTA INICIAL DE LOS GRUPOS*/

            vm.verGrupos = function () {
                vm.showGrupos.value = true;
                vm.showLineas.value = false;
                vm.showSubLineas.value = false;
                vm.showProveedores.value = false;

                /*Limpiamos informacion de los array's*/
                vm.ArrayLineasProductos.forEach(function (item) {
                    item.esSeleccionado = false;
                    vm.ac_lineas_seleccionadas.forEach(function (linea) {
                        if (linea.c_linea === item.c_linea)
                            item.esSeleccionado = true;
                    });
                });

                vm.ArraySubLineasProductos.forEach(function (item) {
                    item.esSeleccionado = false;
                    vm.ac_sublineas_seleccionadas.forEach(function (sublinea) {
                        if (sublinea.c_sublinea === item.c_sublinea)
                            item.esSeleccionado = true;
                    });
                });

                vm.array_proveedores.forEach(function (item) {
                    item.esSeleccionado = false;
                    vm.ac_proveedores_seleccionados.forEach(function (proveedores) {
                        if (proveedores.c_proveedor === item.c_proveedor)
                            item.esSeleccionado = true;
                    });
                });
            };

            /* FIN VISTA INICIAL DE LOS GRUPOS*/

            /*obtenemos los grupos de referencias*/
            vm.getGruposProductos = function () {
                gestionDescuentosService.getGruposProductos()
                    .then(function (grupos) {
                        if (grupos.data.length > 0 && grupos.data[0].length > 0) {
                            vm.ArrayGruposProductos = grupos.data[0];
                            vm.ArrayGruposProductos.forEach(function (item) {
                                item.esSeleccionado = false;
                            });
                            vm.showGrupos.value = true;
                            vm.showLineas.value = false;
                            vm.showSubLineas.value = false;

                            vm.showProveedores.value = false;


                        } else {
                            vm.ArrayGruposProductos = [];
                            toastr.error('No se encontraron grupos de productos');
                        }
                    });
            };
            /*obtenemos las lineas segun los grupos marcados*/
            vm.get_lineas_by_grupo = function () {
                /*Limpiamos informacion de los array's*/
                vm.ArrayLineasProductos.forEach(function (item) {
                    item.esSeleccionado = false;
                    vm.ac_lineas_seleccionadas.forEach(function (linea) {
                        if (linea.c_linea === item.c_linea)
                            item.esSeleccionado = true;
                    });
                });

                vm.ArraySubLineasProductos.forEach(function (item) {
                    item.esSeleccionado = false;
                    vm.ac_sublineas_seleccionadas.forEach(function (sublinea) {
                        if (sublinea.c_sublinea === item.c_sublinea)
                            item.esSeleccionado = true;
                    });
                });

                vm.array_proveedores.forEach(function (item) {
                    item.esSeleccionado = false;
                    vm.ac_proveedores_seleccionados.forEach(function (proveedores) {
                        if (proveedores.c_proveedor === item.c_proveedor)
                            item.esSeleccionado = true;
                    });
                });

                $("#chkTodos_lineas")[0].checked = false;
                var acGrupos = [];
                var arrayGrupos;
                vm.ArrayGruposProductos.forEach(function (item) {
                    if (item.esSeleccionado)
                        acGrupos.push(item.c_grupo.trim());
                });
                if (acGrupos.length > 0) {
                    //vm.ac_grupos_seleccionados = angular.copy(acGrupos);
                    arrayGrupos = acGrupos.join(",");
                } else {
                    toastr.warning('Debe seleccionar un grupo');
                    vm.ac_grupos_seleccionados = [];
                    vm.ac_lineas_seleccionadas = [];
                    vm.ArrayLineasProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                    });
                    return;
                }
                gestionDescuentosService.getLineasByGrupo(arrayGrupos)
                    .then(function (lineas) {
                        if (lineas.data.length > 0 && lineas.data[0].length > 0) {
                            vm.ArrayLineasProductos = lineas.data[0];
                            vm.ArrayLineasProductos.forEach(function (item) {
                                item.esSeleccionado = false;

                                /*selecciono las lineas que habian sido seleccionadas previamente en el categograma*/
                                vm.ac_lineas_seleccionadas.forEach(function (lineas) {
                                    if (lineas.c_linea === item.c_linea) {
                                        item.esSeleccionado = true;
                                    }
                                });
                            });
                            vm.showGrupos.value = false;
                            vm.showLineas.value = true;
                            vm.showSubLineas.value = false;

                            vm.showProveedores.value = false;

                        } else {
                            vm.ArrayLineasProductos = [];
                            toastr.error('No se encontraron resultados con los grupos ' + arrayGrupos);
                        }
                    });
            };
            /*obtenemos las sublineas segun el grupo, linea marcados*/
            vm.get_subLineas_by_linea = function () {
                /*Limpiamos informacion de los array's*/
                vm.ArraySubLineasProductos.forEach(function (item) {
                    item.esSeleccionado = false;
                    vm.ac_sublineas_seleccionadas.forEach(function (sublinea) {
                        if (sublinea.c_sublinea === item.c_sublinea)
                            item.esSeleccionado = true;
                    });
                });

                vm.array_proveedores.forEach(function (item) {
                    item.esSeleccionado = false;
                    vm.ac_proveedores_seleccionados.forEach(function (proveedores) {
                        if (proveedores.c_proveedor === item.c_proveedor)
                            item.esSeleccionado = true;
                    });
                });

                $("#chkTodos_sublineas")[0].checked = false;
                var acLineas = [];
                var acGrupos = [];
                vm.ArrayLineasProductos.forEach(function (item) {
                    if (item.esSeleccionado) {
                        /*obtengo los grupos*/
                        acGrupos.push(item.c_grupo.trim());
                        /*obtengo las lineas*/
                        acLineas.push(item.c_linea.trim());
                    }
                });
                var gruposSeleccionados;
                var arrayLineas;
                if (acLineas.length < 1) {
                    toastr.warning('Debe seleccionar una linea');
                    return;
                } else {
                    acGrupos = _.uniq(acGrupos);
                    gruposSeleccionados = acGrupos.join(",");
                    arrayLineas = acLineas.join(",");
                }
                gestionDescuentosService.getSubLineasByGrupo_Linea(gruposSeleccionados, arrayLineas)
                    .then(function (subLineas) {
                        if (subLineas.data.length > 0 && subLineas.data[0].length > 0) {
                            vm.ArraySubLineasProductos = subLineas.data[0];
                            vm.ArraySubLineasProductos.forEach(function (item) {
                                item.esSeleccionado = false;

                                /*selecciono las sublineas que habian sido seleccionadas previamente en el categograma*/
                                vm.ac_sublineas_seleccionadas.forEach(function (sublineas) {
                                    if (sublineas.c_sublinea === item.c_sublinea) {
                                        item.esSeleccionado = true;
                                    }
                                });
                            });
                            vm.showGrupos.value = false;
                            vm.showLineas.value = false;
                            vm.showSubLineas.value = true;

                            vm.showProveedores.value = false;


                        } else {
                            vm.ArraySubLineasProductos = [];
                            toastr.error('No se encontraron resultados las lineas ' + arrayLineas);
                        }
                    });
            };

            /*obtenemos los proveedores segun este el categograma, si no hay nada marcado, traemos todos los proveedores, si hay algo marcado los traemos deacuerdo a lo seleccionado*/
            vm.show_proveedores = function () {
                vm.showGrupos.value = false;
                vm.showLineas.value = false;
                vm.showSubLineas.value = false;
                vm.showProveedores.value = true;
                /*validamos si han marcado alguna elemento del categograma, validando desde los grupos que son el primer filtro que se marca*/
                /*si el contador es cero, traemos todos los proveedores, sino filtramos los proveedores deacuerdo a los que tengamos marcado en el categograma*/

                var cGruposSeleccionados = 0;
                vm.ArrayGruposProductos.forEach(function (item) {
                    if (item.esSeleccionado) {
                        cGruposSeleccionados++;
                    }
                });

                if (angular.equals(cGruposSeleccionados, 0)) {
                    vm.get_proveedores(); /*obtengo todos los proveedores*/
                } else {

                    //#region FILTRO POR GRUPOS
                    /*obtenemos los grupos checkeados*/
                    var acGrupos = [];
                    vm.ArrayGruposProductos.forEach(function (item) {
                        if (item.esSeleccionado) {
                            acGrupos.push(item.c_grupo.trim());
                        }
                    });
                    if (acGrupos.length > 0) {
                        vm.obj_filtro_proveedores.grupos_seleccionados = acGrupos.join(',');
                    }
                    //#endregion

                    //#region FILTRO POR LINEAS
                    /*verificamos si existen lineas seleccionadas*/
                    var acLineas = [];
                    vm.ArrayLineasProductos.forEach(function (item) {
                        if (item.esSeleccionado) {
                            acLineas.push(item.c_linea.trim());
                        }
                    });
                    if (acLineas.length > 0) {
                        vm.obj_filtro_proveedores.lineas_seleccionadas = acLineas.join(',');
                    }
                    //#endregion

                    //#region FILTRO POR SUBLINEAS
                    var acSubLineas = [];
                    vm.ArraySubLineasProductos.forEach(function (item) {
                        if (item.esSeleccionado) {
                            acSubLineas.push(item.c_sublinea.trim());
                        }
                    });
                    if (acSubLineas.length > 0) {
                        vm.obj_filtro_proveedores.subLineas_seleccionadas = acSubLineas.join(',');
                    }
                    //#endregion

                    vm.get_proveedores_by_filtro();
                } //fin else
            };
            /*obtenemos los proveedores*/
            vm.get_proveedores = function () {
                gestionDescuentosService.getProveedores()
                    .then(function (proveedores) {
                        if (proveedores.data.length > 0 && proveedores.data[0].length > 0) {
                            vm.array_proveedores = proveedores.data[0];
                            vm.array_proveedores.forEach(function (item) {
                                item.esSeleccionado = false;
                            });
                        } else {
                            vm.array_proveedores = [];
                            toastr.error('No se encontraron proveedores');
                        }
                    });
            };
            /*filtramos los proveedores*/
            vm.get_proveedores_by_filtro = function () {
                vm.array_proveedores = [];
                gestionDescuentosService.getProveedoresByFiltro(vm.obj_filtro_proveedores)
                    .then(function (proveedoresFiltrados) {
                        if (proveedoresFiltrados.data.length > 0 && proveedoresFiltrados.data[0].length > 0) {
                            vm.array_proveedores = proveedoresFiltrados.data[0];
                            vm.array_proveedores.forEach(function (item) {
                                item.esSeleccionado = false;

                                /*selecciono los proveedores que habian sido seleccionados previamente en el categograma*/
                                vm.ac_proveedores_seleccionados.forEach(function (lineas) {
                                    if (lineas.c_proveedor === item.c_proveedor) {
                                        item.esSeleccionado = true;
                                    }
                                });
                            });
                        } else {
                            vm.array_proveedores = [];
                            toastr.error('No se encontraron proveedores');
                        }
                    });
            };

            /** GESTION DE ITEMS SELECCIONADOS EN CATEGOGRAMA **/

            /*gestion de grupos checkeados*/
            vm.gestion_grupo_checkeado = function (grupo) {
                /*se deselecciona el grupo*/
                if (!grupo.esSeleccionado) {
                    /*obtengo las lineas, sublineas, y referencias segun el grupo*/
                    //#region QUITAR GRUPOS
                    /*eliminamos los grupos del array grupos seleccionados*/
                    vm.ac_grupos_seleccionados = angular.copy(vm.ac_grupos_seleccionados.filter(function (item) {
                        return item.c_grupo !== grupo.c_grupo;
                    }));
                    //#endregion

                    //#region QUITAR LINEAS
                    /*eliminamos las lineas del array lineas seleccionados*/
                    vm.ac_lineas_seleccionadas = angular.copy(vm.ac_lineas_seleccionadas.filter(function (item) {
                        return item.c_grupo !== grupo.c_grupo;
                    }));
                    vm.ArrayLineasProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_lineas_seleccionadas.forEach(function (linea) {
                            if (linea.c_linea === item.c_linea)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion

                    //#region QUITAR SUBLINEAS
                    /*eliminamos las sublineas del array sublineas seleccionados*/
                    vm.ac_sublineas_seleccionadas = angular.copy(vm.ac_sublineas_seleccionadas.filter(function (item) {
                        return item.c_grupo !== grupo.c_grupo;
                    }));
                    vm.ArraySubLineasProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_sublineas_seleccionadas.forEach(function (sublinea) {
                            if (sublinea.c_sublinea === item.c_sublinea)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion

                    //#region QUITAR PROVEEDORES
                    vm.ac_proveedores_seleccionados = angular.copy(vm.ac_proveedores_seleccionados.filter(function (item) {
                        return item.c_grupo !== grupo.c_grupo;
                    }));
                    vm.array_proveedores.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_proveedores_seleccionados.forEach(function (proveedores) {
                            if (proveedores.c_proveedor === item.c_proveedor)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion

                    $timeout(function () {
                        vm.$apply();
                    }, 1);

                } else {
                    vm.ac_grupos_seleccionados.push({
                        c_grupo: grupo.c_grupo
                    });
                }
            };/*OK*/
            /*gestion de lineas checkeados*/
            vm.gestion_linea_checkeada = function (linea) {
                //console.log(linea)
                /*si es seleccionado, agregamos la linea al array*/
                if (linea.esSeleccionado)
                    vm.ac_lineas_seleccionadas.push({
                        c_linea: linea.c_linea,
                        c_grupo: linea.c_grupo
                    });
                else {
                    /*si es deseleccionada la quitamos del array de lineas, sublineas, referencias seleccionadas*/

                    //#region QUITAR LINEAS
                    /*eliminamos las lineas del array lineas seleccionados*/
                    vm.ac_lineas_seleccionadas = angular.copy(vm.ac_lineas_seleccionadas.filter(function (item) {
                        return item.c_linea !== linea.c_linea;
                    }));
                    vm.ArrayLineasProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_lineas_seleccionadas.forEach(function (linea) {
                            if (linea.c_linea === item.c_linea)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion

                    //#region QUITAR SUBLINEAS
                    /*eliminamos las sublineas del array sublineas seleccionados*/
                    vm.ac_sublineas_seleccionadas = angular.copy(vm.ac_sublineas_seleccionadas.filter(function (item) {
                        return item.c_linea !== linea.c_linea;
                    }));
                    vm.ArraySubLineasProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_sublineas_seleccionadas.forEach(function (sublinea) {
                            if (sublinea.c_sublinea === item.c_sublinea)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion

                    //#region QUITAR PROVEEDORES
                    vm.ac_proveedores_seleccionados = angular.copy(vm.ac_proveedores_seleccionados.filter(function (item) {
                        return item.c_linea !== linea.c_linea;
                    }));
                    vm.array_proveedores.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_proveedores_seleccionados.forEach(function (proveedores) {
                            if (proveedores.c_proveedor === item.c_proveedor)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion
                }
            };
            /*gestion sublineas*/
            vm.gestion_sublinea_checkeada = function (sublinea) {
                /*si es seleccionado, agregamos la sublinea al array*/
                if (sublinea.esSeleccionado)
                    vm.ac_sublineas_seleccionadas.push({
                        c_grupo: sublinea.c_grupo,
                        c_linea: sublinea.c_linea,
                        c_sublinea: sublinea.c_sublinea
                    });
                else {
                    //#region QUITAR SUBLINEAS
                    /*eliminamos las sublineas del array sublineas seleccionados*/
                    vm.ac_sublineas_seleccionadas = angular.copy(vm.ac_sublineas_seleccionadas.filter(function (item) {
                        return item.c_sublinea !== sublinea.c_sublinea;
                    }));
                    vm.ArraySubLineasProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_sublineas_seleccionadas.forEach(function (sublinea) {
                            if (sublinea.c_sublinea === item.c_sublinea)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion

                    //#region QUITAR PROVEEDORES
                    vm.ac_proveedores_seleccionados = angular.copy(vm.ac_proveedores_seleccionados.filter(function (item) {
                        return item.c_sublinea !== sublinea.c_sublinea;
                    }));
                    vm.array_proveedores.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_proveedores_seleccionados.forEach(function (proveedores) {
                            if (proveedores.c_proveedor === item.c_proveedor)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion
                }
            };
            /*gestion referencias*/
            vm.gestion_referencia_checkeada = function (referencia) {
                /*si es seleccionado, agregamos la referencia al array*/
                if (referencia.esSeleccionado)
                    vm.ac_referencias_seleccionadas.push({
                        c_grupo: referencia.c_grupo,
                        c_linea: referencia.c_linea,
                        c_sublinea: referencia.c_sublinea,
                        referencia: referencia.referencia
                    });
                else {
                    //#region QUITAR PROVEEDORES
                    vm.ac_proveedores_seleccionados = angular.copy(vm.ac_proveedores_seleccionados.filter(function (item) {
                        return item.referencia !== referencia.referencia;
                    }));
                    vm.array_proveedores.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_proveedores_seleccionados.forEach(function (proveedores) {
                            if (proveedores.c_proveedor === item.c_proveedor)
                                item.esSeleccionado = true;
                        });
                    });
                    //#endregion
                }
            };
            /*gestion proveedor*/
            vm.gestion_proveedor_checkeado = function (proveedor) {
                /*si es seleccionado, agregamos la referencia al array*/
                if (proveedor.esSeleccionado)
                    vm.ac_proveedores_seleccionados.push({
                        c_grupo: proveedor.c_grupo,
                        c_linea: proveedor.c_linea,
                        c_sublinea: proveedor.c_sublinea,
                        referencia: proveedor.referencia,
                        c_proveedor: proveedor.c_proveedor
                    });
                else {
                    /*si es deseleccionada lo quitamos del array de proveedores seleccionadas*/
                    vm.ac_proveedores_seleccionados = angular.copy(vm.ac_proveedores_seleccionados.filter(function (item) {
                        return item.c_proveedor !== proveedor.c_proveedor;
                    }));
                    vm.array_proveedores.forEach(function (item) {
                        item.esSeleccionado = false;
                        vm.ac_proveedores_seleccionados.forEach(function (proveedores) {
                            if (proveedores.c_proveedor === item.c_proveedor)
                                item.esSeleccionado = true;
                        });
                    });
                }
            };

            /** FIN GESTION DE ITEMS SELECCIONADOS EN CATEGOGRAMA **/

            /*FILTRO DE REFERENCIAS: cuando no se ha seleccionado nada en el categograma, mostramos el formulario para filtrar referencias y agregarlas a una lista*/
            vm.get_referencia_filtro = function () {
                if (vm.obj_filtro_por_referencia.filtro_por_referencia !== "") {
                    gestionDescuentosService.getRefByFiltro(vm.obj_filtro_por_referencia.filtro_por_referencia)
                        .then(function (referencias) {
                            if (referencias.data.length > 0 && referencias.data[0].length > 0) {
                                vm.referencias_filtradas = referencias.data[0];
                            } else {
                                vm.referencias_filtradas = [];
                                toastr.error('No se encontraron referencias con el filtro ' + vm.obj_filtro_por_referencia.filtro_por_referencia);
                            }
                        });
                }
            };
            vm.limpiar_filtro_ref = function () {
                vm.obj_filtro_por_referencia.filtro_por_referencia = "";
                vm.referencias_filtradas = [];
                $timeout(function () {
                    vm.$apply();
                }, 0);
            };

            /* FIN FILTRO DE REFERENCIAS*/

            /*CHECKS ALL DE LAS TABLAS DEL CATEGOGRAMA*/
            vm.chkTodos_grupos = function () {
                if ($("#chkTodos_grupos")[0].checked) {
                    vm.ArrayGruposProductos.forEach(function (item) {
                        item.esSeleccionado = true;
                        vm.ac_grupos_seleccionados.push({
                            c_grupo: item.c_grupo
                        });
                    });
                } else {
                    vm.ArrayGruposProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                    });
                    vm.ac_grupos_seleccionados = [];
                    vm.ac_lineas_seleccionadas = [];
                    vm.ac_sublineas_seleccionadas = [];
                    vm.ac_referencias_seleccionadas = [];
                    vm.ac_proveedores_seleccionados = [];
                }
                $timeout(function () {
                    $rootScope.$apply();
                }, 1);
            };
            vm.chkTodos_lineas = function () {
                /*limpiamos el array que nos guarda las lineas seleccionadas*/
                vm.ac_lineas_seleccionadas = [];
                if ($("#chkTodos_lineas")[0].checked) {
                    vm.ArrayLineasProductos.forEach(function (item) {
                        item.esSeleccionado = true;
                        vm.ac_lineas_seleccionadas.push({
                            c_linea: item.c_linea,
                            c_grupo: item.c_grupo
                        });
                    });
                } else {
                    vm.ArrayLineasProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                    });
                    vm.ac_lineas_seleccionadas = [];
                    vm.ac_sublineas_seleccionadas = [];
                    vm.ac_referencias_seleccionadas = [];
                    vm.ac_proveedores_seleccionados = [];
                }
                $timeout(function () {
                    $rootScope.$apply();
                }, 1);
            };
            vm.chkTodos_sublineas = function () {
                /*limpiamos el array que nos guarda las sublineas seleccionadas*/
                vm.ac_sublineas_seleccionadas = [];
                var i;
                if ($("#chkTodos_sublineas")[0].checked) {
                    vm.ArraySubLineasProductos.forEach(function (item) {
                        item.esSeleccionado = true;
                        vm.ac_sublineas_seleccionadas.push({
                            c_grupo: item.c_grupo,
                            c_linea: item.c_linea,
                            c_sublinea: item.c_sublinea
                        });
                    });
                } else {
                    vm.ArraySubLineasProductos.forEach(function (item) {
                        item.esSeleccionado = false;
                    });
                    vm.ac_sublineas_seleccionadas = [];
                    vm.ac_referencias_seleccionadas = [];
                    vm.ac_proveedores_seleccionados = [];
                }
                $timeout(function () {
                    $rootScope.$apply();
                }, 1);
            };
            vm.chkTodos_proveedores = function () {
                /*limpiamos el array que nos guarda las referencias seleccionadas*/
                vm.ac_proveedores_seleccionados = [];
                if ($("#chkTodos_proveedores")[0].checked) {
                    vm.array_proveedores.forEach(function (item) {
                        item.esSeleccionado = true;
                        vm.ac_proveedores_seleccionados.push({
                            c_grupo: item.c_grupo,
                            c_linea: item.c_linea,
                            c_sublinea: item.c_sublinea,
                            referencia: item.referencia,
                            c_proveedor: item.c_proveedor
                        });
                    });
                } else {
                    vm.array_proveedores.forEach(function (item) {
                        item.esSeleccionado = false;
                    });
                    vm.ac_proveedores_seleccionados = [];
                }
                $timeout(function () {
                    $rootScope.$apply();
                }, 1);
            };
            /*** FIN CATEGOGRAMA ***/

            //#endregion
            vm.get_apps_disponibles = function () {
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_apps_disponibles/" + TreidConfigSrv.variables.idAplicacion + "/" + loginService.UserData.cs_IdUsuario).
                    then(function (result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            toastr.warning('No tiene maestros de aplicaciones disponibles!');
                            $rootScope.progressbar.reset();
                            $rootScope.CerrarSession.value = true;
                            vm.RedirectTo('/');
                            return;
                        }
                        vm.array_apps_disponibles = result.data.data[0];
                        for (var i = 0; i < vm.array_apps_disponibles.length; i++) {

                            if (vm.array_apps_disponibles[i].cs_id_opcion_aplicacion == vm.apps_maestros.id_appDescuentos) {
                                vm.apps_maestros.show_appDescuentos = true;
                            }
                        }

                        if (!vm.apps_maestros.show_appDescuentos) {
                            toastr.warning('No tiene acceso a este maestro. Comuniquese con el administrador');
                            $rootScope.CerrarSession.value = true;
                            $timeout(function () {
                                vm.RedirectTo('/');
                            }, 10);

                        }

                    }).catch(function (data) {
                        $scope.Error.value = true;
                    });
            };

            vm.verificar_existencia_ref = function () {
                if (vm.objFiltrosReferencias.c_referencia == "")
                    return;

                $rootScope.progressbar.start();
                $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "verificar_existencia_ref/", JSON.stringify({ referencia: vm.objFiltrosReferencias.c_referencia })).
                    then(function (result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            toastr.error('la referencia [' + vm.objFiltrosReferencias.c_referencia + '] no existe');
                            $rootScope.progressbar.reset();
                            return;
                        }
                        toastr.success(result.data.data[0][0].descripcion_referencia);
                        $rootScope.progressbar.complete();
                    }).catch(function (data) {
                        $scope.Error.value = true;
                    });
            };
            vm.get_ciudades = function () {
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_ciudades/").
                    then(function (result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            toastr.error('No se encontraron ciudades para el filtro');
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.array_ciudades = result.data.data[0];
                        for (var i = 0; i < vm.array_ciudades.length; i++) {
                            vm.array_ciudades[i].esSeleccionado = false;
                        }
                        $rootScope.progressbar.complete();
                    }).catch(function (data) {
                        $scope.Error.value = true;
                    });
            };
            vm.buscar_centros_operacion = function () {
                $("#chkTodos_ciudad")[0].checked = true;
                var acCiudades = "";
                var acDpto = "";
                var acPais = "";
                vm.ciudades_seleccionadas = [];
                for (var i = 0; i < vm.array_ciudades.length; i++) {
                    if (vm.array_ciudades[i].esSeleccionado == true) {
                        vm.ciudades_seleccionadas.push(vm.array_ciudades[i].d_ciudad);
                        acCiudades = acCiudades + "," + (vm.array_ciudades[i].c_ciudad).trim();
                        acDpto = acDpto + "," + (vm.array_ciudades[i].c_depto).trim();
                        acPais = acPais + "," + (vm.array_ciudades[i].c_pais).trim();
                    }
                }
                if (acCiudades == "") {
                    vm.ArrayCentroOperativo = [];
                    vm.centros_operacion.abierto = false;
                    $("#chkTodos_ciudad")[0].checked = false;
                    return;
                }
                var arrayCiudades = acCiudades.slice(1);
                var arrayDptos = acDpto.slice(1);
                var arrayPais = acPais.slice(1);
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_co_by_ciudades/" + arrayCiudades + "/" + arrayDptos + "/" + arrayPais).
                    then(function (result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            toastr.error('No se encontraron resultados');
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.ArrayCentroOperativo = result.data.data[0];
                        for (var i = 0; i < vm.ArrayCentroOperativo.length; i++) {
                            vm.ArrayCentroOperativo[i].esSeleccionado = false;
                            vm.ArrayCentroOperativo[i].d_ciudad = "(" + vm.ArrayCentroOperativo[i].d_ciudad.substring(0, 3) + ")";
                        }
                        if (!vm.centros_operacion.abierto) {
                            vm.centros_operacion.abierto = true;
                        }
                        $rootScope.progressbar.complete();
                    }).catch(function (data) {
                        $scope.Error.value = true;
                    });
            };
            vm.chkTodos_ciudad = function () {
                if ($("#chkTodos_ciudad")[0].checked) {
                    for (var i = 0; i < vm.array_ciudades.length; i++) {
                        vm.array_ciudades[i].esSeleccionado = true;
                    }
                    vm.buscar_centros_operacion();
                } else {
                    for (var i = 0; i < vm.array_ciudades.length; i++) {
                        vm.array_ciudades[i].esSeleccionado = false;
                    }
                    vm.ArrayCentroOperativo = [];
                    vm.centros_operacion.abierto = false;
                }
            };
            vm.chkTodos_co = function () {
                if ($("#chkTodos_co")[0].checked) {
                    for (var i = 0; i < vm.ArrayCentroOperativo.length; i++) {
                        vm.ArrayCentroOperativo[i].esSeleccionado = true;
                    }
                } else {
                    for (var i = 0; i < vm.ArrayCentroOperativo.length; i++) {
                        vm.ArrayCentroOperativo[i].esSeleccionado = false;
                    }
                }
            };
            vm.verificar_existencia_co = function () {
                if (vm.centros_operacion.abierto) {
                    if (vm.ArrayCentroOperativo.length == 0) {
                        $timeout(function () {
                            //alert("Debe seleccionar como minimo una ciudad para obtener los centros de operación");
                            toastr.warning("Debe seleccionar como minimo una ciudad para obtener los centros de operación");
                        }, 20);
                        $timeout(function () {
                            vm.centros_operacion.abierto = false;
                        }, 20);
                    }
                }
            };
            /*lo utilizo para cotrolar los CO checkeados y manejar sincronizacion con el check principal(el que selecciona a todos los CO)*/
            vm.co_checkeado = function () {
                var hay_seleccionados = false;
                for (var i = 0; i < vm.ArrayCentroOperativo.length; i++) {
                    if (vm.ArrayCentroOperativo[i].esSeleccionado) {
                        $("#chkTodos_co")[0].checked = true;
                        hay_seleccionados = true;
                    }
                }
                if (!hay_seleccionados)
                    $("#chkTodos_co")[0].checked = false;
            };
            vm.go_centro_operacion_list = function () {
                document.getElementById("filtroCO").focus();
                $timeout(function () {
                    document.getElementById("filtroCO").focus();
                }, 300);
            };
            vm.array_proveedores = [];
         
         
            vm.LimpiarFiltros = function () {
                vm.CentroOperacion.abierto = false;
                vm.ArrayCentroOperativo_filtro = [];
                vm.ArrayLineasProductos = [];
                vm.ArraySubLineasProductos = [];
                vm.co_filtrados = "";
                vm.co_consulta_dcto = "";
                vm.filtro_centro_operacion = "";
                vm.dcto_sugerido_global = 0;
                vm.dcto_maximo_global = 0;
                vm.showCiudades = false;
                vm.show_centro_operacion = false;
                vm.objFiltrosReferencias.c_referencia = "";
                vm.objFiltrosReferencias.idCO = null;
                vm.filtro_centro_operacion = "";
                vm.ciudades.abierto = false;
                vm.centros_operacion.abierto = false;
                vm.categograma.abierto = false;
                $("#filtroCiudad")[0].value = "";
                $("#filtroCO")[0].value = "";
                $("#filtroCO_id")[0].value = "";
                vm.filtroCO_id = "";
                vm.filtroCO = "";
                vm.filtroCiudad = "";
                $("#chkTodos_ciudad")[0].checked = false;
                vm.chkTodos_ciudad();
                vm.ArrayReferenciasProductos = [];
                vm.mostrar_btn_guardar.value = false;
                vm.show_check_todos.value = false;
                vm.ac_grupos_seleccionados = [];
                vm.ac_lineas_seleccionadas = [];
                vm.ac_sublineas_seleccionadas = [];
                vm.ac_proveedores_seleccionados = [];

                var campo_prov = $("#filtro_d_prov")[0];
                if (campo_prov !== undefined)
                    $("#filtro_d_prov")[0].value = "";

                var campo_id_prov = $("#filtro_id_prov")[0];
                if (campo_id_prov !== undefined)
                    $("#filtro_id_prov")[0].value = "";

                vm.filtro_id_prov = "";
                vm.filtro_d_prov = "";
                vm.showProveedores.value = false;
                vm.verGrupos();
                if (vm.mostrartabla != 0)
                    $("#chkTodos")[0].checked = false;

                /*se deseleccionan los grupos*/
                for (var i = 0; i < vm.ArrayGruposProductos.length; i++) {
                    vm.ArrayGruposProductos[i].esSeleccionado = false;
                }

                /*se deseleccionan los proveedores*/
                for (var i = 0; i < vm.array_proveedores.length; i++) {
                    vm.array_proveedores[i].esSeleccionado = false;
                }
                vm.mostrartabla = 0;
                $timeout(function () {
                    $rootScope.$apply(); //this triggers a $digest
                }, 1);

                $timeout(function () {
                    vm.showCiudades = true;
                    $timeout(function () {
                        $rootScope.$apply(); //this triggers a $digest
                    }, 1);
                    //vm.$apply();
                }, 800);
                $timeout(function () {
                    vm.show_centro_operacion = true;
                    $timeout(function () {
                        $rootScope.$apply(); //this triggers a $digest
                    }, 1);
                    //vm.$apply();
                }, 800);
            };
     
            vm.co_filtrados = "";
            vm.co_consulta_dcto = "";
            vm.buscar_referencias = function () {
                /*captura de los grupos seleccionados*/
                //#region
                var acGrupos = "";
                for (var i = 0; i < vm.ArrayGruposProductos.length; i++) {
                    if (vm.ArrayGruposProductos[i].esSeleccionado == true) {
                        acGrupos = acGrupos + "," + (vm.ArrayGruposProductos[i].c_grupo).trim();
                    }
                }
                if (acGrupos != "") {
                    var arrayGrupos = acGrupos.slice(1);
                }
                //#endregion
                /*captura de las lineas*/
                //#region
                var acLineas = "";
                for (var i = 0; i < vm.ArrayLineasProductos.length; i++) {
                    if (vm.ArrayLineasProductos[i].esSeleccionado == true) {
                        acLineas = acLineas + "," + (vm.ArrayLineasProductos[i].c_linea).trim();
                    }
                }
                if (acLineas != "") {
                    var arrayLineas = acLineas.slice(1);
                }
                //#endregion
                /*captura de las sublineas*/
                //#region
                var acSubLineas = "";
                for (var i = 0; i < vm.ArraySubLineasProductos.length; i++) {
                    if (vm.ArraySubLineasProductos[i].esSeleccionado == true) {
                        var codigoSublinea = vm.ArraySubLineasProductos[i].c_sublinea;
                        if (codigoSublinea != null)
                            codigoSublinea = codigoSublinea.trim();

                        acSubLineas = acSubLineas + "," + codigoSublinea;
                    }
                }
                if (acSubLineas != "") {
                    var arraySubLineas = acSubLineas.slice(1);
                }
                //#endregion
                /*captura de los CO seleccionados*/
                //#region
                var acCO = "";
                vm.centros_operacion_seleccionados = [];

                for (var i = 0; i < vm.ArrayCentroOperativo.length; i++) {
                    if (vm.ArrayCentroOperativo[i].esSeleccionado == true) {
                        var cod_CO = vm.ArrayCentroOperativo[i].c_centro_operacion;
                        vm.centros_operacion_seleccionados.push(vm.ArrayCentroOperativo[i]);

                        if (cod_CO != null)
                            cod_CO = cod_CO.trim();

                        acCO = acCO + "," + cod_CO;
                    }
                }
                if (acCO != "") {
                    var arrayCO = acCO.slice(1);
                }
                //#endregion

                /*captura de los proveedores seleccionados*/
                //#region
                var ac_proveedores = "";
                for (var i = 0; i < vm.array_proveedores.length; i++) {
                    if (vm.array_proveedores[i].esSeleccionado) {
                        var cod_Proveedor = vm.array_proveedores[i].c_proveedor;
                        if (cod_Proveedor != null)
                            cod_Proveedor = cod_Proveedor.trim();

                        ac_proveedores = ac_proveedores + "," + cod_Proveedor;
                    }
                }
                if (ac_proveedores != "") {
                    var array_proveedores = ac_proveedores.slice(1);
                }
                //#endregion

                if (arrayCO == "" || arrayCO == undefined) {
                    //arrayCO = null;
                    toastr.error('Debe seleccionar un centro de operación');
                    return;
                }

                /*array proveedores*/
                if (array_proveedores == "" || array_proveedores == undefined)
                    array_proveedores = null;

                if (vm.objFiltrosReferencias.c_referencia == "" && array_proveedores == null) {
                    vm.objFiltrosReferencias.c_referencia = null;

                    if (arrayGrupos == "" || arrayGrupos == undefined) {
                        toastr.error('Debe seleccionar minimo un grupo de referencia');
                        return;
                    }
                }

                if (vm.objFiltrosReferencias.c_referencia == "")
                    vm.objFiltrosReferencias.c_referencia = null;

                if (arrayGrupos == "" || arrayGrupos == undefined) {
                    arrayGrupos = null;
                }

                if (arrayLineas == "" || arrayLineas == undefined)
                    arrayLineas = null;

                if (arraySubLineas == "" || arraySubLineas == undefined)
                    arraySubLineas = null;

                var sw_dcto_activo = "";
                if (!vm.objFiltrosRef.sw_todo)
                    sw_dcto_activo = vm.objFiltrosRef.sw_activo ? 1 : 0;
                else {
                    sw_dcto_activo = 2;
                }

                vm.mostrartabla = 0;
                $rootScope.progressbar.start();
                $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "get_referencias_by_filtro/" + arrayGrupos + "/" + arrayLineas + "/" + arraySubLineas + "/" + sw_dcto_activo + "/" + array_proveedores, JSON.stringify({ referencia: vm.objFiltrosReferencias.c_referencia, arrayCO: arrayCO })).
                    then(function (result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            toastr.error('No se encontraron resultados');
                            $rootScope.progressbar.reset();
                            return;
                        }
                        //limpiamos los campos de copiado a centro de operacion y dsctos max, sug
                        vm.filtro_centro_operacion = "";
                        vm.dcto_sugerido_global = 0;
                        vm.dcto_maximo_global = 0;
                        vm.ArrayCentroOperativo_filtro = [];
                        
                        vm.mostrartabla = 0;
                        vm.ArrayReferenciasProductos = result.data.data[0];
                        vm.show_check_todos.value = true;
                        $timeout(function () {
                            var el = document.getElementById('btnFiltros');
                            angular.element(el).trigger('click');
                        }, 0);
                        document.getElementById("btnFiltros").focus();
                        $timeout(function () {
                            document.getElementById("btnFiltros").focus();
                        }, 300);
                        vm.mostrar_btn_guardar.value = true;
                        $rootScope.progressbar.complete();

                        /*activar la tabla que muestra las refencias*/
                        $timeout(function () {
                            vm.mostrartabla = 1;
                        }, 300);

                        /* obtenemos los centros de operacion que no hayan filtrado en la consulta*/
                        var array_co_consultado = [];
                        vm.ArrayReferenciasProductos.forEach(function (item) {
                            array_co_consultado.push(item.c_centro_operacion);
                        });

                        vm.co_filtrados = _.uniq(array_co_consultado);

                        if (vm.co_filtrados.length === 1)
                            vm.co_consulta_dcto = vm.co_filtrados[0];

                        $timeout(function() {
                            vm.$apply();
                        }, 0);

                    }).catch(function (data) {
                        $scope.Error.value = true;
                    });
            };
            vm.seleccionarTodos = function () {
                if ($("#chkTodos")[0].checked) {
                    for (var i = 0; i < vm.ArrayReferenciasProductos.length; i++) {
                        vm.ArrayReferenciasProductos[i].esSeleccionado = true;
                    }
                } else {
                    for (var i = 0; i < vm.ArrayReferenciasProductos.length; i++) {
                        vm.ArrayReferenciasProductos[i].esSeleccionado = false;
                    }
                }
                $timeout(function () {
                    $rootScope.$apply(); //this triggers a $digest
                }, 1);
                //vm.$apply();
            };
         
            vm.chkTodos_DctoActivo = function () {
                if ($("#chkDctoActivo")[0].checked) {
                    for (var i = 0; i < vm.ArrayReferenciasProductos.length; i++) {
                        vm.ArrayReferenciasProductos[i].sw_activo = true;
                    }
                } else {
                    for (var i = 0; i < vm.ArrayReferenciasProductos.length; i++) {
                        vm.ArrayReferenciasProductos[i].sw_activo = false;
                    }
                }
                $timeout(function () {
                    $rootScope.$apply();
                }, 1);
            };
            vm.guardar_cambios = function () {
                vm.referencias_actualizadas = [];
                vm.objRef_co = {
                    co: [],
                    ref: []
                };
                /*selecciono las referencias que estan checkeadas en la tabla*/
                for (var i = 0; i < vm.ArrayReferenciasProductos.length; i++) {
                    if (vm.ArrayReferenciasProductos[i].esSeleccionado) {
                        vm.objRef_co.ref.push(vm.ArrayReferenciasProductos[i]);
                    }
                }

                if (vm.objRef_co.ref.length < 1) {
                    toastr.warning("No hay referencias seleccionadas por guardar");
                    return;
                }

                for (var j = 0; j < vm.objRef_co.ref.length; j++) {

                    if (vm.objRef_co.ref[j].pj_dscto_maximo === undefined || vm.objRef_co.ref[j].pj_dscto_maximo === "") {
                        vm.objRef_co.ref[j].pj_dscto_maximo = 0;
                    }
                    if (vm.objRef_co.ref[j].pj_dscto_sugerido === undefined || vm.objRef_co.ref[j].pj_dscto_sugerido === "") {
                        vm.objRef_co.ref[j].pj_dscto_sugerido = 0;
                    }

                }
                $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "update_datos_ref/" + loginService.UserData.cs_IdUsuario, JSON.stringify(vm.objRef_co)).
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
                        } else {
                            toastr.warning(result.data.MSG);
                            return;
                        }
                    }).catch(function (data) {
                        $scope.Error.value = true;
                    });
            };
            vm.aplicar_dcto_sugerido_global = function () {

                if (vm.dcto_sugerido_global === undefined || vm.dcto_sugerido_global === "") {
                    vm.dcto_sugerido_global = 0;
                }

                alertify.confirm('Va a aplicar el dcto sugerido de ' + vm.dcto_sugerido_global + '% a todas las referencias!.\n  Desea continuar?',
                    function () {
                        console.log("aceptó");
                        var sw_no_aplico_dcto_sug_global = false;
                        var cont_dcto_sug_aplicado = 0;
                        for (var i = 0; i < vm.ArrayReferenciasProductos.length; i++) {

                            if (parseInt(vm.dcto_sugerido_global) <= parseInt(vm.ArrayReferenciasProductos[i].pj_dscto_maximo)) {
                                vm.ArrayReferenciasProductos[i].pj_dscto_sugerido = parseInt(vm.dcto_sugerido_global);
                                cont_dcto_sug_aplicado++;
                            } else {
                                sw_no_aplico_dcto_sug_global = true;
                            }
                        }

                        if (sw_no_aplico_dcto_sug_global) {
                            if (cont_dcto_sug_aplicado != 0) {
                                toastr.warning('No se aplicó dcto sugerido ' + vm.dcto_sugerido_global + '% a algunas referencias por ser éste mayor al dcto máximo');
                            } else {
                                toastr.error('No se aplicó dcto sugerido ' + vm.dcto_sugerido_global + '% a las referencias por ser éste mayor al dcto máximo');
                            }
                        } else {
                            toastr.info('Se aplicó dcto sugerido ' + vm.dcto_sugerido_global + '% a todas las referencias correctamente');
                        }
                        $timeout(function () {
                            vm.$apply();
                        });
                    },
                    function () {
                        console.log("canceló");
                        return;
                    });
            };
            vm.aplicar_dcto_maximo_global = function () {
                if (vm.dcto_maximo_global === undefined || vm.dcto_maximo_global === "") {
                    vm.dcto_maximo_global = 0;
                }

                alertify.confirm('Va a aplicar el dcto maximo de ' + vm.dcto_maximo_global + '% a todas las referencias!.\n  Desea continuar?',
                    function () {
                        console.log("aceptó");
                        var sw_no_aplico_dcto_max_global = false;
                        var cont_dcto_max_aplicado = 0;
                        for (var i = 0; i < vm.ArrayReferenciasProductos.length; i++) {
                            if (parseInt(vm.dcto_maximo_global) >= parseInt(vm.ArrayReferenciasProductos[i].pj_dscto_sugerido)) {
                                vm.ArrayReferenciasProductos[i].pj_dscto_maximo = parseInt(vm.dcto_maximo_global);
                                cont_dcto_max_aplicado++;
                            } else {
                                sw_no_aplico_dcto_max_global = true;
                            }
                        }

                        if (sw_no_aplico_dcto_max_global) {
                            if (cont_dcto_max_aplicado != 0) {
                                toastr.warning('No se aplicó dcto máximo ' + vm.dcto_maximo_global + '% a algunas referencias por ser éste menor al dcto sugerido');
                            } else {
                                toastr.error('No se aplicó dcto máximo ' + vm.dcto_maximo_global + '% a las referencias por ser éste menor al dcto sugerido');
                            }

                        } else {
                            toastr.info('Se aplicó dcto máximo ' + vm.dcto_maximo_global + '% a todas las referencias correctamente');
                        }

                        $timeout(function () {
                            vm.$apply();
                        });
                    },
                    function () {
                        console.log("canceló");
                        return;
                    });
            };

            vm.validar_dcto_sug = function (ref) {
                if (parseInt(ref.pj_dscto_sugerido) > parseInt(ref.pj_dscto_maximo)) {
                    ref.pj_dscto_sugerido = ref.pj_dscto_maximo;
                }

                if (parseInt(ref.pj_dscto_sugerido) < 0) {
                    ref.pj_dscto_sugerido = 0;
                }

                if (parseInt(ref.pj_dscto_sugerido) > 100) {
                    ref.pj_dscto_sugerido = 100;
                }
                if (ref.pj_dscto_sugerido === "" || ref.pj_dscto_sugerido === undefined)
                    ref.pj_dscto_sugerido = 0;
            };
            vm.validar_dcto_max = function (ref) {
                if (parseInt(ref.pj_dscto_maximo) < parseInt(ref.pj_dscto_sugerido)) {
                    ref.pj_dscto_maximo = ref.pj_dscto_sugerido;
                }

                if (parseInt(ref.pj_dscto_maximo) < 0) {
                    ref.pj_dscto_maximo = 0;
                }

                if (parseInt(ref.pj_dscto_maximo) > 100) {
                    ref.pj_dscto_maximo = 100;
                }
                if (ref.pj_dscto_maximo === "" || ref.pj_dscto_maximo === undefined)
                    ref.pj_dscto_maximo = 0;
            };

            vm.ArrayCentroOperativo_filtro = [];
            vm.filtro_centro_operacion = "";
            vm.CentroOperacion = {
                value: false
            };
            vm.getCentroOperacion_filtro = function () {
                if (vm.filtro_centro_operacion == "" || vm.filtro_centro_operacion == undefined) {
                    vm.CentroOperacion.abierto = false;
                    vm.ArrayCentroOperativo_filtro = [];
                    return;
                }
                gestionDescuentosService.getCentroOperativoFiltro(vm.filtro_centro_operacion)
                    .then(function (centros_operacion) {
                        if (centros_operacion.data.length > 0 && centros_operacion.data[0].length > 0) {
                            vm.ArrayCentroOperativo_filtro = centros_operacion.data[0];
                            vm.CentroOperacion.abierto = true;
                        } else {
                            vm.CentroOperacion.abierto = false;
                            vm.ArrayCentroOperativo_filtro = [];
                            toastr.error('No se encontraron resultados con la palabra clave [ ' + vm.filtro_centro_operacion + ' ]');
                            vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino = "";
                            vm.filtro_centro_operacion = "";
                        }
                    });
            };
            vm.cargarCO = function (item) {
                vm.filtro_centro_operacion = item.c_centro_operacion;
                vm.CentroOperacion.abierto = false;
                vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino = item.c_centro_operacion;
            };

            vm.obj_copia_dcto_centro_operacion = {
                c_centro_operacion_origen: "",
                c_centro_operacion_destino: ""
            }
            vm.copy_dctos_to_co = function () {
                vm.obj_copia_dcto_centro_operacion.c_centro_operacion_origen = vm.co_consulta_dcto;
                if (vm.obj_copia_dcto_centro_operacion.c_centro_operacion_origen === "" || vm.obj_copia_dcto_centro_operacion.c_centro_operacion_origen === undefined || vm.obj_copia_dcto_centro_operacion.c_centro_operacion_origen === null) {
                    toastr.error("Ocurrió un error al obtener el centro de operaciónes origen. Comuniquese con el admin");
                    return;
                }
                if (vm.filtro_centro_operacion === "")
                    vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino = "";
                else {
                    vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino = vm.filtro_centro_operacion;
                }
                if (vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino === undefined || vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino === "") {
                    toastr.error("Debe ingresar el centro de operaciones de destino");
                    return;
                }
                var co_existente = vm.ArrayCentroOperativo_filtro.filter(function (item) {
                    return item.c_centro_operacion == vm.filtro_centro_operacion;
                });
                if (co_existente.length === 0) {
                    toastr.error('El centro de operaciones [ ' + vm.filtro_centro_operacion + ' ] no existe');
                    vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino = "";
                    return;
                }
                vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino = vm.filtro_centro_operacion;

                alertify.confirm('Va a aplicar el dcto máximo del centro de operaciónes ' + vm.obj_copia_dcto_centro_operacion.c_centro_operacion_origen + ' al centro de operaciónes ' + vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino + '.\n  Desea continuar?',
                function () {
                    vm.ArrayReferenciasProductos.forEach(function (item) {
                        if (item.pj_dscto_maximo === undefined || item.pj_dscto_maximo === "") {
                            item.pj_dscto_maximo = 0;
                        }
                        if (item.pj_dscto_sugerido === undefined || item.pj_dscto_sugerido === "") {
                            item.pj_dscto_sugerido = 0;
                        }
                    });
                    var referencias_por_guardar = {
                        ref: [],
                        list_ref: "",
                        c_centro_operacion_destino: vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino
                    }

                    referencias_por_guardar.ref = vm.ArrayReferenciasProductos.filter(function (item) {
                        return item.pj_dscto_maximo !== 0 || item.pj_dscto_maximo !== 0;
                    });

                    var array_c_referencias = [];
                    referencias_por_guardar.ref.forEach(function (item) {
                        //item.c_centro_operacion = vm.obj_copia_dcto_centro_operacion.c_centro_operacion_destino;
                        array_c_referencias.push(item.referencia.trim());
                    });

                    referencias_por_guardar.list_ref = array_c_referencias.join(",");
              
                    if (referencias_por_guardar.ref.length === 0) {
                        toastr.info("No se encontraron descuentos pendientes por almacenar");
                        $timeout(function () {
                            toastr.info("Recuerde que las referencias con % dscto sugerido y % dscto máximo en [ 0 ], no serán almacenadas");
                        }, 1900);
                        return;
                    }

                    $rootScope.progressbar.start();
                    $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "copy_data_ref_to_co/" + loginService.UserData.cs_IdUsuario, JSON.stringify(referencias_por_guardar)).
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
                                $rootScope.progressbar.reset();
                                return;
                            }
                            if (result.data.MSG == "GUARDADO") {
                                toastr.success('Registro almacenado correctamente');
                                $rootScope.progressbar.complete();
                            } else {
                                toastr.warning(result.data.MSG);
                                $rootScope.progressbar.reset();
                                return;
                            }
                        }).catch(function (data) {
                            $rootScope.progressbar.reset();
                        });
                },
                function () {
                    console.log("canceló");
                    return;
                });
            }
            /*inicialización de metodos*/
            vm.get_apps_disponibles();
            vm.get_ciudades();
            vm.getGruposProductos();
            vm.get_proveedores();
        };

        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('serviceLogIn');
        if (vm.cookieUser != null) {
            if (vm.cookieUser.hasSession && vm.cookieUser.UserData.cs_IdUsuario == loginService.UserData.cs_IdUsuario) {
                if ($location.$$path == "/GestionDescuentos") {

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
                            $rootScope.actualPage = "/GestionDescuentos";
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

