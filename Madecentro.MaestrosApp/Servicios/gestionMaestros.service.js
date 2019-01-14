(function () {
    "use strict";

    angular
      .module("appmadecentro")
      .factory("gestionMaestrosService", gestionMaestrosService);

    gestionMaestrosService.$inject = ["$http", "TreidConfigSrv", "$rootScope"];

    function gestionMaestrosService($http, TreidConfigSrv, $rootScope) {
        return {
            getAppsDisponibles: getAppsDisponibles
        };

        function getAppsDisponibles(idAplicacion, cs_IdUsuario) {
            $rootScope.progressbar.start();
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestros + "get_apps_disponibles/" + idAplicacion + "/" + cs_IdUsuario)
                .then(getAppsDisponiblesCompleto)
                .catch(getAppsDisponiblesError);

            function getAppsDisponiblesCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getAppsDisponiblesError(error) {
                $rootScope.progressbar.reset();
                console.error('Error en getAppsDisponibles', error);
                return error;
            }
        }
    }
})();
