(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('MesesInventarioService', MesesInventarioService);

    MesesInventarioService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function MesesInventarioService($http, TreidConfigSrv, $rootScope) {

        return {
            get_meses_inventario_cgrupo_and_or_co   : get_meses_inventario_cgrupo_and_or_co,
            get_grupos_productos                    : get_grupos_productos, 
            get_centros_operacion                   : get_centros_operacion,
            insert_meses_inventario_grupo_referencia: insert_meses_inventario_grupo_referencia
        };

        //Methods
        function get_meses_inventario_cgrupo_and_or_co(request) {

            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosMesesInv + "get_meses_inventario_cgrupo_and_or_co/", JSON.stringify(request))
                .then(get_meses_inventario_cgrupo_and_or_co_completo)
                .catch(get_meses_inventario_cgrupo_and_or_co_error);

            function get_meses_inventario_cgrupo_and_or_co_completo(response) {
                return response.data;
            }
            function get_meses_inventario_cgrupo_and_or_co_error(error) {
                console.log('Error en get_meses_inventario_cgrupo_and_or_co', error);
                return error;
            }
        }



        function get_centros_operacion() {
           return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosMesesInv + "get_centros_operacion/")
                .then(get_centros_operacion)
                .catch(get_meses_inventario_cgrupo_and_or_co_error);
            function get_centros_operacion(response) {
                return response.data;
            }
            function get_meses_inventario_cgrupo_and_or_co_error(error) {
                console.log('Error en get_centros_operacion', error);
                return error;
            }
        }


   
        function get_grupos_productos() {

            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosMesesInv + "get_grupos_productos/")
               .then(get_grupos_productos_completo)
               .catch(get_grupos_productos_error);

            function get_grupos_productos_completo(response) {
                return response.data;
            }
            function get_grupos_productos_error(error) {
                console.log('Error en get_grupos_productos', error);
                return error;
            }
        }



        function insert_meses_inventario_grupo_referencia(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosMesesInv + "insert_meses_inventario_grupo_referencia/", JSON.stringify(request))
                .then(insert_meses_inventario_grupo_referencia_completo)
                .catch(insert_meses_inventario_grupo_referencia_error);

            function insert_meses_inventario_grupo_referencia_completo(response) {
                return response.data;
            }
            function insert_meses_inventario_grupo_referencia_error(error) {
                console.log('Error en insert_meses_inventario_grupo_referencia', error);
                return error;
            }
        }
        
        
    }
})();
