/// <reference path="../Reportes/ReporteIndicadoresLeptView.html" />


(function () {
    'use strict';

    angular.module('appmadecentro', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'angularFileUpload', 'formly', 'formlyBootstrap',
        'ngAnimate', 'ngMessages', 'ngProgress', 'blockUI'])
        .config(function ($routeProvider, $locationProvider, formlyConfigProvider, blockUIConfig) {

            //poner las url bonitas
            //$locationProvider.html5Mode({ enabled: false, requireBase: true });
            //moment.locale('es');

            var baseUrl = $("base").first().attr("href");
            console.log("base url for relative links = " + baseUrl);
            
            $routeProvider
                .when('/', {
                    templateUrl: 'Modulos/Home/HomeView.html',
                    controller: 'HomeCtrl'
                }).when('/Maestros', {
                    templateUrl: 'Modulos/Maestros/MaestrosView.html',
                    controller: 'MaestrosCtrl',
                    views: {
                        'scriptmodales': {
                            templateUrl: baseUrl + 'Modulos/Maestros/scriptModal.html'
                        }
                    }
                }).when('/bodyForm/:idFormulario', {
                    templateUrl: 'Modulos/bodyForm/bodyFormView.html',
                    controller: 'bodyFormCtrl'

                    //}).when('/ForgotPassword/:idUsuarioChangePass', {
                    //    templateUrl: 'Modulos/ForgotPassword/ForgotPasswordView.html',
                    //    controller: 'ForgotPasswordCtrl'
                }).otherwise({
                    redirectTo: '/'
                });
            
            blockUIConfig.delay = 0;
            //blockUIConfig.message = 'Espere...';
            // set templates here

            /*FORMULARIO HZTAL*/
            formlyConfigProvider.setWrapper({
                name: 'horizontalBootstrapLabel',
                template: [
                    '<div style="border-top: 1px solid #E9E9E9;padding-top: 17px;">' +
                  '<label for="{{::id}}" class="col-sm-4 control-label">',
                    '{{to.label}} {{to.required ? "*" : ""}}',
                  '</label>',
                  '<div class="col-sm-8">',
                    '<formly-transclude></formly-transclude>',
                  '</div>' +
                      '<div>'
                ].join(' ')
            });

            formlyConfigProvider.setWrapper({
                name: 'horizontalBootstrapCheckbox',
                template: [
                  '<div class="col-sm-offset-2 col-sm-8">',
                    '<formly-transclude></formly-transclude>',
                  '</div>'
                ].join(' ')
            });

            formlyConfigProvider.setType({
                name: 'horizontalInput',
                extends: 'input',
                wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
            });

            formlyConfigProvider.setType({
                name: 'horizontalCheckbox',
                extends: 'checkbox',
                wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
            });

            /*TEXTO DE AYUDA*/
            formlyConfigProvider.templateManipulators.preWrapper.push(function (template, options, scope) {
                if (!options.data.somePropertyToTriggerTheManipulator) {
                    return template;
                }

                //return '<div style="color: gray;text-transform: none;">' + scope.name + template + '</div>';
                return '<div><label style="color: gray;text-transform: none;font-size: 12px;margin-bottom: 9px;font-weight: 400;">' + scope.name + template + '</label></div>';
            });


        });


}());