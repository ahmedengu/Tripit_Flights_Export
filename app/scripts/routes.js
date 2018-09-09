/**
 * @ngdoc overview
 * @name tripitflightsexport.routes
 * @description
 * # tripitflightsexport.routes
 *
 * Routes module. All app states are defined here.
 */

(() => {
    'use strict';

    angular
        .module('tripitflightsexport')
        .config(routerHelperProvider);

    /* @ngInject */
    function routerHelperProvider($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeCtrl',
                controllerAs: 'vm',
                templateUrl: 'scripts/routes/home/home-c.html'
            })
            /* STATES-NEEDLE - DO NOT REMOVE THIS */;
    }
})();
