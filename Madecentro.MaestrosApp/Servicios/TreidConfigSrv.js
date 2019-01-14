(function() {
    "use strict";

    angular.module('appmadecentro')
           .factory('TreidConfigSrv', function($location) {

            var protocolo = $location.protocol();
            var host      = $location.host();
            var puerto    = $location.port();

            console.info("protocolo: " + protocolo + ', host: ' + host + ', puerto: ' + puerto);

            var urlbase = protocolo + "://" + host + ":" + puerto;

            var pathApiNode = "";

            if (host === "localhost") {
                //NODE URL LOCAL
                pathApiNode = "http://localhost:1600";
                urlbase = "http://192.168.1.43";
            } else {
                pathApiNode = urlbase + "/webapinode";
            }

            var TreidConfigSrv = {
                ApiUrls: {
                    UrlMaestros                      : pathApiNode + "/maestros/gestionMaestros/",
                    UrlMaestrosSam                   : pathApiNode + "/maestros/gestionSam/",
                    UrlMaestrosMesesInv              : pathApiNode + "/maestros/mesesInventario/",
                    UrlCrearClienteNodejs            : pathApiNode + "/crm/clientes/",
                    UrlGestionDctos                  : pathApiNode + "/maestros/gestionDctos/",
                    UrlMaestrosGestionCargos         : pathApiNode + "/maestros/gestionCargos/",
                    UrlMaestrosGestionSedesPdv       : pathApiNode + "/maestros/gestionSedesPdv/",
                    UrlMaestrosGestionBodegasPdv     : pathApiNode + "/maestros/gestionBodegasPdv/",
                    UrlMaestrosAutorizadoresMayorDcto: pathApiNode + "/maestros/autorizadoresMayorDcto/",
                    UrlGestionPresupuestosMesPdv     : pathApiNode + "/maestros/gestionPresupuestosMesPdv/",
                    UrlGestionPersonal               : pathApiNode + "/maestros/gestion_personal/",
                    UrlGestionTransporte             : pathApiNode + "/maestros/gestion_transporte/",
                    urlGestionMayorDescuento: pathApiNode + "/maestros/gestionMayorDescuento/",
                    urlGestionSuperOferta: pathApiNode + "/maestros/gestionSuperOferta/"
                },
                variables: {
                    Dominio                                   : urlbase,
                    DirectorioBase                            : "D:",
                    idCompaniaAspitante                       : 6,
                    id_estructura_gdocumental_imagen_persona  : "FPER",
                    id_estructura_gdocumental_hojaVida_persona: "HVID",
                    d_carpeta_libMilitar_persona              : "\\libMilitar",
                    d_carpeta_registroCivil_persona           : "",
                    d_carpeta_estudios_persona                : "",
                    estructuraDocumentalGestionHumana         : "PE",
                    idAplicacion                              : 6
                }
            };
            return TreidConfigSrv;
        });
}());


