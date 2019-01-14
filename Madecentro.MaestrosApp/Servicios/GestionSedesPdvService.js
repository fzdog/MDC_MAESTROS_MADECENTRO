/// <reference path="GestionSedesPdvService.js" />

(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('GestionSedesPdvService', GestionSedesPdvService);

    GestionSedesPdvService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function GestionSedesPdvService($http, TreidConfigSrv, $rootScope) {

        return {
            buscar_centro_operacion: buscar_centro_operacion
            , consultar_optimizacion: consultar_optimizacion
            , actualizar_sedes: actualizar_sedes
            , consultar_co: consultar_co
            , consultar_connector_unoee: consultar_connector_unoee

        }

        //Functions
        function consultar_co() {
            //console.log("conectado con el service");
            //return;
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionSedesPdv + "consultar_co/")
               .then(consultar_co_completo)
               .catch(consultar_co_error);
            function consultar_co_completo(response) {
                return response.data;
            }
            function consultar_co_error(error) {
                console.log('Error en consultar_co', error);
                return error;
            }
        }
        
        function consultar_connector_unoee() {
            //console.log("conectado con el service");
            //return;
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionSedesPdv + "consultar_connector_unoee/")
               .then(consultar_connector_unoee_completo)
               .catch(consultar_connector_unoee_error);
            function consultar_connector_unoee_completo(response) {
                return response.data;
            }
            function consultar_connector_unoee_error(error) {
                console.log('Error en consultar_connector_unoee', error);
                return error;
            }
        }

        function buscar_centro_operacion(c_centro_operacion) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionSedesPdv + "buscar_centro_operacion/" + c_centro_operacion)
          .then(buscar_centro_operacion_completo)
          .catch(buscar_centro_operacion_error);
            function buscar_centro_operacion_completo(response) {
                return response.data;
            }
            function buscar_centro_operacion_error(error) {
                console.log('Error en buscar_centro_operacion_error', error);
                return error;
            }
        }

        function consultar_optimizacion() {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionSedesPdv + "consultar_optimizacion/")
               .then(consultar_optimizacion_completo)
               .catch(consultar_optimizacion_error);
            function consultar_optimizacion_completo(response) {
                return response.data;
            }
            function consultar_optimizacion_error(error) {
                console.log('Error en consultar_optimizacion_error', error);
                return error;
            }
        }

        function actualizar_sedes(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosGestionSedesPdv + "actualizar_sedes/", JSON.stringify(request))
                .then(actualizar_sedes_completo)
                .catch(actualizar_sedes_error);

            function actualizar_sedes_completo(response) {
                return response.data;
            }
            function actualizar_sedes_error(error) {
                console.log('Error en actualizar_cargos', error);
                return error;
            }
        }
    }

})();

