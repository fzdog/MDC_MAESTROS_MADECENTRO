(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('GestionSuperOfertaService', GestionSuperOfertaService);

    GestionSuperOfertaService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function GestionSuperOfertaService($http, TreidConfigSrv, $rootScope) {

        return {             
            insert_gestion_super_oferta: insert_gestion_super_oferta,             
             get_producto_by_referencia                    : get_producto_by_referencia,             
        };

        function insert_gestion_super_oferta(request) {
            return $http.post(TreidConfigSrv.ApiUrls.urlGestionSuperOferta + "insert_gestion_super_oferta", JSON.stringify(request))
                .then(insert_gestion_super_oferta_completo)
                .catch(insert_gestion_super_oferta_error);

            function insert_gestion_super_oferta_completo(response) {
                return response.data;
            }
            function insert_gestion_super_oferta_error(error) {
                console.log('Error en insert_gestion_super_oferta', error);
                return error;
            }
        }

        function get_producto_by_referencia(referencia) {
            return $http.get(TreidConfigSrv.ApiUrls.urlGestionSuperOferta + "get_producto_by_referencia/"+ referencia)
                .then(get_producto_by_referencia)
                .catch(get_meses_inventario_cgrupo_and_or_co_error);
            function get_producto_by_referencia(response) {
                return response.data;
            }
            function get_meses_inventario_cgrupo_and_or_co_error(error) {
                console.log('Error en get_producto_by_referencia', error);
                return error;
            }
        }   
    }
})();
