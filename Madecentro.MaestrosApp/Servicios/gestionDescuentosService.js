(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('gestionDescuentosService', gestionDescuentosService);

    gestionDescuentosService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function gestionDescuentosService($http, TreidConfigSrv, $rootScope) {
        return {
            getCentroOperativoFiltro: getCentroOperativoFiltro,
            insertProgramacionDscto: insertProgramacionDscto,
            getProgramacionDsctoByFiltro: getProgramacionDsctoByFiltro,
            getProveedores: getProveedores,
            getGruposProductos: getGruposProductos,
            getLineasByGrupo: getLineasByGrupo,
            getSubLineasByLinea: getSubLineasByLinea,
            getSubLineasByGrupo_Linea: getSubLineasByGrupo_Linea,
            getProveedoresByFiltro: getProveedoresByFiltro
        };
        function getProveedoresByFiltro(request) {
            $rootScope.progressbar.start();
            return $http.post(TreidConfigSrv.ApiUrls.UrlGestionDctos + "get_proveedores_by_filtro/", JSON.stringify(request))
                .then(getProveedoresByFiltroCompleto)
                .catch(getProveedoresByFiltroError);

            function getProveedoresByFiltroCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getProveedoresByFiltroError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getProveedoresByFiltro', error);
                return error;
            }
        }
        function getSubLineasByGrupo_Linea(grupos, lineas) {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlGestionDctos + "get_subLineas_by_grupo_linea/" + grupos + "/" + lineas)
                .then(getSubLineasByGrupo_LineaCompleto)
                .catch(getSubLineasByGrupo_LineaError);

            function getSubLineasByGrupo_LineaCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getSubLineasByGrupo_LineaError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getSubLineasByGrupo_Linea', error);
                return error;
            }
        }
        function getProveedores() {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_proveedores/")
                .then(getProveedoresCompleto)
                .catch(getProveedoresError);

            function getProveedoresCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getProveedoresError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getProveedores', error);
                return error;
            }
        }

        function getGruposProductos() {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "getGruposProductos/")
                .then(getGruposProductosCompleto)
                .catch(getGruposProductosError);

            function getGruposProductosCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getGruposProductosError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getGruposProductos', error);
                return error;
            }
        }

        function getLineasByGrupo(grupos) {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_lineas_by_grupo/" + grupos)
                .then(getLineasByGrupoCompleto)
                .catch(getLineasByGrupoError);

            function getLineasByGrupoCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getLineasByGrupoError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getLineasByGrupo', error);
                return error;
            }
        }

        function getSubLineasByLinea(lineas) {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_subLineas_by_linea/" + lineas)
                .then(getSubLineasByLineaCompleto)
                .catch(getSubLineasByLineaError);

            function getSubLineasByLineaCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getSubLineasByLineaError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getSubLineasByLinea', error);
                return error;
            }
        }

        function getProgramacionDsctoByFiltro(c_referencia, arrayGrupos, arrayLineas, arraySubLineas, arrayCO, sw_dcto_activo, array_proveedores) {
            $rootScope.progressbar.start();
            return $http.post(TreidConfigSrv.ApiUrls.UrlGestionDctos + "get_programacion_dscto_by_filtro/" + arrayGrupos + "/" + arrayLineas + "/" + arraySubLineas + "/" + sw_dcto_activo + "/" + array_proveedores, JSON.stringify({ referencia:c_referencia, arrayCO: arrayCO }))
                .then(getProgramacionDsctoByFiltroCompleto)
                .catch(getProgramacionDsctoByFiltroError);

            function getProgramacionDsctoByFiltroCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getProgramacionDsctoByFiltroError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getProgramacionDsctoByFiltro', error);
                return error;
            }
        }

        function getCentroOperativoFiltro(filtro_co) {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlGestionDctos + "getCentroOperativo_filtro/" + filtro_co)
                .then(getCentroOperativoFiltroCompleto)
                .catch(getCentroOperativoFiltroError);

            function getCentroOperativoFiltroCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getCentroOperativoFiltroError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getCentroOperativoFiltro', error);
                return error;
            }
        }
        function insertProgramacionDscto(log_insert, request) {
            $rootScope.progressbar.start();
            return $http.post(TreidConfigSrv.ApiUrls.UrlGestionDctos + "update_programacion_dscto/" + log_insert, JSON.stringify(request))
                .then(insertProgramacionDsctoCompleto)
                .catch(insertProgramacionDsctoError);

            function insertProgramacionDsctoCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function insertProgramacionDsctoError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en insertProgramacionDscto', error);
                return error;
            }
        }
    }
})();
