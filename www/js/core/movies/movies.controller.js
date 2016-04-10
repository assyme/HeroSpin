;
(function () {
    "use strict";

    angular.module("starter")
        .controller("MovieListingController",
        [
            "$q",
            "$location",
            "$scope",
            "$stateParams",
            "movies.repository",
            MovieListingController
        ]
    );

    function MovieListingController($q,
                                    $location,
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

        function onViewEnter() {
            vm.selectedHero = $stateParams.name;
            $q.when(moviesRepository.get(vm.selectedHero))
                .then(function (movies) {
                    vm.moviesList = _.shuffle(movies);
                },function(){
                    //TODO : handle rejections
                },function(movies){
                    vm.moviesList = vm.moviesList.concat(movies);
                });
        }

        /**
         * @description: pulls out a random hero and searches movies of that hero.
         * */
        function randomHeroMovie() {
            $q.when(moviesRepository.get())
                .then(function (movies) {
                    vm.moviesList = movies;
                },function(){
                    //TODO : handle rejections
                },function(movies){
                    vm.moviesList = _.shuffle(vm.moviesList.concat(movies));
                });
        }

        function selectRandomMovie() {
            if (vm.moviesList.length) {
                var randomMovie = _.sample(vm.moviesList);
                $location.path('/spin/random/detail/' + randomMovie.imdbID);
            }
        }

    }
})();