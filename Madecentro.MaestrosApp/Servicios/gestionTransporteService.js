/*Servicio con referencia a la BD MDC_REQUERIMIENTOS*/
(function () {
    "use strict";

    angular
      .module("appmadecentro")
      .factory("gestionPersonasService", gestionPersonasService);

    gestionPersonasService.$inject = ["$http", "TreidConfigSrv", "$rootScope"];

    function gestionPersonasService($http, TreidConfigSrv, $rootScope) {
        return {
            activarPersona  : activarPersona,
            getTiposCamisas : getTiposCamisas,
            getTiposPantalon: getTiposPantalon,
            getDireccionesCo: getDireccionesCo
        };
        
        function getDireccionesCo() {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlGestionPersonal + "get_direcciones_co")
                .then(getDireccionesCoCompleto)
                .catch(getDireccionesCoError);

            function getDireccionesCoCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getDireccionesCoError(error) {
                $rootScope.progressbar.reset();
                console.error('Error en getDireccionesCo', error);
                return error;
            }
        }

        function getTiposPantalon() {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlGestionPersonal + "get_tipos_pantalon")
                .then(getTiposPantalonCompleto)
                .catch(getTiposPantalonError);

            function getTiposPantalonCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getTiposPantalonError(error) {
                $rootScope.progressbar.reset();
                console.error('Error en getTiposPantalon', error);
                return error;
            }
        }

        function getTiposCamisas() {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlGestionPersonal + "get_tipos_camisas")
                .then(getTiposCamisasCompleto)
                .catch(getTiposCamisasError);

            function getTiposCamisasCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getTiposCamisasError(error) {
                $rootScope.progressbar.reset();
                console.error('Error en getTiposCamisas', error);
                return error;
            }
        }

        function activarPersona(request) {
            $rootScope.progressbar.start();
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestros + "activar_persona", JSON.stringify(request))
                .then(activarPersonaComplete)
                .catch(activarPersonaError);

            function activarPersonaComplete(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function activarPersonaError(error) {
                $rootScope.progressbar.reset();
                console.error('Error en activarPersona', error);
                return error;
            }
        }
    }
})();
