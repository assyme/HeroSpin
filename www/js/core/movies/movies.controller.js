;
(function () {
    "use strict";

    angular.module("starter")
        .controller("MovieListingController",
        [
            "$q",
            "$scope",
            "$stateParams",
            "movies.repository",
            MovieListingController
        ]
    );

    function MovieListingController($q,
                                    $scope,
                                    $stateParams,
                                    moviesRepository) {
        var vm = this;
        vm.randomHeroMovie = randomHeroMovie;


        $scope.$on('$ionicView.enter', onViewEnter);

        activate();

        /**
         * @description: initializes the controller and setups defaults
         * */
        function activate() {
            vm.moviesList = [];
        }

        function onViewEnter(){
            vm.selectedHero = $stateParams.name;
            $q.when(moviesRepository.get(vm.selectedHero))
                .then(function (movies) {
                    vm.moviesList = movies;
                });
        }

        /**
        * @description: pulls out a random hero and searches movies of that hero.
        * */
        function randomHeroMovie(){
            $q.when(moviesRepository.get())
                .then(function(movies){
                    vm.moviesList = movies;
                });
        }
    }
})();