;
(function () {
    "use strict";

    angular.module('starter', ['ionic']);

})();
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
                        templateUrl: 'js/core/templates/favourite-hero.html',
                        controller : 'HeroListController as heroListVM'
                    }
                }
            });

        $urlRouterProvider.otherwise('/spin/random');

    }
})();
;
(function () {
    "use strict";

    angular.module('starter')
        .run(
        [
            "$ionicPlatform",
            runIonic
        ]
    );

    /**
     * @description: Main entry to the ionic app
     * */
    function runIonic($ionicPlatform) {

        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .controller("HeroListController",
        [
            "$q",
            "heroes.repository",
            HeroListController
        ]
    );

    function HeroListController($q,
                                heroesRepository) {

        //this is basically the view model for the controller
        var vm = this;
        vm.heroList = [];

        activate();

        function activate() {

            $q.when(heroesRepository.get())
                .then(function (heroes) {
                    vm.heroList = heroes;
                });
        }

    }
})();
;
(function () {
    "use strict";

    angular.module("starter")
        .factory("heroes.repository",
        [
            "$q",
            heroesRepository
        ]
    );

    function heroesRepository($q){


        /**
        * @description: make factory methods exposed
        * */
        var _this = {
            get : get
        };

        /**
        * @description: Gets heroes from the local storage
        * */
        function get(){
            var heroes = [
                {
                    id: 0,
                    name: "Storm",
                    avatar: "http://x.annihil.us/u/prod/marvel/i/mg/c/c0/537bc5db7c77d/standard_xlarge.jpg"
                },
                {
                    id: 1,
                    name: "Hulk",
                    avatar: "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg"
                },
                {
                    id: 2,
                    name: "Spider-man",
                    avatar: "http://i.annihil.us/u/prod/marvel/i/mg/9/30/538cd33e15ab7/standard_xlarge.jpg"
                },
                {
                    id: 3,
                    name: "Fantastic four",
                    avatar: "http://i.annihil.us/u/prod/marvel/i/mg/9/60/50febc4f55525/standard_xlarge.jpg"
                },
                {
                    id: 4,
                    name: "Captain America",
                    avatar: "http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087/standard_xlarge.jpg"
                }
            ];

            return heroes;
        }

        return _this;
    }
})();