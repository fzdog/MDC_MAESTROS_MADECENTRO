(function () {
    'use strict';
    // angular.module('appmadecentro').controller('HomeCtrl', ['$scope', 'loginService', '$location', '$http', 'TreidConfigSrv', '$rootScope', function($scope, loginService, $location, $http, TreidConfigSrv, $rootScope) {
    angular.module('appmadecentro')
        .controller('HomeCtrl', ['$scope', 'loginService', '$location', '$http', 'TreidConfigSrv', '$rootScope', 'blockUI', function ($scope, loginService, $location, $http, TreidConfigSrv, $rootScope, blockUI) {
            console.log('entro al Ctrl Home');
            $scope.ShowSelectSucursalesPopup = {
                value: false
            };

            $scope.SucursalSelected = {
                NombreSucursal: "",
                CodigoSucursal: "",
                idSucursal:""
            };
            
            // Variables globales
            $scope.is_nueva_direccion = false;
            $scope.SucursalArray = [];
            $scope.pais_global = null;
            $scope.departamento_global = null;
            $scope.municipio_global = null;
            $scope.permite_editar_documento = false;
            $scope.DNS = TreidConfigSrv.variables.IP_servidor; //Dominio
            $scope.URL_TICKETS = null;
            $scope.ruta_imagenes_calificacion_pqrs = $scope.DNS + "Tickets/Assets/img/";
            $scope.lista_centros_operaciones = [];
            $scope.show_pqrs = false; 
            $scope.total_pqrs_abiertas = 0;
            $scope.total_pqrs_cerradas = 0;
            $scope.total_pqrs_totales = 0;
            moment.locale("es");
            $scope.toolstips_fecha_cumpleanios = "";
            $scope.sw_global_indica_requiere_datos_clientes = "false";
            $rootScope.show_primer_modulo = false;
            $scope.puede_crear_comentario_PQRS = true;
            $scope.idConectorSeisaClienteOcasionales = 1;
            $scope.direccion_mostrar = null;

            if (loginService.hasSession) {
                if ($location.$$path == "/home") {
                    $scope.$parent.$parent.SucursalToDisplay.NombreSucursal = loginService.UserData.Sucursales;
                    $scope.cs_id_usuario = loginService.UserData.cs_IdUsuario;
                    $scope.$parent.$parent.Usuario.UserName = loginService.UserData.UserName;
                } else {
                    $location.path($location.$$path);
                }
            } else {
                $rootScope.$$childHead.showmodal = true;
            }
            //*** CLIENTES
            $scope.Cliente = {
                paisdepartmunic_dir_casa : {
                    id_pais: null,
                    id_depart: null,
                    id_municipio: null,
                    descripcion_pais: null,
                    descripcion_depart: null,
                    descripcion_municipio: null,
                },
                paisdepartmunic_dir_trabajo : {
                    id_pais: null,
                    id_depart: null,
                    id_municipio: null,
                    descripcion_pais: null,
                    descripcion_depart: null,
                    descripcion_municipio: null,
                },
                paisdepartmunic_dir_entrega : {
                    id_pais: null,
                    id_depart: null,
                    id_municipio: null,
                    descripcion_pais: null,
                    descripcion_depart: null,
                    descripcion_municipio: null,
                },
                Tipo_documento: null,
                tipo_cliente: null,
                image_tipo_cliente: null,
                this_cs_tipo_cliente: null,
                documento: null,
                nombres: null,
                apellidos: null,
                sexo: null,
                dia_nacimiento: null,
                mes_nacimiento: null,
                anio_nacimiento: null,
                rango_edad: null,
                foto: null,
                celular: null,
                correo: null,
                direccion_casa: null,
                direccion_trabajo: null,
                direccion_entrega: null,
                telefono_casa: null,
                telefono_trabajo: null,
                id_current_user: null,
                fecha_ultima_modificacion: null,
                fecha_crecion: null,
                Nombre_usuario_ultima_modificacion: null,
                observacion_dir_casa: null,
                observacion_dir_trabajo: null,
                observacion_dir_entrega: null,
                observacion_tel_casa: null,
                observacion_tel_trabajo: null,
                observacion_celular: null,
                Lista_contactos_clientes: [],
                digito_verificacion: null,
            };
            $scope.show_contacto = false;

            $scope.isnit = function () {
                if ($scope.Cliente.Tipo_documento === "1") {
                    
                    //*** Consulto si el tipo es NIT, para validar he impedir que es documento tenga letras
                    var var_documento = Number($scope.Cliente.documento);
                    var is_numero = isNaN(var_documento);
                    if (is_numero) {
                        angular.showWarning('El NIT no puede tener letras. Rectifique por favor.');
                        $scope.data_cliente.numero_identificacion = null;
                        $scope.Cliente.documento = null;
                    } else {
                        $scope.show_contacto = true;
                    }
                } else {
                    $scope.show_contacto = false;
                }
                $scope.calcular_digito_verificacion();
            };

            $scope.obj_contacto_cliente = {
                id_cliente: null, // id del cliente al q va a estar enlazado
                id_usuario: null,
                documento: null,
                nombres: null,
                apellidos: null,
                celular: null,
                correo: null,
                dominio: null,
                cargo: null,
                id_ram_contacto: null
            };

            $scope.get_data_parametros_sistema = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_data_parametros_sistema", JSON.stringify()).
                    then(function (result) {
                        if (result === null) return;
                        if (result.data === null) return;
                        if (result.data.data[0].length < 1) return;
                        $scope.URL_TICKETS = result.data.data[1][0].vr_parametro;
                        $scope.imagen_genero = $scope.DNS + "SGD/CRM/TGE/SIN_ASIGNAR.png";
                    }).catch(function (data) {
                        $scope.Error.value = true;
                    });
            }
            
            $scope.permite_guardar_contactos = function () {
                $scope.permite_guardar = true;
                $scope.msn = "Los campos marcados con (*) son de caracter obligatorios. \n";

                if ($scope.obj_contacto_cliente.documento != null && $scope.obj_contacto_cliente.documento != "null" && $scope.obj_contacto_cliente.documento != "") {
                    if ($scope.obj_contacto_cliente.documento.length < 7) {
                        $scope.permite_guardar = false;
                        $scope.msn += "* El documento del contacto debe tener al menos 7 caracteres. Verifique por favor.\n";
                    } else {
                        if ($scope.numero_coincidencias($scope.obj_contacto_cliente.documento) < 4) return;
                    }
                }
                if ($scope.obj_contacto_cliente.nombres == null || $scope.obj_contacto_cliente.nombres == "null" || $scope.obj_contacto_cliente.nombres == "") {
                    $scope.permite_guardar = false;
                    $scope.msn += "* El campo nombres del contacto es requerido. \n";
                }
                if ($scope.obj_contacto_cliente.apellidos == null || $scope.obj_contacto_cliente.apellidos == "null" || $scope.obj_contacto_cliente.apellidos == "") {
                    $scope.permite_guardar = false;
                    $scope.msn += "* El campo apellidos del contacto es requerido. \n";
                }
                if ($scope.obj_contacto_cliente.cargo == null || $scope.obj_contacto_cliente.cargo == "null" || $scope.obj_contacto_cliente.cargo == "") {
                    $scope.permite_guardar = false;
                    $scope.msn += "* El campo cargo del contacto es requerido. \n";
                }
                if ($scope.obj_contacto_cliente.celular != null && $scope.obj_contacto_cliente.celular != "null" && $scope.obj_contacto_cliente.celular != "") {
                    if ($scope.obj_contacto_cliente.celular.length < 10) {
                        $scope.permite_guardar = false;
                        $scope.msn += "* El campo celular no puede tener menos de 10 caracteres. \n";
                    }
                }
                //"
                $scope.msn += "Por favor rectificar.";
                if (!$scope.permite_guardar) {
                    angular.showWarning($scope.msn);
                }
                return $scope.permite_guardar;
            }
            $scope.lista_contactos = [];
            $scope.consecutivo_id_ram_contacto = 0;
            $scope.agregar_contacto = function () {
                var format_correo = null;
                if ($scope.obj_contacto_cliente.correo != null && $scope.obj_contacto_cliente.correo != "" && $scope.obj_contacto_cliente.correo != "null")
                {
                    if ($scope.obj_contacto_cliente.dominio != null && $scope.obj_contacto_cliente.dominio != "null" && $scope.obj_contacto_cliente.dominio != "") {
                        format_correo = $scope.obj_contacto_cliente.correo + "@" + $scope.obj_contacto_cliente.dominio;
                        if (!$scope.mail_correcto(format_correo)) return;
                    } else {
                        angular.showWarning("Error: La dirección de correo es incorrecta y/o incompleta.");
                        return;
                    }
                }
                if ($scope.obj_contacto_cliente.dominio != null && $scope.obj_contacto_cliente.dominio != "null" && $scope.obj_contacto_cliente.dominio != "") {
                    if ($scope.obj_contacto_cliente.correo != null && $scope.obj_contacto_cliente.correo != "" && $scope.obj_contacto_cliente.correo != "null")
                    {
                        format_correo = $scope.obj_contacto_cliente.correo + "@" + $scope.obj_contacto_cliente.dominio;
                        if (!$scope.mail_correcto(format_correo)) return;
                    } else {
                        angular.showWarning("Error: La dirección de correo es incorrecta y/o incompleta.");
                        return;
                    }
                }
                if ($scope.lista_contactos == null) {
                    $scope.lista_contactos = [];
                }
                if (!$scope.permite_guardar_contactos()) return;
                if (!$scope.actualizo_contacto_existe($scope.obj_contacto_cliente)) {
                    $scope.consecutivo_id_ram_contacto++;
                    $scope.obj_contacto_cliente = {
                        // 'N' indicando que es un nuevo registro.
                        id_ram_contacto: "N" + $scope.consecutivo_id_ram_contacto,
                        id_cliente: ($scope.obj_contacto_cliente.id_cliente == null || $scope.obj_contacto_cliente.id_cliente == "" || $scope.obj_contacto_cliente.id_cliente == "null") ? "" : $scope.obj_contacto_cliente.id_cliente, // id del cliente al q va a estar enlazado
                        id_usuario: ($scope.obj_contacto_cliente.id_usuario == null || $scope.obj_contacto_cliente.id_usuario == "" || $scope.obj_contacto_cliente.id_usuario == "null") ? "" : $scope.obj_contacto_cliente.id_usuario,
                        documento: ($scope.obj_contacto_cliente.documento == null || $scope.obj_contacto_cliente.documento == "" || $scope.obj_contacto_cliente.documento == "null") ? "" : $scope.obj_contacto_cliente.documento,
                        nombres: ($scope.obj_contacto_cliente.nombres == null || $scope.obj_contacto_cliente.nombres == "" || $scope.obj_contacto_cliente.nombres == "null") ? "" : $scope.obj_contacto_cliente.nombres,
                        apellidos: ($scope.obj_contacto_cliente.apellidos == null || $scope.obj_contacto_cliente.apellidos == "" || $scope.obj_contacto_cliente.apellidos == "null") ? "" : $scope.obj_contacto_cliente.apellidos,
                        celular: ($scope.obj_contacto_cliente.celular == null || $scope.obj_contacto_cliente.celular == "" || $scope.obj_contacto_cliente.celular == "null") ? "" : $scope.obj_contacto_cliente.celular,
                        correo: ($scope.obj_contacto_cliente.correo == null || $scope.obj_contacto_cliente.correo == "" || $scope.obj_contacto_cliente.correo == "null") ? "" : $scope.obj_contacto_cliente.correo,
                        dominio: ($scope.obj_contacto_cliente.dominio == null || $scope.obj_contacto_cliente.dominio == "" || $scope.obj_contacto_cliente.dominio == "null") ? "" : $scope.obj_contacto_cliente.dominio,
                        cargo: ($scope.obj_contacto_cliente.cargo == null || $scope.obj_contacto_cliente.cargo == "" || $scope.obj_contacto_cliente.cargo == "null") ? "" : $scope.obj_contacto_cliente.cargo,
                        correo_completo: ($scope.obj_contacto_cliente.correo == null || $scope.obj_contacto_cliente.correo == "" || $scope.obj_contacto_cliente.correo == "null"
                                            || $scope.obj_contacto_cliente.dominio == null || $scope.obj_contacto_cliente.dominio == "" || $scope.obj_contacto_cliente.dominio == "null")
                                            ? null : $scope.obj_contacto_cliente.correo + "@" + $scope.obj_contacto_cliente.dominio 
                    };
                    $scope.lista_contactos.push($scope.obj_contacto_cliente);
                    //$scope.var_global_contacto_seleccionado = null;
                }
                $scope.limpiar_campos_contactos();
                $scope.var_global_contacto_seleccionado = null;
            };
            $scope.actualizo_contacto_existe = function (obj_contacto) {
                if ($scope.lista_contactos == null) {
                    $scope.lista_contactos = [];
                }
                for (var i = 0; i < $scope.lista_contactos.length; i++){
                    var contacto = $scope.lista_contactos[i];
                    if (/*contacto.documento == obj_contacto.documento
                        && */contacto.id_ram_contacto == $scope.var_global_contacto_seleccionado
                        /*&& contacto.documento == obj_contacto.documento */) {
                        obj_contacto.id_ram_contacto = contacto.id_ram_contacto;
                        $scope.lista_contactos[i] = obj_contacto;
                        return true;
                    }
                }
                $scope.var_global_contacto_seleccionado = null;
                return false;
            }
            $scope.var_global_contacto_seleccionado = null;
            $scope.carga_obj_contactos_cliente = function (obj_contacto) {
                $scope.var_global_contacto_seleccionado = obj_contacto.id_ram_contacto;
                $scope.obj_contacto_cliente = {
                    id_cliente: obj_contacto.id_cliente, // id del cliente al q va a estar enlazado
                    id_usuario: obj_contacto.id_usuario,
                    documento: obj_contacto.documento,
                    nombres: obj_contacto.nombres,
                    apellidos: obj_contacto.apellidos,
                    celular: obj_contacto.celular,
                    correo: obj_contacto.correo,
                    dominio: obj_contacto.dominio,
                    cargo: obj_contacto.cargo,
                    correo_completo: obj_contacto.correo_completo
                };
            };
            $scope.limpiar_campos_contactos = function () {
                $scope.obj_contacto_cliente = {
                    id_cliente: null, // id del cliente al q va a estar enlazado
                    id_usuario: null,
                    documento: null,
                    nombres: null,
                    apellidos: null,
                    celular: null,
                    correo: null,
                    dominio: null,
                    cargo: null                
                };
                $scope.var_global_contacto_seleccionado = null;
            };
            $scope.cerrar_modal_PQRS = function(){
                $scope.var_global_contacto_seleccionado = null;
            }
            $scope.Tipo_documento = {
                id: null,
                descripcion: null
            };
            $scope.Tipos_documentos = [];
            $scope.data_cliente = {
                numero_identificacion : null,
                nombre_cliente : null,
            };        
            $scope.mail_correcto = function (correo) {
                $scope.expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (!$scope.expr.test(correo)) {
                    angular.showWarning("Error: La dirección de correo es incorrecta.");
                    return false;
                }
                return true;
            };
            $scope.var_id_cliente = null;
            $scope.var_id_usuario = null;
            $scope.Crear_cliente = function () {
                var Cliente = $scope.Cliente;
                $scope.objectDialog.LoadingDialog('Guardando...');
                if (Cliente.documento == null || Cliente.documento == "null" || Cliente.documento == "") {
                    angular.showWarning("Los campos marcados con * son obligatorios. Rectifique por favor.");
                }
                if (!$scope.validacion_permite_campos_requeridos()) return;
                if (Cliente.paisdepartmunic_dir_entrega.id_depart == null && Cliente.paisdepartmunic_dir_entrega.id_municipio == null
                    && $scope.GLOBAL_paisdepartmunic_dir_entrega.id_depart != null && $scope.GLOBAL_paisdepartmunic_dir_entrega.id_municipio != null)
                {
                    Cliente.paisdepartmunic_dir_entrega = $scope.GLOBAL_paisdepartmunic_dir_entrega;
                }
                if (Cliente.rango_edad == "null" || Cliente.rango_edad == NaN) {
                    Cliente.rango_edad = null;
                }
                Cliente.tipo_cliente = Cliente.this_cs_tipo_cliente; // se la asigno a la variable dado que esta es la que recive el SP
                if (Cliente.correo == "" || Cliente.correo == null) {
                    Cliente.correo == null;
                }
                if (Cliente.anio_nacimiento == "null" || Cliente.anio_nacimiento == NaN) {
                    Cliente.anio_nacimiento = null;
                }
                if (Cliente.mes_nacimiento == "null" || Cliente.mes_nacimiento == NaN) {
                    Cliente.mes_nacimiento = null;
                }
                if (Cliente.dia_nacimiento == "null" || Cliente.dia_nacimiento == NaN) {
                    Cliente.dia_nacimiento = null;
                }
                Cliente.id_current_user = $scope.cs_id_usuario;
                Cliente.digito_verificacion = ($scope.digito_verificacion === "-") ? null : $scope.digito_verificacion;
                if (Cliente.direccion_casa !== null && Cliente.direccion_casa !== "null" && Cliente.direccion_casa !== "") {
                    Cliente.direccion_casa = Cliente.direccion_casa.split("(")[0].trim();
                }
                if (Cliente.direccion_trabajo !== null && Cliente.direccion_trabajo !== "null" && Cliente.direccion_trabajo !== "") {
                    Cliente.direccion_trabajo = Cliente.direccion_trabajo.split("(")[0].trim();
                }
                if (Cliente.direccion_entrega !== null && Cliente.direccion_entrega !== "null" && Cliente.direccion_entrega !== "") {
                    Cliente.direccion_entrega = Cliente.direccion_entrega.split("(")[0].trim();
                }
                var s = Cliente.sexo;
                if (Cliente.sexo === "null" || Cliente.sexo === "") {
                    Cliente.sexo = null;
                }
                // asigno los contactos del cliente
                Cliente.Lista_contactos_clientes = $scope.lista_contactos;
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "Crearcliente", JSON.stringify(Cliente), {
                }).then(function (result) {
                    //***
                    $scope.permite_editar_documento = false;
                    $scope.var_id_cliente = result.data.OUT_ID_CLIENTE;
                    $scope.var_id_usuario = $scope.cs_id_usuario;
                    if ($scope.show_contacto) {
                        $scope.Crear_contactos();
                    }
                    if (result.data.MSG == "GUARDADO") {
                        //*** consulto si el cliente existe en unoee  11048647100
                        $scope.consulta_cliente_unoee($scope.Cliente);  // 
                    } else {
                        angular.showAlert('Ha ocurrido un problema con tu conexion al servidor, por favor intenta de nuevo o ponte en contacto con el administrador del sistema.');
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            //*** valido si el cliente existe en UnoEE para crearlo tambien o solo actualizar la data
            $scope.consulta_cliente_unoee = function(cliente){
                $http.post(TreidConfigSrv.ApiUrls.UrlNuevaOrdenNodejs + "consulta_cliente_unoee", JSON.stringify(cliente), {
                }).then(function (result) {
                    var existe = result.data.EXISTE;
                    $scope.consulta_conexion_unoee();
                    $scope.inserta_cliente_unoee(existe); // 0 Guardar, 1 Actualiza 
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.limpiar_formulario_contactos = function () {
                $scope.obj_contacto_cliente = {
                    id_cliente: null, // id del cliente al q va a estar enlazado
                    id_usuario: null,
                    documento: null,
                    nombres: null,
                    apellidos: null,
                    celular: null,
                    correo: null,
                    dominio: null,
                    cargo: null
                };
            };
            $scope.Crear_contactos = function () {
                if ($scope.lista_contactos == null)
                    return;
                if ($scope.lista_contactos.length > 0) {
                    for (var i = 0; i < ($scope.lista_contactos.length) ; i++) {
                        var contacto = $scope.lista_contactos[i];
                        contacto.id_cliente = $scope.var_id_cliente;
                        contacto.id_usuario = $scope.cs_id_usuario;
                        if (contacto.correo == null || contacto.correo == "") {
                            contacto.correo = null;
                        } else {
                            contacto.correo += "@" + contacto.dominio;
                        }
                        if (contacto.celular == "" || contacto.celular == "null" || contacto.celular == null) {
                            contacto.celular = null;
                        }
                        if (contacto.documento == "" || contacto.documento == "null" || contacto.documento == null) {
                            contacto.documento = null;
                        }
                        if (contacto.id_ram_contacto != null) {
                            for (var f = 0; f < contacto.id_ram_contacto.length; f++) {
                                if (contacto.id_ram_contacto[f] == "N") {
                                    contacto.id_ram_contacto = 0;
                                    break;
                                }
                            }
                        }
                        $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "crear_contactos", JSON.stringify(contacto), {
                        }).then(function (result) {
                            var sasasass = null;
                        }).catch(function (data) {
                            $scope.Error.value = true;
                        });
                    };
                }
            }
            $scope.cambiar_formato_fecha = function (ddmmaaaa) {
                var array = ddmmaaaa.split("/");
                var aaaammdd = array[2] + "/" + array[1] + "/" + array[0];
                return aaaammdd;
            }
            $scope.img_regalo = "regalo";
            $scope.is_birthday = function (dia, mes) {
                if (dia == null || dia == "null" || dia == "") return;
                if (mes == null || mes == "null" || mes == "") return;
                var fecha_actual = ($scope.Cliente.fecha_actual == null || $scope.Cliente.fecha_actual == "null" || $scope.Cliente.fecha_actual == "") ? null
                                    : $scope.Cliente.fecha_actual.split("/");
                if (fecha_actual == null) return;
                var anio_actual = fecha_actual[2];
                //***
                var fecha = anio_actual + "/" + mes + "/" + dia;
                var fecha_cumpleanios = moment(fecha).format("YYYY/MM/DD");
                $scope.toolstips_fecha_cumpleanios = moment(fecha_cumpleanios, "YYYY/MM/DD").fromNow();
                var hoy = $scope.cambiar_formato_fecha($scope.Cliente.fecha_actual);
                var cumple = moment(fecha, "YYYY/MM/DD");
                var f_actual = moment(hoy, "YYYY/MM/DD");
                var diff_days = f_actual.diff(cumple, 'days', true);
                if (diff_days > -8 && diff_days < 8) {
                    $scope.img_regalo = "regalo_color";
                }
            };
            
            $scope.show_warning = false;
            $scope.enable_documento = null;
            $scope.fecha_antiguedad_data = function (fecha_ultima_transaccion, fecha_actual) {
                if (fecha_ultima_transaccion == null || fecha_ultima_transaccion == ""
                    || fecha_actual == null || fecha_actual == "") return;
                // En caso de que sean anios distintos
                var split_ultima_transaccion = fecha_ultima_transaccion.split("/");
                var splt_fecha_actual = fecha_actual.split("/");
                var anio_ultima_transaccion = Number(split_ultima_transaccion[2]);
                var anio_fecha_actual = Number(splt_fecha_actual[2]);
                if (anio_fecha_actual > anio_ultima_transaccion) {
                    $scope.show_warning = true;
                    return;
                } else {
                    // En caso de que sea el mismo anio consulto en numero de meses de diferencia
                    var mes_ultima_transaccion = Number(split_ultima_transaccion[1]);
                    var mes_fecha_actual = Number(splt_fecha_actual[1]);
                    var diferencia_meses = mes_fecha_actual - mes_ultima_transaccion;
                    if (diferencia_meses > 5) {
                        $scope.show_warning = true;
                        return;
                    }
                }
                $scope.show_warning = false;
            };
            $scope.lista_clientes_coinciden = [];
            $scope.cantidad_cliente_coinciden = function (data_cliente) {
                $scope.consultar_cliente(data_cliente);
            };
            //*** QUERYS
            $scope.call_consultar_cliente = function (numero_identificacion) {
                $scope.data_cliente = {
                    numero_identificacion: numero_identificacion,
                    nombre_cliente: null,
                };
                $scope.consultar_cliente($scope.data_cliente);
                $scope.cerrar_filtro_coinciden();
            }
            $scope.cerrar_filtro_coinciden = function () {
                $('#filtro_coincidencias').closeModal();
            }
            $scope.nuevo_documento_cliente = function (numero_identificacion) {
                $scope.data_cliente = {
                    numero_identificacion: numero_identificacion,
                    nombre_cliente: null,
                };
                $scope.consultar_cliente($scope.data_cliente);
                $('#filtro_coincidencias').closeModal();
            }
            $scope.consultar_cliente = function (data_cliente) {
                if ($scope.numero_coincidencias(data_cliente.numero_identificacion) < 4) return;
                if (data_cliente.numero_identificacion.length < 7) {
                    angular.showWarning("* El campo número de documento debe tener al menos 7 caracteres. \n");
                    return;
                }
                //***  Limpio la sumatoria de PQRS
                $scope.limpiar_cantidad_pqrs();
                $('#filtro').closeModal();
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "consulta_data_cliente", JSON.stringify(data_cliente), {
                }).then(function (result) {
                    $scope.permite_editar_documento = false;
                    $scope.show_pqrs = false; 
                    
                    $scope.btnlimpiar_campos();
                    if (result.data.MSG !== "NO EXISTE") {
                        $scope.show_pqrs = true; 
                        $scope.permite_editar_documento = true;
                        $scope.carga_imagenes(data_cliente);
                        $scope.carga_data_contactos(data_cliente);
                        $scope.isnit();
                        $scope.get_data_dt_contacto(data_cliente);
                        if (result == null) return;
                        if (result.data == null) return;
                        if (result.data.data.length < 1) return;
                        if (result.data.data[0][0] == null) return;
                        if (result.data.data[0][0].documento_cliente == null || result.data.data[0][0].documento_cliente == "") return;
                        $scope.Cliente.documento = result.data.data[0][0].documento_cliente;
                        $scope.Cliente.nombres = result.data.data[0][0].nombres_cliente;
                        $scope.Cliente.apellidos = result.data.data[0][0].apellidos_cliente;

                        $scope.Cliente.tipo_cliente = result.data.data[0][0].cs_id_tipo_cliente;
                        $scope.Cliente.image_tipo_cliente = result.data.data[0][0].imagen_tipo_cliente;
                        $scope.Cliente.this_cs_tipo_cliente = result.data.data[0][0].cs_id_tipo_cliente;
                        $scope.tipo_cliente_global = $scope.DNS + $scope.Cliente.image_tipo_cliente;
                        if (result.data.data[0][0].sexo === null || result.data.data[0][0].sexo === "null" || result.data.data[0][0].sexo === "") {
                            $scope.imagen_genero = $scope.DNS + "SGD/CRM/TGE/SIN_ASIGNAR.png";
                        } else {
                            $scope.imagen_genero = $scope.DNS + result.data.data[0][0].imagen_genero;
                        }
                        $scope.Cliente.sexo = result.data.data[0][0].sexo;
                        $scope.Cliente.Tipo_documento = result.data.data[0][0].c_tipo_documento;
                        $scope.Cliente.celular = (result.data.data[0][0].celular_contacto != "null") ? result.data.data[0][0].celular_contacto : null;
                    
                        var fecha_ultima_movida = (result.data.data[0][0].fh_modificacion == "null") ? result.data.data[0][0].fh_creacion : result.data.data[0][0].fh_modificacion ;
                        $scope.Cliente.fecha_ultima_modificacion = "(" + fecha_ultima_movida + ")";//(result.data.data[0][0].fh_modificacion == "null") ? "(" + result.data.data[0][0].fh_creacion + ")" : "(" + result.data.data[0][0].fh_modificacion + ")";
                        $scope.Cliente.fecha_actual = result.data.data[0][0].fh_actual;
                        $scope.fecha_antiguedad_data(fecha_ultima_movida, $scope.Cliente.fecha_actual);
                        $scope.Cliente.dia_nacimiento = (result.data.data[0][0].dia_nacimiento == null || result.data.data[0][0].dia_nacimiento == "null" || result.data.data[0][0].dia_nacimiento == "") ? null : result.data.data[0][0].dia_nacimiento;
                        $scope.Cliente.mes_nacimiento = (result.data.data[0][0].mes_nacimiento == null || result.data.data[0][0].mes_nacimiento == "null" || result.data.data[0][0].mes_nacimiento == "") ? null : parseInt(result.data.data[0][0].mes_nacimiento);
                        $scope.Cliente.anio_nacimiento = result.data.data[0][0].anio_nacimiento;
                        $scope.Cliente.rango_edad = result.data.data[0][0].c_rango_edad;
                        // obtengo la fecha de cumpleaños
                        $scope.is_birthday($scope.Cliente.dia_nacimiento, $scope.Cliente.mes_nacimiento);
                        //*** cargo nombre completo del usuario de la ultima actualizacion
                        if ($scope.Cliente.Tipo_documento == "1") {
                            $scope.show_contacto = true;
                        }
                        if (result.data.data[0].length < 1) return;
                        for (var i = 0; i < result.data.data[0].length;i++){
                            $scope.set_observacion_DB(result.data.data[0][i]);
                        }
                        $scope.get_nombre_usuario_ultima_modificacion(data_cliente);
                        // Modulo PQRS 
                        $scope.consultar_pqrs_cliente($scope.Cliente);
                        $scope.get_centros_operacion();
                    }else {
                        // Cargo la identificacion para permitir crear un nuevo cliente
                        $scope.Cliente.documento = $scope.data_cliente.numero_identificacion;
                        $scope.limpiar_campos_contactos();
                        $scope.lista_contactos = [];
                        $scope.ruta_imagen_cliente = "Assets/img/user.png";
                        $scope.dominio_cliente = null;
                        $scope.Cliente.Tipo_documento = $scope.Tipos_documentos[0].c_tipo_documento;
                        $scope.show_contacto = false;
                        $scope.tipo_cliente_global = "Assets/img/OTROS.png";

                        $scope.imagen_genero = $scope.DNS + "SGD/CRM/TGE/SIN_ASIGNAR.png";
                    }
                    $scope.calcular_digito_verificacion();
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.get_nombre_dep_ciudad = function (clasificacion) {
                $scope.obj_temp = {
                    c_clasificacion: clasificacion,
                    documento_cliente: $scope.Cliente.documento
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_pqrs_by_clasificacion_cerrados", JSON.stringify($scope.obj_temp), {
                }).then(function (result) {
                    
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }

            $scope.get_nombre_usuario_ultima_modificacion = function (Cliente) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_usuario_last_update", JSON.stringify(Cliente), {
                }).then(function (result) {
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data.length < 1) return;
                    if (result.data.data[0][0].u_primer_nombre != null && result.data.data[0][0].u_primer_nombre != ""
                            && result.data.data[0][0].u_primer_nombre != "null") {
                        $scope.var_ultima_modificacion = "";
                        $scope.var_ultima_modificacion += (result.data.data[0][0].u_primer_nombre != "null") ? result.data.data[0][0].u_primer_nombre + " " : "";
                        $scope.var_ultima_modificacion += (result.data.data[0][0].u_segundo_nombre != "null") ? result.data.data[0][0].u_segundo_nombre + " " : "";
                        $scope.var_ultima_modificacion += (result.data.data[0][0].u_primer_apellido != "null") ? result.data.data[0][0].u_primer_apellido + " " : "";
                        $scope.var_ultima_modificacion += (result.data.data[0][0].u_segundo_apellido != "null") ? result.data.data[0][0].u_segundo_apellido : "";
                        
                        if ($scope.var_ultima_modificacion.length > 31) {
                            $scope.Cliente.Nombre_usuario_ultima_modificacion = $scope.var_ultima_modificacion.substring(0, 30) + " ...";
                            return;
                        }
                        $scope.Cliente.Nombre_usuario_ultima_modificacion = $scope.var_ultima_modificacion.substring(0, 34);
                    }
                }).catch(function (data) {
                    angular.showAlert('Ha ocurrido un error por favor comunicate con el administrador del sistema 2');
                    $scope.Error.value = true;
                });
            }
            $scope.get_data_direcciones_cliente = function (pais, depto, municipio, obj_direcciones_cliente, direccion) {
                var obj_direcciones = {
                    id_pais: pais,
                    id_depto: depto,
                    id_municipio: municipio
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_data_direcciones_cliente", JSON.stringify(obj_direcciones), {
                }).then(function (result) {
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data.length < 1) return;
                    obj_direcciones_cliente.descripcion_pais = result.data.data[0][0].f011_descripcion;
                    obj_direcciones_cliente.descripcion_depart = result.data.data[1][0].f012_descripcion;
                    obj_direcciones_cliente.descripcion_municipio = result.data.data[2][0].f013_descripcion;
                    if(obj_direcciones_cliente.descripcion_pais === null || obj_direcciones_cliente.descripcion_pais === "null" || obj_direcciones_cliente.descripcion_pais === "") return;
                    if(obj_direcciones_cliente.descripcion_depart === null || obj_direcciones_cliente.descripcion_depart === "null" || obj_direcciones_cliente.descripcion_depart === "") return;
                    if(obj_direcciones_cliente.descripcion_municipio === null || obj_direcciones_cliente.descripcion_municipio === "null" || obj_direcciones_cliente.descripcion_municipio === "") return;

                    if (direccion === "d_casa") {
                        $scope.Cliente.direccion_casa = $scope.Cliente.direccion_casa
                                                                        + " (" + obj_direcciones_cliente.descripcion_depart.substring(0, 3)
                                                                        + "-" + obj_direcciones_cliente.descripcion_municipio.substring(0, 3) + ")";
                    } else {
                        if (direccion === "d_entrega") {
                            $scope.Cliente.direccion_entrega = $scope.Cliente.direccion_entrega
                                                                            + " (" + obj_direcciones_cliente.descripcion_depart.substring(0, 3)
                                                                            + "-" + obj_direcciones_cliente.descripcion_municipio.substring(0, 3) + ")";
                        } else {
                            if (direccion === "d_trabajo") {
                                $scope.Cliente.direccion_trabajo = $scope.Cliente.direccion_trabajo
                                                                                + " (" + obj_direcciones_cliente.descripcion_depart.substring(0, 3)
                                                                                + "-" + obj_direcciones_cliente.descripcion_municipio.substring(0, 3) + ")";
                            }
                        }
                    }
                }).catch(function (data) {
                    angular.showAlert('Ha ocurrido un error por favor comunicate con el administrador del sistema 2');
                    $scope.Error.value = true;
                });
            }
            $scope.get_data_dt_contacto = function (data_cliente) { // direccion-telefono-mail
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "consulta_data_dt_contacto_cliente", JSON.stringify(data_cliente), {
                }).then(function (result) {
                    // consulto la imagen
                    if (result == null) return;
                    if (result.data.data[0] == null) return;
                    if (result.data.data[0][0] == null) return;
                    for (var i = 0; i < result.data.data[0].length; i++){
                        switch (result.data.data[0][i].d_tipologia_contacto) {
                            case "CELULAR":
                                $scope.Cliente.celular = (result.data.data[0][i].CONTACTO != "null") ? result.data.data[0][i].CONTACTO : null; break;
                            case "EMAIL":
                                $scope.Cliente.correo = (result.data.data[0][i].CONTACTO != "null") ? result.data.data[0][i].CONTACTO : null; break;
                            case "DIRECCIÓN RESIDENCIA":
                                $scope.Cliente.direccion_casa = (result.data.data[0][i].CONTACTO != "null") ? result.data.data[0][i].CONTACTO : null;
                                $scope.Cliente.paisdepartmunic_dir_casa = {
                                    id_pais: result.data.data[0][i].c_pais,
                                    id_depart: result.data.data[0][i].c_departamento,
                                    id_municipio: result.data.data[0][i].c_municipio,
                                    descripcion_pais: result.data.data[0][i].descripcion_pais,
                                    descripcion_depart: result.data.data[0][i].descripcion_depart,
                                    descripcion_municipio: result.data.data[0][i].descripcion_municipio,
                                }
                                $scope.get_data_direcciones_cliente($scope.Cliente.paisdepartmunic_dir_casa.id_pais
                                                                    , $scope.Cliente.paisdepartmunic_dir_casa.id_depart
                                                                    , $scope.Cliente.paisdepartmunic_dir_casa.id_municipio
                                                                    , $scope.Cliente.paisdepartmunic_dir_casa
                                                                    , "d_casa");
                                break;
                            case "DIRECCIÓN ENTREGA PEDIDO":
                                $scope.Cliente.direccion_entrega = (result.data.data[0][i].CONTACTO != "null") ? result.data.data[0][i].CONTACTO : null;
                                $scope.Cliente.paisdepartmunic_dir_entrega = {
                                    id_pais: result.data.data[0][i].c_pais,
                                    id_depart: result.data.data[0][i].c_departamento,
                                    id_municipio: result.data.data[0][i].c_municipio,
                                    descripcion_pais: result.data.data[0][i].descripcion_pais,
                                    descripcion_depart: result.data.data[0][i].descripcion_depart,
                                    descripcion_municipio: result.data.data[0][i].descripcion_municipio,
                                }
                                $scope.get_data_direcciones_cliente($scope.Cliente.paisdepartmunic_dir_entrega.id_pais
                                                                    , $scope.Cliente.paisdepartmunic_dir_entrega.id_depart
                                                                    , $scope.Cliente.paisdepartmunic_dir_entrega.id_municipio
                                                                    , $scope.Cliente.paisdepartmunic_dir_entrega
                                                                    , "d_entrega");
                                break;
                            case "TELEFONO RESIDENCIA":
                                $scope.Cliente.telefono_casa = (result.data.data[0][i].CONTACTO != "null") ? result.data.data[0][i].CONTACTO : null; break;
                            case "DIRECCIÓN TRABAJO":
                                $scope.Cliente.direccion_trabajo = (result.data.data[0][i].CONTACTO != "null") ? result.data.data[0][i].CONTACTO : null;
                                $scope.Cliente.paisdepartmunic_dir_trabajo = {
                                    id_pais: result.data.data[0][i].c_pais,
                                    id_depart: result.data.data[0][i].c_departamento,
                                    id_municipio: result.data.data[0][i].c_municipio,
                                    descripcion_pais: result.data.data[0][i].descripcion_pais,
                                    descripcion_depart: result.data.data[0][i].descripcion_depart,
                                    descripcion_municipio: result.data.data[0][i].descripcion_municipio,
                                }
                                $scope.get_data_direcciones_cliente($scope.Cliente.paisdepartmunic_dir_trabajo.id_pais
                                                                    , $scope.Cliente.paisdepartmunic_dir_trabajo.id_depart
                                                                    , $scope.Cliente.paisdepartmunic_dir_trabajo.id_municipio
                                                                    , $scope.Cliente.paisdepartmunic_dir_trabajo
                                                                    , "d_trabajo");
                                break;
                            case "TELEFONO TRABAJO":
                                $scope.Cliente.telefono_trabajo = (result.data.data[0][i].CONTACTO != "null") ? result.data.data[0][i].CONTACTO : null; break;
                        };
                    }
                }).catch(function (data) {
                    angular.showAlert('Ha ocurrido un error por favor comunicate con el administrador del sistema 1');
                    $scope.Error.value = true;
                });
            }
            $scope.set_data = function (result) {
                for (var i = 0; i < result.data.data[0].length; i++) {
                    switch (result.data.data[0][i].d_tipologia_contacto) {
                        case "CELULAR":
                            $scope.Cliente.celular = (result.data.data[0][0].CONTACTO != "null") ? result.data.data[0][0].CONTACTO : null; break;
                        case "EMAIL":
                            $scope.Cliente.correo = (result.data.data[0][i].CONTACTO != "null") ? result.data.data[0][i].CONTACTO : null; break;
                    };
                }
            }
            $scope.set_dominio = function (dominio) {
                for (var i = 0; i < $scope.lista_dominios.length; i++){
                    if ($scope.lista_dominios[i] == dominio) {
                        return;
                    }   
                }
                $scope.lista_dominios.push(dominio);
            }
            $scope.set_correo = function (correo) {
                if (correo == null || correo == "") return;
                var split_correo = correo.split("@");
                if (split_correo[0] == null) return;
                if (split_correo[0] == null || split_correo[0] == ""
                    || split_correo[1] == null || split_correo[1] == "") return;
                $scope.set_dominio(split_correo[1]);
                $scope.var_direccion = split_correo[0];
                $scope.dominio_cliente = split_correo[1];
            };
            $scope.lista_rango_edad = [];
            $scope.get_rango_edad = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_rango_edad", JSON.stringify(), {
                }).then(function (result1) {
                    $scope.carga_pais_departamento_ciudad();
                    if (result1.data == null) return;
                    if (result1.data.data[0].length < 1) return;
                    if (result1.data.data[0][0] == null) return;
                    for (var i = 0; i < (result1.data.data[0].length); i++){
                        $scope.obj_rango_edad = {
                            id: result1.data.data[0][i].c_rango_edad,
                            descripcion: result1.data.data[0][i].d_rango_edad
                        };
                        $scope.lista_rango_edad.push($scope.obj_rango_edad);
                    }                
                }).catch(function (data) {
                    angular.showAlert('Ha ocurrido un error por favor comunicate con el administrador del sistema 3');
                    $scope.Error.value = true;
                });
            }
        
            $scope.get_dominio_correo = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_dominio_correo", JSON.stringify(), {
                }).then(function (result) {
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data[0].length < 1) return;
                    if ($scope.lista_dominios == null)
                        $scope.lista_dominios = [];

                    for (var i = 0; i < result.data.data[0].length; i++){
                        $scope.lista_dominios.push(result.data.data[0][i].d_dominio_correo);
                    }
                }).catch(function (data) {
                    angular.showAlert('Ha ocurrido un error por favor comunicate con el administrador del sistema 4');
                    $scope.Error.value = true;
                });
            }
            $scope.carga_tipo_cliente = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_tipo_cliente", JSON.stringify(), {
                }).then(function (result) {
                    $scope.carga_imagenes_generos();
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data[0] == null) return;
                    $scope.Tipos_clientes = result.data.data[0];
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.obj_direccion_entrega = {
                c_departamento: null,
                c_municipio: null,
                c_pais: null,
                contacto_cliente: null,
                desc_pais: null,
                desc_departamento: null,
                desc_municipio: null,
            };
            $scope.lista_direcciones_entrega = [];
            $scope.carga_direcciones_entrega_cliente = function (cliente) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_direcciones_entrega_clientes", JSON.stringify(cliente)).
                    then(function (result) {
                        if (result == null) return;
                        if (result.data == null) return;
                        if (result.data.data == null) return;
                        if (result.data.data[0] == null) return;
                        if (result.data.data[0][0].length < 1) return;
                        for (var i = 0; i < result.data.data[0].length; i++) {
                            $scope.obj_direccion_entrega = {
                                c_departamento: (result.data.data[0][i].c_departamento == null || result.data.data[0][i].c_departamento == "null" || result.data.data[0][i].c_departamento == "") ? null : result.data.data[0][i].c_departamento,
                                c_municipio: (result.data.data[0][i].c_municipio == null || result.data.data[0][i].c_municipio == "null" || result.data.data[0][i].c_municipio == "") ? null : result.data.data[0][i].c_municipio,
                                c_pais: (result.data.data[0][i].c_pais == null || result.data.data[0][i].c_pais == "null" || result.data.data[0][i].c_pais == "") ? null : result.data.data[0][i].c_pais,
                                contacto_cliente: (result.data.data[0][i].contacto_cliente == null || result.data.data[0][i].contacto_cliente == "null" || result.data.data[0][i].contacto_cliente == "") ? null : result.data.data[0][i].contacto_cliente,
                                desc_pais: (result.data.data[0][i].pais == null || result.data.data[0][i].pais == "null" || result.data.data[0][i].pais == "") ? null : result.data.data[0][i].pais,
                                desc_departamento: (result.data.data[0][i].departamento == null || result.data.data[0][i].departamento == "null" || result.data.data[0][i].departamento == "") ? null : result.data.data[0][i].departamento,
                                desc_municipio: (result.data.data[0][i].municipio == null || result.data.data[0][i].municipio == "null" || result.data.data[0][i].municipio == "") ? null : result.data.data[0][i].municipio,
                            };
                            $scope.lista_direcciones_entrega.push($scope.obj_direccion_entrega);
                        }
                    }).catch(function (data) {
                        $scope.Error.value = true;
                    });
            }
            $scope.call_btn_limpiar_campos = function () {
                $scope.digito_verificacion = "-";
                $scope.show_pqrs = false; 
                $scope.permite_editar_documento = false;
                $scope.btnlimpiar_campos();
                $scope.data_cliente.numero_identificacion = null;
                $('#filtro').openModal(); // SIP
                $('#identificacion_filtro').focus();
                //*** limpiar campos PQRS
                $scope.limpia_var_pqrs();
                $scope.limpiar_cantidad_pqrs();
            }
            $scope.limpiar_cantidad_pqrs = function () {
                $scope.cantidad_P = 0;
                $scope.cantidad_Q = 0;
                $scope.cantidad_R = 0;
                $scope.cantidad_S = 0;
                $scope.cantidad_P_cerrada = 0;
                $scope.cantidad_Q_cerrada = 0;
                $scope.cantidad_R_cerrada = 0;
                $scope.cantidad_S_cerrada = 0;
                $scope.total_pqrs_abiertas = 0;
                $scope.total_pqrs_cerradas = 0;
                $scope.total_pqrs_totales = 0;

                $scope.cantidad_P_Total = 0;
                $scope.cantidad_Q_Total = 0;
                $scope.cantidad_R_Total = 0;
                $scope.cantidad_S_Total = 0;
            }
            $scope.btnlimpiar_campos = function () {
                $scope.LimpiarCampos();
                $scope.limpiar_campos_contactos();
                $scope.lista_contactos = [];
                $scope.ruta_imagen_cliente = "Assets/img/user.png";
                $scope.lista_dominios = ["hotmail.com", "gmail.com", "yahoo.com"]
                $scope.dominio_cliente = null;
                $scope.Cliente.Tipo_documento = $scope.Tipos_documentos[0].c_tipo_documento;
                $scope.show_contacto = false;
                $scope.tipo_cliente_global = "Assets/img/OTROS.png";
                $scope.Cliente.documento = null;
                $scope.imagen_genero = $scope.DNS + "SGD/CRM/TGE/SIN_ASIGNAR.png";
                // remuevo la clase que pinta de color el icono de regalo
                $scope.img_regalo = "regalo";
                $scope.lista_direcciones_entrega = [];
                //***
                $scope.limpia_campos_PQRS();
            
            };
            // metodos
            $scope.LimpiarCampos = function () {
                $scope.Cliente = {
                    paisdepartmunic_dir_casa: {
                        id_pais: null,
                        id_depart: null,
                        id_municipio: null
                    },
                    paisdepartmunic_dir_trabajo: {
                        id_pais: null,
                        id_depart: null,
                        id_municipio: null
                    },
                    paisdepartmunic_dir_entrega: {
                        id_pais: null,
                        id_depart: null,
                        id_municipio: null
                    },
                    Tipo_documento: null,
                    this_cs_tipo_cliente: null,
                    d_tipo_cliente: null,
                    nombres: null,
                    apellidos: null,
                    dia_nacimiento: null,
                    mes_nacimiento: null,
                    anio_nacimiento: null,
                    rango_edad: null,
                    foto: null,
                    celular: null,
                    correo: null,
                    direccion_casa: null,
                    direccion_trabajo: null,
                    direccion_entrega: null,
                    telefono_casa: null,
                    telefono_trabajo: null,
                    fecha_ultima_modificacion: null,
                    fecha_crecion: null,
                    Nombre_usuario_ultima_modificacion: null,
                    tipo_cliente: null,
                    sexo: null,
                };
                $scope.var_direccion = null;
                $scope.dominio_cliente = "hotmail.com";
            };
        
            $scope.carga_data_inicial = function () {
                $('#filtro').openModal();
                $('#identificacion_filtro').focus();
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_tipos_documentos", JSON.stringify(), {
                }).then(function (result) {
                    $scope.get_data_parametros_sistema();
                    $scope.get_dominio_correo();
                    $scope.data_current_user.id = $scope.cs_id_usuario;
                    $scope.get_data_current_user($scope.data_current_user);
                    $scope.carga_tipo_cliente();
                    $scope.ruta_imagen_cliente = "Assets/img/user.png";
                    $scope.Tipos_documentos = result.data.data[0];
                    $scope.Cliente.Tipo_documento = $scope.Tipos_documentos[0].c_tipo_documento;
                    $scope.Cliente.sexo = null;
                    $scope.get_range_anio();
                    $scope.get_dias_mes();
                    $scope.carga_clasificacion_pqrs();
                    $scope.show_pqrs = false;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.obj_usuario_actual = {
                nombres: null,
                id: null
            }
            
            $scope.ruta_imagen_cliente = null;
            $scope.carga_imagenes = function (data_cliente) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_imagenes_tipoclientes", JSON.stringify(data_cliente), {
                }).then(function (result) {
                    $scope.carga_direcciones_entrega_cliente(data_cliente);
                    //***
                    if (result.data.MSG == "NO EXISTE") return;
                    var ruta = result.data.data[0][0].ruta_archivo;
                    var nombrearchivo = result.data.data[0][0].cs_id_gdocumental;
                    var extension = result.data.data[0][0].extension;
                    $scope.ruta_imagen_cliente = $scope.DNS + ruta + nombrearchivo + "." + extension;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.lista_generos = [];
            $scope.carga_imagenes_generos = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_imagenes_generos", JSON.stringify(), {
                }).then(function (result) {
                    $scope.get_rango_edad();
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data[0] == null) return;
                    for (var i = 0; i < result.data.data[0].length; i++){
                        $scope.obj_genero = {
                            c_genero: result.data.data[0][i].c_genero,
                            d_genero: result.data.data[0][i].d_genero,
                            imagen_genero: $scope.DNS + result.data.data[0][i].imagen_genero
                        };
                        $scope.lista_generos.push($scope.obj_genero);
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.obj_pais = {
                id: null,
                descripcion: null
            }
            $scope.lista_pais = [];
            $scope.lista_departamento = [];
            $scope.lista_municipio = [];
            $scope.carga_pais_departamento_ciudad = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_pais_departamento_ciudad", JSON.stringify(), {
                }).then(function (result) {
                    //*** pais
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        $scope.obj_departamento = {
                            id_pais: null,
                            id_departamento: null,
                            d_departamento: null
                        }
                        $scope.obj_pais = {
                            id : result.data.data[0][i].idPais,
                            descripcion : result.data.data[0][i].descripcionPais
                        }
                        $scope.lista_pais.push($scope.obj_pais);
                    }
                    // Asigno el primer item como seleccionado por defecto, 
                    // la idea es q sea Colombia pero esto podria cambiar
                    $scope.pais_global = $scope.lista_pais[0].id;
                    $scope.id_pais = $scope.lista_pais[0].id;
                    //*** departamento
                    for (var d = 0; d < result.data.data[1].length; d++) {
                        $scope.obj_departamento = {
                            id_pais: null,
                            id_departamento: null,
                            d_departamento: null
                        }
                        $scope.obj_departamento.id_pais = result.data.data[1][d].f012_id_pais;
                        $scope.obj_departamento.id_departamento = result.data.data[1][d].idDepto;
                        $scope.obj_departamento.d_departamento = result.data.data[1][d].descripcionDepto;
                        $scope.lista_departamento.push($scope.obj_departamento);
                        $scope.lista_departamento_original.push($scope.obj_departamento);
                    }
                    //*** municipio
                    for (var d = 0; d < result.data.data[2].length; d++) {
                        $scope.obj_municipio = {
                            d_municipio: null,
                            id_departemento: null,
                            id_pais: null,
                            id_minicipio: null
                        }
                        $scope.obj_municipio.d_municipio = result.data.data[2][d].descripcionCiudad;
                        $scope.obj_municipio.id_departemento = result.data.data[2][d].f013_id_depto;
                        $scope.obj_municipio.id_pais = result.data.data[2][d].f013_id_pais;
                        $scope.obj_municipio.id_minicipio = result.data.data[2][d].idCiudad;
                        $scope.lista_municipio.push($scope.obj_municipio);
                    }
                    $scope.lista_municipio_original = $scope.lista_municipio;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.lista_departamento_original = [];
            $scope.SetDepartamentos = function (pais_id) {
                $scope.id_pais = pais_id;
                $scope.lista_departamento = Enumerable.From($scope.lista_departamento_original).Where(function (x) {
                    return (x.id_pais == pais_id);
                }).Select(function (x) {
                    return x;
                }).ToArray();
            };
            $scope.lista_municipio_original = [];
            $scope.nombre_departamento_selected = "";
            $scope.SetCiudades = function (depto_id) {
                $scope.id_ciudad = depto_id;
                $scope.lista_municipio = Enumerable.From($scope.lista_municipio_original).Where(function (x) {
                    return (x.id_departemento == depto_id);
                }).Select(function (x) {
                    return x;
                }).ToArray();
                //*** nombre deol departamento
                $scope.nombre_departamento_selected = "";
                for (var i = 0; i < $scope.lista_departamento.length; i++) {
                    if ($scope.lista_departamento[i].id_departamento === depto_id
                            && $scope.lista_departamento[i].id_pais === $scope.id_pais) {
                        $scope.nombre_departamento_selected = $scope.lista_departamento[i].d_departamento.substring(0, 3);
                        break;
                    }
                }
            };
            $scope.nombre_municipio_selected = "";
            $scope.id_ciudad = null;
            $scope.get_nombre_ciudad = function (municip_id) {
                $scope.nombre_municipio_selected = "";
                for (var i = 0; i < $scope.lista_municipio_original.length; i++) {
                    if ($scope.lista_municipio_original[i].id_minicipio === municip_id
                            && $scope.lista_municipio_original[i].id_departemento == $scope.id_ciudad
                            && $scope.lista_municipio_original[i].id_pais == $scope.id_pais) {
                        $scope.nombre_municipio_selected = $scope.lista_municipio_original[i].d_municipio.substring(0, 3);
                        break;
                    }
                }
            };
            $scope.temp = {
                numero_identificacion: null
            };
        
            $scope.carga_data_contactos = function (data_cliente) {
                $scope.temp.numero_identificacion = data_cliente.numero_identificacion;
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_data_contactos", JSON.stringify(data_cliente), {
                }).then(function (result) {
                    //***
                    $scope.lista_contactos = [];
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data.length < 1) return;
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        var correo = null;
                        if (result.data.data[0][i].email != "null") {
                            correo = result.data.data[0][i].email.split("@");
                        }
                        $scope.obj_contacto_cliente = {
                            id_ram_contacto: result.data.data[0][i].cs_id_contacto_cliente_corpo,
                            id_cliente: (result.data.data[0][i].cs_id_cliente != "null") ? result.data.data[0][i].cs_id_cliente : null, // id del cliente al q va a estar enlazado
                            id_usuario: null,
                            documento: (result.data.data[0][i].nro_documento_contacto != "null") ? result.data.data[0][i].nro_documento_contacto : null,
                            nombres: (result.data.data[0][i].nombres_contacto != "null") ? result.data.data[0][i].nombres_contacto : null,
                            apellidos: (result.data.data[0][i].apellidos_contacto != "null") ? result.data.data[0][i].apellidos_contacto : null,
                            celular: (result.data.data[0][i].celular != "null" && result.data.data[0][i].celular != null) ? result.data.data[0][i].celular : "",
                            correo: (correo != null && correo != "null") ? correo[0] : null,
                            dominio: (correo != null && correo != "null") ? correo[1] : null,
                            cargo: (result.data.data[0][i].cargo != "null") ? result.data.data[0][i].cargo : null,
                            correo_completo: (correo == null || correo[0] == null || correo[0] == "null" || correo[0] == ""
                                        || correo[1] == null || correo[1] == "null" || correo[1] == "")
                                        ? null : correo[0] + "@" + correo[1],
                        };
                        $scope.lista_contactos.push($scope.obj_contacto_cliente);
                        // agrego elp nuevo dominio a la lista
                        if ($scope.lista_dominios != null) {
                            var existe_dominio = false;
                            for (var j = 0; j < $scope.lista_dominios.length; j++) {
                                // verifico si el dominio ta existe en la lista
                                if ($scope.obj_contacto_cliente.dominio == "" || $scope.obj_contacto_cliente.dominio == null || $scope.obj_contacto_cliente.dominio == "null") continue;
                                if ($scope.lista_dominios[j] == $scope.obj_contacto_cliente.dominio) {
                                    existe_dominio = true;
                                    continue;
                                }
                            }
                            if (!existe_dominio && $scope.obj_contacto_cliente.dominio != "" && $scope.obj_contacto_cliente.dominio != "null"
                                 && $scope.obj_contacto_cliente.dominio != null) {
                                $scope.lista_dominios.push($scope.obj_contacto_cliente.dominio);
                            }
                        }
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            
            $scope.selected_genero = function (imagen) {
                $scope.imagen_genero = imagen.imagen_genero;
                $scope.Cliente.sexo = imagen.c_genero;
            };
        
            $scope.tipo_cliente_global = "Assets/img/OTROS.png";
            $scope.tipo_cliente_seleccionado = function (tipo_cliente) {
                $scope.Cliente.tipo_cliente = tipo_cliente.d_tipo_cliente;
                $scope.Cliente.this_cs_tipo_cliente = tipo_cliente.cs_id_tipo_cliente;
                $scope.tipo_cliente_global = $scope.DNS + tipo_cliente.ruta_imagen;
            };

            $scope.obj_mes = {
                id: null,
                descipcion: null
            };
            $scope.meses = [
                { descripcion: "Enero", id: 1 },
                { descripcion: "Febrero", id: 2 },
                { descripcion: "Marzo", id: 3 },
                { descripcion: "Abril", id: 4 },
                { descripcion: "Mayo", id: 5 },
                { descripcion: "Junio", id: 6 },
                { descripcion: "Julio", id: 7 },
                { descripcion: "Agosto", id: 8 },
                { descripcion: "Septiembre", id: 9 },
                { descripcion: "Octubre", id: 10 },
                { descripcion: "Noviembre", id: 11 },
                { descripcion: "Diciembre", id: 12 }
            ];
            //*** fecha nacimiento
            $scope.dias_mes = [];
            $scope.get_dias_mes = function (mes) {
                for (var i = 1; i <= 31; i++) {
                    $scope.dias_mes.push(i.toString());
                }
            };
            $scope.anio = [];
            $scope.get_range_anio = function () {
                for (var i = 1; i < 170;i++){
                    $scope.anio.push((1969 + i).toString());
                };
            };
            $scope.dia_selected = null;
            $scope.mes_selected = null;
            $scope.anio_selected = null;

            $scope.muestra_direccion_actual = function (p_direccion) {
                $scope.direccion_mostrar = null;
                if (p_direccion === "direccion_casa") {
                    $scope.direccion_mostrar = $scope.Cliente.direccion_casa;
                } else {
                    if (p_direccion === "direccion_trabajo") {
                        $scope.direccion_mostrar = $scope.Cliente.direccion_trabajo;
                    } else {
                        if (p_direccion === "direccion_entrega") {
                            $scope.direccion_mostrar = $scope.Cliente.direccion_entrega;
                        }
                    }
                }
            }
            $scope.var_global_direcciones = null;
            $scope.carga_direccion = function (p_direccion) {
                //$scope.pais_global = null;
                $scope.muestra_direccion_actual(p_direccion);
                $scope.departamento_global = null;
                $scope.municipio_global = null;

                $scope.var_global_direcciones = p_direccion;
                $scope.limpia_direccion();
                // muestro la modal de direcciones lista para crear o editar la direccion
                if (p_direccion == "direccion_entrega") {
                    //Hago que la ventana modal me permita seleccionar una direccion de la lista y/o me permita crear una nueva
                    $scope.cambio_is_nueva_direccion(false);
                    $scope.permite_crear_nueva_direccion = true;
                    $scope.is_nueva_direccion = false;
                } else {
                    $scope.cambio_is_nueva_direccion(true);
                    $scope.permite_crear_nueva_direccion = false;
                }
            }
            $scope.GLOBAL_paisdepartmunic_dir_entrega = {
                id_pais: null,
                id_depart: null,
                id_municipio: null,
                descripcion_pais: null,
                descripcion_depart: null,
                descripcion_municipio: null,
            }
            $scope.GLOBAL_direccion_entrega = null;
            $scope.set_direccion_seleccionada = function (direccion) {
                $scope.format_Direccion_Result = direccion.contacto_cliente + "(" + direccion.desc_pais + "-" + direccion.desc_departamento + "-" + direccion.desc_municipio + ")";
                $scope.GLOBAL_paisdepartmunic_dir_entrega = { 
                    id_pais: direccion.c_pais,
                    id_depart: direccion.c_departamento,
                    id_municipio: direccion.c_municipio,
                    descripcion_pais: direccion.desc_pais,
                    descripcion_depart: direccion.desc_departamento,
                    descripcion_municipio: direccion.desc_municipio,
                }
                $scope.Cliente.direccion_entrega = direccion.contacto_cliente + " (" + direccion.desc_departamento.substring(0, 3) + "-" + direccion.desc_municipio.substring(0, 3) + ")";
                $('#template_direccion').closeModal();
                $scope.format_Direccion_Result = null;
                $scope.Cliente.observacion_dir_entrega = null;
                //*** Consulto la observacion referente a esa Direccion
                $scope.get_observacion_referente($scope.Cliente.documento, direccion.contacto_cliente);
            };
            $scope.get_observacion_referente = function (documento_cliente, var_direccion) {
                var obj_consulta = {
                    documento: documento_cliente,
                    direccion: var_direccion
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_observacion_referente", JSON.stringify(obj_consulta), {
                }).then(function (result) {
                    $scope.Cliente.observacion_dir_entrega = result.data.data[0][0].observacion;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }

            $scope.var_global_carga_observacion = null;// obs_casa
            $scope.carga_observacion = function (obs) {
                $scope.var_global_carga_observacion = obs;
                // set la informacion a la variable correspondiente
                $scope.trae_observacion();
            };
            // paso el texto del campo observacion a la variable encargado de capturar la infromacion referente.
            $scope.set_observacion = function () {
                if ($scope.var_global_carga_observacion == "obs_dir_casa") {
                    $scope.Cliente.observacion_dir_casa = $scope.observacion_global;
                } else {
                    if ($scope.var_global_carga_observacion == "obs_dir_trabajo") {
                        $scope.Cliente.observacion_dir_trabajo = $scope.observacion_global;
                    } else {
                        if ($scope.var_global_carga_observacion == "obs_dir_entrega") {
                            $scope.Cliente.observacion_dir_entrega = $scope.observacion_global;
                        } else {
                            if ($scope.var_global_carga_observacion == "obs_tel_casa") {
                                $scope.Cliente.observacion_tel_casa = $scope.observacion_global;
                            } else {
                                if ($scope.var_global_carga_observacion == "obs_tel_trabajo") {
                                    $scope.Cliente.observacion_tel_trabajo = $scope.observacion_global;
                                } else {
                                    if ($scope.var_global_carga_observacion == "obs_celular") {
                                        $scope.Cliente.observacion_celular = $scope.observacion_global;
                                    }
                                }
                            }
                        }
                    }
                }
            };
            //*** Variables globales
            $scope.global_dir_casa = null;
            $scope.global_dir_trabajo = null;
            $scope.global_dir_entrega = null;
            $scope.global_tel_casa = null;
            $scope.global_tel_trabajo = null;
            
            //***
            $scope.set_observacion_DB = function (array_result) { 
                if (array_result == null || array_result == "") return;
                if (array_result.d_tipologia_contacto == "DIRECCIÓN RESIDENCIA") {
                    $scope.global_dir_casa = (array_result.observacion != "null") ? array_result.observacion : null;
                    $scope.Cliente.observacion_dir_casa = (array_result.observacion != "null") ? array_result.observacion : null;
                } else {
                    if (array_result.d_tipologia_contacto == "DIRECCIÓN TRABAJO") {
                        $scope.global_dir_trabajo = (array_result.observacion != "null") ? array_result.observacion : null;
                        $scope.Cliente.observacion_dir_trabajo = (array_result.observacion != "null") ? array_result.observacion : null;
                    } else {
                        if (array_result.d_tipologia_contacto == "DIRECCIÓN ENTREGA PEDIDO") {
                            $scope.global_dir_entrega = (array_result.observacion != "null") ? array_result.observacion : null;
                            $scope.Cliente.observacion_dir_entrega = (array_result.observacion != "null") ? array_result.observacion : null;
                        } else {
                            if (array_result.d_tipologia_contacto == "TELEFONO RESIDENCIA") {
                                $scope.global_tel_casa = (array_result.observacion != "null") ? array_result.observacion : null;
                                $scope.Cliente.observacion_tel_casa = (array_result.observacion != "null") ? array_result.observacion : null;
                            } else {
                                if (array_result.d_tipologia_contacto == "TELEFONO TRABAJO") {
                                    $scope.global_tel_trabajo = (array_result.observacion != "null") ? array_result.observacion : null;
                                    $scope.Cliente.observacion_tel_trabajo = (array_result.observacion != "null") ? array_result.observacion : null;
                                } else {
                                    if (array_result.d_tipologia_contacto == "CELULAR") {
                                        $scope.global_celular = (array_result.observacion != "null") ? array_result.observacion : null;
                                        $scope.Cliente.observacion_celular = (array_result.observacion != "null") ? array_result.observacion : null;
                                    }
                                }
                            }
                        }
                    }
                }
            };
            // paso la informacion a la variable correspondiente a la variable que me permite hacerla visible por medio de la pop up
            $scope.trae_observacion = function () {
                if ($scope.var_global_carga_observacion == "obs_dir_casa") {
                    $scope.observacion_global = $scope.Cliente.observacion_dir_casa;
                } else {
                    if ($scope.var_global_carga_observacion == "obs_dir_trabajo") {
                        $scope.observacion_global = $scope.Cliente.observacion_dir_trabajo;
                    } else {
                        if ($scope.var_global_carga_observacion == "obs_dir_entrega") {
                            $scope.observacion_global = $scope.Cliente.observacion_dir_entrega;
                        } else {
                            if ($scope.var_global_carga_observacion == "obs_tel_casa") {
                                $scope.observacion_global = $scope.Cliente.observacion_tel_casa;
                            } else {
                                if ($scope.var_global_carga_observacion == "obs_tel_trabajo") {
                                    $scope.observacion_global = $scope.Cliente.observacion_tel_trabajo;
                                } else {
                                    if ($scope.var_global_carga_observacion == "obs_celular") {
                                        $scope.observacion_global = $scope.Cliente.observacion_celular;
                                    }
                                }

                            }
                        }
                    }
                }
            };
            $scope.var_nuevo_dominio = null;
            $scope.add_nuevo_dominio = function (dominio) {
                if (dominio == null || dominio == "") {
                    angular.showWarning("No ha ingresado el nuevo dominio, por favor intente de nuevo.");
                } else {
                    var format_dominio = "text@" + dominio;
                    if ($scope.mail_correcto(format_dominio)) {
                        $scope.lista_dominios.push(dominio);
                        $scope.dominio_cliente = dominio;
                        $scope.var_nuevo_dominio = null;
                    }
                }
            };
            $scope.var_nuevo_dominio_contacto = null;
            $scope.add_nuevo_dominio_contacto = function (dominio) {
                if (dominio == null || dominio == "") {
                    angular.showWarning("No ha ingresado el nuevo dominio, por favor intente de nuevo.");
                } else {
                    var format_dominio = "text@" + dominio;
                    if ($scope.mail_correcto(format_dominio)) {
                        $scope.lista_dominios.push(dominio);
                        $scope.obj_contacto_cliente.dominio = dominio;
                        $scope.var_nuevo_dominio_contacto = null;
                        $scope.show_nuevo_dominio = false;
                    }
                }
            };
            $scope.nuevo_correo = function (direccion, dominio) {
                // 
                if (direccion === "null" || direccion === "" || direccion === null) {
                    angular.showWarning("Error: La dirección de correo es incorrecta y/o incompleta.");
                    return;
                }
                var e_mail = direccion + "@" + dominio;
                if ($scope.mail_correcto(e_mail)) {
                    $('#modal_correo_cliente').closeModal();
                    $scope.Cliente.correo = e_mail;
                }
            };
            // Get numero de dias del mes
            $scope.get_num_dias_mes = function daysInMonth(humanMonth, year) {
                //alert("vvvvvvvvvvvvvv" + new Date(year || new Date().getFullYear(), humanMonth, 0).getDate());
            }
            $scope.numero_coincidencias = function (documento) {
                $scope.cuenta_coincidencias = 0;
                for (var i = 0; i < 10; i++) {
                    if (documento.indexOf(i) > -1) {
                        $scope.cuenta_coincidencias++;
                    }
                }
                if ($scope.cuenta_coincidencias < 4) {
                    angular.showWarning("El documento tiene una cantidad numeros repetidos por encima de lo normal. \nPor favor rectifique he intente nuevamente.");
                }
                return $scope.cuenta_coincidencias;
            };
            $scope.permite_guardar = true;
            $scope.validacion_permite_campos_requeridos = function () {
                $scope.permite_guardar = true;
                if ($scope.numero_coincidencias($scope.Cliente.documento) < 4) return;
                $scope.mensaje_validacion = "Los campos marcados con (*) son de caracter obligatorios. \n";
                if ($scope.Cliente.Tipo_documento == null) {
                    $scope.permite_guardar = false;
                    $scope.mensaje_validacion += "* El campo tipo de documento es requerido. \n";
                }
            
                if ($scope.Cliente.documento == null) {
                    $scope.permite_guardar = false;
                    $scope.mensaje_validacion += "* El campo número de documento es requerido. \n";
                } else {
                    if ($scope.Cliente.documento.length < 7) {
                        $scope.mensaje_validacion += "* El campo número de documento debe tener al menos 7 caracteres. \n";
                        $scope.permite_guardar = false;
                    }
                }
                if ($scope.Cliente.nombres == null) {
                    $scope.permite_guardar = false;
                    $scope.mensaje_validacion += "* El campo nombres es requerido. \n";
                }
                if (($scope.Cliente.apellidos === null || $scope.Cliente.apellidos === "") && $scope.Cliente.Tipo_documento !== "1") {
                    $scope.permite_guardar = false;
                    $scope.mensaje_validacion += "* El campo apellidos es requerido. \n";
                }
                if ($scope.Cliente.celular == null) {
                    $scope.permite_guardar = false;
                    $scope.mensaje_validacion += "* El campo celular es requerido. \n";
                } else {
                    if ($scope.Cliente.celular.length < 10) {
                        $scope.permite_guardar = false;
                        $scope.mensaje_validacion += "* El campo celular debe tener 10 caracteres. \n";
                    }
                }
                if ($scope.Cliente.tipo_cliente == null) {
                    $scope.permite_guardar = false;
                    $scope.mensaje_validacion += "* El campo tipo cliente es requerido. \n";
                }
                
                $scope.mensaje_validacion += "Por favor rectificar.";
                if (!$scope.permite_guardar) {
                    angular.showWarning($scope.mensaje_validacion);
                    $scope.objectDialog.HideDialog();
                    return $scope.permite_guardar;
                }
                return $scope.permite_guardar;
            };
            $scope.limpiar_campo_filtro = function () {
                $scope.data_cliente.numero_identificacion = null;
                $scope.permite_editar_documento = false;
            }

            //***********************************************  DIRECCION  *************************************
            $scope.cambio_is_nueva_direccion = function (valor) {
                $scope.is_nueva_direccion = valor;
            };
            $scope.internalControl = $scope.controldirecciones || {};
            $scope.internalControl.showform = false;
            $scope.tooltipMsg = {
                ErrMsg: "",
                template1Error: "<div style='background: red;border: 1px solid red;border-radius: 4px;padding-left: 4px;padding-right: 4px;'>",
                template1Errorend: "</div>",
            };
            $scope.limpia_direccion = function () {
                $scope.objDireccion = {
                    tv1: "",
                    nV1: "",
                    ap1: "",
                    ca1: "",
                    signoNumero: "",
                    nV2: "",
                    ap2: "",
                    guion: "",
                    ca2: "",
                    pl: "",
                    compl: ""
                };
            };
            $scope.objDireccion = {
                tv1: "",
                nV1: "",
                ap1: "",
                ca1: "",
                signoNumero: "",
                nV2: "",
                ap2: "",
                guion: "",
                ca2: "",
                pl: "",
                compl: ""
            };

            $scope.direccionResult = null;

            $scope.RefrescarDireccion = function () {
                $scope.direccionResult = "";
                var espacio = "";

                if ($scope.objDireccion.nV1 != "") {
                    $scope.objDireccion.signoNumero = "#";
                } else {
                    $scope.objDireccion.signoNumero = "";
                }

                if ($scope.objDireccion.nV2 != "") {
                    $scope.objDireccion.guion = "-";
                } else {
                    $scope.objDireccion.guion = "";
                }

                Object.keys($scope.objDireccion).forEach(function (val, key) {
                    espacio = "";
                    if ($scope.objDireccion[val] != "") {
                        if (val == "tv1") {
                            espacio = " ";
                        }

                        if (val == "ap1") {
                            espacio = " ";
                        }
                        if (val == "ca1") {
                            espacio = " ";
                        }
                        if (val == "ap2") {
                            espacio = " ";
                        }
                        if (val == "ca2") {
                            espacio = " ";
                        }
                        if (val == "pl") {
                            espacio = " ";
                        }
                        if (val == "signoNumero") {
                            espacio = " ";
                        }
                        if (val == "guion") {
                            espacio = " ";
                        }

                        $scope.direccionResult = $scope.direccionResult + $scope.objDireccion[val] + espacio;
                    }
                });
            };
            $scope.show_nuevo_dominio = false;
            $scope.show_nuevo_dominio_contacto = function () {
                $scope.show_nuevo_dominio = true;
            }
            $scope.direccion_definitiva = $scope.direccionResult;
            $scope.RetrunDireccionData = function () {
                // Validaciones
                var text_validacion = "Los campos marcados con * son Obligatorios. \n";
                var permite_crear_direccion = true;
                if ($scope.pais_global == null || $scope.pais_global == "" || $scope.pais_global == "null") {
                    text_validacion += "El campo país es Obligatorio. \n";
                    permite_crear_direccion = false;
                }
                if ($scope.departamento_global == null || $scope.departamento_global == "null" || $scope.departamento_global == "") {
                    text_validacion += "El campo departamento es Obligatorio. \n";
                    permite_crear_direccion = false;
                }
                if ($scope.municipio_global == null || $scope.municipio_global == "null" || $scope.municipio_global == "") {
                    text_validacion += "El campo municipio es Obligatorio. \n";
                    permite_crear_direccion = false;
                }
                if ($scope.objDireccion.tv1 == null || $scope.objDireccion.tv1 == "null" || $scope.objDireccion.tv1 == "") {
                    text_validacion += "El campo de 'Calle, Carrera, Vereda...' es Obligatorio. \n";
                    permite_crear_direccion = false;
                }
                if ($scope.objDireccion.nV1 == null || $scope.objDireccion.nV1 == "null" || $scope.objDireccion.nV1 == "") {
                    text_validacion += "El campo número de 'Calle, Carrera, Vereda...' es Obligatorio. \n";
                    permite_crear_direccion = false;
                }
                if(!permite_crear_direccion){
                    text_validacion += "Verifique por favor he intente de nuevo. \n";
                    angular.showWarning(text_validacion);
                    return;
                }
                //*** Concateno el pais, departamento y municipio
                if ($scope.var_global_direcciones == 'direccion_casa') {
                    // le concateno el id de Pais, Departamento y Municipio
                    $scope.Cliente.direccion_casa = $scope.direccionResult + "(" + $scope.nombre_departamento_selected + "-" + $scope.nombre_municipio_selected + ")";
                    $scope.Cliente.paisdepartmunic_dir_casa = {
                        id_pais: $scope.pais_global,
                        id_depart: $scope.departamento_global,
                        id_municipio: $scope.municipio_global
                    };
                    $scope.Cliente.observacion_dir_casa = null;
                    $('#template_direccion').closeModal();
                } else {
                    if ($scope.var_global_direcciones == 'direccion_trabajo') {
                        $scope.Cliente.direccion_trabajo = $scope.direccionResult + "(" + $scope.nombre_departamento_selected + "-" + $scope.nombre_municipio_selected + ")";
                        $scope.Cliente.paisdepartmunic_dir_trabajo = {
                            id_pais: $scope.pais_global,
                            id_depart: $scope.departamento_global,
                            id_municipio: $scope.municipio_global
                        };
                        $scope.Cliente.observacion_dir_trabajo = null;
                        $('#template_direccion').closeModal();
                    } else {
                        if ($scope.var_global_direcciones == 'direccion_entrega') {
                            $scope.Cliente.direccion_entrega = $scope.direccionResult + "(" + $scope.nombre_departamento_selected + "-" + $scope.nombre_municipio_selected + ")";
                            $scope.Cliente.paisdepartmunic_dir_entrega = {
                                id_pais: $scope.pais_global,
                                id_depart: $scope.departamento_global,
                                id_municipio: $scope.municipio_global
                            };
                            $scope.Cliente.observacion_dir_casa = null;
                        }
                        $('#template_direccion').closeModal();
                    }
                }
                $scope.direccionResult = "";
                $scope.departamento_global = null;
                $scope.municipio_global = null;
            };
            $scope.$on('Login:End', function (event, MsgError, LoginOk) {
                if (LoginOk) {
                    $scope.guardarCookie();
                } else {
                    //scope.objectDialog.AlertDialog(MsgError);
                }
            });
            //************************************************************ PQRS ******************************************************
            $scope.data_current_user = {
                id: null,
                id_centro_operacion: null,
                id_area_solicitante: null,
                sede_ubicacion: null,
                telefono_solicitante: null
            }
            $scope.PQRS = {
                documento_cliente: null,
                clasificacion: null, // P, Q, R ó S
                observaciones: null,
                id_peticion: null, // id tickets
                id_area: null,
                id_caso: null,  // tipologia seleccionada
                id_centro_operativo: null,
                id_area_solicitante: null,
                id_sede_ubicacion: null,
                subject: null,
                id_usuario: null,
                telefono_solicitante: null,
                id_modelo_aprobacion: null,
                id_centro_operacion_seleccionado: null,
                producto: null,
                numero_factura: null

            };
            $scope.img_pqrs_habilitada = null;
            $scope.obj_clasificaciones_pqrs = {
                id: null,
                descripcion: null,
                ruta_imagen: null,
                area_gestion: null,
                opacidad: null
            };
            $scope.show_observaciones_pqrs = false;
            $scope.show_formulario_preguntas = function (clasificacion) {
                // muestro el campo de observacion
                $scope.show_observaciones_pqrs = true;
                $scope.obj_clasificaciones_pqrs = {
                    id: clasificacion.id,
                    descripcion: clasificacion.descripcion,
                    ruta_imagen: "Assets/img/PQRS/" + clasificacion.id + ".png",
                    area_gestion: clasificacion.area_gestion,
                    opacidad: 0.4
                };
                $scope.PQRS.clasificacion = clasificacion.id;
                $scope.get_tipologia_pqrs($scope.obj_clasificaciones_pqrs);
                $scope.inhabilita_boton_pqrs(clasificacion);
            };

            $scope.get_tipologia_pqrs = function (clasificacion) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_tipologias_pqrs", JSON.stringify(clasificacion), {
                }).then(function (result) {
                    $scope.lista_tipificacion_segun_clasificacion_pqrs = [];
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data == null) return;
                    if (result.data.data[0].length < 1) return;
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        $scope.obj_tipificacion = {
                            id_caso: result.data.data[0][i].cs_IdCaso,
                            descripcion_caso: result.data.data[0][i].Descripcion,
                            sw_requiere_datos_clientes: result.data.data[0][i].sw_requiere_datos_cliente
                        };
                        $scope.lista_tipificacion_segun_clasificacion_pqrs.push($scope.obj_tipificacion);
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };
            $scope.inhabilita_boton_pqrs = function (clasificacion) {
                for (var i = 0; i < $scope.lista_clasificaciones_pqrs.length; i++) {
                    if ($scope.lista_clasificaciones_pqrs[i].id != clasificacion.id) {
                        $scope.lista_clasificaciones_pqrs[i].opacidad = 0.3;
                    } else {
                        $scope.lista_clasificaciones_pqrs[i].opacidad = 1;
                    }
                }
            };
            $scope.get_data_current_user = function (user_id) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_data_current_user", JSON.stringify(user_id), {
                }).then(function (result) {
                    if (result === null) return;
                    if (result.data === null) return;
                    if (result.data.data[0] === null) return;
                    if (result.data.data.length < 1) return;
                    var pn = (result.data.data[0][0].PrimerNombre == null || result.data.data[0][0].PrimerNombre == "null" || result.data.data[0][0].PrimerNombre == "") ? "" : result.data.data[0][0].PrimerNombre;// text.substring(0, 1).toUpperCase() + text.substring(1),
                    var var_nombre_usuario = (pn === "") ? "" : pn.substring(0, 1).toUpperCase() + pn.substring(1).toLowerCase();
                    var sn = (result.data.data[0][0].PrimerApellido == null || result.data.data[0][0].PrimerApellido == "null" || result.data.data[0][0].PrimerApellido == "") ? "" : result.data.data[0][0].PrimerApellido.trim();
                    var_nombre_usuario += (sn === "") ? "" : " " + sn.substring(0, 1).toUpperCase() + sn.substring(1).toLowerCase();
                    $scope.data_current_user = {
                        id: result.data.data[0][0].cs_IdUsuario,
                        id_centro_operacion: result.data.data[0][0].c_centro_operacion,
                        id_area_solicitante: result.data.data[0][0].cs_IdArea,
                        sede_ubicacion: result.data.data[0][0].c_sede_ubicacion,
                        telefono_solicitante: result.data.data[0][0].Telefono,
                        nombre_usuario: var_nombre_usuario,
                        nombre_area: result.data.data[0][0].DescripcionArea,
                        correo_usuario: result.data.data[0][0].UserName,
                        ruta_foto_perfil: result.data.data[0][0].Ruta_FotoPerfil,
                        nombre_foto_perfil: result.data.data[0][0].Nombre_FotoPerfil,
                        extencion: result.data.data[0][0].ext_FotoPerfil,
                        correo: result.data.data[0][0].UserName,
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };

            $scope.text_tipificacion_seleccionada = null;
            $scope.set_data_tipificacion = function (tipificacion_id) {
                for (var i=0; i<$scope.lista_tipificacion_segun_clasificacion_pqrs.length; i++){
                    if ($scope.lista_tipificacion_segun_clasificacion_pqrs[i].id_caso == tipificacion_id) {
                        $scope.text_tipificacion_seleccionada = $scope.lista_tipificacion_segun_clasificacion_pqrs[i].descripcion_caso;
                        $scope.sw_global_indica_requiere_datos_clientes = $scope.lista_tipificacion_segun_clasificacion_pqrs[i].sw_requiere_datos_clientes;
                    
                        break;
                    }
                }
            }
        
            $scope.carga_clasificacion_pqrs = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_carga_clasificacion_pqrs", JSON.stringify(), {
                }).then(function (result) {
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data == null) return;
                    if (result.data.data[0].length < 1) return;
                    $scope.lista_clasificaciones_pqrs = [];
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        $scope.obj_clasificaciones_pqrs = {
                            id: result.data.data[0][i].c_clasificacion_pqrs,
                            descripcion: result.data.data[0][i].d_clasificacion_pqrs,
                            ruta_imagen: $scope.DNS + result.data.data[0][i].imagen_clasificacion_pqrs,
                            area_gestion: result.data.data[0][i].c_area_gestion_sln,
                            opacidad: 0.4
                        }
                        $scope.lista_clasificaciones_pqrs.push($scope.obj_clasificaciones_pqrs);
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };

            $scope.crear_pqrs_2 = function (pqrs) {
                $scope.objectDialog.LoadingDialog('Guardando...');
                var text_validacion = "";
                var requerido = false;
                if (pqrs.clasificacion == null || pqrs.clasificacion == "null" || pqrs.clasificacion == "") {
                    text_validacion += "El campo clasificación es requerido. \n";
                    requerido = true;
                }
                if (pqrs.observaciones == null || pqrs.observaciones == "null" || pqrs.observaciones == "") {
                    text_validacion += "El campo observación es requerido. \n";
                    requerido = true;
                }
                if (pqrs.tipificacion == null || pqrs.tipificacion == "null" || pqrs.tipificacion == "") {
                    text_validacion += "El campo tipología es requerido. \n";
                    requerido = true;
                }
                if (requerido) {
                    text_validacion += "Verifique por favor he intente de nuevo.";
                    angular.showWarning(text_validacion);
                    return;
                }
                $scope.PQRS = {
                    documento_cliente: $scope.Cliente.documento,
                    clasificacion: pqrs.clasificacion, // P, Q, R ó S
                    observaciones: pqrs.observaciones,
                    id_peticion: null,
                    id_area: $scope.obj_clasificaciones_pqrs.area_gestion,
                    id_caso: pqrs.tipificacion, // tipologia seleccionada
                    id_centro_operativo: $scope.data_current_user.id_centro_operacion,
                    id_area_solicitante: $scope.data_current_user.id_area_solicitante,
                    id_sede_ubicacion: $scope.data_current_user.sede_ubicacion,
                    subject: $scope.text_tipificacion_seleccionada,
                    id_usuario: $scope.data_current_user.id,
                    telefono_solicitante: $scope.data_current_user.telefono_solicitante,
                    id_modelo_aprobacion: null, // Por ahora es null (Erika)
                    id_centro_operacion_seleccionado: pqrs.id_centro_operacion_seleccionado,
                    producto: pqrs.producto,
                    numero_factura: pqrs.numero_factura,
                    sw_requiere_datos_cliente: $scope.sw_global_indica_requiere_datos_clientes,
                };
                var var_services_crear_pqrs = {
                    "IN_ID_AREA": $scope.obj_clasificaciones_pqrs.area_gestion, 
                    "IN_ID_CASO": pqrs.tipificacion,
                    "IN_ID_CENTRO_OPERATIVO": $scope.data_current_user.id_centro_operacion,
                    "IN_ID_AREA_SOLICITANTE": $scope.data_current_user.id_area_solicitante,
                    "IN_ID_SEDE_UBICACION": $scope.data_current_user.sede_ubicacion,
                    "IN_SUBJECT": $scope.text_tipificacion_seleccionada,
                    "IN_ID_USUARIO": $scope.data_current_user.id,
                    "IN_TELEFONO_SOLICITANTE": $scope.data_current_user.telefono_solicitante,
                    "IN_ID_ESTADO": 1,
                    "IN_ID_MODELO_APROBACION": null,
                    "IN_LOG_INSERT": $scope.data_current_user.id,
                    "IN_DESCRIPCION":  pqrs.observaciones,
                    "IN_SW_DESCRIPCION_PETICION": 1,
                    "IN_CS_ID_TIPO_NOVEDAD": 1,
                    "IN_ID_ALARMA": 1,
                    "IN_ID_APLICACION": 4,
                    "IN_ID_OPCION_APLICACION": 2
                }
                $http.post(TreidConfigSrv.ApiUrls.Url_Crear_PQRS + "crear_pqrs", JSON.stringify(var_services_crear_pqrs), {
                }).then(function (result) {
                    // Aqui optengo el id del tickets
                    var A = result.data.Msg;
                    //if (result.data.Msg == "GUARDADO") {
                        $scope.global_fecha_tentativa = result.data.ParamResult3;
                        $scope.global_nombre_servidor = result.data.ParamResult5;
                        $scope.global_correo_servidor = result.data.ParamResult4;
                        $scope.global_id_peticion = result.data.ParamResult2;
                        $scope.global_tipologia = $scope.obj_clasificaciones_pqrs.descripcion;// $scope.text_tipificacion_seleccionada;
                        $scope.PQRS.id_peticion = result.data.ParamResult2;
                        $scope.insertar_descripcion_pqrs($scope.PQRS);
                        angular.showSuccess('Solictud PQRS guardada en base de datos de manera satisfactoria.');
                        $scope.limpia_campos_PQRS();
                        $('#modal_pqrs').closeModal();
                    //} else {
                    //    angular.showAlert('Ocurrio un error al guardar, por favor intente nuevo.');
                    //}
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };
            
            $scope.Limpiar_form_PQRS = function () {
                $scope.limpia_campos_PQRS();
                for (var i = 0; i < $scope.lista_centros_operaciones.length; i++) {
                    if ($scope.lista_centros_operaciones) {
                        $scope.lista_centros_operaciones[i].is_checked = false;
                        $scope.lista_centros_operaciones[i].is_show = true;
                    }
                }
            }
        

            $scope.insertar_relacion_cliente_peticion = function (data_pqrs) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "insertar_relacion_cliente_peticion", JSON.stringify(data_pqrs), {
                }).then(function (result) {
                    $scope.insertar_data_adicional_pqrs(data_pqrs); 
                    $scope.area_asignada_pqrs = result.data.data[0][0].DESC_AREA_ASIGNADA_PQRS;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };

            $scope.insertar_data_adicional_pqrs = function (data_pqrs) {
                data_pqrs.requiere_datos_cliente = $scope.sw_global_indica_requiere_datos_clientes;
                data_pqrs.id_usuario = $scope.cs_id_usuario;
                data_pqrs.descripcion_datos_clientes = "";
                data_pqrs.descripcion_datos_clientes = "<b>Nombres: </b>" + $scope.Cliente.nombres + " " + $scope.Cliente.apellidos + "<br/>";
                data_pqrs.descripcion_datos_clientes += ($scope.Cliente.celular == null || $scope.Cliente.celular == "null" || $scope.Cliente.celular == "") ? "" : "<b>Celular: </b>" + $scope.Cliente.celular + "<br/>";
                data_pqrs.descripcion_datos_clientes += ($scope.Cliente.correo == null || $scope.Cliente.correo == "null" || $scope.Cliente.correo == "") ? "" : "<b>Correo: </b>" + $scope.Cliente.correo + "<br/>";
                data_pqrs.descripcion_datos_clientes += ($scope.Cliente.direccion_casa == null || $scope.Cliente.direccion_casa == "null" || $scope.Cliente.direccion_casa == "") ? "" : "<b>Dirección: </b>" + $scope.Cliente.direccion_casa + "<br/>";
                data_pqrs.descripcion_datos_clientes += ($scope.Cliente.paisdepartmunic_dir_casa.descripcion_pais == null || $scope.Cliente.paisdepartmunic_dir_casa.descripcion_pais == "null" || $scope.Cliente.paisdepartmunic_dir_casa.descripcion_pais == "") ? "" : "<b>Pais: </b>" + $scope.Cliente.paisdepartmunic_dir_casa.descripcion_pais + "<br/>";
                data_pqrs.descripcion_datos_clientes += ($scope.Cliente.paisdepartmunic_dir_casa.descripcion_depart == null || $scope.Cliente.paisdepartmunic_dir_casa.descripcion_depart == "null" || $scope.Cliente.paisdepartmunic_dir_casa.descripcion_depart == "") ? "" : "<b>Departamento: </b>" + $scope.Cliente.paisdepartmunic_dir_casa.descripcion_depart + "<br/>";
                data_pqrs.descripcion_datos_clientes += ($scope.Cliente.paisdepartmunic_dir_casa.descripcion_municipio == null || $scope.Cliente.paisdepartmunic_dir_casa.descripcion_municipio == "null" || $scope.Cliente.paisdepartmunic_dir_casa.descripcion_municipio == "") ? "" : "<b>Municipio: </b>" + $scope.Cliente.paisdepartmunic_dir_casa.descripcion_municipio + "<br/>";
                data_pqrs.descripcion_datos_clientes += ($scope.Cliente.telefono_casa == null || $scope.Cliente.telefono_casa == "null" || $scope.Cliente.telefono_casa == "") ? "" : "<b>Telefono: </b>" + $scope.Cliente.telefono_casa + "<br/>";
                //*** Descripcion productos, centros operaciones y factura
                data_pqrs.descripcion_detalles_PQRS = null;
                var bandera = true;
                if ($scope.lista_centros_operaciones.length > -1) {
                    for (var i = 0; i < $scope.lista_centros_operaciones.length; i++) {
                        if ($scope.lista_centros_operaciones[i].is_checked == true) {
                            if (bandera) {
                                data_pqrs.descripcion_detalles_PQRS = "<b>Centros operativos: </b> <br/>";
                                bandera = false;
                            }
                            data_pqrs.descripcion_detalles_PQRS += $scope.lista_centros_operaciones[i].descripcion + "<br/>";
                        }
                    }
                }
                if (data_pqrs.producto != null && data_pqrs.producto != "null" && data_pqrs.producto != "") {
                    if (bandera) {
                        data_pqrs.descripcion_detalles_PQRS = "<b>Producto: </b>" + data_pqrs.producto + "<br/>";
                        bandera = false;
                    } else {
                        data_pqrs.descripcion_detalles_PQRS += "<b>Producto: </b>" + data_pqrs.producto + "<br/>";
                    }
                }
                if (data_pqrs.numero_factura != null && data_pqrs.numero_factura != "null" && data_pqrs.numero_factura != "") {
                    if (bandera) {
                        data_pqrs.descripcion_detalles_PQRS = "<b>Factura: </b>" + data_pqrs.numero_factura + "<br/>";
                        bandera = false;
                    } else {
                        data_pqrs.descripcion_detalles_PQRS += "<b>Factura: </b>" + data_pqrs.numero_factura + "<br/>";
                    }
                }

                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "insertar_data_adicional_pqrs", JSON.stringify(data_pqrs), {
                }).then(function (result) {
                    for (var i = 0; i < $scope.lista_centros_operaciones.length; i++) {
                        if ($scope.lista_centros_operaciones[i].is_checked == true) {
                            $scope.obj_centro_operacion = {
                                id: $scope.lista_centros_operaciones[i].id,
                                descripcion: $scope.lista_centros_operaciones[i].descripcion,
                                is_checked: null, // indicando que no ha sido seleccionado.
                                instacia_id_centro_operacion_seleccionado: $scope.lista_centros_operaciones[i].id,
                                id_peticion: data_pqrs.id_peticion
                            }
                            $scope.insertar_data_adicional_centros_operativos_pqrs($scope.obj_centro_operacion);
                        }
                    }
                    var obj_data_cliente = {
                        numero_identificacion: $scope.Cliente.documento
                    }
                    $scope.consultar_cliente(obj_data_cliente);
                    //*** TODA LA LISTA DE CENTROS OPERACION LAS DESELECCIONO.
                    for (var l = 0; l < $scope.lista_centros_operaciones.length; l++) {
                        if ($scope.lista_centros_operaciones[l].is_checked == true || $scope.lista_centros_operaciones[l].is_checked == "true") {
                            $scope.lista_centros_operaciones[l].is_checked = false;
                        }
                    }
                    // ENVIA CORREOS
                    $scope.id_peticion_envio_correo = data_pqrs.id_peticion;
                    $scope.enviar_correos(data_pqrs);
                    $scope.objectDialog.HideDialog();
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };
            
            $scope.enviar_correos = function (data_pqrs) {
                var obj_requerimientos_correo = {
                    id_novedad: 1,
                    id_peticion: $scope.global_id_peticion,
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_plantillas_correos_crear_pqrs", JSON.stringify(obj_requerimientos_correo), {
                }).then(function (result) {
                    if(result == null) return;
                    if(result.data == null) return;
                    if(result.data.data[0] == null) return;
                    if (result.data.data[0].length < 1) return;
                    var correo_1 = {
                        nombreUsuario: $scope.data_current_user.nombre_usuario,
                        id_tickets: $scope.global_id_peticion,
                        subject: $scope.text_tipificacion_seleccionada, // PREGUNTAS, QUEJAS, RECLAMOS Ó SUJERENCIAS
                        area: "Servicio al cliente.",// $scope.area_asignada_pqrs, // $scope.data_current_user.nombre_area, 
                        ticket_type: $scope.area_asignada_pqrs, // TIPOLOGIA
                        due_by_time: $scope.global_fecha_tentativa, // FECHA TENTATIVA
                        agent_name: $scope.global_nombre_servidor,
                        status: "Abierto",
                        url: $scope.URL_TICKETS + $scope.global_id_peticion, // URL TICKETS
                    }

                    var plantilla_1 = result.data.data[0][0].plantilla;
                    plantilla_1 = plantilla_1.replace("{{ticket.solicitante}}", correo_1.nombreUsuario); 
                    plantilla_1 = plantilla_1.replace("{{ticket.id}}", correo_1.id_tickets);
                    plantilla_1 = plantilla_1.replace("{{ticket.subject}}", correo_1.subject);
                    plantilla_1 = plantilla_1.replace("{{ticket.Area}}", correo_1.area);
                    plantilla_1 = plantilla_1.replace("{{ticket.ticket_type}}", correo_1.ticket_type);
                    plantilla_1 = plantilla_1.replace("{{ticket.due_by_time}}", correo_1.due_by_time);
                    plantilla_1 = plantilla_1.replace("{{ticket.agent.name}}", correo_1.agent_name);
                    plantilla_1 = plantilla_1.replace("{{ticket.status}}", correo_1.status);
                    plantilla_1 = plantilla_1.replace("{{ticket.url}}", correo_1.url);
                    var obj_plantilla = {
                        contenido_html: plantilla_1, 
                        correo_destino: $scope.data_current_user.correo_usuario,// $scope.data_current_user.correo_usuario //  
                        asunto: $scope.global_tipologia + "(PQRS)" // $scope.global_tipologia,
                    }
                    // *** llamo en metodo que envia mail al Agente que crea el Tickets
                    if (result.data.data[0][1].idPerfil == 2) {
                        $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "enviar_correo", JSON.stringify(obj_plantilla), {
                        }).then(function (result) {
                            var ughuihiohih = null;
                        }).catch(function (data) {
                            $scope.Error.value = true;
                        });
                    }
                
                    var correo_2 = {  
                        agent_name: $scope.global_nombre_servidor,
                        id_tickets: $scope.global_id_peticion,
                        subject: $scope.text_tipificacion_seleccionada, // $scope.global_tipologia + "(PQRS)",
                        description: data_pqrs.observaciones,
                        user: $scope.data_current_user.nombre_usuario,// $scope.global_nombre_servidor,
                        email: $scope.data_current_user.correo_usuario, // $scope.global_correo_servidor, 
                        url: $scope.URL_TICKETS + $scope.global_id_peticion, // URL TICKETS
                    }
                    var plantilla_2 = result.data.data[0][1].plantilla;
                    plantilla_2 = plantilla_2.replace("{{ticket.agent.name}}", correo_2.agent_name);
                    plantilla_2 = plantilla_2.replace("{{ticket.subject}}", correo_2.subject);
                    plantilla_2 = plantilla_2.replace("{{ticket.id}}", correo_2.id_tickets);
                    plantilla_2 = plantilla_2.replace("{{comment.description}}", correo_2.description);
                    plantilla_2 = plantilla_2.replace("{{ticket.user}}", correo_2.user);
                    plantilla_2 = plantilla_2.replace("{{ticket.email}}", correo_2.email);
                    plantilla_2 = plantilla_2.replace("{{ticket.url}}", correo_2.url);
                    var obj_plantilla_2 = {
                        contenido_html: plantilla_2,
                        correo_destino: $scope.global_correo_servidor,// 
                        asunto: $scope.global_tipologia + "(PQRS)",// $scope.global_tipologia,
                    }
                    // *** llamo en metodo que envia mail a quien crea el Tickets
                    if (result.data.data[0][0].idPerfil == 3) {
                        $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "enviar_correo", JSON.stringify(obj_plantilla_2), {
                        }).then(function (result) {
                            var ughdduihiohih = null;
                        }).catch(function (data) {
                            $scope.Error.value = true;
                        });
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
        
            $scope.enviar_correos_post_comentarios = function (descripcion_pqrs) {
                var obj_requerimientos_correo = {
                    id_novedad: 2,
                    id_peticion: $scope.obj_PQRS_cliente.id_peticion,
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_plantillas_correos_crear_pqrs", JSON.stringify(obj_requerimientos_correo), {
                }).then(function (result) {
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data[0] == null) return;
                    if (result.data.data[0].length < 1) return;

                    var asunto_mail = result.data.data[1][0].DescripcionArea;
                    var var_subject = result.data.data[1][0].Subject;
                    var nombres_propietarios_pqrs = result.data.data[1][0].PrimerNombre + " " + result.data.data[1][0].PrimerApellido;
                    var correo_propietarios_pqrs = result.data.data[1][0].UserName;
                    //*** DATA DE QUIEN CREA EL TICKETS
                    var correo_1 = {
                        nombreUsuario: $scope.data_current_user.nombre_usuario, 
                        id_tickets: $scope.obj_PQRS_cliente.id_peticion,
                        subject: var_subject, 
                        area: $scope.data_current_user.nombre_area,
                        url: /*$scope.DNS +*/ $scope.URL_TICKETS + $scope.global_id_peticion, // URL TICKETS
                        comment: descripcion_pqrs,
                    }
                    //*** el encargado de resolver el tickets
                    var plantilla_1 = result.data.data[0][0].plantilla;
                    plantilla_1 = plantilla_1.replace("{{comment.body}}", correo_1.comment);
                    plantilla_1 = plantilla_1.replace("{{ticket.solicitante}}", correo_1.nombreUsuario);
                    plantilla_1 = plantilla_1.replace("{{ticket.id}}", correo_1.id_tickets);
                    plantilla_1 = plantilla_1.replace("{{ticket.subject}}", correo_1.subject);
                    plantilla_1 = plantilla_1.replace("{{ticket.Area}}", correo_1.area);
                    plantilla_1 = plantilla_1.replace("{{ticket.url}}", correo_1.url);
                    var obj_plantilla = {
                        contenido_html: plantilla_1,
                        correo_destino: $scope.data_current_user.correo_usuario, 
                        asunto: asunto_mail 
                    }
                     //*** llamo en metodo que envia mail al Agente que crea el Tickets
                    if (result.data.data[0][1].idPerfil == 2) {
                        $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "enviar_correo", JSON.stringify(obj_plantilla), {
                        }).then(function (result) {
                            var ughuihiohih = null;
                        }).catch(function (data) {
                            $scope.Error.value = true;
                        });
                    }
                    // DATA DEL DUEÑO DEL TICKETS
                    var correo_2 = {
                        comment: descripcion_pqrs,
                        agent_name: nombres_propietarios_pqrs,
                        id_tickets: $scope.obj_PQRS_cliente.id_peticion,
                        subject: var_subject,
                        url: $scope.URL_TICKETS + $scope.global_id_peticion, // URL TICKETS
                    }
                    var plantilla_2 = result.data.data[0][1].plantilla;
                    plantilla_2 = plantilla_2.replace("{{ticket.agent.name}}", correo_2.agent_name);
                    plantilla_2 = plantilla_2.replace("{{ticket.id}}", correo_2.id_tickets);
                    plantilla_2 = plantilla_2.replace("{{ticket.subject}}", correo_2.subject);
                    plantilla_2 = plantilla_2.replace("{{comment.body}}", correo_2.comment);
                    plantilla_2 = plantilla_2.replace("{{ticket.url}}", correo_2.url);

                    var obj_plantilla_2 = {
                        contenido_html: plantilla_2,
                        correo_destino: $scope.global_correo_servidor, 
                        asunto: asunto_mail, // var_asunto
                    }
                    // *** llamo en metodo que envia mail a quien crea el Tickets
                    if (result.data.data[0][0].idPerfil == 3) {
                        $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "enviar_correo", JSON.stringify(obj_plantilla_2), {
                        }).then(function (result) {
                            var ughdduihiohih = null;
                        }).catch(function (data) {
                            $scope.Error.value = true;
                        });
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }

            $scope.insertar_data_adicional_centros_operativos_pqrs = function (data_pqrs) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "insertar_data_adicional_centros_operativos_pqrs", JSON.stringify(data_pqrs), {
                }).then(function (result) {
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };
            $scope.insertar_descripcion_pqrs = function (pqrs) {
                $scope.obj_descripcion_pqrs = {
                    id_peticion: pqrs.id_peticion,
                    descipcion: pqrs.observaciones, // aqui si se va a guardar
                    sw_descipcion_peticion: 1, // se guarda al crear el tickets, por esta razon es 1.
                    id_tipo_novedad: 1, // 1 Ingreso nuevo Tickets
                    id_usuario: pqrs.id_usuario
                };
                $scope.insertar_relacion_cliente_peticion(pqrs); 
            };
            $scope.get_cometarios_tickets = function (pqrs) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_cometarios_tickets", JSON.stringify(pqrs), {
                }).then(function (result) {
                    $scope.obj_PQRS_cliente.fecha_cierre_tickets = null;
                    $scope.get_centros_operativos_tickets(pqrs);
                    pqrs.lista_comentario_tickets = [];
                    if (result.data == null) return;
                    if (result.data.data == null) return;
                    if (result.data.data[0] == null) return;
                    if (result.data.data[0].length < 1) return;
                    if (result.data.data[0][0].d_estado_ticket == "Cerrado" || result.data.data[0][0].d_estado_ticket == "Resuelto") {
                        $scope.puede_crear_comentario_PQRS = false;
                    } else {
                        $scope.puede_crear_comentario_PQRS = true;
                    }
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        var primer_nombre_usuario_creo_descripcion = (result.data.data[0][i].PrimerNombre == null || result.data.data[0][i].PrimerNombre == "null" || result.data.data[0][i].PrimerNombre == "") ? "" : result.data.data[0][i].PrimerNombre;
                        var segundo_nombre_usuario_creo_descripcion = (result.data.data[0][i].SegundoNombre == null || result.data.data[0][i].SegundoNombre == "null" || result.data.data[0][i].SegundoNombre == "") ? "" : result.data.data[0][i].SegundoNombre;
                        var primer_apellido_usuario_creo_descripcion = (result.data.data[0][i].PrimerApellido == null || result.data.data[0][i].PrimerApellido == "null" || result.data.data[0][i].PrimerApellido == "") ? "" : result.data.data[0][i].PrimerApellido;
                        var segundo_apellido_usuario_creo_descripcion = (result.data.data[0][i].SegundoApellido == null || result.data.data[0][i].SegundoApellido == "null" || result.data.data[0][i].SegundoApellido == "") ? "" : result.data.data[0][i].SegundoApellido;
                        var fc = moment(result.data.data[0][i].fh_creacion).add(5, "hours");
                        var var_fecha_creacion = fc.format("LLLL");
                        var obj_comentario = {
                            cs_IdDescripcionTicket: result.data.data[0][i].cs_IdDescripcionTicket,
                            descripcion: result.data.data[0][i].Descripcion,
                            sw_DescripcionPeticion: result.data.data[0][i].sw_DescripcionPeticion,
                            cs_IdTipoNovedad: result.data.data[0][i].cs_IdTipoNovedad,
                            log_insert: result.data.data[0][i].log_insert,
                            fh_creacion: var_fecha_creacion,
                            ruta_imagen_comentario_pqrs: [],
                            nombre_usuario_crea_descripcion_pqrs: primer_nombre_usuario_creo_descripcion
                                                                    + " " + primer_apellido_usuario_creo_descripcion
                        }
                        if (obj_comentario.cs_IdTipoNovedad === 4) { // Ticket Cerrado
                            //*** Asigno la fecha en que fue cerrado el PQRS.
                            $scope.obj_PQRS_cliente.fecha_cierre_tickets = obj_comentario.fh_creacion;
                        }
                        pqrs.lista_comentario_tickets.push(obj_comentario);
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            
            $scope.get_centros_operativos_tickets = function (pqrs) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_centros_operativos_tickets", JSON.stringify(pqrs), {
                }).then(function (result) {
                    $scope.get_archivos_pqrs(pqrs);
                    $scope.obj_PQRS_cliente.centro_operativo = "";
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data[0] == null) return;
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        $scope.obj_PQRS_cliente.centro_operativo += " - " + result.data.data[0][i].d_centro_operacion;
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.cantidad_P = 0;
            $scope.cantidad_Q = 0;
            $scope.cantidad_R = 0;
            $scope.cantidad_S = 0;

            $scope.get_cantidad_pqrs = function (Cliente) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_cantidad_pqrs", JSON.stringify(Cliente), {
                }).then(function (result) {
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data == null) return;
                    if (result.data.data[0] == null) return;
                    if (result.data.data[0].length < 1) return;
                    for (var i = 0; i < result.data.data[0].length; i++){
                        switch (result.data.data[0][i].c_clasificacion_pqrs) {
                            case "P":
                                $scope.cantidad_P = (result.data.data[0][i].cantidad == null
                                                        || result.data.data[0][i].cantidad == "null"
                                                        || result.data.data[0][i].cantidad == "") ? 0 : result.data.data[0][i].cantidad;
                                break;
                            case "Q":
                                $scope.cantidad_Q = (result.data.data[0][i].cantidad == null
                                                        || result.data.data[0][i].cantidad == "null"
                                                        || result.data.data[0][i].cantidad == "") ? 0 : result.data.data[0][i].cantidad;
                                break;
                            case "R":
                                $scope.cantidad_R = (result.data.data[0][i].cantidad == null
                                                        || result.data.data[0][i].cantidad == "null"
                                                        || result.data.data[0][i].cantidad == "") ? 0 : result.data.data[0][i].cantidad;
                                break;
                            case "S":
                                $scope.cantidad_S = (result.data.data[0][i].cantidad == null 
                                                        || result.data.data[0][i].cantidad == "null"
                                                        || result.data.data[0][i].cantidad == "") ? 0 : result.data.data[0][i].cantidad;
                                break;
                        }
                    }
                    $scope.cantidad_P_Total += Number($scope.cantidad_P);
                    $scope.cantidad_Q_Total += Number($scope.cantidad_Q);
                    $scope.cantidad_R_Total += Number($scope.cantidad_R);
                    $scope.cantidad_S_Total += Number($scope.cantidad_S);
                    $scope.total_pqrs_abiertas = Number($scope.cantidad_P) + Number($scope.cantidad_Q) + Number($scope.cantidad_R) + Number($scope.cantidad_S);
                    $scope.total_pqrs_totales += $scope.total_pqrs_abiertas;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.cantidad_P_Total = 0;
            $scope.cantidad_Q_Total = 0;
            $scope.cantidad_R_Total = 0;
            $scope.cantidad_S_Total = 0;

            $scope.cantidad_P_cerrada = 0;
            $scope.cantidad_Q_cerrada = 0;
            $scope.cantidad_R_cerrada = 0;
            $scope.cantidad_S_cerrada = 0;
            $scope.get_cantidad_pqrs_cerrados = function (Cliente) {
                //***
                $scope.limpiar_cantidad_pqrs();
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_cantidad_pqrs_cerrados", JSON.stringify(Cliente), {
                }).then(function (result) {
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data == null) return;
                    if (result.data.data[0] == null) return;
                    if (result.data.data[0].length < 1) return;
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        switch (result.data.data[0][i].c_clasificacion_pqrs) {
                            case "P":
                                $scope.cantidad_P_cerrada = (result.data.data[0][i].cantidad == null
                                                        || result.data.data[0][i].cantidad == "null"
                                                        || result.data.data[0][i].cantidad == "") ? 0 : result.data.data[0][i].cantidad;
                                break;
                            case "Q":
                                $scope.cantidad_Q_cerrada = (result.data.data[0][i].cantidad == null
                                                        || result.data.data[0][i].cantidad == "null"
                                                        || result.data.data[0][i].cantidad == "") ? 0 : result.data.data[0][i].cantidad;
                                break;
                            case "R":
                                $scope.cantidad_R_cerrada = (result.data.data[0][i].cantidad == null
                                                        || result.data.data[0][i].cantidad == "null"
                                                        || result.data.data[0][i].cantidad == "") ? 0 : result.data.data[0][i].cantidad;
                                break;
                            case "S":
                                $scope.cantidad_S_cerrada = (result.data.data[0][i].cantidad == null
                                                        || result.data.data[0][i].cantidad == "null"
                                                        || result.data.data[0][i].cantidad == "") ? 0 : result.data.data[0][i].cantidad;
                                break;
                        }
                    }
                    $scope.cantidad_P_Total += Number($scope.cantidad_P_cerrada);
                    $scope.cantidad_Q_Total += Number($scope.cantidad_Q_cerrada);
                    $scope.cantidad_R_Total += Number($scope.cantidad_R_cerrada);
                    $scope.cantidad_S_Total += Number($scope.cantidad_S_cerrada);
                    $scope.total_pqrs_cerradas = Number($scope.cantidad_P_cerrada) + Number($scope.cantidad_Q_cerrada) + Number($scope.cantidad_R_cerrada) + Number($scope.cantidad_S_cerrada);
                    $scope.total_pqrs_totales += $scope.total_pqrs_cerradas;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.lista_PQRS = [];
            $scope.nombre_completo_solicitante = null;
            $scope.fecha_creacion_tickets = null;
            $scope.fecha_cierre_tickets = null;
            $scope.estado_tickets = null;
            //*** consulta
            $scope.consultar_pqrs_cliente = function (Cliente) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "consultar_pqrs_cliente", JSON.stringify(Cliente), {
                }).then(function (result) {
                    $scope.limpiar_cantidad_pqrs();

                    $scope.get_cantidad_pqrs($scope.Cliente);
                    $scope.get_cantidad_pqrs_cerrados($scope.Cliente);

                    $scope.cantidad_P_Total += Number($scope.cantidad_P_cerrada);
                    $scope.cantidad_Q_Total += Number($scope.cantidad_Q_cerrada);
                    $scope.cantidad_R_Total += Number($scope.cantidad_R_cerrada);
                    $scope.cantidad_S_Total += Number($scope.cantidad_S_cerrada);
                    $scope.total_pqrs_cerradas = Number($scope.cantidad_P_cerrada) + Number($scope.cantidad_Q_cerrada) + Number($scope.cantidad_R_cerrada) + Number($scope.cantidad_S_cerrada);
                    $scope.total_pqrs_totales += $scope.total_pqrs_cerradas;

                    $scope.set_lista_pqrs(result);
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };
            $scope.get_plantillas_mail_nuevo_ticket = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_plantillas_mail_nuevo_ticket", JSON.stringify(), {
                }).then(function (result) {
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };
        
            $scope.set_lista_pqrs = function (result) {
                $scope.lista_PQRS = [];
                if (result == null) return;
                if (result.data == null) return;
                if (result.data.data[0] == null) return;
                if (result.data.data[0].length < 1) return;

                for (var i = 0; i < result.data.data[0].length; i++) {
                    var primer_nombres = (result.data.data[0][i].PrimerNombre == null || result.data.data[0][0].PrimerNombre == "null" || result.data.data[0][0].PrimerNombre == "") ? null : result.data.data[0][0].PrimerNombre;
                    var segundo_nombres = (result.data.data[0][0].SegundoNombre == null || result.data.data[0][0].SegundoNombre == "null" || result.data.data[0][0].SegundoNombre == "") ? null : result.data.data[0][0].SegundoNombre;
                    var primer_apellido = (result.data.data[0][0].PrimerApellido == null || result.data.data[0][0].PrimerApellido == "null" || result.data.data[0][0].PrimerApellido == "") ? null : result.data.data[0][0].PrimerApellido;
                    var segundo_apellido = (result.data.data[0][0].SegundoApellido == null || result.data.data[0][0].SegundoApellido == "null" || result.data.data[0][0].SegundoApellido == "") ? null : result.data.data[0][0].SegundoApellido;
                    // Nombres agentes
                    var primer_nombre_agente = (result.data.data[0][i].p_nombre_agente == null || result.data.data[0][i].p_nombre_agente == "null" || result.data.data[0][i].p_nombre_agente == "") ? "" : result.data.data[0][i].p_nombre_agente;
                    var segundo_nombre_agente = (result.data.data[0][i].s_nombre_agente == null || result.data.data[0][i].s_nombre_agente == "null" || result.data.data[0][i].s_nombre_agente == "") ? "" : result.data.data[0][i].s_nombre_agente;
                    var primer_apellido_agente = (result.data.data[0][i].p_apellido_agente == null || result.data.data[0][i].p_apellido_agente == "null" || result.data.data[0][i].p_apellido_agente == "") ? "" : result.data.data[0][i].p_apellido_agente;
                    var segundo_apellido_agente = (result.data.data[0][i].s_apellido_agente == null || result.data.data[0][i].s_apellido_agente == "null" || result.data.data[0][i].s_apellido_agente == "") ? "" : result.data.data[0][i].s_apellido_agente;
                    $scope.obj_PQRS_cliente = {
                        id_peticion: (result.data.data[0][i].cs_IdPeticion == null || result.data.data[0][i].cs_IdPeticion == "null" || result.data.data[0][i].cs_IdPeticion == "") ? null : result.data.data[0][i].cs_IdPeticion,
                        id_area: (result.data.data[0][i].cs_IdArea == null || result.data.data[0][i].cs_IdArea == "null" || result.data.data[0][i].cs_IdArea == "") ? null : result.data.data[0][i].cs_IdArea,
                        id_centro_operativo: (result.data.data[0][i].cs_idCentroOperativo == null || result.data.data[0][i].cs_idCentroOperativo == "null" || result.data.data[0][i].cs_idCentroOperativo == "") ? null : result.data.data[0][i].cs_idCentroOperativo,
                        id_area_solicitante: (result.data.data[0][i].cs_id_area_solictante == null || result.data.data[0][i].cs_id_area_solictante == "null" || result.data.data[0][i].cs_id_area_solictante == "") ? null : result.data.data[0][i].cs_id_area_solictante,
                        id_sede_ubicacion: (result.data.data[0][i].c_sede_ubicacion == null || result.data.data[0][i].c_sede_ubicacion == "null" || result.data.data[0][i].c_sede_ubicacion == "") ? null : result.data.data[0][i].c_sede_ubicacion,
                        subject: (result.data.data[0][i].Subject == null || result.data.data[0][i].Subject == "null" || result.data.data[0][i].Subject == "") ? null : result.data.data[0][i].cs_IdPeticion + "-" + result.data.data[0][i].Subject,
                        telefono_solicitante: (result.data.data[0][i].Telefono_Solicitante == null || result.data.data[0][i].Telefono_Solicitante == "null" || result.data.data[0][i].Telefono_Solicitante == "") ? null : result.data.data[0][i].Telefono_Solicitante,
                        calificacion_servicio: (result.data.data[0][i].c_calificacion_servicio == null || result.data.data[0][i].c_calificacion_servicio == "null" || result.data.data[0][i].c_calificacion_servicio == "") ? null : result.data.data[0][i].c_calificacion_servicio,
                        tooltips_calificacion_servicio: null,
                        tooltips_calificacion_solucion: null,
                        calificacion_solucion: (result.data.data[0][i].c_calificacion_solucion == null || result.data.data[0][i].c_calificacion_solucion == "null" || result.data.data[0][i].c_calificacion_solucion == "") ? null : result.data.data[0][i].c_calificacion_solucion,
                        id_tipologia_solucion: (result.data.data[0][i].cs_id_tipologia_solucion == null || result.data.data[0][i].cs_id_tipologia_solucion == "null" || result.data.data[0][i].cs_id_tipologia_solucion == "") ? null : result.data.data[0][i].cs_id_tipologia_solucion,
                        id_clasificacion: (result.data.data[0][i].c_clasificacion_pqrs == null || result.data.data[0][i].c_clasificacion_pqrs == "null" || result.data.data[0][i].c_clasificacion_pqrs == "") ? null : result.data.data[0][i].c_clasificacion_pqrs,
                        descripcion_clasificacion: (result.data.data[0][i].d_clasificacion_pqrs == null || result.data.data[0][i].d_clasificacion_pqrs == "null" || result.data.data[0][i].d_clasificacion_pqrs == "") ? null : result.data.data[0][i].d_clasificacion_pqrs,
                        descripcion_tickets: (result.data.data[0][i].Descripcion_tickets == null || result.data.data[0][i].Descripcion_tickets == "null" || result.data.data[0][i].Descripcion_tickets == "") ? null : result.data.data[0][i].Descripcion_tickets,
                        imagen_estado_tickets: (result.data.data[0][i].d_estado_ticket == "Abierto" || result.data.data[0][i].d_estado_ticket == "Pendiente Aprobación") ? "Circle_Red.png" : "Circle_Green.png",// result.data.data[0][i].DESCRIPCION_TICKETS,
                        fecha_creacion: (result.data.data[0][i].fh_origen_ticket == null || result.data.data[0][i].fh_origen_ticket == "null" || result.data.data[0][i].fh_origen_ticket == "") ? "" : moment(result.data.data[0][i].fh_origen_ticket).format('L'),
                        nombre_completo_solicitante: primer_nombres + " " + segundo_nombres + " " + primer_apellido + " " + segundo_apellido,
                        fecha_creacion_tickets: moment(result.data.data[0][i].fh_origen_ticket).format('LLLL'),
                        fecha_tentativa_solucion: moment(result.data.data[0][i].f_TentativaSolucion).format('LLLL'),
                        //fecha_cierre_tickets: (result.data.data[0][i].cs_id_estado_ticket == 3) ? moment(result.data.data[0][i].fecha_ciere).format('LLLL') : null,
                        estado_tickets: result.data.data[0][i].d_estado_ticket,
                        numero_factura: (result.data.data[0][i].numero_factura == null || result.data.data[0][i].numero_factura == "null" || result.data.data[0][i].numero_factura == "") ? null : result.data.data[0][i].numero_factura,
                        nombre_producto: (result.data.data[0][i].nombre_producto == null || result.data.data[0][i].nombre_producto == "null" || result.data.data[0][i].nombre_producto == "") ? null : result.data.data[0][i].nombre_producto,
                        nombre_agente: primer_nombre_agente + " " + segundo_nombre_agente + " " + primer_apellido_agente + " " + segundo_apellido_agente,
                    }
                    $scope.set_img_calificaciones($scope.obj_PQRS_cliente, result); 
                    $scope.lista_PQRS.push($scope.obj_PQRS_cliente);
                }
            }
            //*** ABIERTOS
            $scope.get_pqrs_by_clasificacion = function (clasificacion) {
                $scope.obj_temp = {
                    c_clasificacion: clasificacion,
                    documento_cliente: $scope.Cliente.documento
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_pqrs_by_clasificacion", JSON.stringify($scope.obj_temp), {
                }).then(function (result) {
                    $scope.set_lista_pqrs(result);
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.get_pqrs_by_clasificacion_sumatoria = function (clasificacion) {
                $scope.obj_temp = {
                    c_clasificacion: clasificacion,
                    documento_cliente: $scope.Cliente.documento
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_pqrs_by_clasificacion_sumatoria", JSON.stringify($scope.obj_temp), {
                }).then(function (result) {
                    $scope.set_lista_pqrs(result);
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.get_pqrs_sumatoria_final = function () {
                $scope.obj_temp = {
                    documento_cliente: $scope.Cliente.documento
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_pqrs_sumatoria_final", JSON.stringify($scope.obj_temp), {
                }).then(function (result) {
                    $scope.set_lista_pqrs(result);
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.get_pqrs_sumatoria_cerrados = function (clasificacion) {
                $scope.obj_temp = {
                    documento_cliente: $scope.Cliente.documento
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_pqrs_sumatoria_cerrados", JSON.stringify($scope.obj_temp), {
                }).then(function (result) {
                    $scope.set_lista_pqrs(result);
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.get_pqrs_sumatoria_abiertos = function (clasificacion) {
                $scope.obj_temp = {
                    documento_cliente: $scope.Cliente.documento
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_pqrs_sumatoria_abiertos", JSON.stringify($scope.obj_temp), {
                }).then(function (result) {
                    $scope.set_lista_pqrs(result);
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            //*** CERRADOS
            $scope.get_pqrs_by_clasificacion_cerrados = function (clasificacion) {
                $scope.obj_temp = {
                    c_clasificacion: clasificacion,
                    documento_cliente: $scope.Cliente.documento
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_pqrs_by_clasificacion_cerrados", JSON.stringify($scope.obj_temp), {
                }).then(function (result) {
                    $scope.set_lista_pqrs(result);
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.get_centros_operacion = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_centros_operacion", JSON.stringify(), {
                }).then(function (result) {
                    $scope.lista_centros_operaciones = [];
                    if (result == null) return;
                    if (result.data == null) return;
                    if (result.data.data == null) return;
                    if (result.data.data[0].length < 1) return;
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        $scope.obj_centro_operacion = {
                            id: result.data.data[0][i].f285_id,
                            descripcion: result.data.data[0][i].f285_descripcion + " - " + result.data.data[0][i].f285_id,
                            is_checked: null, // indicando que no ha sido seleccionado.
                            is_show: true, // Indica que se muestra en la lista.
                        }
                        $scope.lista_centros_operaciones.push($scope.obj_centro_operacion);
                    }
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            };
            $scope.get_archivos_pqrs = function (pqrs) {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "get_archivos_pqrs", JSON.stringify(pqrs), {
                }).then(function (result) {
                
                    if (result.data == null) return;
                    if (result.data.data == null) return;
                    if (result.data.data[0] == null) return;
                    if (result.data.data[0].length < 1) return;
                    // agrego el archivo relacionado a cada objeto en la lista de comentarios
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        // creo la lista de posibles archivos relacionados al comentario
                        for (var t = 0; t < pqrs.lista_comentario_tickets.length; t++){
                            if (pqrs.id_peticion == result.data.data[0][i].cs_IdPeticion
                                && pqrs.lista_comentario_tickets[t].cs_IdDescripcionTicket == result.data.data[0][i].cs_IdDescripcionTicket) { //
                                var ruta_archivo_cometario_pqrs = "";
                                ruta_archivo_cometario_pqrs += result.data.data[0][i].PathArchivo;
                                ruta_archivo_cometario_pqrs += result.data.data[0][i].NombreArchivo;
                                ruta_archivo_cometario_pqrs += "." + result.data.data[0][i].ExtensionArchivo;
                                var locas_is_imagen = null;
                                var local_is_otro_archivo = null;
                                var local_logo_archivo = null;
                                if (result.data.data[0][i].ExtensionArchivo.indexOf("png")     > -1
                                    || result.data.data[0][i].ExtensionArchivo.indexOf("PNG")  > -1
                                    || result.data.data[0][i].ExtensionArchivo.indexOf("jpg")  > -1
                                    || result.data.data[0][i].ExtensionArchivo.indexOf("JPG")  > -1
                                    || result.data.data[0][i].ExtensionArchivo.indexOf("jpeg") > -1
                                    || result.data.data[0][i].ExtensionArchivo.indexOf("JPEG") > -1) {
                                    locas_is_imagen = true;
                                    local_is_otro_archivo = false;
                                    local_logo_archivo = null;
                                } else {
                                    if (result.data.data[0][i].ExtensionArchivo.indexOf("xls") > -1) {
                                        local_logo_archivo = "Assets/img/PQRS/xlsx-image.png";
                                    } else {
                                        if (result.data.data[0][i].ExtensionArchivo.indexOf("doc") > -1) {
                                            local_logo_archivo = "Assets/img/PQRS/doc-image.png";
                                        } else {
                                            if (result.data.data[0][i].ExtensionArchivo.indexOf("pdf") > -1) {
                                                local_logo_archivo = "Assets/img/PQRS/pdf-image.png";
                                            }
                                        }
                                    }
                                    locas_is_imagen = false;
                                    local_is_otro_archivo = true;
                                }
                                var data_referente_imagen = {
                                    ruta: $scope.DNS + ruta_archivo_cometario_pqrs,
                                    is_imagen: locas_is_imagen,
                                    is_otro_archivo: local_is_otro_archivo,
                                    logo_arcghivo: (local_logo_archivo == null) ? $scope.DNS + ruta_archivo_cometario_pqrs : local_logo_archivo,
                                }
                                pqrs.lista_comentario_tickets[t].ruta_imagen_comentario_pqrs.push(data_referente_imagen);
                            }
                        }
                    }
                    var rweqr = null;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }
            $scope.archivo_seleccionado = null;
            $scope.muestra_otro_archivo = null;
            $scope.muestra_imagen = null;
            $scope.set_archivo_mostrar = function (ruta_archivo, var_is_otro_archivo, var_is_imagen) {
                var a = null;
                $scope.archivo_seleccionado = ruta_archivo;
                $scope.muestra_otro_archivo = var_is_otro_archivo;
                $scope.muestra_imagen = var_is_imagen;
                if (var_is_imagen) {
                    $('#muestra_archivos_pqrs').openModal();
                } else {
                    $('#muestra_archivos_pqrs').claseModal();
                }
            }
            $scope.set_img_calificaciones = function (pqrs) {
                //*** CALIFICACION SERVICIO
                switch(pqrs.calificacion_servicio){
                    case "1":
                        pqrs.img_calificacion_servicio = "Assets/img/Calificacion/S_Malo.PNG";
                        pqrs.tooltips_calificacion_servicio = "Malo";
                        break;
                    case "2":
                        pqrs.img_calificacion_servicio = "Assets/img/Calificacion/S_Regular.PNG";
                        pqrs.tooltips_calificacion_servicio = "Regular";
                        break;
                    case "3":
                        pqrs.img_calificacion_servicio = "Assets/img/Calificacion/S_Bueno.PNG";
                        pqrs.tooltips_calificacion_servicio = "Bueno";
                        break;
                    case "4":
                        pqrs.img_calificacion_servicio = "Assets/img/Calificacion/S_Excelente.PNG";
                        pqrs.tooltips_calificacion_servicio = "Excelente";
                        break;
                    default:
                        pqrs.img_calificacion_servicio = "Assets/img/Calificacion/vacio.PNG";
                        pqrs.tooltips_calificacion_servicio = "No ha sido calificado.";
                        break;
                }
                //*** CALIFICACION SOLUCION
                switch (pqrs.calificacion_solucion) {
                    case "1":
                        pqrs.img_calificacion_solucion = "Assets/img/Calificacion/S_Malo.PNG";
                        pqrs.tooltips_calificacion_solucion = "Malo";
                        break;
                    case "2":
                        pqrs.img_calificacion_solucion = "Assets/img/Calificacion/S_Regular.PNG";
                        pqrs.tooltips_calificacion_solucion = "Regular";
                        break;
                    case "3":
                        pqrs.img_calificacion_solucion = "Assets/img/Calificacion/S_Bueno.PNG";
                        pqrs.tooltips_calificacion_solucion = "Bueno";
                        break;
                    case "4":
                        pqrs.img_calificacion_solucion = "Assets/img/Calificacion/S_Excelente.PNG";
                        pqrs.tooltips_calificacion_solucion = "Excelente";
                        break;
                    default:
                        pqrs.img_calificacion_solucion = "Assets/img/Calificacion/vacio.PNG";
                        pqrs.tooltips_calificacion_solucion = "No ha sido calificado.";
                        break;
                }
            }
            $scope.limpia_campos_PQRS = function () {
                $scope.PQRS = {
                    documento_cliente: null,
                    clasificacion: null, // P, Q, R ó S
                    observaciones: null,
                    id_peticion: null, // id tickets
                    id_area: null,
                    id_caso: null,  // tipologia seleccionada
                    id_centro_operativo: null,
                    id_area_solicitante: null,
                    id_sede_ubicacion: null,
                    subject: null,
                    id_usuario: null,
                    telefono_solicitante: null,
                    id_modelo_aprobacion: null,
                };
                $scope.obj_PQRS_cliente = {
                    id_peticion: null,
                    id_area: null,
                    id_centro_operativo: null,
                    id_area_solicitante: null,
                    id_sede_ubicacion: null,
                    subject: null,
                    telefono_solicitante: null,
                    calificacion_servicio: null,
                    calificacion_solucion: null,
                    img_calificacion_servicio: null,
                    img_calificacion_solucion: null,
                    id_tipologia_solucion: null,
                    id_clasificacion: null,
                    descripcion_clasificacion: null,
                    descripcion_tickets: null,
                    lista_comentario_tickets: [],
                    imagen_estado_tickets: null,
                    fecha_creacion: null,

                    nombre_completo_solicitante : null,
                    fecha_creacion_tickets : null, 
                    fecha_tentativa_solucion : null,
                    fecha_cierre_tickets : null,
                    estado_tickets : null,
                    numero_factura : null,
                    centro_operativo : null,
                    nombre_producto : null,
                    nombre_agente: null,
                    tooltips_global: null,
                    tooltips_calificacion_servicio: null,
                    tooltips_calificacion_solucion: null,
                }
                $scope.lista_tipificacion_segun_clasificacion_pqrs = [];
                $scope.filtro_centro_operativo = "";
                if ($scope.lista_clasificaciones_pqrs == null) return;
                for (var i = 0; i < $scope.lista_clasificaciones_pqrs.length; i++) {
                    $scope.lista_clasificaciones_pqrs[i].opacidad = 0.4;
                }
            };
        
            $scope.obj_PQRS_cliente = {
                id_peticion: null,
                id_area: null,
                id_centro_operativo: null,
                id_area_solicitante: null,
                id_sede_ubicacion: null,
                subject: null,
                telefono_solicitante: null,
                calificacion_servicio: null,
                calificacion_solucion: null,
                img_calificacion_servicio: null,
                img_calificacion_solucion: null,
                id_tipologia_solucion: null,
                id_clasificacion: null,
                descripcion_clasificacion: null,
                descripcion_tickets: null,
                lista_comentario_tickets: [],
                imagen_estado_tickets: null,
                fecha_creacion: null,

                nombre_completo_solicitante: null,
                fecha_creacion_tickets: null,
                fecha_tentativa_solucion: null,
                fecha_cierre_tickets: null,
                estado_tickets: null,
                numero_factura: null,
                centro_operativo: null,
                nombre_producto: null,
                nombre_agente: null,
                tooltips_global: null,
                tooltips_calificacion_servicio: null,
                tooltips_calificacion_solucion: null,
            }
            // sw_DescripcionPeticion 
            // 1 Descripcion que se ingresa al crear el Tickets
            // 0 Los comentarios relacionados a ese tickets.
            $scope.set_data_pqrs = function (pqrs) {
                $scope.obj_PQRS_cliente = {
                    id_peticion: pqrs.id_peticion,
                    id_area: pqrs.id_area,
                    id_centro_operativo: pqrs.id_centro_operativo,
                    id_area_solicitante: pqrs.id_area_solicitante,
                    id_sede_ubicacion: pqrs.id_sede_ubicacion,
                    subject: pqrs.subject.split("-")[1], // pqrs.subject,
                    telefono_solicitante: pqrs.telefono_solicitante,
                    calificacion_servicio: pqrs.calificacion_servicio,
                    calificacion_solucion: pqrs.calificacion_solucion,
                    id_tipologia_solucion: pqrs.id_tipologia_solucion,
                    id_clasificacion: pqrs.id_clasificacion,
                    descripcion_clasificacion: pqrs.descripcion_clasificacion,
                    descripcion_tickets: pqrs.descripcion_tickets,
                    lista_comentario_tickets: [],
                    imagen_estado_tickets: pqrs.imagen_estado_tickets,
                    fecha_creacion: pqrs.fecha_creacion,
                    img_calificacion_servicio: null,
                    img_calificacion_solucion: null,

                    nombre_completo_solicitante: pqrs.nombre_completo_solicitante,
                    fecha_creacion_tickets: pqrs.fecha_creacion_tickets,
                    fecha_tentativa_solucion: pqrs.fecha_tentativa_solucion,
                    fecha_cierre_tickets: pqrs.fecha_cierre_tickets,
                    estado_tickets: pqrs.estado_tickets,
                    numero_factura: pqrs.numero_factura,
                    centro_operativo: pqrs.centro_operativo,
                    nombre_producto: pqrs.nombre_producto,
                    nombre_agente: pqrs.nombre_agente,
                    tooltips_global: pqrs.tooltips_global,
                    tooltips_calificacion_servicio: pqrs.tooltips_calificacion_servicio,
                    tooltips_calificacion_solucion: pqrs.tooltips_calificacion_solucion,
                    url_tickets: $scope.URL_TICKETS + pqrs.id_peticion,
                }
                $('.modal_detalles_pqrs').openModal();
            
                $scope.get_cometarios_tickets($scope.obj_PQRS_cliente);
            }
            $scope.limpia_var_pqrs = function () {
                $scope.limpia_campos_PQRS();
                $scope.obj_PQRS_cliente = {
                    id_peticion: null,
                    id_area: null,
                    id_centro_operativo: null,
                    id_area_solicitante: null,
                    id_sede_ubicacion: null,
                    subject: null,
                    telefono_solicitante: null,
                    calificacion_servicio: null,
                    calificacion_solucion: null,
                    id_tipologia_solucion: null,
                    id_clasificacion: null,
                    descripcion_clasificacion: null,
                    descripcion_tickets: null,
                    lista_comentario_tickets: [],
                    img_calificacion_servicio: null,
                    img_calificacion_solucion: null,
                    imagen_estado_tickets: null,
                    fecha_creacion: null,

                    nombre_completo_solicitante: null,
                    fecha_creacion_tickets: null,
                    fecha_tentativa_solucion: null,
                    fecha_cierre_tickets: null,
                    estado_tickets: null,
                    numero_factura: null,
                    centro_operativo: null,
                    nombre_producto: null,
                    nombre_agente: null,
                    tooltips_global: null,
                    tooltips_calificacion_servicio: null,
                    tooltips_calificacion_solucion: null,
                }
                $scope.lista_PQRS = [];
            }
            $scope.filtro_centro_operativo = null;
            $scope.filtrar_lista_centro_operativo = function () {
                for (var i = 0; i < $scope.lista_centros_operaciones.length; i++){
                    if ($scope.lista_centros_operaciones[i].descripcion.indexOf($scope.filtro_centro_operativo.toUpperCase()) == -1) {
                        $scope.lista_centros_operaciones[i].is_show = false;
                    } else {
                        $scope.lista_centros_operaciones[i].is_show = true;
                    }
                }
                $scope.ordenar_lista_centros_operativos();
            }
            $scope.ordenar_lista_centros_operativos = function () {
                var lista_temp = $scope.lista_centros_operaciones;
                $scope.lista_centros_operaciones = [];
                // RECORRO LA LISTA Y COLOCO PRIMERO LOS QUE ESTAN SELECCIONADOS
                for (var i = 0; i<lista_temp.length; i++){
                    if (lista_temp[i].is_checked == true || lista_temp[i].is_checked == "true") {
                        $scope.lista_centros_operaciones.push(lista_temp[i]);
                    }
                }
                // AHORA AGREGO LOS QUE NO HAN SIDO SELECCIONADOS
                for (var i = 0; i < lista_temp.length; i++) {
                    if (lista_temp[i].is_checked != true && lista_temp[i].is_checked != "true") {
                        $scope.lista_centros_operaciones.push(lista_temp[i]);
                    }
                }
            }
            $scope.nueva_descripcion_pqrs = null;
            $scope.crear_descripcion_PQRS = function (descripcion_pqrs) {
                var obj_descripcion = {
                    id_peticion: $scope.obj_PQRS_cliente.id_peticion,
                    descripcion: descripcion_pqrs,
                    sw_descripcion_peticion: 0,
                    tipo_novedad: 1,
                    id_usuario: $scope.data_current_user.id,
                }
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "insertar_nueva_descripcion_pqrs", JSON.stringify(obj_descripcion), {
                }).then(function (result) {
                    $scope.nueva_descripcion_pqrs = null;
                    $scope.get_cometarios_tickets($scope.obj_PQRS_cliente);
                    $scope.enviar_correos_post_comentarios(descripcion_pqrs);
                    $('#crear_comentarios').closeModal();
                    angular.showSuccess('Descripcion del PQRS guardada de manera satisfactoria.');
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }


            $scope.call_crear_comentario = function () {
                $('#crear_comentarios').openModal();
            }
            $scope.cerrar_modal_nueva_descripcion = function () {
                $('#crear_comentarios').closeModal();
                $scope.nueva_descripcion_pqrs = null;
            }

            $scope.consulta_conexion_unoee = function () {
                $http.post(TreidConfigSrv.ApiUrls.UrlCrearClienteNodejs + "consulta_conexion_unoee", JSON.stringify(), {
                }).then(function (result) {
                    $scope.conexion_unoee = result.data.data[0][0].vr_parametro;
                }).catch(function (data) {
                    $scope.Error.value = true;
                });
            }

            /***************************************************** UTILIZANDO UNOEE ************************************************/
            $scope.inserta_cliente_unoee = function (modoUpdate) {
                getPlantillaByConectorSiesa($scope.idConectorSeisaClienteOcasionales)
                .then(function (result) {
                    if (result !== undefined && result.data.length > 0) {
                        var plantilla = result.data[0];
                        //manipulamos la plantilla
                        completarPlantillaSiesa(plantilla, modoUpdate);
                        //parametrizar esto en BD luego
                        var header = $scope.conexion_unoee + "<Linea>000000100000001001</Linea>\n";
                        //var header = "<Importar>\n" +
                        //    "<NombreConexion>pruebas</NombreConexion>\n" +
                        //    "<IdCia>1</IdCia>\n" +
                        //    "<Usuario>unoee</Usuario>\n" +
                        //    "<Clave>123</Clave>\n" +
                        //    "<Datos>\n" +
                        //    "<Linea>000000100000001001</Linea>\n";
                        var footer = "<Linea>000000399990001001</Linea>\n" +
                            "</Datos>\n" +
                            "</Importar>\n";


                        //creamos el xml para el conector
                        var xmlConector = loginService.crearXmlConectorSiesa(plantilla, header, footer);
                        //*** Mando a guardar el cliente en UnoEE
                        $http.post(TreidConfigSrv.ApiUrls.URLConectorUnoEE + "ImportarUNE", JSON.stringify({ "template": xmlConector }), {
                        }).then(function (result) {
                            var s = result.data.Msg;
                            if (result.data.Msg === "•	0 = Ejecutado exitosamente.") {
                                var FF = null;
                                $scope.data_cliente = {
                                    numero_identificacion: $scope.Cliente.documento,
                                    nombre_cliente: null,
                                }
                                $scope.consultar_cliente($scope.data_cliente);
                                $scope.objectDialog.HideDialog();
                                angular.showSuccess('Cliente guardado en nuestra base de datos de manera satisfactoria.');
                                $scope.show_pqrs = true;
                            } else {
                                $scope.objectDialog.HideDialog();
                                angular.showSuccess('Cliente guardado en CRM satisfactoriamente. Presenta problemas para guardar en UnoEE.');
                            }
                        }).catch(function (data) {
                            $scope.Error.value = true;
                            $scope.objectDialog.HideDialog();
                            angular.showSuccess('Cliente guardado en CRM satisfactoriamente. Ha ocurrido un error al guardar en UnoEE. Quizas se deba a caracteres especiales en los nombres y apellidos ó a una falla en la conexion a ese servidor.');
                        });


                        console.log("xmlConector", xmlConector);
                        //enviamos el xml a APIUnoE
                        // Guardar el log dela tabla MV_CONECTORES_SIEGA de la DB MDC_POS
                        $http.post(TreidConfigSrv.ApiUrls.UrlNuevaOrdenNodejs + "insertPlantillaConectorSiega", JSON.stringify({ "template": plantilla }), {
                        }).then(function (result) {
                        }).catch(function (data) {
                            $scope.Error.value = true;
                        });
                    };
                    //verificamos el resultado
                });
        }

            function getPlantillaByConectorSiesa(conectorsiesa) {
                return $http.get(TreidConfigSrv.ApiUrls.UrlNuevaOrdenNodejs + "getPlantillaByConectorSiesa/" + conectorsiesa)
                    .then(getPlantillaByConectorSiesaComplete)
                    .catch(getPlantillaByConectorSiesaFailed);

                function getPlantillaByConectorSiesaComplete(response) {
                    return response.data;
                }

                function getPlantillaByConectorSiesaFailed(error) {
                    return logger.error('XHR falló en getPlantillaByConectorSiesa' + error);
                }
            }

        // verificar el apellido, direccion y concatenar dep-ciu, 
        function completarPlantillaSiesa(plantilla, modoUpdate) {
            plantilla.forEach(function (item, index) {
                switch (item.nombre) {
                    case "F_ACTUALIZA_REG": 
                        item.valor_defecto = Number(modoUpdate);
                        break;
                    case "F160_ID": 
                        item.valor_defecto = $scope.Cliente.documento;
                        break;
                    case "F160_NIT": 
                        //item.valor_defecto = "";
                        //if ($scope.Cliente.Tipo_documento === "1") { 
                        item.valor_defecto = $scope.Cliente.documento;
                        //}
                        break;
                    case "F160_DV_NIT":
                        item.valor_defecto = "";
                        if ($scope.Cliente.Tipo_documento === "1") {   
                            var dv = $scope.digito_verificacion_numero($scope.Cliente.documento);
                            item.valor_defecto = dv;// digitoVerificacion($scope.Cliente.documento);
                        }
                        break;
                    case "F160_ID_TIPO_IDENT":
                        item.valor_defecto = "";
                        if ($scope.Cliente.Tipo_documento === "1") {
                            item.valor_defecto = "N";
                        }
                        else {
                            if ($scope.Cliente.Tipo_documento === "2") {
                                item.valor_defecto = "C";
                            } else {
                                if ($scope.Cliente.Tipo_documento === "3") {
                                    item.valor_defecto = "E";
                                }
                            }
                        }
                        break;
                    case "F160_IND_TIPO_TERCERO":
                        item.valor_defecto = 0;
                        if ($scope.Cliente.Tipo_documento === "1") {
                            item.valor_defecto = 1;
                        }
                        break;
                    case "F160_RAZON_SOCIAL":
                        item.valor_defecto = (($scope.Cliente.nombres + " " + $scope.Cliente.apellidos).substring(0, 48).replace("&", "Y"));
                        if ($scope.Cliente.Tipo_documento === "1") {
                            //razón social apellidos y nombres, Jorge pidio invertirlos
                            item.valor_defecto = (($scope.Cliente.nombres + " " + $scope.Cliente.apellidos).substring(0, 48).replace("&", "Y"));
                        }
                        break;
                    case "F160_APELLIDO_1": 
                        item.valor_defecto = "";
                        var apellidos = $scope.Cliente.apellidos.split(" ");
                        item.valor_defecto = (apellidos[0].replace("&", "Y")).substring(0, 14);
                        break;
                    case "F160_APELLIDO_2": 
                        var apellidos = $scope.Cliente.apellidos.split(" ");
                        item.valor_defecto = apellidos.length > 1 ? (apellidos[1].substring(0, 14).replace("&", "Y")) : "2APELLIDO";
                        break;
                    case "F160_NOMBRE": 
                        item.valor_defecto = ($scope.Cliente.nombres.substring(0, 18).replace("&", "Y"));
                        if ($scope.Cliente.Tipo_documento !== "1") {
                            item.valor_defecto = ($scope.Cliente.nombres.split(" ")[0].substring(0, 18).replace("&", "Y"));
                        }
                        break;
                    case "F160_FECHA_INGRESO":
                        item.valor_defecto = moment().format('YYYYMMDD');
                        break;
                    case "F160_FECHA_NACIMIENTO":
                        item.valor_defecto = ($scope.Cliente.dia_nacimiento == null || $scope.Cliente.dia_nacimiento == "null"
                                               || $scope.Cliente.mes_nacimiento == null || $scope.Cliente.mes_nacimiento == "null"
                                               || $scope.Cliente.anio_nacimiento == null || $scope.Cliente.anio_nacimiento == "null") 
                                               ? moment(new Date('1900/01/01')).format('YYYYMMDD') //fecha convenciòn 1900/01/01"
                                               : moment($scope.Cliente.anio_nacimiento + "/" + $scope.Cliente.mes_nacimiento + "/" + $scope.Cliente.dia_nacimiento).format('YYYYMMDD');
                        break;
                    case "F160_IND_ESTADO_BLOQUEADO":
                        item.valor_defecto = 0;
                        break;
                    case "F160_MOTIVO_BLOQUEO":
                        item.valor_defecto = "";
                        break;
                    case "F015_CONTACTO":
                        item.valor_defecto = "";
                        if ($scope.lista_contactos.length < 1)  break; 
                        var contacto = $scope.lista_contactos[0];
                        item.valor_defecto = (contacto.nombres + " " + contacto.apellidos).substring(0, 49);
                        break;
                    case "F015_DIRECCION1": 
                        item.valor_defecto = ($scope.Cliente.direccion_casa === null
                                                || $scope.Cliente.direccion_casa === "null"
                                                || $scope.Cliente.direccion_casa === "")
                                                ? "" : $scope.Cliente.direccion_casa.substring(0, 38); //en el formulario no se pide - casa
                        break;
                    case "F015_DIRECCION2": 
                        item.valor_defecto = ($scope.Cliente.direccion_trabajo === null
                                                || $scope.Cliente.direccion_trabajo === "null"
                                                || $scope.Cliente.direccion_trabajo === "")
                                                ? "" : $scope.Cliente.direccion_trabajo.substring(0, 38); //en el formulario no se pide - trabajo
                        break;
                    case "F015_DIRECCION3": 
                        item.valor_defecto = ($scope.Cliente.direccion_entrega === null
                                                || $scope.Cliente.direccion_entrega === "null"
                                                || $scope.Cliente.direccion_entrega === "")
                                                ? "" : $scope.Cliente.direccion_entrega.substring(0, 38); //en el formulario no se pide - entrega
                        break;
                    case "F015_ID_PAIS":  
                        //item.valor_defecto = ""; //en el formulario no se pide
                        if ($scope.Cliente.paisdepartmunic_dir_casa.id_pais === null || $scope.Cliente.paisdepartmunic_dir_casa.id_pais === "null" || $scope.Cliente.paisdepartmunic_dir_casa.id_pais === "") {
                            item.valor_defecto = ""; break
                        }
                        item.valor_defecto = $scope.Cliente.paisdepartmunic_dir_casa.id_pais;
                        break;
                    case "F015_ID_DEPTO":
                        if ($scope.Cliente.paisdepartmunic_dir_casa.id_depart === null
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_depart === "null"
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_depart === ""
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_pais === null
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_pais === "null"
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_pais === "") {
                            item.valor_defecto = ""; break
                        }
                        item.valor_defecto = $scope.Cliente.paisdepartmunic_dir_casa.id_depart;
                        break;
                    case "F015_ID_CIUDAD": // 
                        item.valor_defecto = ""; //en el formulario no se pide
                        if ($scope.Cliente.paisdepartmunic_dir_casa.id_municipio === null
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_municipio === "null"
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_municipio === ""
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_pais === null
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_pais === "null"
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_pais === ""
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_depart === null
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_depart === "null"
                            || $scope.Cliente.paisdepartmunic_dir_casa.id_depart === "") {
                            item.valor_defecto = ""; break
                        }
                        item.valor_defecto = $scope.Cliente.paisdepartmunic_dir_casa.id_municipio;
                        break;
                    case "F015_ID_BARRIO":
                        item.valor_defecto = ""; //en el formulario no se pide
                        break;
                    case "F015_TELEFONO":
                        item.valor_defecto = ($scope.Cliente.telefono_casa === null
                                               || $scope.Cliente.telefono_casa === "null"
                                               || $scope.Cliente.telefono_casa === "") ? "NOEXISTE" : $scope.Cliente.telefono_casa;//.substring(0, 18);
                        break;
                    case "F015_FAX":
                        item.valor_defecto = "";
                        break;
                    case "F015_COD_POSTAL":
                        item.valor_defecto = "";
                        break;
                    case "F015_EMAIL":
                        item.valor_defecto = "";
                        if ($scope.Cliente.correo === null
                            || $scope.Cliente.correo === "null"
                            || $scope.Cliente.correo === "") break;
                        item.valor_defecto = $scope.Cliente.correo.substring(0, 48); 
                        break;
                    case "F160_ID_DESCRIPCION_TECNICA":
                        item.valor_defecto = "";
                        break;
                    case "F160_TS_FECHA_BLOQUEO": // 
                        item.valor_defecto = "";
                        break;
                }
            });
        }
        $scope.calcular_digito_verificacion = function () {
            $scope.digito_verificacion = "-";
            var documento = $scope.data_cliente.numero_identificacion;
            var tipo_documento = $scope.Cliente.Tipo_documento;
            if (documento !== null && tipo_documento === "1") {
                var dv = digitoVerificacion(documento);
                var a = isNaN(dv);
                if (a) return;
                if (dv !== "NaN" && dv !== NaN) {
                    $scope.digito_verificacion = dv;
                } else {
                    $scope.digito_verificacion = "-";
                }
            }
        }

        $scope.digito_verificacion_numero = function (identificacion) {
            $scope.digito_verificacion = "-";
            var dv = digitoVerificacion(identificacion);
            var a = isNaN(dv);
            if (a) return 0;
            if (dv !== "NaN" && dv !== NaN) {
                $scope.digito_verificacion = dv;
            }
            return $scope.digito_verificacion;
        }

        /**
        * calcular el numero de verificación NIT colombia o rut, solo válido para colombia
        * http://www.laneros.com/temas/validacion-nit-y-rut-de-la-dian.62165/
        * editado con mejores sintaxis, mas entendibles y buenas prácticas
        * @return {[type]} [description]
        */
        function digitoVerificacion(i_rut) {
            var pesos = new Array(71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3);
            var rut_fmt = zero_fill(i_rut, 15);
            var suma = 0;
            for (var i = 0; i <= 14; i++)
                suma += rut_fmt.substring(i, i + 1) * pesos[i];
            var resto = suma % 11;
            var digitov;
            if (resto === 0 || resto === 1)
                digitov = resto;
            else
                digitov = 11 - resto;

            return (digitov);
        }

        function zero_fill(i_valor, num_ceros) {
            var relleno = "";
            var i = 1;
            var salir = 0;
            var total_caracteres = 0;
            while (!salir) {
                total_caracteres = i_valor.length + i;
                if (i > num_ceros || total_caracteres > num_ceros)
                    salir = 1;
                else
                    relleno = relleno + "0";
                i++;
            }

            i_valor = relleno + i_valor;
            return i_valor;
        }

       

    }]);
}());
