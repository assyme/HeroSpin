;
(function () {
    "use strict";

    angular.module("starter")
        .config(
        [
            "$stateProvider",
            "$urlRouterProvider",
            configureRoutes
        ]
    );

    function configureRoutes($stateProvider,
                             $urlRouterProvider) {

        $stateProvider
            .state('spin', {
                url: '/spin',
                abstract: true,
                templateUrl: 'js/core/templates/tabs.html'
            })
            .state('spin.random', {
                url: '/random',
                views: {
                    'tab-random-hero': {
                        templateUrl: 'js/core/templates/random-hero.html'
                    }
                }
            })
            .state('spin.favourite', {
                url: '/favourite',
                views: {
                    'tab-favourite-hero': {
                        templateUrl: 'js/core/templates/favourite-hero.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/spin/random');

    }
})();