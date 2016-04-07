;
(function () {
    "use strict";

    angular.module("starter")
        .factory("movies.repository",
        [
            "$q",
            "movies.api",
            "heroes.repository",
            "DataStore",
            "TableNames",
            moviesRepository
        ]
    );

    function moviesRepository($q,
                              moviesApi,
                              heroesRepository,
                              DataStore,
                              TableNames) {

        var TABLE_NAME = TableNames.Movies.Name,
            COLUMN = TableNames.Movies.Column,
            _cache = {};

        var _this = {
            load: load,
            get: get
        };


        /**
         * @description: Loads movies from the database to the cache.
         * */
        function load() {
            var selectQuery = squel.select()
                .from(TABLE_NAME)
                .field(COLUMN.key)
                .field(COLUMN.value);

            return DataStore.ExecuteQuery(selectQuery.toString()).then(function (results) {
                processResults(results);
                return $q.resolve();
            },$q.reject);
        }

        /**
         * @description: gets movies from the local storage first,
         * Alternately syncs with the omdb api and caches the data locally
         * @[inputs] - "string" name of selected hero.
         * */
        function get(selectedHero) {

            return $q.when(
                function(){
                    if (selectedHero){
                        return $q.resolve(selectedHero);
                    }else{
                        return heroesRepository.randomHero();
                    }
                }()
            )
                .then(function (hero) {
                    if (_cache[hero]) {
                        return $q.resolve(_cache[hero]);
                    } else {
                        return moviesApi.search(hero)
                            .then(function (response) {
                                //save it in local cache
                                applyChanges(response.hero, response.movies);

                                return $q.resolve(response.movies);
                            }, function () {
                                //TODO : log the error.
                                //TODO : resolve from local cache.
                                return $q.resolve([]);
                            });
                    }
                })
        }


        /**
         * @descriptions: processes movies retrieved from database.
         *  creates movies objects from sql results.
         * */
        function processResults(results) {

            if (results.rows.length > 0) {
                for (var count = 0; count < results.rows.length; count++) {
                    var rowValue = results.rows.item(count);
                    var hero = rowValue.key;
                    var movies = angular.fromJson(rowValue.value);
                    _cache[hero] = movies;
                }
            }
        }

        function applyChanges(hero, movies) {

            if (!movies || !movies.length) {
                return;
            }

            var insert_query = squel.insert()
                .into(TABLE_NAME)
                .set(COLUMN.key)
                .set(COLUMN.value)
                .toParam();

            //insert
            return DataStore.ExecuteQuery(insert_query.text, [hero, angular.toJson(movies)]).then(function (sucess) {
                // add to cache
                _cache[hero] = movies;
                return $q.resolve();

            }, function (error) {
                //TODO : Log error
            });
        }

        return _this;
    }
})();