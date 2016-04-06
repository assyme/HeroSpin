;
(function () {
    "use strict";

    angular.module("starter")
        .controller("MovieListingController",
        [
            "$q",
            "movies.repository",
            MovieListingController
        ]
    );

    function MovieListingController($q,
                                    moviesRepository) {
        var vm = this;
        vm.randomHeroMovie = randomHeroMovie;

        activate();

        /**
         * @description: initializes the controller and setups defaults
         * */
        function activate() {
            vm.moviesList = [];

            $q.when(moviesRepository.get())
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