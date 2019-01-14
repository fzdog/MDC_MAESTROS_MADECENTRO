/// <reference path="GestionPresupuestosMesPdvService.js" />
(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('GestionPresupuestosMesPdvService', GestionPresupuestosMesPdvService);

    GestionPresupuestosMesPdvService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function GestionPresupuestosMesPdvService($http, TreidConfigSrv, $rootScope) {

        return {
            consultar_co: consultar_co
            , insertar_presupuesto_mes: insertar_presupuesto_mes
            , consultar_presupuestos_co_mes_anio: consultar_presupuestos_co_mes_anio
            , consultar_presupuestos_co_anio_mes_a_mes: consultar_presupuestos_co_anio_mes_a_mes

        }


        //functions

        function consultar_co() {
            //console.log("conectado con el service");
            //return;
            return $http.get(TreidConfigSrv.ApiUrls.UrlGestionPresupuestosMesPdv + "consultar_co/")
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

        function consultar_presupuestos_co_mes_anio(c_centro_operacion,ano,mes) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlGestionPresupuestosMesPdv + "consultar_presupuestos_co_mes_anio/" + c_centro_operacion + "/" + ano + "/" + mes)
               .then(consultar_presupuestos_co_mes_anio_completo)
               .catch(consultar_presupuestos_co_mes_anio_error);
            function consultar_presupuestos_co_mes_anio_completo(response) {
                return response.data;
            }
            function consultar_presupuestos_co_mes_anio_error(error) {
                console.log('Error en consultar_presupuestos_co_mes_anio', error);
                return error;
            }
        }

        function consultar_presupuestos_co_anio_mes_a_mes(c_centro_operacion, ano) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlGestionPresupuestosMesPdv + "consultar_presupuestos_co_anio_mes_a_mes/" + c_centro_operacion + "/" + ano)
               .then(consultar_presupuestos_co_anio_mes_a_mes_completo)
               .catch(consultar_presupuestos_co_anio_mes_a_mes_error);
            function consultar_presupuestos_co_anio_mes_a_mes_completo(response) {
                return response.data;
            }
            function consultar_presupuestos_co_anio_mes_a_mes_error(error) {
                console.log('Error en consultar_presupuestos_co_anio_mes_a_mes', error);
                return error;
            }
        }

        function insertar_presupuesto_mes(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlGestionPresupuestosMesPdv + "insertar_presupuesto_mes/", JSON.stringify(request))
               .then(insertar_presupuesto_mes_completo)
               .catch(insertar_presupuesto_mes_error);
            function insertar_presupuesto_mes_completo(response) {
                return response.data;
            }
            function insertar_presupuesto_mes_error(error) {
                console.log('Error en insertar_presupuesto_mes_error', error);
                return error;
            }
        }




    }

})();

