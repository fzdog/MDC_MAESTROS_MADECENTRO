(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('GestionMayorDescuentoService', GestionMayorDescuentoService);

    GestionMayorDescuentoService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function GestionMayorDescuentoService($http, TreidConfigSrv, $rootScope) {

        return {
            get_planes_criterios                            : get_planes_criterios
            , get_lista_criterios_by_idPlan                 : get_lista_criterios_by_idPlan
            , get_validaciones_mayor_descuento_by_idcriterio: get_validaciones_mayor_descuento_by_idcriterio
            , insert_validaciones_mayor_descuento           : insert_validaciones_mayor_descuento
            , get_lista_criterios                           : get_lista_criterios
            , get_producto_by_referencia                    : get_producto_by_referencia
            , get_validaciones_mayor_descuento              : get_validaciones_mayor_descuento
        };

        //Methods
        function get_planes_criterios() {
           return $http.get(TreidConfigSrv.ApiUrls.urlGestionMayorDescuento + "get_planes_criterios/")
                .then(get_planes_criterios)
                .catch(get_meses_inventario_cgrupo_and_or_co_error);
            function get_planes_criterios(response) {
                return response.data;
            }
            function get_meses_inventario_cgrupo_and_or_co_error(error) {
                console.log('Error en get_planes_criterios', error);
                return error;
            }
        }  


    
        function get_lista_criterios_by_idPlan(id_plan) {
            return $http.get(TreidConfigSrv.ApiUrls.urlGestionMayorDescuento + "get_lista_criterios_by_idPlan/" + id_plan)
                .then(get_lista_criterios_by_idPlan)
                .catch(get_meses_inventario_cgrupo_and_or_co_error);
            function get_lista_criterios_by_idPlan(response) {
                return response.data;
            }
            function get_meses_inventario_cgrupo_and_or_co_error(error) {
                console.log('Error en get_lista_criterios_by_idPlan', error);
                return error;
            }
        }  



        function get_validaciones_mayor_descuento_by_idcriterio(request) {
            return $http.post(TreidConfigSrv.ApiUrls.urlGestionMayorDescuento + "get_validaciones_mayor_descuento_by_idcriterio", JSON.stringify(request))
                .then(get_validaciones_mayor_descuento_by_idcriterio_completo)
                .catch(get_validaciones_mayor_descuento_by_idcriterio_error);

            function get_validaciones_mayor_descuento_by_idcriterio_completo(response) {
                return response.data;
            }
            function get_validaciones_mayor_descuento_by_idcriterio_error(error) {
                console.log('Error en get_validaciones_mayor_descuento_by_idcriterio', error);
                return error;
            }
        }


        function insert_validaciones_mayor_descuento(request) {
            return $http.post(TreidConfigSrv.ApiUrls.urlGestionMayorDescuento + "insert_validaciones_mayor_descuento", JSON.stringify(request))
                .then(insert_validaciones_mayor_descuento_completo)
                .catch(insert_validaciones_mayor_descuento_error);

            function insert_validaciones_mayor_descuento_completo(response) {
                return response.data;
            }
            function insert_validaciones_mayor_descuento_error(error) {
                console.log('Error en insert_validaciones_mayor_descuento', error);
                return error;
            }
        }


        function get_lista_criterios(id_plan) {
            return $http.get(TreidConfigSrv.ApiUrls.urlGestionMayorDescuento + "get_lista_criterios/" )
                .then(get_lista_criterios)
                .catch(get_meses_inventario_cgrupo_and_or_co_error);
            function get_lista_criterios(response) {
                return response.data;
            }
            function get_meses_inventario_cgrupo_and_or_co_error(error) {
                console.log('Error en get_lista_criterios', error);
                return error;
            }
        }  



        function get_producto_by_referencia(referencia) {
            return $http.get(TreidConfigSrv.ApiUrls.urlGestionMayorDescuento + "get_producto_by_referencia/"+ referencia)
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


        //function get_producto_by_referencia(referencia) {
        //    return $http.get(TreidConfigSrv.ApiUrls.urlGestionMayorDescuento + "get_producto_by_referencia/" + referencia)
        //        .then(get_producto_by_referencia)
        //        .catch(get_meses_inventario_cgrupo_and_or_co_error);
        //    function get_producto_by_referencia(response) {
        //        return response.data;
        //    }
        //    function get_meses_inventario_cgrupo_and_or_co_error(error) {
        //        console.log('Error en get_producto_by_referencia', error);
        //        return error;
        //    }
        //} 



        function get_validaciones_mayor_descuento() {
            return $http.get(TreidConfigSrv.ApiUrls.urlGestionMayorDescuento + "get_validaciones_mayor_descuento/" )
                .then(get_validaciones_mayor_descuento)
                .catch(get_meses_inventario_cgrupo_and_or_co_error);
            function get_validaciones_mayor_descuento(response) {
                return response.data;
            }
            function get_meses_inventario_cgrupo_and_or_co_error(error) {
                console.log('Error en get_validaciones_mayor_descuento', error);
                return error;
            }
        } 
        
    }
})();
