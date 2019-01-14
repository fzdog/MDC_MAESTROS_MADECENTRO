/// <reference path="AutorizadoresMayorDctoService.js" />
(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('AutorizadoresMayorDctoService', AutorizadoresMayorDctoService);

    AutorizadoresMayorDctoService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function AutorizadoresMayorDctoService($http, TreidConfigSrv, $rootScope) {

        return {
            consultar_zonas: consultar_zonas
            , consultar_grupos: consultar_grupos
            , consultar_lineas: consultar_lineas
            , usuarios_autorizados_dcto_grupo: usuarios_autorizados_dcto_grupo
            , usuarios_autorizados_dcto_linea: usuarios_autorizados_dcto_linea
            , verificar_user_name: verificar_user_name
            , autorizar_usuario_dcto_grupo: autorizar_usuario_dcto_grupo
            , autorizar_usuario_dcto_linea: autorizar_usuario_dcto_linea
            , consultar_permisos_por_usuario_grupo: consultar_permisos_por_usuario_grupo
            , consultar_permisos_por_usuario_lineas: consultar_permisos_por_usuario_lineas
            , remplazar_usuario_grupo: remplazar_usuario_grupo
            , remplazar_usuario_linea: remplazar_usuario_linea
            , remplazar_autorizador_por_autorizador_grupo: remplazar_autorizador_por_autorizador_grupo
            , remplazar_autorizador_por_autorizador_linea: remplazar_autorizador_por_autorizador_linea

        }


        //functions
        function consultar_zonas() {
            //toastr.info("conectado con el service");
            //return;
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "consultar_zonas/")
               .then(consultar_zonas_completo)
               .catch(consultar_zonas_error);
            function consultar_zonas_completo(response) {
                return response.data;
            }
            function consultar_zonas_error(error) {
                console.log('Error en consultar_zonas', error);
                return error;
            }
        }

        function consultar_grupos() {

            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "consultar_grupos/")
               .then(consultar_grupos_completo)
               .catch(consultar_grupos_error);
            function consultar_grupos_completo(response) {
                return response.data;
            }
            function consultar_grupos_error(error) {
                console.log('Error en consultar_grupos', error);
                return error;
            }
        }


        function consultar_lineas(grupo) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "consultar_lineas/" + grupo)
               .then(consultar_lineas_completo)
               .catch(consultar_lineas_error);
            function consultar_lineas_completo(response) {
                return response.data;
            }
            function consultar_lineas_error(error) {
                console.log('Error en consultar_lineas', error);
                return error;
            }
        }

        function usuarios_autorizados_dcto_grupo(zona_sucursal, grupo) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "usuarios_autorizados_dcto_grupo/" + zona_sucursal + "/" + grupo)
               .then(usuarios_autorizados_dcto_grupo_completo)
               .catch(usuarios_autorizados_dcto_grupo_error);
            function usuarios_autorizados_dcto_grupo_completo(response) {
                return response.data;
            }
            function usuarios_autorizados_dcto_grupo_error(error) {
                console.log('Error en usuarios_autorizados_dcto_grupo', error);
                return error;
            }
        }

        function usuarios_autorizados_dcto_linea(zona_sucursal, grupo, linea) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "usuarios_autorizados_dcto_linea/" + zona_sucursal + "/" + grupo + "/" + linea)
               .then(usuarios_autorizados_dcto_linea_completo)
               .catch(usuarios_autorizados_dcto_linea_error);
            function usuarios_autorizados_dcto_linea_completo(response) {
                return response.data;
            }
            function usuarios_autorizados_dcto_linea_error(error) {
                console.log('Error en usuarios_autorizados_dcto_linea', error);
                return error;
            }
        }

        function verificar_user_name(correo_electronico) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "verificar_user_name/" + correo_electronico)
               .then(verificar_user_name_completo)
               .catch(verificar_user_name_error);
            function verificar_user_name_completo(response) {
                return response.data;
            }
            function verificar_user_name_error(error) {
                console.log('Error en verificar_user_name', error);
                return error;
            }
        }

        function autorizar_usuario_dcto_grupo(request) { //actualiza los usuarios autorizados para dar permisos
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "autorizar_usuario_dcto_grupo/", JSON.stringify(request))
                .then(autorizar_usuario_dcto_grupo_completo)
                .catch(autorizar_usuario_dcto_grupo_error);

            function autorizar_usuario_dcto_grupo_completo(response) {
                return response.data;
            }
            function autorizar_usuario_dcto_grupo_error(error) {
                console.log('Error en autorizar_usuario_dcto_grupo', error);
                return error;
            }
        }

        function autorizar_usuario_dcto_linea(request) { //actualiza los usuarios autorizados para dar permisos
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "autorizar_usuario_dcto_linea/", JSON.stringify(request))
                .then(autorizar_usuario_dcto_linea_completo)
                .catch(autorizar_usuario_dcto_linea_error);

            function autorizar_usuario_dcto_linea_completo(response) {
                return response.data;
            }
            function autorizar_usuario_dcto_linea_error(error) {
                console.log('Error en autorizar_usuario_dcto_linea', error);
                return error;
            }
        }

        function consultar_permisos_por_usuario_grupo(user_name) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "consultar_permisos_por_usuario_grupo/" + user_name)
               .then(consultar_permisos_por_usuario_grupo_completo)
               .catch(consultar_permisos_por_usuario_grupo_error);
            function consultar_permisos_por_usuario_grupo_completo(response) {
                return response.data;
            }
            function consultar_permisos_por_usuario_grupo_error(error) {
                console.log('Error en consultar_permisos_por_usuario_grupo', error);
                return error;
            }
        }


        function consultar_permisos_por_usuario_lineas(user_name) {
            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "consultar_permisos_por_usuario_lineas/" + user_name)
               .then(consultar_permisos_por_usuario_lineas_completo)
               .catch(consultar_permisos_por_usuario_lineas_error);
            function consultar_permisos_por_usuario_lineas_completo(response) {
                return response.data;
            }
            function consultar_permisos_por_usuario_lineas_error(error) {
                console.log('Error en consultar_permisos_por_usuario_lineas', error);
                return error;
            }
        }


        function remplazar_usuario_grupo(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "remplazar_usuario_grupo/", JSON.stringify(request))
                .then(remplazar_usuario_grupo_completo)
                .catch(remplazar_usuario_grupo_error);

            function remplazar_usuario_grupo_completo(response) {
                return response.data;
            }
            function remplazar_usuario_grupo_error(error) {
                console.log('Error en remplazar_usuario_grupo', error);
                return error;
            }
        }

        function remplazar_usuario_linea(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "remplazar_usuario_linea/", JSON.stringify(request))
                .then(remplazar_usuario_linea_completo)
                .catch(remplazar_usuario_linea_error);

            function remplazar_usuario_linea_completo(response) {
                return response.data;
            }
            function remplazar_usuario_linea_error(error) {
                console.log('Error en remplazar_usuario_linea', error);
                return error;
            }
        }


        function remplazar_autorizador_por_autorizador_grupo(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "remplazar_autorizador_por_autorizador_grupo/", JSON.stringify(request))
                .then(remplazar_autorizador_por_autorizador_grupo_completo)
                .catch(remplazar_autorizador_por_autorizador_grupo_error);

            function remplazar_autorizador_por_autorizador_grupo_completo(response) {
                return response.data;
            }
            function remplazar_autorizador_por_autorizador_grupo_error(error) {
                console.log('Error en remplazar_autorizador_por_autorizador_grupo', error);
                return error;
            }
        }

        function remplazar_autorizador_por_autorizador_linea(request) {
            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosAutorizadoresMayorDcto + "remplazar_autorizador_por_autorizador_linea/", JSON.stringify(request))
                .then(remplazar_autorizador_por_autorizador_linea_completo)
                .catch(remplazar_autorizador_por_autorizador_linea_error);

            function remplazar_autorizador_por_autorizador_linea_completo(response) {
                return response.data;
            }
            function remplazar_autorizador_por_autorizador_linea_error(error) {
                console.log('Error en remplazar_autorizador_por_autorizador_linea', error);
                return error;
            }
        }







    }

})();

