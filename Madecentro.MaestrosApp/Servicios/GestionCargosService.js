/// <reference path="GestionCargosService.js" />
(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('GestionCargosService', GestionCargosService);

    GestionCargosService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function GestionCargosService($http, TreidConfigSrv, $rootScope) {

        return {
            consultar_cargos: consultar_cargos,
            consultar_nivel_cargo: consultar_nivel_cargo,
            insertar_cargo: insertar_cargo,
            consulta_modificar_cargo: consulta_modificar_cargo,
            modificar_cargos: modificar_cargos
    }


        //functions
        function consultar_cargos() {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionCargos + "consultar_cargos/")
               .then(consultar_cargos_completo)
               .catch(consultar_cargos_error);
            function consultar_cargos_completo(response) {
                return response.data;
            }
            function consultar_cargos_error(error) {
                console.log('Error en consultar_cargos', error);
                return error;
            }
        }
     
        function consultar_nivel_cargo() {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionCargos + "consultar_nivel_cargo/")
               .then(consultar_nivel_cargo_completo)
               .catch(consultar_nivel_cargo_error);
            function consultar_nivel_cargo_completo(response) {
                return response.data;
            }
            function consultar_nivel_cargo_error(error) {
                console.log('Error en consultar_nivel_cargo_error', error);
                return error;
            }
        }
        
        function insertar_cargo(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosGestionCargos + "insertar_cargo/", JSON.stringify(request))
               .then(insertar_cargo_completo)
               .catch(insertar_cargo_error);
            function insertar_cargo_completo(response) {
                return response.data;
            }
            function insertar_cargo_error(error) {
                console.log('Error en insertar_cargo_error', error);
                return error;
            }
        }
      
        function consulta_modificar_cargo(codigo_cargo) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosGestionCargos + "consulta_modificar_cargo/" + codigo_cargo)
               .then(consulta_modificar_cargo_completo)
               .catch(consulta_modificar_cargo_error);
            function consulta_modificar_cargo_completo(response) {
                return response.data;
            }
            function consulta_modificar_cargo_error(error) {
                console.log('Error en consulta_modificar_cargo', error);
                return error;
            }
        }

        function modificar_cargos(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosGestionCargos + "modificar_cargos/", JSON.stringify(request))
               .then(modificar_cargos_completo)
               .catch(modificar_cargos_error);
            function modificar_cargos_completo(response) {
                return response.data;
            }
            function modificar_cargos_error(error) {
                console.log('Error en modificar_cargos', error);
                return error;
            }
        }
    }

})();

