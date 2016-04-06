;
(function () {
    "use strict";

    angular.module("starter")
        .factory("movies.repository",
        [
            "$q",
            "movies.api",
            moviesRepository
        ]
    );

    function moviesRepository($q,
                              moviesApi) {

        var _this = {
            get: get
        };

        /**
         * @description: gets movies from the local storage first,
         * Alternately syncs with the omdb api and caches the data locally
         * */
        function get() {
            return $q.when(moviesApi.search("Hulk"))
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