;
(function () {
    "use strict";

    angular.module("starter")
        .factory("movies.repository",
        [
            "$q",
            "movies.api",
            "heroes.repository",
            moviesRepository
        ]
    );

    function moviesRepository($q,
                              moviesApi,
                              heroesRepository) {

        var _this = {
            get: get
        };

        /**
         * @description: gets movies from the local storage first,
         * Alternately syncs with the omdb api and caches the data locally
         * */
        function get() {

            return $q.when(heroesRepository.randomHero())
                .then(moviesApi.search)
                .then(function (movies) {
                    return $q.resolve(movies);
                }, function () {
                    //TODO : log the error.
                    //TODO : resolve from local cache.
                    return $q.resolve([]);
                });
        }

        return _this;
    }
})();