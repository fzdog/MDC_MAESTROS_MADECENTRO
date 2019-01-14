/// <reference path="GestionBodegasPdvService.js" />
(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('GestionBodegasPdvService', GestionBodegasPdvService);

    GestionBodegasPdvService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function GestionBodegasPdvService($http, TreidConfigSrv, $rootScope) {

        return {
            //insertar_bodega: insertar_bodega
            //,
            consultar_co: consultar_co
            ,consultar_bodegas: consultar_bodegas
            , consultar_lista_bodegas: consultar_lista_bodegas
            , insertar_bodega: insertar_bodega
            , modificar_estado_bodega: modificar_estado_bodega

    }

        //functions
        function consultar_co() {
            //console.log("conectado con el service");
            //return;
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionBodegasPdv + "consultar_co/")
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
        function consultar_bodegas(centro_operacion) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionBodegasPdv + "consultar_bodegas/" + centro_operacion)
               .then(consultar_bodegas_completo)
               .catch(consultar_bodegas_error);
            function consultar_bodegas_completo(response) {
                return response.data;
            }
            function consultar_bodegas_error(error) {
                console.log('Error en consultar_bodegas', error);
                return error;
            }
        }
        function consultar_lista_bodegas() {
     return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionBodegasPdv + "consultar_lista_bodegas/")
               .then(consultar_lista_bodegas_completo)
               .catch(consultar_lista_bodegas_error);
            function consultar_lista_bodegas_completo(response) {
                return response.data;
            }
            function consultar_lista_bodegas_error(error) {
                console.log('Error en consultar_lista_bodegas', error);
                return error;
            }
        }

        function insertar_bodega(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosGestionBodegasPdv + "insertar_bodega/", JSON.stringify(request))
               .then(insertar_bodega_completo)
               .catch(insertar_bodega_error);
            function insertar_bodega_completo(response) {
                return response.data;
            }
            function insertar_bodega_error(error) {
                console.log('Error en insertar_bodega_error', error);
                return error;
            }
        }
        function modificar_estado_bodega(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosGestionBodegasPdv + "modificar_estado_bodega/", JSON.stringify(request))
               .then(modificar_estado_bodega_completo)
               .catch(modificar_estado_bodega_error);
            function modificar_estado_bodega_completo(response) {
                return response.data;
            }
            function modificar_estado_bodega_error(error) {
                console.log('Error en modificar_estado_bodega_error', error);
                return error;
            }
        }
       
       
    }

})();

