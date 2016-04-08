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
                resolve: { // putting this at the root of the route so that this has to be resolved before application start.
                    AppState: [
                        '$q',
                        'DataStore',
                        'DbUpgrade',
                        'movies.repository',
                        'image.repository',
                        'heroes.repository',
                        function ($q,
                                  DataStore,
                                  DbUpgrade,
                                  moviesRepository,
                                  imageRepository,
                                  heroesRepository) {
                            return DataStore.init()
                                .then(DbUpgrade.upgrade)
                                .then(function () {
                                    return $q.all([
                                        moviesRepository.load(),
                                        imageRepository.init(),
                                        heroesRepository.init()
                                    ]).then(function () {
                                        return $q.resolve();
                                    });
                                });
                        }
                    ]
                },
                templateUrl: 'js/core/templates/tabs.html',
                controller: 'TabsController as TabsVM'
            })
            .state('spin.random', {
                url: '/random/:name',
                views: {
                    'tab-random-hero': {
                        templateUrl: 'js/core/templates/random-hero.html',
                        controller: "MovieListingController as movieListingVM"
                    }
                }
            })
            .state('spin.favourite', {
                url: '/favourite',
                views: {
                    'tab-favourite-hero': {
                        templateUrl: 'js/core/templates/favourite-hero.html',
                        controller: 'HeroListController as heroListVM'
                    }
                }
            })
            .state('spin.movieDetail', {
                url: '/random/detail/:id',
                views: {
                    'tab-random-hero': {
                        templateUrl: 'js/core/templates/movie-detail.html',
                        controller: "MovieDetailController as movieDetailVM"
                    }
                }
            });

        $urlRouterProvider.otherwise('/spin/random/');

    }
})();