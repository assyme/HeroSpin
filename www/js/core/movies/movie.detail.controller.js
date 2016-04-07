;
(function () {
    "use strict";

    angular.module("starter")
        .controller(
        'MovieDetailController',
        [
            '$stateParams',
            'movies.repository',
            MovieDetailController
        ]
    );

    function MovieDetailController($stateParams,
                                   movieRepository) {

        var vm = this;

        vm.movie_id = $stateParams.id;
        vm.movie = {};

        activate();

        function activate() {
            movieRepository.detail(vm.movie_id).then(function(movieDetails){
                vm.movie = movieDetails;
            });
        }


    }
})();