(function () {
    "use strict";

    angular
        .module('appmadecentro')
        .factory('GestionUsuSamService', GestionUsuSamService);

    GestionUsuSamService.$inject = ['$http', 'TreidConfigSrv', '$rootScope'];

    function GestionUsuSamService($http, TreidConfigSrv, $rootScope) {

        return {
            //declaracion de metodos
            buscar_usuario_sam: buscar_usuario_sam,
            get_roles: get_roles,
            update_rol_usuario: update_rol_usuario,
            get_id_usuario: get_id_usuario,
            insert_rol_usuario: insert_rol_usuario,
            get_centro_operativo: get_centro_operativo,
            insert_sucursal: insert_sucursal,
            get_sucursales_usuario: get_sucursales_usuario,
            update_sw_sucursal: update_sw_sucursal
        }

        //Metodos
        //buscar usuario
        function buscar_usuario_sam(correo_usuario_sam) {

            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "buscar_usuario_sam/" + correo_usuario_sam)
               .then(buscar_usuario_sam_completo)
               .catch(buscar_usuario_sam_error);

            function buscar_usuario_sam_completo(response) {

                return response.data;
            }

            function buscar_usuario_sam_error(error) {

                console.log('Error en buscar_usuario_sam', error);
                return error;
            }

        }

        //get_usuario_id
        function get_id_usuario(correo_usuario_sam) {

            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "get_id_usuario/" + correo_usuario_sam)
               .then(get_id_usuario_completo)
               .catch(get_id_usuario_error);

            function get_id_usuario_completo(response) {

                return response.data;
            }

            function get_id_usuario_error(error) {

                console.log('Error en get_id_usuario', error);
                return error;
            }

        }

        //get sucursales usaurio get_sucursales_usuario
        function get_sucursales_usuario(codigo_usuario) {

            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "get_sucursales_usuario/" + codigo_usuario)
               .then(get_sucursales_usuario_completo)
               .catch(get_sucursales_usuario_error);

            function get_sucursales_usuario_completo(response) {

                return response.data;
            }

            function get_sucursales_usuario_error(error) {

                console.log('Error en get_sucursales_usuario', error);
                return error;
            }

        }

        //get_roles
        function get_roles() {

            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "get_roles/")
               .then(get_roles_completo)
               .catch(get_roles_error);

            function get_roles_completo(response) {

                return response.data;
            }

            function get_roles_error(error) {

                console.log('Error en get_roles_error', error);
                return error;
            }

        }

        //update_rol_usuario  update_rol_usuario
        function update_rol_usuario(request) {

            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "update_rol_usuario/", JSON.stringify(request))
                .then(update_rol_usuario_completo)
                .catch(update_rol_usuario_error);

            function update_rol_usuario_completo(response) {

                return response.data;
            }

            function update_rol_usuario_error(error) {

                console.log('Error en update_rol_usuario', error);
                return error;
            }
        }

        //insertar_rol_usuario  insert_rol_usuario
        function insert_rol_usuario(request) {

            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "insert_rol_usuario/", JSON.stringify(request))
                .then(insert_rol_usuario_completo)
                .catch(insert_rol_usuario_error);

            function insert_rol_usuario_completo(response) {

                return response.data;
            }

            function insert_rol_usuario_error(error) {

                console.log('Error en insert_rol_usuario', error);
                return error;
            }
        }

        //get_centro_operación    get_centro_operativo
        function get_centro_operativo() {

            return $http.get(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "get_centro_operativo/")
               .then(get_centro_operativo_completo)
               .catch(get_centro_operativo_error);

            function get_centro_operativo_completo(response) {

                return response.data;
            }

            function get_centro_operativo_error(error) {

                console.log('Error en get_centro_operativo', error);
                return error;
            }

        }

        //insert sucursal insert_sucursal
        function insert_sucursal(request) {

            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "insert_sucursal/", JSON.stringify(request))
                .then(insert_sucursal_completo)
                .catch(insert_sucursal_error);

            function insert_sucursal_completo(response) {

                return response.data;
            }

            function insert_sucursal_error(error) {

                console.log('Error en insert_sucursal', error);
                return error;
            }
        }

        //update sw sucursales 

        function update_sw_sucursal(request) {

            return $http.post(TreidConfigSrv.ApiUrls.UrlMaestrosSam + "update_sw_sucursal/", JSON.stringify(request))
                .then(update_sw_sucursal_completo)
                .catch(update_sw_sucursal_error);

            function update_sw_sucursal_completo(response) {

                return response.data;
            }

            function update_sw_sucursal_error(error) {

                console.log('Error en update_sw_sucursal', error);
                return error;
            }
        }
    };
})();
