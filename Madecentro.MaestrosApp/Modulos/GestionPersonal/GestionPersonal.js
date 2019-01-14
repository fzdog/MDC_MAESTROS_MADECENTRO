
(function() {
    'use strict';

    angular.module('appmadecentro')
        .controller('GestionPersonal', GestionPersonal);

    GestionPersonal.$inject = ['gestionPersonasService', '$scope', '$http', '$upload', 'TreidConfigSrv', 'loginService', '$timeout', '$q', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', 'datepickerPopupConfig', 'ngProgressFactory', 'blockUI'];

    function GestionPersonal(gestionPersonasService, $scope, $http, $upload, TreidConfigSrv, loginService, $timeout, $q, $location, $compile, $cookieStore, $rootScope, $templateCache, datepickerPopupConfig, ngProgressFactory, blockUI) {

        var vm = $scope;

        vm.init = function () {

            vm.GuardarPersona = GuardarPersona;
            vm.ModificarPersona = ModificarPersona;

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
            vm.filtroPersona            = "";
            vm.CrearUsuario             = 0;
            vm.isCollapsed              = false;
            vm.isCollapsed_Direccion    = true;
            /*identificar que se hizo una transaccion, va orientada cuando se realiza cambios en la plaza de empleado */
            vm.realizoTransaccion = {
                value: false
            };
            /****** ModuloCreacionEmpleado *******/
            vm.objGestionEmpleadosOriginal = {
                primerNombre: "",
                segundoNombre: "",
                primerApellido: "",
                segundoApellido: "",
                cedula: "",
                fhNacimiento: "",
                genero: "",
                telefono: 0,
                celular: 0,
                direccion: "",
                c_compania: "",
                idPlaza: "",
                plaza: "",
                fhIngreso: "",
                swActivo: true,
                fechaRegistro: "",
                c_tipo_contrato: 0,
                c_talla_camisa: "",
                c_talla_pantalon: "",
                c_talla_chaqueta: "",
                c_talla_zapatos: "",
                /**
                 * campos nuevos*
                 */
                cantidad_camisas: "",
                sw_derecho_dotacion: true,
                sw_derecho_chaqueta: true,
                sw_bono_dotacion: true,
                c_talla_chaleco: "",
                c_tipo_camisa: "",
                c_tipo_pantalon: "",

                c_otro_tipo_camisa: "",
                c_tipo_bota: "",

                nombres_contacto_familiar :"",
                telefono_contacto_familiar: "",

                emailPersonal: "",
                logInsert: loginService.UserData.cs_IdUsuario,
                c_pais: "",
                c_departamento: "",
                c_municipio: "",
                direccion_dotacion: "",
                c_depto_dotacion: "",
                c_ciudad_dotacion: "",

                /*ARCHIVOS ADJUNTOS*/
                rutaFotoPersona: "",
                nombreFotoPersona: "",
                extensionFotoPersona: "",

                /*HV*/
                rutaHV: "",
                nombreHV: "",
                extensionHV: "",

                /*retiro*/
                c_tipo_retiro: 0,
                d_tipo_retiro: "",
                fhRetiro: "",
                d_motivo_retiro: "",
                fhRetiro_format: "",
                plaza_old_empleado: "",
                sw_empleado_retirado: false,
                sw_desligar_plaza: false,

                c_estado_civil: "",
                c_nivel_educativo: "",
                c_detalle_nivel_academico: ""
            };
            
            vm.objGestionEmpleados = angular.copy(vm.objGestionEmpleadosOriginal);

            vm.ArrayCompanias         = [];
            vm.ArrayplazasDisponibles = [];
            vm.Arrayplazas            = [];
            vm.ArrayDatosEmpleado     = [];
            vm.crear = {
                value: true
            };
            vm.modificar = {
                value: false
            };
            vm.ArrayCentroOperativo = [];
            vm.ArrayGerencias       = [];
            vm.ArrayCentrosCostos   = [];
            vm.ArrayCargos          = [];
            vm.objFiltrosPlaza = {
                gerencia: null,
                CO      : null,
                CC      : null,
                Cargo   : null
            };
            vm.ArrayCentroOperativo = [];
            vm.ArrayCentrosCostos   = [];
            vm.showFoto = {
                value: false
            };
            vm.showHV = {
                value: false
            };
            vm.objEliminarArchivo = {
                ruta       : "",
                nombre     : "",
                extension  : "",
                pathArchivo: "",
                log_update : loginService.UserData.cs_IdUsuario
            };
            vm.array_tipos_camisas = [];
            vm.list_otros_tipos_camisa = [];
            vm.array_tipos_pantalon = [];
            vm.list_tipos_botas = [];

            vm.ArrayTiposContratos = [];
            vm.tipoContratoEmpleado = "";
            vm.disable_ChkswActivo = true;
            vm.obj_pais = {
                id: null,
                descripcion: null
            };
            vm.lista_pais                   = [];
            vm.lista_departamento           = [];
            vm.lista_municipio              = [];
            vm.lista_departamento_original  = [];
            vm.lista_municipio_original     = [];
            vm.nombre_departamento_selected = "";
            vm.nombre_municipio_selected    = "";
            vm.id_ciudad                    = null;
            vm.internalControl              = vm.controldirecciones || {};
            vm.internalControl.showform     = false;
            vm.tooltipMsg = {
                ErrMsg: "",
                template1Error: "<div style='background: red;border: 1px solid red;border-radius: 4px;padding-left: 4px;padding-right: 4px;'>",
                template1Errorend: "</div>"
            };
            vm.objDireccion = {
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
            vm.direccionResult      = null;
            vm.show_nuevo_dominio   = false;
            vm.direccion_definitiva = vm.direccionResult;
            vm.array_tipos_retiro   = [];
            vm.obj_update_persona_retirada = {
                cedula: "",
                log_update: loginService.UserData.cs_IdUsuario
            };
            vm.obj_datos_persona     = {};
            vm.arrayArchivosAdjuntos = [];
            vm.list_estados_civiles = [];
            vm.list_niveles_educacion = [];
            vm.list_dt_niveles_educacion = [];

            var main = "{preview}\n" +
                "<div class=\'input-group {class}\'>\n" +
                "   <div class=\'input-group-btn\'>\n" +
                "       {browse}\n" +
                "       {remove}\n" +
                "   </div>\n" +
                "</div>";

            var footerTemplate = "<div class=\"file-thumbnail-footer\">\n" +
                "   <div style=\"margin:5px 0\">\n" +
                "       <input disabled class=\"kv-input kv-new form-control input-sm {TAG_CSS_NEW}\" value=\"{caption}\" >\n" +
                "   </div>\n" +
                "</div>";
            //#endregion

            //#region Elementos JQuery
            
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
            $timeout(function () {
                $('#dtFhNacimiento').datetimepicker(
                {
                    dayViewHeaderFormat: 'MMMM YYYY',
                    locale             : 'es',
                    sideBySide         : false,
                    showClear          : true,
                    widgetPositioning: {
                        horizontal: 'right',
                        vertical: 'top'
                    },
                    format: 'DD/MMMM/YYYY'
                });
                $('#dtFhIngreso').datetimepicker(
                {
                    dayViewHeaderFormat: 'MMMM YYYY',
                    locale             : 'es',
                    sideBySide         : true,
                    defaultDate        : dt,
                    showClear          : true,
                    widgetPositioning: {
                        horizontal: 'right',
                        vertical: 'top'
                    },
                    format: 'DD/MMMM/YYYY'
                });
                $('#dtFhRegistro').datetimepicker(
                {
                    dayViewHeaderFormat: 'MMMM YYYY',
                    locale             : 'es',
                    sideBySide         : true,
                    defaultDate        : dt,
                    showClear          : true,
                    widgetPositioning: {
                        horizontal: 'right',
                        vertical: 'top'
                    },
                    format: 'DD/MMMM/YYYY'
                });
                $('#dtFhRetiro').datetimepicker(
                {
                    dayViewHeaderFormat: 'MMMM YYYY',
                    locale             : 'es',
                    sideBySide         : false,
                    defaultDate        : dt,
                    showClear          : true,
                    widgetPositioning: {
                        horizontal: 'right',
                        vertical: 'top'
                    },
                    format: 'DD/MMMM/YYYY'
                });

                $timeout(function () {
                    $("[class*=date]").on("keypress", function (e) { e.preventDefault(); });
                }, 300);

            }, 300);
            $("#escogerDireccion").on("click", function () {
                $timeout(function () {
                    $("#select_pais").focus();
                }, 300);

                vm.limpia_direccion();
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

            $("#seleccion_centro_operacion").on("change", function (e) {
                console.info(e);

                if (e.val === "") {

                    vm.objGestionEmpleados.direccion_dotacion = "";
                    vm.objGestionEmpleados.c_depto_dotacion   = "";
                    vm.objGestionEmpleados.c_ciudad_dotacion  = "";

                } else {

                    var dataSelect2 = JSON.parse(e.val);

                    if (dataSelect2.direccion !== "" && !_.isNull(dataSelect2.direccion) && !_.isUndefined(dataSelect2.direccion))
                        vm.objGestionEmpleados.direccion_dotacion = dataSelect2.direccion;
                    else {
                        vm.objGestionEmpleados.direccion_dotacion = "";
                        toastr.info("EL centro de operación no tiene dirección configurada");
                    }
                    
                    var ubicacion_centro_operacion = _.findWhere(vm.listUbicacionCentrosOperacion, { c_centro_operacion: dataSelect2.c_centro_operacion });

                    if (!_.isUndefined(ubicacion_centro_operacion)) {
                        
                        vm.listCiudades = vm.listCiudadesOriginal.filter(function (item) {
                            return item.c_depto === ubicacion_centro_operacion.c_depto;
                        });
                        
                        vm.objGestionEmpleados.c_depto_dotacion  = ubicacion_centro_operacion.c_depto;
                        vm.objGestionEmpleados.c_ciudad_dotacion = ubicacion_centro_operacion.c_ciudad;
                    }
                }

                $timeout(function() {
                    vm.$apply();
                }, 0);
            });

            $("#searchclearUsuario").click(function () {
                vm.LimpiarCampos();
            });
            //#endregion   
            //#region CARGA DE FOTO DE PERSONA
            $("#inputImagenPersona").fileinput({
                language             : "es",
                maxFileCount         : 1,
                allowedFileExtensions: ["JPG", "BMP", "PDF", "GIF", "PNG", "JPEG"],
                browseClass          : "btn btn-warning",
                browseLabel          : "Cargar Imagen",
                browseIcon           : "<i class=\"glyphicon glyphicon-picture\"></i> ",
                removeClass          : "btn btn-default",
                showUpload           : false,
                layoutTemplates: {
                    main1: main,
                    footer: footerTemplate
                }
            });
            /*eventos al cargar la imagen de persona*/
            $('#inputImagenPersona').on('fileloaded', function(event, file, previewId, index, reader) {
                var pos = null;
                for (var i = 0; i < vm.arrayArchivosAdjuntos.length; i++) {
                    if (vm.arrayArchivosAdjuntos[i].clasificacionArchivo == "foto persona") {
                        pos = i;
                    }
                }
                if (pos != null)
                    vm.arrayArchivosAdjuntos.splice(pos, 1);

                vm.arrayArchivosAdjuntos.push({
                    clasificacionArchivo     : "foto persona",
                    id_estructura_gdocumental: TreidConfigSrv.variables.id_estructura_gdocumental_imagen_persona,
                    archivo                  : file
                });
            });
            $('#inputImagenPersona').on('fileclear', function(event) {
                var pos = null;
                for (var i = 0; i < vm.arrayArchivosAdjuntos.length; i++) {
                    if (vm.arrayArchivosAdjuntos[i].clasificacionArchivo == "foto persona") {
                        pos = i;
                    }
                }
                if (pos != null)
                    vm.arrayArchivosAdjuntos.splice(pos, 1);
            });
            //#endregion
            //TENER EN CUENTA QUE ESTO DEBE APARECER CUANDO ESCOJAN SEXO [M]
            //#region CARGA DE HOJA DE VIDA
            $("#inputHojaVida").fileinput({
                language             : "es",
                maxFileCount         : 1,
                browseClass          : "btn btn-warning",
                browseLabel          : "Cargar Hoja de vida",
                uploadUrl            : "/file-upload-batch/2",
                allowedFileExtensions: ["txt", "docx", "DOC", "PDF", "pdf", "doc", "DOCX", "JPG", "BMP", "PDF", "GIF", "PNG", "JPEG", "TIFF", "TIF"],
                minImageWidth        : 50,
                minImageHeight       : 50,
                showUpload           : false,
                layoutTemplates: {
                    main1: main,
                    footer: footerTemplate,
                    zoom: ''
                }
            });
            $('#inputHojaVida').on('fileloaded', function(event, file, previewId, index, reader) {
                console.log("hoja de vida cargada");
                var pos = null;
                for (var i = 0; i < vm.arrayArchivosAdjuntos.length; i++) {
                    if (vm.arrayArchivosAdjuntos[i].clasificacionArchivo == "hoja de vida") {
                        pos = i;
                    }
                }
                if (pos != null)
                    vm.arrayArchivosAdjuntos.splice(pos, 1);

                vm.arrayArchivosAdjuntos.push({
                    clasificacionArchivo     : "hoja de vida",
                    id_estructura_gdocumental: TreidConfigSrv.variables.id_estructura_gdocumental_hojaVida_persona,
                    archivo                  : file
                });
            });
            $('#inputHojaVida').on('fileclear', function(event) {
                console.log("hoja de vida eliminada");
                var pos = null;
                for (var i = 0; i < vm.arrayArchivosAdjuntos.length; i++) {
                    if (vm.arrayArchivosAdjuntos[i].clasificacionArchivo == "hoja de vida") {
                        pos = i;
                    }
                }
                if (pos != null)
                    vm.arrayArchivosAdjuntos.splice(pos, 1);
            });
            //#endregion
            /*NO ACTIVOS TEMPORALMENTE  ↓ ↓ ↓ ↓ ↓*/
            //#region CARGA DE LIBRETA MILITAR
            vm.objLibretaMilitar = {
                rutaAlmacenamiento: TreidConfigSrv.variables.d_carpeta_libMilitar_persona,
                ArrayArchivo: []
            };
            $("#inputLibretaMilitar").fileinput({
                language             : "es",
                maxFileCount         : 3,
                uploadUrl            : "/file-upload-batch/2",
                allowedFileExtensions: ["txt", "docx", "DOC", "PDF", "pdf", "doc", "DOCX", "JPG", "BMP", "PDF", "GIF", "PNG", "JPEG"],
                minImageWidth        : 50,
                minImageHeight       : 50,
                showUpload           : false,
                layoutTemplates: {
                    main1: "{preview}\n" +
                        "<div class=\'input-group {class}\'>\n" +
                        "   <div class=\'input-group-btn\'>\n" +
                        "       {browse}\n" +
                        //"       {upload}\n" +
                        "       {remove}\n" +
                        "   </div>\n" +
                        "</div>"
                },
            });
            $('#inputLibretaMilitar').on('fileloaded', function(event, file, previewId, index, reader) {
                console.log("fileloaded");
                vm.objLibretaMilitar.ArrayArchivo.push({
                    archivo: file
                });
            });
            //#endregion
            //#region CARGA DE REGISTRO CIVIL DE NACIMIENTO
            vm.objRegistroCivil = {
                rutaAlmacenamiento: "",
                archivo: ""
            };
            $("#inputRegistroCivilNacimiento").fileinput({
                language             : "es",
                uploadUrl            : "/file-upload-batch/2",
                allowedFileExtensions: ["txt", "docx", "DOC", "PDF", "pdf", "doc", "DOCX"],
                minImageWidth        : 50,
                minImageHeight       : 50,
                showUpload           : false,
                layoutTemplates: {
                    main1: "{preview}\n" +
                        "<div class=\'input-group {class}\'>\n" +
                        "   <div class=\'input-group-btn\'>\n" +
                        "       {browse}\n" +
                        "       {remove}\n" +
                        "   </div>\n" +
                        "</div>"
                },
            });
            $('#inputRegistroCivilNacimiento').on('fileloaded', function(event, file, previewId, index, reader) {
                console.log("fileloaded");
                vm.objRegistroCivil = {
                    rutaAlmacenamiento: TreidConfigSrv.variables.d_carpeta_libMilitar_persona,
                    archivo: file
                };
            });
            //#endregion
            //#region Métodos

            get_tipos_camisas();
            get_tipos_pantalon();
            get_tipos_botas();
            get_estados_civiles();
            get_niveles_educacion();
            get_detalles_nivel_academico_empleado();

            function get_tipos_camisas() {
                gestionPersonasService.getTiposCamisas()
                    .then(function (tipos_camisas) {
                        if (tipos_camisas.data.length > 0 && tipos_camisas.data[0].length > 0) {

                            vm.array_tipos_camisas = _.where(tipos_camisas.data[0], { sw_otro_tipo_camisa: false });
                            vm.list_otros_tipos_camisa = _.where(tipos_camisas.data[0], { sw_otro_tipo_camisa: true });

                        } else {
                            vm.array_tipos_camisas = [];
                            vm.list_otros_tipos_camisa = [];
                            toastr.error('No se encontraron tipos de camisas para la dotación del empleado. Comuniquese con el admin');
                        }
                    });
            };
         
            function get_tipos_pantalon() {
                gestionPersonasService.getTiposPantalon()
                    .then(function (datos) {
                        if (datos.data.length > 0 && datos.data[0].length > 0) {
                            vm.array_tipos_pantalon = datos.data[0];
                        } else {
                            vm.array_tipos_pantalon = [];
                            toastr.error('No se encontraron tipos de pantalón para la dotación del empleado. Comuniquese con el admin');
                        }
                    });
            };

            function get_tipos_botas() {
                gestionPersonasService.getTiposBotas()
                    .then(function (datos) {
                        if (datos.data.length > 0 && datos.data[0].length > 0) {
                            vm.list_tipos_botas = datos.data[0];
                        } else {
                            vm.list_tipos_botas = [];
                            toastr.error('No se encontraron tipos de botas para la dotación del empleado. Comuníquese con el admin');
                        }
                    });
            };

            function get_estados_civiles() {
                gestionPersonasService.getEstadosCiviles()
                    .then(function (datos) {
                        if (datos.data.length > 0 && datos.data[0].length > 0) {
                            vm.list_estados_civiles = datos.data[0];
                        } else {
                            vm.list_estados_civiles = [];
                            toastr.error('No se encontraron tipos de estados civiles. Comuníquese con el admin');
                        }
                    });
            };

            
            function get_niveles_educacion() {
                gestionPersonasService.getNivelesEducacion()
                    .then(function (datos) {
                        if (datos.data.length > 0 && datos.data[0].length > 0) {
                            vm.list_niveles_educacion = datos.data[0];
                        } else {
                            vm.list_niveles_educacion = [];
                            toastr.error('No se encontraron niveles de educación. Comuníquese con el admin');
                        }
                    });
            };

            function get_detalles_nivel_academico_empleado() {
                gestionPersonasService.getDetallesNivelAcademicoEmpleado()
                    .then(function (datos) {
                        if (datos.data.length > 0 && datos.data[0].length > 0) {
                            vm.list_dt_niveles_educacion = datos.data[0];
                        } else {
                            vm.list_dt_niveles_educacion = [];
                            toastr.error('No se encontraron detalles de niveles de educación. Comuníquese con el admin');
                        }
                    });
            };

            
            

            function GuardarPersona() {

                vm.objGestionEmpleados.fhNacimiento = moment($('#dtFhNacimiento').data("DateTimePicker").date()).format("DD/MMMM/YYYY");
                vm.objGestionEmpleados.fhIngreso = moment($('#dtFhIngreso').data("DateTimePicker").date()).format("DD/MMMM/YYYY");
                vm.objGestionEmpleados.fechaRegistro = moment($('#dtFhRegistro').data("DateTimePicker").date()).format("DD/MMMM/YYYY");

                if (vm.objGestionEmpleados.cedula === "") {
                    toastr.warning("Debe ingresar un número de cédula válido");
                    return;
                }
                if (parseInt(vm.objGestionEmpleados.cedula.length) > 12) {
                    toastr.warning("La cedúla debe contener máximo 12 digitos");
                    return;
                }
                if (vm.objGestionEmpleados.primerNombre === "") {
                    toastr.warning("Debe ingresar el primer nombre");
                    return;
                }
                if (vm.objGestionEmpleados.primerApellido === "") {
                    toastr.warning("Debe ingresar el primer apellido");
                    return;
                }
                if (vm.objGestionEmpleados.fhNacimiento === "" || vm.objGestionEmpleados.fhNacimiento === "Invalid date") {
                    vm.objGestionEmpleados.fhNacimiento = null;
                }
                if (vm.objGestionEmpleados.genero === "") {
                    toastr.warning("Debe seleccionar un genero");
                    return;
                }
                if (vm.objGestionEmpleados.telefono === "" || _.isNull(vm.objGestionEmpleados.telefono)) {
                    vm.objGestionEmpleados.telefono = null;
                } else {
                    /*validamos el length del telefono*/
                    var lenghtTelefono = vm.objGestionEmpleados.telefono.length;

                    if (lenghtTelefono > 10) {
                        toastr.warning("El telefono de residencia debe tener máximo 10 digitos");
                        return;
                    }
                }

                if (vm.objGestionEmpleados.direccion === "") {
                    vm.objGestionEmpleados.direccion = null;
                }
                if (vm.objGestionEmpleados.c_compania === "") {
                    toastr.warning("Debe seleccionar una compañia");
                    return;
                }

                /*tallas de dotacion*/
                if (!vm.objGestionEmpleados.sw_derecho_dotacion) {
                    vm.objGestionEmpleados.sw_derecho_chaqueta = false;
                    vm.objGestionEmpleados.c_talla_camisa = "";
                    vm.objGestionEmpleados.c_talla_chaqueta = "";
                    vm.objGestionEmpleados.c_talla_pantalon = "";
                    vm.objGestionEmpleados.c_talla_zapatos = "";
                    vm.objGestionEmpleados.c_talla_chaleco = "";
                    vm.objGestionEmpleados.c_tipo_camisa = "";
                    vm.objGestionEmpleados.c_tipo_pantalon = "";
                    vm.objGestionEmpleados.cantidad_camisas = "";
                    vm.objGestionEmpleados.direccion_dotacion = "";
                    vm.objGestionEmpleados.c_depto_dotacion = "";
                    vm.objGestionEmpleados.c_ciudad_dotacion = "";

                    vm.objGestionEmpleados.c_otro_tipo_camisa = "";
                    vm.objGestionEmpleados.c_tipo_bota = ""; 
                }

                if (vm.objGestionEmpleados.c_talla_camisa === "") {
                    vm.objGestionEmpleados.c_talla_camisa = null;
                }
                if (vm.objGestionEmpleados.c_talla_chaqueta === "" || !vm.objGestionEmpleados.sw_derecho_chaqueta) {
                    vm.objGestionEmpleados.c_talla_chaqueta = null;
                }
                if (vm.objGestionEmpleados.c_talla_pantalon === "") {
                    vm.objGestionEmpleados.c_talla_pantalon = null;
                }
                if (vm.objGestionEmpleados.c_talla_zapatos === "") {
                    vm.objGestionEmpleados.c_talla_zapatos = null;
                }

                if (vm.objGestionEmpleados.c_talla_chaleco === null) {
                    vm.objGestionEmpleados.c_talla_chaleco = "";
                }
                if (vm.objGestionEmpleados.cantidad_camisas === null) {
                    vm.objGestionEmpleados.cantidad_camisas = "";
                }
                if (vm.objGestionEmpleados.c_tipo_camisa === null) {
                    vm.objGestionEmpleados.c_tipo_camisa = "";
                }
                if (vm.objGestionEmpleados.c_tipo_pantalon === null) {
                    vm.objGestionEmpleados.c_tipo_pantalon = "";
                }

                if (vm.objGestionEmpleados.c_otro_tipo_camisa === null) {
                    vm.objGestionEmpleados.c_otro_tipo_camisa = "";
                }
                if (vm.objGestionEmpleados.c_tipo_bota === null) {
                    vm.objGestionEmpleados.c_tipo_bota = "";
                }

                //REGISTRO DE UN EMPLEADO (VALIDACIONES)
                if (vm.objGestionEmpleados.c_compania != $rootScope.idCompaniaAspirante.value) {
                    if (vm.objGestionEmpleados.fhIngreso === "" || vm.objGestionEmpleados.fhIngreso === "Invalid date") {
                        toastr.warning("Debe seleccionar una fecha de ingreso válido");
                        return;
                    }

                    vm.objGestionEmpleados.c_tipo_contrato = vm.tipoContratoEmpleado;
                    if (vm.objGestionEmpleados.c_tipo_contrato === "" || vm.objGestionEmpleados.c_tipo_contrato === null || vm.objGestionEmpleados.c_tipo_contrato === undefined) {
                        toastr.warning("Debe seleccionar un tipo de contrato");
                        return;
                    }

                    /* validamos la direccion de envio de dotación*/
                    if ((vm.objGestionEmpleados.direccion_dotacion !== "" && !_.isNull(vm.objGestionEmpleados.direccion_dotacion) && !_.isUndefined(vm.objGestionEmpleados.direccion_dotacion))
                        ||
                        (vm.objGestionEmpleados.c_depto_dotacion !== "" && !_.isNull(vm.objGestionEmpleados.c_depto_dotacion) && !_.isUndefined(vm.objGestionEmpleados.c_depto_dotacion))
                        ||
                        (vm.objGestionEmpleados.c_ciudad_dotacion !== "" && !_.isNull(vm.objGestionEmpleados.c_ciudad_dotacion) && !_.isUndefined(vm.objGestionEmpleados.c_ciudad_dotacion))) {

                        if (vm.objGestionEmpleados.direccion_dotacion === "" || _.isNull(vm.objGestionEmpleados.direccion_dotacion) || _.isUndefined(vm.objGestionEmpleados.direccion_dotacion)) {
                            toastr.warning("Debe ingresar una dirección válida");
                            return;
                        }

                        if (vm.objGestionEmpleados.c_depto_dotacion === "" || _.isNull(vm.objGestionEmpleados.c_depto_dotacion) || _.isUndefined(vm.objGestionEmpleados.c_depto_dotacion)) {
                            toastr.warning("Debe seleccionar un departamento válido");
                            return;
                        }

                        if (vm.objGestionEmpleados.c_ciudad_dotacion === "" || _.isNull(vm.objGestionEmpleados.c_ciudad_dotacion) || _.isUndefined(vm.objGestionEmpleados.c_ciudad_dotacion)) {
                            toastr.warning("Debe seleccionar una ciudad válida");
                            return;
                        }
                    }

                    if (vm.objGestionEmpleados.idPlaza == "" || vm.objGestionEmpleados.idPlaza == null) {
                        alertify.confirm("No se seleccionó una plaza para el empleado. Desea guardar el empleado y que éste quede inactivo?",
                            function () {

                                vm.objGestionEmpleados.swActivo = false;
                                vm.objGestionEmpleados.idPlaza = null;

                                $timeout(function () {
                                    vm.$apply();
                                    guardar_empleado();
                                }, 1);
                            },
                            function () {
                                return;
                            });
                    } else {
                        guardar_empleado();
                    }
                }

                //#region INSERT DE UN ASPIRANTE
                /*va a insertar un aspirante*/
                if (vm.objGestionEmpleados.c_compania == $rootScope.idCompaniaAspirante.value) {

                    if (vm.objGestionEmpleados.fechaRegistro == "" || vm.objGestionEmpleados.fechaRegistro == "Invalid date") {
                        toastr.warning("Debe ingresar una fecha de resgistro válida");
                        return;
                    }

                    vm.objGestionEmpleados.fhNacimiento_format = moment($('#dtFhNacimiento').data("DateTimePicker").date()).format("MM/DD/YYYY");
                    if (vm.objGestionEmpleados.fhNacimiento_format === "Invalid date") {
                        vm.objGestionEmpleados.fhNacimiento_format = null;
                    }
                    vm.objGestionEmpleados.fhRegistro_format = moment($('#dtFhRegistro').data("DateTimePicker").date()).format("MM/DD/YYYY");
                    $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "postDataAspirante/", JSON.stringify(vm.objGestionEmpleados)).
                        then(function (result) {
                            if (result === null) {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data === null) {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data.name == "RequestError") {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data.MSG == "GUARDADO") {
                                toastr.success('Registro almacenado correctamente');
                                /*GUARDAR LOS DOCS ADJUNTOS*/
                                vm.insertarGdocumental(vm.objGestionEmpleados.cedula);
                                vm.ArrayDatosEmpleado = [];
                            } else {
                                toastr.warning(result.data.MSG);
                                return;
                            }
                        }).catch(function (data) {
                            vm.Error.value = true;
                        });
                }
                //#endregion
            };

            function ModificarPersona() {

                vm.objGestionEmpleados.fhNacimiento = moment($('#dtFhNacimiento').data("DateTimePicker").date()).format("DD/MMMM/YYYY");
                vm.objGestionEmpleados.fhIngreso = moment($('#dtFhIngreso').data("DateTimePicker").date()).format("DD/MMMM/YYYY");
                if (vm.objGestionEmpleados.primerNombre == "") {
                    toastr.warning("Debe ingresar el primer nombre");
                    return;
                }
                if (vm.objGestionEmpleados.primerApellido == "") {
                    toastr.warning("Debe ingresar el primer apellido");
                    return;
                }
                if (vm.objGestionEmpleados.fhNacimiento == "" || vm.objGestionEmpleados.fhNacimiento == "Invalid date") {
                    vm.objGestionEmpleados.fhNacimiento = null;
                }

                if (vm.objGestionEmpleados.genero == "" || vm.objGestionEmpleados.genero == "") {
                    toastr.warning("Debe seleccionar un genero");
                    return;
                }
                if (vm.objGestionEmpleados.telefono === "" || vm.objGestionEmpleados.telefono === null) {
                    vm.objGestionEmpleados.telefono = null;
                } else {
                    /*validamos el length del telefono*/
                    var lenghtTelefono = vm.objGestionEmpleados.telefono.length;

                    if (lenghtTelefono > 10) {
                        toastr.warning("El telefono de residencia debe tener máximo 10 digitos");
                        return;
                    }
                }
                if (vm.objGestionEmpleados.direccion == "" || vm.objGestionEmpleados.direccion == null) {
                    vm.objGestionEmpleados.direccion = null;
                }
                if (vm.objGestionEmpleados.c_compania == "" || vm.objGestionEmpleados.c_compania == null) {
                    toastr.warning("Debe seleccionar una compañia");
                    return;
                }

                /*tallas de dotacion*/
                if (!vm.objGestionEmpleados.sw_derecho_dotacion) {
                    vm.objGestionEmpleados.sw_derecho_chaqueta = false;
                    vm.objGestionEmpleados.c_talla_camisa = "";
                    vm.objGestionEmpleados.c_talla_chaqueta = "";
                    vm.objGestionEmpleados.c_talla_pantalon = "";
                    vm.objGestionEmpleados.c_talla_zapatos = "";
                    vm.objGestionEmpleados.c_talla_chaleco = "";
                    vm.objGestionEmpleados.c_tipo_camisa = "";
                    vm.objGestionEmpleados.c_tipo_pantalon = "";

                    vm.objGestionEmpleados.c_otro_tipo_camisa = "";
                    vm.objGestionEmpleados.c_tipo_bota = "";

                    vm.objGestionEmpleados.cantidad_camisas = "";
                    vm.objGestionEmpleados.direccion_dotacion = "";
                    vm.objGestionEmpleados.c_depto_dotacion = "";
                    vm.objGestionEmpleados.c_ciudad_dotacion = "";
                }

                if (vm.objGestionEmpleados.c_talla_camisa === "") {
                    vm.objGestionEmpleados.c_talla_camisa = null;
                }
                if (vm.objGestionEmpleados.c_talla_chaqueta === "" || !vm.objGestionEmpleados.sw_derecho_chaqueta) {
                    vm.objGestionEmpleados.c_talla_chaqueta = null;
                }
                if (vm.objGestionEmpleados.c_talla_pantalon === "") {
                    vm.objGestionEmpleados.c_talla_pantalon = null;
                }
                if (vm.objGestionEmpleados.c_talla_zapatos === "") {
                    vm.objGestionEmpleados.c_talla_zapatos = null;
                }
                if (vm.objGestionEmpleados.c_talla_chaleco === null) {
                    vm.objGestionEmpleados.c_talla_chaleco = "";
                }
                if (vm.objGestionEmpleados.cantidad_camisas === null) {
                    vm.objGestionEmpleados.cantidad_camisas = "";
                }
                if (vm.objGestionEmpleados.c_tipo_camisa === null) {
                    vm.objGestionEmpleados.c_tipo_camisa = "";
                }
                if (vm.objGestionEmpleados.c_tipo_pantalon === null) {
                    vm.objGestionEmpleados.c_tipo_pantalon = "";
                }

                if (vm.objGestionEmpleados.c_otro_tipo_camisa === null) {
                    vm.objGestionEmpleados.c_otro_tipo_camisa = "";
                }
                if (vm.objGestionEmpleados.c_tipo_bota === null) {
                    vm.objGestionEmpleados.c_tipo_bota = "";
                }

                /* validamos la direccion de envio de dotación*/
                if ((vm.objGestionEmpleados.direccion_dotacion !== "" && !_.isNull(vm.objGestionEmpleados.direccion_dotacion) && !_.isUndefined(vm.objGestionEmpleados.direccion_dotacion))
                    ||
                    (vm.objGestionEmpleados.c_depto_dotacion !== "" && !_.isNull(vm.objGestionEmpleados.c_depto_dotacion) && !_.isUndefined(vm.objGestionEmpleados.c_depto_dotacion))
                    ||
                    (vm.objGestionEmpleados.c_ciudad_dotacion !== "" && !_.isNull(vm.objGestionEmpleados.c_ciudad_dotacion) && !_.isUndefined(vm.objGestionEmpleados.c_ciudad_dotacion))) {

                    if (vm.objGestionEmpleados.direccion_dotacion === "" || _.isNull(vm.objGestionEmpleados.direccion_dotacion) || _.isUndefined(vm.objGestionEmpleados.direccion_dotacion)) {
                        toastr.warning("Debe ingresar una dirección válida");
                        return;
                    }

                    if (vm.objGestionEmpleados.c_depto_dotacion === "" || _.isNull(vm.objGestionEmpleados.c_depto_dotacion) || _.isUndefined(vm.objGestionEmpleados.c_depto_dotacion)) {
                        toastr.warning("Debe seleccionar un departamento válido");
                        return;
                    }

                    if (vm.objGestionEmpleados.c_ciudad_dotacion === "" || _.isNull(vm.objGestionEmpleados.c_ciudad_dotacion) || _.isUndefined(vm.objGestionEmpleados.c_ciudad_dotacion)) {
                        toastr.warning("Debe seleccionar una ciudad válida");
                        return;
                    }
                }

                //REGISTRO DE UN EMPLEADO (VALIDACIONES)
                if (vm.objGestionEmpleados.c_compania != $rootScope.idCompaniaAspirante.value) {
                    if (vm.objGestionEmpleados.fhIngreso == "" || vm.objGestionEmpleados.fhIngreso == "Invalid date") {
                        toastr.warning("Debe seleccionar una fecha de ingreso válido");
                        return;
                    }

                    if (!vm.retirar_empleado.value) {
                        vm.objGestionEmpleados.c_tipo_contrato = vm.tipoContratoEmpleado;
                        if (vm.objGestionEmpleados.c_tipo_contrato == "" || vm.objGestionEmpleados.c_tipo_contrato == null || vm.objGestionEmpleados.c_tipo_contrato == undefined) {
                            toastr.warning("Debe seleccionar un tipo de contrato");
                            return;
                        }
                    }

                    /*no tiene plaza seleccionada*/
                    if (vm.objGestionEmpleados.idPlaza == "" || vm.objGestionEmpleados.idPlaza == null) {
                        alertify.confirm("No se seleccionó una plaza para el empleado. Desea guardar el empleado y que éste quede inactivo?",
                            function () {
                                vm.objGestionEmpleados.swActivo = false;
                                vm.objGestionEmpleados.idPlaza = null;
                                retiro_empleado();
                                $timeout(function () {
                                    vm.$apply();
                                }, 0);
                            },
                            function () {
                                return;
                            });
                    } else {
                        /*tiene plaza escogida*/
                        if (!vm.objGestionEmpleados.swActivo) {
                            alertify.confirm("La persona tiene una plaza asiganada, la cual quedara vacante, desea inactivarlo?",
                                function () {
                                    console.log("acepto");
                                    vm.objGestionEmpleados.swActivo = false;
                                    vm.objGestionEmpleados.plaza_old_empleado = vm.objGestionEmpleados.idPlaza;
                                    vm.objGestionEmpleados.idPlaza = null;
                                    vm.objGestionEmpleados.sw_desligar_plaza = true;
                                    retiro_empleado();
                                    $timeout(function () {
                                        vm.$apply();
                                    }, 0);
                                },
                                function () {
                                    return;
                                });
                        } else {
                            retiro_empleado();
                        }
                    }
                }
                //#region se va a modificar un aspirante*/
                if (vm.objGestionEmpleados.c_compania == $rootScope.idCompaniaAspirante.value) {
                    vm.objGestionEmpleados.fhRegistro_format = moment($('#dtFhRegistro').data("DateTimePicker").date()).format("MM/DD/YYYY");
                    vm.objGestionEmpleados.fhNacimiento_format = moment($('#dtFhNacimiento').data("DateTimePicker").date()).format("MM/DD/YYYY");

                    if (vm.objGestionEmpleados.fhNacimiento_format === "Invalid date") {
                        vm.objGestionEmpleados.fhNacimiento_format = null;
                    }

                    $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "updateDataAspirante/", JSON.stringify(vm.objGestionEmpleados)).
                        then(function (result) {
                            if (result === null) {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data === null) {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data.name == "RequestError") {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data.MSG == "GUARDADO") {
                                toastr.success('Registro almacenado correctamente');
                                /*GUARDAR LOS DOCS ADJUNTOS*/
                                vm.insertarGdocumental(vm.objGestionEmpleados.cedula);
                                vm.ArrayDatosEmpleado = [];
                                vm.realizoTransaccion.value = false;
                            } else {
                                toastr.warning(result.data.MSG);
                                return;
                            }
                        }).catch(function (data) {
                            vm.Error.value = true;
                        });
                }
                //#endregion

            };

            /*se guardan las modificaciones del empleado*/
            function guardar_modificacion_empleado() {

                //#region va a modificar un empleado*/
                if (vm.objGestionEmpleados.c_compania != $rootScope.idCompaniaAspirante.value) {
                    vm.objGestionEmpleados.primerNombre.toUpperCase();
                    vm.objGestionEmpleados.segundoNombre.toUpperCase();
                    vm.objGestionEmpleados.primerApellido.toUpperCase();
                    vm.objGestionEmpleados.segundoApellido.toUpperCase();

                    if (vm.objGestionEmpleados.c_tipo_contrato != null)
                        vm.objGestionEmpleados.c_tipo_contrato = parseInt(vm.objGestionEmpleados.c_tipo_contrato);

                    vm.objGestionEmpleados.fhNacimiento_format = moment($('#dtFhNacimiento').data("DateTimePicker").date()).format("MM/DD/YYYY");

                    if (vm.objGestionEmpleados.fhNacimiento_format === "Invalid date") {
                        vm.objGestionEmpleados.fhNacimiento_format = null;
                    }

                    vm.objGestionEmpleados.fhIngreso_format = moment($('#dtFhIngreso').data("DateTimePicker").date()).format("MM/DD/YYYY");
                    $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "UpdateDataPersona/", JSON.stringify(vm.objGestionEmpleados)).
                        then(function (result) {
                            if (result === null) {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data === null) {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data.name == "RequestError") {
                                toastr.warning(result.data.message);
                                return;
                            }
                            if (result.data.MSG == "GUARDADO") {
                                toastr.success('Registro almacenado correctamente');
                                /*GUARDAR LOS DOCS ADJUNTOS*/
                                vm.insertarGdocumental(vm.objGestionEmpleados.cedula);
                                vm.ArrayDatosEmpleado = [];
                                vm.realizoTransaccion.value = false;

                                $timeout(function () {
                                    getPersonaByParametro(vm.objGestionEmpleados.cedula);
                                }, 200);
                            } else {
                                toastr.warning(result.data.MSG);
                                return;
                            }
                        }).catch(function (data) {
                            vm.Error.value = true;
                        });
                }
                //#endregion
            }

            vm.validar_existencia_cedula = function() {

                if (vm.objGestionEmpleados.cedula != "") {
                    if (parseInt(vm.objGestionEmpleados.cedula.length) > 12)
                        toastr.error('La cédula debe contener máximo 12 digitos');

                    $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "validar_existencia_cedula/" + vm.objGestionEmpleados.cedula).
                        then(function(result) {
                            if (result === null)
                                return;
                            if (result.data === null)
                                return;
                            if (result.data.data[0].length > 0) {
                                toastr.error('La cédula ' + vm.objGestionEmpleados.cedula + " ya se encuentra registrada");
                                $rootScope.progressbar.reset();
                                return;
                            }

                            $rootScope.progressbar.complete();
                        }).catch(function(data) {
                            vm.Error.value = true;
                        });
                }

            };
            vm.GetCompanias = function() {
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCompanias/").
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.ArrayCompanias = result.data.data[0];
                        for (var i = 0; i < vm.ArrayCompanias.length; i++) {
                            if (vm.ArrayCompanias[i].d_compania == "ASPIRANTE") {
                                vm.objGestionEmpleados.c_compania = vm.ArrayCompanias[i].c_compania;
                                vm.ArrayCompanias[i].seleccionado = true;
                            } else {
                                vm.ArrayCompanias[i].seleccionado = false;
                            }
                        }
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.buscarEmpleado = function() {
                vm.LimpiarCampos();
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "buscarEmpleado/" + vm.filtroPersona).
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            toastr.error('No se encontró registro con ' + vm.filtroPersona);
                            /*desactivar botones para modificar el usuario*/
                            vm.modificar.value                     = false;
                            vm.objGestionEmpleados.primerNombre    = "";
                            vm.objGestionEmpleados.segundoNombre   = "";
                            vm.objGestionEmpleados.primerApellido  = "";
                            vm.objGestionEmpleados.segundoApellido = "";
                            vm.objGestionEmpleados.cedula          = "";
                            vm.objGestionEmpleados.fhNacimiento    = "";
                            vm.objGestionEmpleados.genero          = "";
                            vm.objGestionEmpleados.telefono        = 0;
                            vm.objGestionEmpleados.celular         = 0;
                            vm.objGestionEmpleados.direccion       = "";
                            vm.objGestionEmpleados.c_compania      = "";
                            vm.objGestionEmpleados.fhIngreso       = "";
                            vm.objGestionEmpleados.swActivo        = true;

                            $timeout(function() {
                                vm.$apply();
                            }, 0);

                            $('#dtFhNacimiento').data("DateTimePicker").clear();
                            $('#dtFhIngreso').data("DateTimePicker").clear();
                            
                            vm.disable_ChkswActivo = true;
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.ArrayDatosEmpleado = result.data.data[0];
                        vm.getTiposContratos();
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.getCentroOperacion_filtro = function() {
                if (vm.filtro_centro_operacion == "" || vm.filtro_centro_operacion == undefined) {
                    toastr.error('Debe ingresar una palabra clave!');
                    return;
                }
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCentroOperativo_filtro/" + vm.filtro_centro_operacion).
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            vm.CentroOperacion.abierto = false;
                            vm.ArrayCentroOperativo    = [];
                            toastr.error('No se encontraron resultados con la palabra clave [ ' + vm.filtro_centro_operacion + ' ]');
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.ArrayCentroOperativo    = result.data.data[0];
                        vm.CentroOperacion.abierto = true;
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.cargarCO = function(item) {
                vm.filtro_centro_operacion = item.c_centro_operacion;
                vm.objFiltrosPlaza.CO      = item.c_centro_operacion;
                vm.CentroOperacion.abierto = false;
            };
            vm.getGerencias = function() {
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getGerencias/").
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.ArrayGerencias = result.data.data[0];
                        $timeout(function() {
                            $("#seleccion_Gerencias").select2({
                                placeholder: "Buscar gerencia",
                                allowClear: true
                            });
                        }, 0);
                        vm.getCargos();
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.getCentroCostos_filtro = function() {
                if (vm.filtro_idCentroCostos == "" || vm.filtro_idCentroCostos == undefined) {
                    toastr.error('Debe ingresar una palabra clave!');
                    return;
                }
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCentroCostos_filtro/" + vm.filtro_idCentroCostos).
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            vm.CentroCostos.abierto = false;
                            vm.ArrayCentrosCostos = [];
                            toastr.error('No se encontraron resultados con la palabra clave [ ' + vm.filtro_idCentroCostos + ' ]');
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.ArrayCentrosCostos = result.data.data[0];
                        vm.CentroCostos.abierto = true;
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.cargarCC = function(item) {
                vm.filtro_idCentroCostos = item.f284_id;
                vm.objFiltrosPlaza.CC    = item.f284_id;
                vm.CentroCostos.abierto  = false;
            };
            vm.getCargos = function() {
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getCargos/").
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.ArrayCargos = result.data.data[0];
                        $timeout(function() {
                            $("#seleccion_Cargos").select2({
                                placeholder: "Buscar cargos",
                                allowClear: true
                            });
                        }, 0);
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.buscarPlaza = function() {
                if (vm.isCollapsed) {
                    vm.ArrayplazasDisponibles = [];
                    vm.getGerencias();
                    document.getElementById("seleccion_Gerencias").focus();

                    $timeout(function() {
                        document.getElementById("seleccion_Gerencias").focus();
                    }, 300);
                }
            };



   

            vm.listCentrosOperacionDireccion = [];
            vm.listUbicacionCentrosOperacion = [];
            vm.listDeptos                    = [];
            vm.listCiudades                  = [];
            vm.listCiudadesOriginal          = [];
            
            vm.get_direcciones_co = function () {
                gestionPersonasService.getDireccionesCo()
                    .then(function (datos) {
                        if (datos.data.length > 0 && datos.data[0].length > 0) {

                            vm.listCentrosOperacionDireccion = datos.data[0];
                            vm.listUbicacionCentrosOperacion = datos.data[1];
                            vm.listDeptos                    = datos.data[2];
                            vm.listCiudadesOriginal          = datos.data[3];
                            vm.listCiudades                  = angular.copy(vm.listCiudadesOriginal);

                            vm.listCentrosOperacionDireccion.forEach(function (item, index) {
                                item.text = item.d_centro_operacion;
                                item.id = item.c_centro_operacion;
                            });

                            $("#seleccion_centro_operacion").select2({
                                placeholder: "Centro Operación",
                                allowClear: true
                            });

                        } else {
                            vm.listCentrosOperacionDireccion = [];
                            vm.listUbicacionCentrosOperacion = [];
                            vm.listDeptos                    = [];
                            vm.listCiudades                  = [];
                            vm.listCiudadesOriginal          = [];
                            toastr.error('No se encontraron datos de direcciones de los centros de operación. Comuniquese con el admin');
                        }
                    });
            };
            vm.get_ciudades_depto_dotacion = function() {
                
                if (vm.objGestionEmpleados.c_depto_dotacion !== "" && !_.isUndefined(vm.objGestionEmpleados.c_depto_dotacion) && !_.isNull(vm.objGestionEmpleados.c_depto_dotacion)) {

                    vm.objGestionEmpleados.c_ciudad_dotacion = "";
                    vm.listCiudades = vm.listCiudadesOriginal.filter(function (item) {
                        return item.c_depto === vm.objGestionEmpleados.c_depto_dotacion;
                    });
                } else {
                    vm.objGestionEmpleados.c_ciudad_dotacion = "";
                    vm.listCiudades = angular.copy(vm.listCiudadesOriginal);
                }

                $timeout(function() {
                    vm.$apply();
                }, 0);
            };

            vm.filtrarPlazas = function() {
                if (vm.objFiltrosPlaza.gerencia == null) {
                    toastr.error('Debe seleccionar una Gerencia');
                    return;
                }
                if (vm.filtro_centro_operacion == "" || vm.filtro_centro_operacion == undefined) {
                    vm.objFiltrosPlaza.CO = null;
                } else {
                    vm.objFiltrosPlaza.CO = vm.filtro_centro_operacion;
                }
                if (vm.filtro_idCentroCostos == "" || vm.filtro_idCentroCostos == undefined) {
                    vm.objFiltrosPlaza.CC = null;
                } else {
                    vm.objFiltrosPlaza.CC = vm.filtro_idCentroCostos;
                }
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "GetPlazasDisponibles/" + vm.objFiltrosPlaza.gerencia + "/" + vm.objFiltrosPlaza.CO + "/" + vm.objFiltrosPlaza.CC + "/" + vm.objFiltrosPlaza.Cargo).
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            $rootScope.progressbar.reset();
                            vm.ArrayplazasDisponibles = [];
                            return;
                        }
                        vm.ArrayplazasDisponibles = result.data.data[0];
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.getTiposContratos = function() {
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getTiposContratos/").
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            $rootScope.progressbar.reset();
                            return;
                        }

                        vm.ArrayTiposContratos = result.data.data[0];

                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.cargarPersona = function (registro) {
                 
                vm.objGestionEmpleados = angular.copy(vm.objGestionEmpleadosOriginal);

                $("#seleccion_centro_operacion").select2("val", "");
                $('#dtFhIngreso').data("DateTimePicker").clear();
                vm.listCiudades = angular.copy(vm.listCiudadesOriginal);
                vm.arrayArchivosAdjuntos = [];
                vm.tipoContratoEmpleado  = "";
                /*activar botones para modificar el usuario*/
                vm.modificar.value       = true;
                vm.disable_ChkswActivo = false;
                
                /*propiedades origen con nombre diferente a las propiedades que utiliza la aplicación*/
                vm.objGestionEmpleados.primerNombre        = registro.primer_nombre;
                vm.objGestionEmpleados.segundoNombre       = registro.segundo_nombre;
                vm.objGestionEmpleados.primerApellido      = registro.primer_apellido;
                vm.objGestionEmpleados.segundoApellido     = registro.segundo_apellido;
                vm.objGestionEmpleados.fhNacimiento        = moment(registro.f_nacimiento).format("DD/MMMM/YYYY");
                vm.objGestionEmpleados.genero              = registro.c_genero;
                vm.objGestionEmpleados.telefono            = registro.telefono_residencia;
                vm.objGestionEmpleados.emailPersonal       = registro.email_personal;
                vm.objGestionEmpleados.direccion           = registro.direccion_residencia;
                vm.objGestionEmpleados.fhIngreso           = moment(registro.f_ingreso).format("DD/MMMM/YYYY");
                vm.objGestionEmpleados.swActivo            = registro.sw_activo;
                vm.objGestionEmpleados.idPlaza             = registro.c_plaza;
                vm.objGestionEmpleados.plaza               = registro.d_plaza;
                vm.objGestionEmpleados.cantidad_camisas    = registro.cant_camisas;
  
                /*el resto de propiedades se extienden dado que la app utiliza el mismo nombre de origen*/
                _.extend(vm.objGestionEmpleados, registro);
                
                if (_.isNull(vm.objGestionEmpleados.direccion_dotacion) || _.isUndefined(vm.objGestionEmpleados.direccion_dotacion))
                    vm.objGestionEmpleados.direccion_dotacion = "";

                if (_.isNull(vm.objGestionEmpleados.c_depto_dotacion) || _.isUndefined(vm.objGestionEmpleados.c_depto_dotacion))
                    vm.objGestionEmpleados.c_depto_dotacion = "";

                if (_.isNull(vm.objGestionEmpleados.c_ciudad_dotacion) || _.isUndefined(vm.objGestionEmpleados.c_ciudad_dotacion))
                    vm.objGestionEmpleados.c_ciudad_dotacion = "";

                if (_.isNull(vm.objGestionEmpleados.cantidad_camisas))
                    vm.objGestionEmpleados.cantidad_camisas = "";

                if (_.isNull(vm.objGestionEmpleados.c_tipo_camisa))
                    vm.objGestionEmpleados.c_tipo_camisa = "";

                if (_.isNull(vm.objGestionEmpleados.c_tipo_pantalon))
                    vm.objGestionEmpleados.c_tipo_pantalon = "";
                
                if (_.isNull(vm.objGestionEmpleados.c_otro_tipo_camisa))
                    vm.objGestionEmpleados.c_otro_tipo_camisa = "";

                if (_.isNull(vm.objGestionEmpleados.c_tipo_bota))
                    vm.objGestionEmpleados.c_tipo_bota = "";

                if (_.isNull(vm.objGestionEmpleados.c_talla_chaleco))
                    vm.objGestionEmpleados.c_talla_chaleco = "";

                if (!_.isNull(registro.c_talla_camisa))
                    vm.objGestionEmpleados.c_talla_camisa = registro.c_talla_camisa.trim();

                if (!_.isNull(registro.c_talla_pantalon))
                    vm.objGestionEmpleados.c_talla_pantalon = registro.c_talla_pantalon.trim();

                if (!_.isNull(registro.c_talla_chaqueta))
                    vm.objGestionEmpleados.c_talla_chaqueta = registro.c_talla_chaqueta.trim();
                
                if (_.isNull(vm.objGestionEmpleados.c_talla_pantalon))
                    vm.objGestionEmpleados.c_talla_pantalon = "";

                if (_.isNull(vm.objGestionEmpleados.c_talla_chaqueta))
                    vm.objGestionEmpleados.c_talla_chaqueta = "";

                if (_.isNull(vm.objGestionEmpleados.c_talla_zapatos))
                    vm.objGestionEmpleados.c_talla_zapatos = "";

                if (!_.isNull(vm.objGestionEmpleados.c_tipo_contrato) && vm.objGestionEmpleados.c_tipo_contrato !== "") {
                    $timeout(function() {
                        var pos;
                        for (var i = 0; i < vm.ArrayTiposContratos.length; i++) {
                            if (vm.ArrayTiposContratos[i].c_tipo_contrato == registro.c_tipo_contrato)
                                pos = i;
                        }
                        vm.tipoContratoEmpleado = vm.ArrayTiposContratos[pos].c_tipo_contrato;
                    }, 0);
                }

                if (registro.f_registro != null)
                    vm.objGestionEmpleados.fechaRegistro = moment(registro.f_registro).format("DD/MMMM/YYYY");
                else
                    vm.objGestionEmpleados.fechaRegistro = "Sin especificar";
                
                if (vm.objGestionEmpleados.fhNacimiento !== null && vm.objGestionEmpleados.fhNacimiento !== undefined && vm.objGestionEmpleados.fhNacimiento !== "")
                    $('#dtFhNacimiento').data("DateTimePicker").date(vm.objGestionEmpleados.fhNacimiento);

                $('#dtFhIngreso').data("DateTimePicker").date(vm.objGestionEmpleados.fhIngreso);

                /*FP*/
                vm.objGestionEmpleados.rutaFotoPersona      = registro.rutaImagen;
                vm.objGestionEmpleados.nombreFotoPersona    = registro.nombreImagen;
                vm.objGestionEmpleados.extensionFotoPersona = registro.extensionImagen;
                
                /*empleado retirado*/
                if (registro.f_retiro != "" && registro.f_retiro != null) {
                    vm.objGestionEmpleados.fhRetiro             = moment(registro.f_retiro).format("DD/MMMM/YYYY");
                    vm.objGestionEmpleados.d_motivo_retiro      = registro.d_motivo_retiro;
                    vm.objGestionEmpleados.d_tipo_retiro        = registro.d_tipo_retiro;
                    vm.objGestionEmpleados.sw_empleado_retirado = true;
                    vm.retirar_empleado.value                   = true;
                    vm.disable_ChkswActivo                      = false;
                } else {
                    vm.objGestionEmpleados.sw_empleado_retirado = false;
                    vm.retirar_empleado.value                   = false;
                    vm.objGestionEmpleados.fhRetiro             = "";
                    vm.objGestionEmpleados.d_motivo_retiro      = "";
                }
                if (registro.fotoPersona != null)
                    vm.fotoPersona = TreidConfigSrv.variables.Dominio + registro.fotoPersona;

                vm.hojaVida = "Assets/img/hojaVida.png";
                if (registro.hojaVida != null)
                    vm.hojaVida_link = TreidConfigSrv.variables.Dominio + registro.hojaVida;

                if (registro.fotoPersona != "" && registro.fotoPersona != null) {
                    vm.showFoto.value = true;
                } else {
                    vm.showFoto.value = false;
                }
                if (registro.hojaVida != "" && registro.hojaVida != null) {
                    vm.showHV.value = true;
                }

                vm.listCiudades = vm.listCiudadesOriginal.filter(function (item) {
                    return item.c_depto === vm.objGestionEmpleados.c_depto_dotacion;
                });

                /*manejo de barra de busqueda, con esto sabemos si se requiere o no abrir la barra, esta propiedad la inicializo en el metodo getPersonaByParametro*/
                if (registro.toggle_wrappper === undefined) /*si es undefined es porque se hace la carga de datos normal en la barra de busqueda, si no lo es es porque se creó en el metodo getPersonaByParametro con el fin de que esta no se abra */
                    registro.toggle_wrappper = true;

                $timeout(function() {
                    /*cuando esta con la clase toggled es porque tenemos cerrado el panel del filtro*/
                    if ($("#wrapperPL").hasClass("toggled")) {
                        if (registro.toggle_wrappper)
                            $("#wrapperPL").removeClass("toggled");

                    } else {
                        $("#wrapperPL").addClass("toggled");
                    }
                }, 0);

                $timeout(function() {
                    $("#app-outer-container").animate({
                        scrollTop: 0
                    }, 120);
                }, 500);

                $timeout(function() {
                    vm.$apply();
                }, 100);
            };
            vm.eliminarArchivo = function(iDdocumento) {
                var tipoDoc = "";
                if (iDdocumento == "FP") {
                    tipoDoc = "Foto";
                    vm.objEliminarArchivo.ruta        = TreidConfigSrv.variables.DirectorioBase + vm.objGestionEmpleados.rutaFotoPersona;
                    vm.objEliminarArchivo.nombre      = vm.objGestionEmpleados.nombreFotoPersona;
                    vm.objEliminarArchivo.extension   = vm.objGestionEmpleados.extensionFotoPersona;
                    vm.objEliminarArchivo.pathArchivo = (TreidConfigSrv.variables.DirectorioBase
                        + vm.objGestionEmpleados.rutaFotoPersona
                        + vm.objGestionEmpleados.nombreFotoPersona
                        + "."
                        + vm.objGestionEmpleados.extensionFotoPersona).trim();
                }
                if (iDdocumento == "HV") {
                    tipoDoc = "Hoja de vida";
                    vm.objEliminarArchivo.ruta        = TreidConfigSrv.variables.DirectorioBase + vm.objGestionEmpleados.rutaHV;
                    vm.objEliminarArchivo.nombre      = vm.objGestionEmpleados.nombreHV;
                    vm.objEliminarArchivo.extension   = vm.objGestionEmpleados.extensionHV;
                    vm.objEliminarArchivo.pathArchivo = (TreidConfigSrv.variables.DirectorioBase
                        + vm.objGestionEmpleados.rutaHV
                        + vm.objGestionEmpleados.nombreHV
                        + "."
                        + vm.objGestionEmpleados.extensionHV).trim();
                }

                alertify.confirm("Está seguro que desea eliminar la " + tipoDoc + " de la persona?",
                    function() {
                        
                        $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "deleteFile/", JSON.stringify(vm.objEliminarArchivo)).
                            then(function(result) {
                                if (result === null) {
                                    toastr.error(result.data.message);
                                    return;
                                }
                                if (result.data === null) {
                                    toastr.error(result.data.message);
                                    return;
                                }
                                if (result.data.name == "RequestError") {
                                    toastr.error(result.data.message);
                                    return;
                                }
                                if (result.data.MSG == "BORRADO") {
                                    toastr.success('Archivo eliminado correctamente');
                                    if (iDdocumento == "FP")
                                        vm.showFoto.value = false;

                                    if (iDdocumento == "HV")
                                        vm.showHV.value = false;

                                } else {
                                    toastr.error(result.data.MSG);
                                    return;
                                }
                            }).catch(function(data) {
                                vm.Error.value = true;
                            });

                    },
                    function() {
                        return;
                    });
            };
            vm.editarArchivo = function(iDdocumento) {
                var tipoDoc = "";
                if (iDdocumento == "FP") {
                    tipoDoc = "Foto";
                    vm.showFoto.value = false;
                }
                if (iDdocumento == "HV") {
                    tipoDoc = "Hoja de vida";
                    vm.showHV.value = false;
                }
            };
            vm.LimpiarCampos = function() {
                vm.modificar.value = false;
                $timeout(function() {
                    $rootScope.$apply(function() {
                        vm.isCollapsed                              = false;
                        vm.isCollapsed_Direccion                    = true;
                        vm.ArrayDatosEmpleado                       = [];
                        vm.filtroPersona                            = "";
                        vm.objGestionEmpleados.primerNombre         = "";
                        vm.objGestionEmpleados.segundoNombre        = "";
                        vm.objGestionEmpleados.primerApellido       = "";
                        vm.objGestionEmpleados.segundoApellido      = "";
                        vm.objGestionEmpleados.cedula               = "";
                        vm.objGestionEmpleados.fhNacimiento         = "";
                        vm.objGestionEmpleados.genero               = "";
                        vm.objGestionEmpleados.telefono             = 0;
                        vm.objGestionEmpleados.celular              = 0;
                        vm.objGestionEmpleados.direccion            = "";
                        vm.objGestionEmpleados.c_compania           = $rootScope.idCompaniaAspirante.value;
                        vm.objGestionEmpleados.fhIngreso            = "";
                        vm.objGestionEmpleados.swActivo             = true;
                        vm.objGestionEmpleados.c_talla_camisa       = "";
                        vm.objGestionEmpleados.c_talla_chaqueta     = "";
                        vm.objGestionEmpleados.c_talla_pantalon     = "";
                        vm.objGestionEmpleados.c_talla_zapatos      = "";
                        vm.objGestionEmpleados.emailPersonal        = "";
                        vm.objGestionEmpleados.plaza                = "";
                        vm.objGestionEmpleados.idPlaza              = "";
                        vm.objGestionEmpleados.c_pais               = "";
                        vm.objGestionEmpleados.c_departamento       = "";
                        vm.objGestionEmpleados.c_municipio          = "";
                        vm.pais_global                              = "";
                        vm.departamento_global                      = "";
                        vm.municipio_global                         = "";
                        vm.arrayArchivosAdjuntos                    = [];
                        vm.showHV.value                             = false;
                        vm.showFoto.value                           = false;
                        vm.retirar_empleado.value                   = false;
                        vm.objGestionEmpleados.fhRetiro             = "";
                        vm.objGestionEmpleados.fhRetiro_format      = "";
                        vm.objGestionEmpleados.plaza_old_empleado   = "";
                        vm.objGestionEmpleados.d_motivo_retiro      = "";
                        vm.objGestionEmpleados.d_tipo_retiro        = "";
                        vm.objGestionEmpleados.sw_empleado_retirado = false;
                        vm.objGestionEmpleados.sw_desligar_plaza    = false;

                        vm.objGestionEmpleados.c_tipo_camisa        = "";
                        vm.objGestionEmpleados.c_tipo_pantalon = "";

                        vm.objGestionEmpleados.c_otro_tipo_camisa = "";
                        vm.objGestionEmpleados.c_tipo_bota = "";
                        
                        vm.objGestionEmpleados.direccion_dotacion   = "";
                        vm.objGestionEmpleados.c_depto_dotacion     = "";
                        vm.objGestionEmpleados.c_ciudad_dotacion    = "";

                        vm.objGestionEmpleados = angular.copy(vm.objGestionEmpleadosOriginal);

                        vm.listCiudades = angular.copy(vm.listCiudadesOriginal);

                        $('#inputImagenPersona').fileinput('reset');
                        $('#inputHojaVida').fileinput('reset');
                        vm.limpia_direccion();
                    });
                }, 0);
                if ($('#dtFhNacimiento').data("DateTimePicker").date() != "" && $('#dtFhNacimiento').data("DateTimePicker").date() != null) {
                    $('#dtFhNacimiento').data("DateTimePicker").clear();
                }
                if ($('#dtFhIngreso').data("DateTimePicker").date() != "" && $('#dtFhIngreso').data("DateTimePicker").date() != null) {
                    $('#dtFhIngreso').data("DateTimePicker").clear();
                }
                //$("#ChkswActivo").attr('disabled', true);
                vm.disable_ChkswActivo = true;

                $timeout(function() {
                    vm.$apply();
                }, 1);
            };
            vm.SeleccionarPlaza = function(plaza) {
                vm.objGestionEmpleados.plaza    = plaza.descripcionPlaza;
                vm.objGestionEmpleados.idPlaza  = plaza.c_plaza;
                vm.objGestionEmpleados.swActivo = true;
                vm.isCollapsed                  = !vm.isCollapsed;
                document.getElementById("inputPlaza").focus();
                $timeout(function() {
                    document.getElementById("inputPlaza").focus();
                }, 300);
            };
            
            function guardar_empleado() {
                vm.objGestionEmpleados.c_tipo_contrato     = parseInt(vm.objGestionEmpleados.c_tipo_contrato);
                vm.objGestionEmpleados.fhIngreso_format    = moment($('#dtFhIngreso').data("DateTimePicker").date()).format("MM/DD/YYYY");
             
                vm.objGestionEmpleados.fhNacimiento_format = null;

                if (moment($('#dtFhNacimiento').data("DateTimePicker").date()).isValid()) {

                    vm.objGestionEmpleados.fhNacimiento_format = moment($('#dtFhNacimiento').data("DateTimePicker").date()).format("MM/DD/YYYY");
                }

                $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "postDataPersona/", JSON.stringify(vm.objGestionEmpleados))
                    .then(function(result) {
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
                            /*GUARDAR LOS DOCS ADJUNTOS*/
                            vm.insertarGdocumental(vm.objGestionEmpleados.cedula);
                            vm.ArrayDatosEmpleado = [];
                        } else {
                            toastr.warning(result.data.MSG);
                            return;
                        }
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            }

          
            function retiro_empleado() {
                /*validacion sobre retiro de empleado */
                if (vm.retirar_empleado.value)
                    vm.objGestionEmpleados.fhRetiro = moment($('#dtFhRetiro').data("DateTimePicker").date()).format("DD/MMMM/YYYY");

                /*si tiene fecha la variable es porque se va a retirar el empleado*/
                if (vm.objGestionEmpleados.fhRetiro != "" && vm.objGestionEmpleados.fhRetiro != null) {
                    $timeout(function() {
                        alertify.confirm("Está seguro de querer retirar el empleado?",
                            function() {
                                //alertify.success('aplicó el dcto');

                                console.log("aceptó retirar empleado");
                                vm.objGestionEmpleados.fhRetiro_format = moment($('#dtFhRetiro').data("DateTimePicker").date()).format("MM/DD/YYYY");

                                if (vm.objGestionEmpleados.c_tipo_retiro == "" || vm.objGestionEmpleados.c_tipo_retiro == 0 || vm.objGestionEmpleados.c_tipo_retiro == null) {
                                    toastr.warning("Debe seleccionar un tipo de retiro del empleado");
                                    return;
                                }

                                vm.objGestionEmpleados.swActivo           = false;
                                vm.objGestionEmpleados.plaza_old_empleado = vm.objGestionEmpleados.idPlaza;
                                vm.objGestionEmpleados.idPlaza            = null;
                                vm.objGestionEmpleados.sw_desligar_plaza  = true;

                                /*guardar datos*/
                                guardar_modificacion_empleado();

                                $timeout(function () {
                                    vm.$apply();
                                }, 0);
                            },
                            function() {
                                
                                vm.retirar_empleado.value                = false;
                                vm.objGestionEmpleados.sw_desligar_plaza = false;
                                vm.objGestionEmpleados.fhRetiro          = "";
                                vm.objGestionEmpleados.c_tipo_retiro     = null;
                                $('#dtFhRetiro').data("DateTimePicker").clear();
                                $timeout(function () {
                                    vm.$apply();
                                }, 0);
                                return;
                            });
                    }, 200);


                } else {
                    vm.objGestionEmpleados.d_motivo_retiro = "";
                    vm.objGestionEmpleados.c_tipo_retiro   = null;
                    /*guardar datos*/
                    guardar_modificacion_empleado();
                }
            }
 

            vm.ConfirmacionEliminarPlazaEmpleado = function () {
                alertify.confirm("Está seguro de eliminar la plaza " + vm.objGestionEmpleados.plaza + " del empleado " + vm.objGestionEmpleados.primerNombre + " " + vm.objGestionEmpleados.segundoNombre + " " + vm.objGestionEmpleados.primerApellido + " " + vm.objGestionEmpleados.segundoApellido + "?",
                    function() {
                        vm.deletePlazaEmpleado();
                        vm.$apply();
                    },
                    function() {
                        return;
                    });
            };
            vm.deletePlazaEmpleado = function() {
                $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "deletePlazaEmpleado/", JSON.stringify(vm.objGestionEmpleados)).
                    then(function(result) {
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
                            toastr.success('Plaza eliminada correctamente');
                            vm.objGestionEmpleados.idPlaza = null;
                            vm.objGestionEmpleados.plaza   = null;
                            vm.realizoTransaccion.value    = true;
                        } else {
                            toastr.warning(result.data.MSG);
                            return;
                        }
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            vm.cancelar_retiro = function() {
                vm.retirar_empleado.value = false;
            };
            //#region DIRECCIONES
            vm.carga_pais_departamento_ciudad = function() {
                $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "get_pais_depto_ciudad", JSON.stringify(), {

                }).then(function(result) {
                    //*** pais
                    for (var i = 0; i < result.data.data[0].length; i++) {
                        vm.obj_departamento = {
                            id_pais: null,
                            id_departamento: null,
                            d_departamento: null
                        }
                        vm.obj_pais = {
                            id: result.data.data[0][i].idPais,
                            descripcion: result.data.data[0][i].descripcionPais
                        }
                        vm.lista_pais.push(vm.obj_pais);
                    }
                    // Asigno el primer item como seleccionado por defecto, 
                    // la idea es q sea Colombia pero esto podria cambiar
                    vm.pais_global = vm.lista_pais[0].id;
                    vm.id_pais = vm.lista_pais[0].id;
                    //*** departamento
                    for (var d = 0; d < result.data.data[1].length; d++) {
                        vm.obj_departamento = {
                            id_pais        : null,
                            id_departamento: null,
                            d_departamento : null
                        }
                        vm.obj_departamento.id_pais         = result.data.data[1][d].f012_id_pais;
                        vm.obj_departamento.id_departamento = result.data.data[1][d].idDepto;
                        vm.obj_departamento.d_departamento  = result.data.data[1][d].descripcionDepto;
                        vm.lista_departamento.push(vm.obj_departamento);
                        vm.lista_departamento_original.push(vm.obj_departamento);
                    }
                    //*** municipio
                    for (var d = 0; d < result.data.data[2].length; d++) {
                        vm.obj_municipio = {
                            d_municipio    : null,
                            id_departemento: null,
                            id_pais        : null,
                            id_minicipio   : null
                        }
                        vm.obj_municipio.d_municipio     = result.data.data[2][d].descripcionCiudad;
                        vm.obj_municipio.id_departemento = result.data.data[2][d].f013_id_depto;
                        vm.obj_municipio.id_pais         = result.data.data[2][d].f013_id_pais;
                        vm.obj_municipio.id_minicipio    = result.data.data[2][d].idCiudad;
                        vm.lista_municipio.push(vm.obj_municipio);
                    }
                    vm.lista_municipio_original = vm.lista_municipio;
                }).catch(function(data) {
                    vm.Error.value = true;
                });
            }
            vm.SetDepartamentos = function(pais_id) {
                vm.id_pais = pais_id;
                vm.lista_departamento = Enumerable.From(vm.lista_departamento_original).Where(function(x) {
                    return (x.id_pais == pais_id);
                }).Select(function(x) {
                    return x;
                }).ToArray();
            };
            vm.SetCiudades = function(depto_id) {
                vm.id_ciudad = depto_id;
                vm.lista_municipio = Enumerable.From(vm.lista_municipio_original).Where(function(x) {
                    return (x.id_departemento == depto_id);
                }).Select(function(x) {
                    return x;
                }).ToArray();
                //*** nombre deol departamento
                vm.nombre_departamento_selected = "";
                for (var i = 0; i < vm.lista_departamento.length; i++) {
                    if (vm.lista_departamento[i].id_departamento === depto_id
                        && vm.lista_departamento[i].id_pais === vm.id_pais) {
                        vm.nombre_departamento_selected = vm.lista_departamento[i].d_departamento.substring(0, 3);
                        break;
                    }
                }
            };
            vm.get_nombre_ciudad = function(municip_id) {
                vm.nombre_municipio_selected = "";
                for (var i = 0; i < vm.lista_municipio_original.length; i++) {
                    if (vm.lista_municipio_original[i].id_minicipio === municip_id
                        && vm.lista_municipio_original[i].id_departemento == vm.id_ciudad
                        && vm.lista_municipio_original[i].id_pais == vm.id_pais) {
                        vm.nombre_municipio_selected = vm.lista_municipio_original[i].d_municipio.substring(0, 3);
                        break;
                    }
                }
            };
            vm.carga_pais_departamento_ciudad();
            vm.SetDepartamentos();
            vm.SetCiudades();
            vm.cambio_is_nueva_direccion = function(valor) {
                vm.is_nueva_direccion = valor;
            };
            vm.limpia_direccion = function() {
                vm.objDireccion = {
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
            vm.RefrescarDireccion = function() {
                vm.direccionResult = "";
                var espacio = "";

                if (vm.objDireccion.nV1 != "") {
                    vm.objDireccion.signoNumero = "#";
                } else {
                    vm.objDireccion.signoNumero = "";
                }

                if (vm.objDireccion.nV2 != "") {
                    vm.objDireccion.guion = "-";
                } else {
                    vm.objDireccion.guion = "";
                }
                Object.keys(vm.objDireccion).forEach(function(val, key) {
                    espacio = "";
                    if (vm.objDireccion[val] != "") {
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

                        vm.direccionResult = vm.direccionResult + vm.objDireccion[val] + espacio;
                    }
                });
            };
            vm.show_nuevo_dominio_contacto = function() {
                vm.show_nuevo_dominio = true;
            }
            vm.RetrunDireccionData = function() {
                // Validaciones
                //var text_validacion = "Los campos marcados con * son Obligatorios. \n";
                var text_validacion = "";
                var permite_crear_direccion = true;
                if (vm.pais_global == null || vm.pais_global == "" || vm.pais_global == "null") {
                    //text_validacion += "El campo país es Obligatorio. \n";
                    toastr.warning("El campo país es Obligatorio.");
                    return;
                    //permite_crear_direccion = false;
                }
                if (vm.departamento_global == null || vm.departamento_global == "null" || vm.departamento_global == "") {
                    //text_validacion += "El campo departamento es Obligatorio. \n";
                    //permite_crear_direccion = false;
                    toastr.warning("El campo departamento es Obligatorio.");
                    return;
                }
                if (vm.municipio_global == null || vm.municipio_global == "null" || vm.municipio_global == "") {
                    //text_validacion += "El campo municipio es Obligatorio. \n";
                    //permite_crear_direccion = false;
                    toastr.warning("El campo municipio es Obligatorio.");
                    return;
                }
                if (vm.objDireccion.tv1 == null || vm.objDireccion.tv1 == "null" || vm.objDireccion.tv1 == "") {
                    //text_validacion += "El campo de 'Calle, Carrera, Vereda...' es Obligatorio. \n";
                    //permite_crear_direccion = false;
                    toastr.warning("El campo número de 'Calle, Carrera, Vereda...' es Obligatorio.");
                    return;
                }
                if (vm.objDireccion.nV1 == null || vm.objDireccion.nV1 == "null" || vm.objDireccion.nV1 == "") {
                    //text_validacion += "El campo número de 'Calle, Carrera, Vereda...' es Obligatorio. \n";
                    //permite_crear_direccion = false;
                    toastr.warning("El campo número de 'Calle, Carrera, Vereda...' es Obligatorio");
                    return;
                }
                //*** Concateno el pais, departamento y municipio
                if (vm.var_global_direcciones == 'direccion_casa') {
                    // le concateno el id de Pais, Departamento y Municipio
                    vm.Cliente.direccion_casa = vm.direccionResult + "(" + vm.nombre_departamento_selected + "-" + vm.nombre_municipio_selected + ")";
                    vm.Cliente.paisdepartmunic_dir_casa = {
                        id_pais     : vm.pais_global,
                        id_depart   : vm.departamento_global,
                        id_municipio: vm.municipio_global
                    };
                    vm.Cliente.observacion_dir_casa = null;
                } else {
                    if (vm.var_global_direcciones == 'direccion_trabajo') {
                        vm.Cliente.direccion_trabajo = vm.direccionResult + "(" + vm.nombre_departamento_selected + "-" + vm.nombre_municipio_selected + ")";
                        vm.Cliente.paisdepartmunic_dir_trabajo = {
                            id_pais     : vm.pais_global,
                            id_depart   : vm.departamento_global,
                            id_municipio: vm.municipio_global
                        };
                        vm.Cliente.observacion_dir_trabajo = null;
                    } else {
                        if (vm.var_global_direcciones == 'direccion_entrega') {
                            vm.Cliente.direccion_entrega = vm.direccionResult + "(" + vm.nombre_departamento_selected + "-" + vm.nombre_municipio_selected + ")";
                            vm.Cliente.paisdepartmunic_dir_entrega = {
                                id_pais     : vm.pais_global,
                                id_depart   : vm.departamento_global,
                                id_municipio: vm.municipio_global
                            };
                            vm.Cliente.observacion_dir_casa = null;
                        }
                    }
                }
                vm.direccionResult     = "";
                vm.departamento_global = null;
                vm.municipio_global    = null;
            };
            vm.getDireccion = function() {
                if (vm.pais_global == "") {
                    toastr.warning('Seleccione un pais');
                    return;
                }
                if (vm.departamento_global == "") {
                    toastr.warning('Seleccione una departamento');
                    return;
                }
                if (vm.municipio_global == "") {
                    toastr.warning('Seleccione un municipio');
                    return;
                }
                //if (vm.objDireccion.tv1 == null || vm.objDireccion.tv1 == "null" || vm.objDireccion.tv1 == "") {
                //    toastr.warning("El campo de 'Calle, Carrera, Vereda...' es Obligatorio.");
                //    return;
                //}
                //if (vm.objDireccion.nV1 == null || vm.objDireccion.nV1 == "null" || vm.objDireccion.nV1 == "") {

                //    toastr.warning("El campo NÚMERO de 'Calle, Carrera, Vereda...' es Obligatorio");
                //    return;
                //}
                if (vm.objDireccion.tv1 == null || vm.objDireccion.tv1 == "null" || vm.objDireccion.tv1 == "") {
                    if (vm.objDireccion.compl == "" || _.isNull(vm.objDireccion.compl) || _.isUndefined(vm.objDireccion.compl)) {
                        toastr.warning('Debe ingresar el complemento de la dirección');
                        return;
                    }
                    //toastr.warning("El campo de 'Calle, Carrera, Vereda...' es Obligatorio.");
                    //return;
                }
                if (vm.objDireccion.nV1 == null || vm.objDireccion.nV1 == "null" || vm.objDireccion.nV1 == "") {

                    if (vm.objDireccion.compl == "" || _.isNull(vm.objDireccion.compl) || _.isUndefined(vm.objDireccion.compl)) {
                        toastr.warning('Debe ingresar el complemento de la dirección');
                        return;
                    }
                    //toastr.warning("El campo NÚMERO de 'Calle, Carrera, Vereda...' es Obligatorio");
                    //return;
                }
                vm.objGestionEmpleados.c_pais         = vm.pais_global;
                vm.objGestionEmpleados.c_departamento = vm.departamento_global;
                vm.objGestionEmpleados.c_municipio    = vm.municipio_global;
                vm.objGestionEmpleados.direccion      = vm.direccionResult + "(" + vm.nombre_departamento_selected + "-" + vm.nombre_municipio_selected + ")";
                vm.isCollapsed_Direccion              = !vm.isCollapsed_Direccion;

                $("#escogerDireccion").focus();
            };
            vm.get_tipos_retiro = function() {
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_tipos_retiro/").
                    then(function(result) {
                        if (result === null)
                            return;
                        if (result.data === null)
                            return;
                        if (result.data.data[0].length < 1) {
                            $rootScope.progressbar.reset();
                            return;
                        }
                        vm.array_tipos_retiro = result.data.data[0];
                        vm.objGestionEmpleados.c_tipo_retiro = vm.array_tipos_retiro[0].c_tipo_retiro;
                        $rootScope.progressbar.complete();
                    }).catch(function(data) {
                        vm.Error.value = true;
                    });
            };
            /*validamos si se va a activar a un empleado previamente retirado */
            vm.validar_activacion_persona = function() {
                if (vm.objGestionEmpleados.swActivo && vm.objGestionEmpleados.sw_empleado_retirado) {
                    alertify.confirm("Está seguro de activar de nuevo a esta persona previamente retirada?",
                        function() {
                            //alertify.success("aplicó");
                            vm.obj_update_persona_retirada.cedula = vm.objGestionEmpleados.cedula;

                            $timeout(function() {
                                activarPersona();
                            }, 1);
                        },
                        function() {
                            //alertify.error("Canceló");
                            console.log("cancelo");
                            vm.objGestionEmpleados.swActivo = false;
                            $timeout(function() {
                                vm.$apply();
                            }, 0);
                            return;
                        });
                }
                //alert("va a activar a un empleado previamente retirado")
            }
            /*actualizamos la persona*/
            function activarPersona() {
                gestionPersonasService.activarPersona(vm.obj_update_persona_retirada)
                    .then(function(result) {
                        vm.objectDialog.HideDialog();
                        if (result.MSG === "GUARDADO") {
                            toastr.success('Persona activada correctamente');

                            $timeout(function() {
                                getPersonaByParametro(vm.obj_update_persona_retirada.cedula);
                            }, 100);
                        } else {
                            toastr.warning(result.MSG);
                        }
                    });
            }
            function getPersonaByParametro(cedula) {
                vm.LimpiarCampos();
                $rootScope.progressbar.start();
                $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "buscarEmpleado/" + cedula).
                    then(function(result) {
                        if (result.data.data.length > 0 && result.data.data[0].length > 0) {
                            vm.obj_datos_persona = result.data.data[0][0];

                            /*lo utilizo para evitar que se abra la barra de busqueda*/
                            vm.obj_datos_persona.toggle_wrappper = false;
                            vm.getTiposContratos();
                            $timeout(function() {
                                /*cargamos los datos actualizados en la vista*/
                                vm.cargarPersona(vm.obj_datos_persona);
                            }, 100);
                            $rootScope.progressbar.complete();
                        } else {
                            toastr.error("No se encontró persona con la cedula " + cedula);
                            return;
                        }
                    }).catch(function(data) {
                        toastr.error(data);
                    });
            };
            //#endregion
            vm.insertarGdocumental = function(cedulaPersona) {
                /*copio el array que contiene los documentos adjuntos*/
                vm.Files = vm.arrayArchivosAdjuntos;
                var ext = "";
                /*recorro el array para extraer el archivo, su extension y la ruta de almacenamiento de este*/
                for (var i = 0; i < vm.Files.length; i++) {
                    /*extension*/
                    ext = (vm.Files[i].archivo.name).split('.');
                    ext = ext[ext.length - 1];

                    /*archivo*/
                    var $file = vm.Files[i].archivo;

                    /*estructura documental*/
                    var objGdctalFile                          = {};
                    objGdctalFile.in_id_estructura_gdocumental = vm.Files[i].id_estructura_gdocumental;
                    objGdctalFile.cedulaPersona                = cedulaPersona;
                    objGdctalFile.int_log_insert               = loginService.UserData.cs_IdUsuario;
                    objGdctalFile.extension                    = ext;
                    objGdctalFile.d_archivo                    = vm.Files[i].id_estructura_gdocumental + "_" + cedulaPersona.toString();

                    $upload.upload({
                        url: TreidConfigSrv.ApiUrls.UrlMaestros + "PostFormData/" + objGdctalFile.in_id_estructura_gdocumental
                            + "/" + objGdctalFile.cedulaPersona
                            + "/" + objGdctalFile.d_archivo
                            + "/" + objGdctalFile.extension
                            + "/" + objGdctalFile.int_log_insert,
                        method: "POST",
                        headers: { 'Content-Type': 'multipart/form-data' },
                        file: $file
                    }).success(function(result) {
                        // file is uploaded successfully

                        if (result.MSG == "GUARDADO") {
                            toastr.success('Archivo almacenado correctamente');
                            vm.CloseModal();
                        } else {
                            toastr.error(result.MSG);
                        }
                    }).error(function(data, status, headers, config) {

                    });
                }
            };
            //#endregion
            
            vm.GetCompanias();
            vm.getTiposContratos();
            vm.get_direcciones_co();
        };
        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('serviceLogIn');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && vm.cookieUser.UserData.cs_IdUsuario == loginService.UserData.cs_IdUsuario) {

                if ($location.$$path == "/GestionPersonal") {

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
                            $rootScope.actualPage            = "/GestionPersonal";
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

