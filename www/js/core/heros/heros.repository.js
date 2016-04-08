;
(function () {
    "use strict";

    angular.module("starter")
        .factory("heroes.repository",
        [
            "$q",
            "DataStore",
            "TableNames",
            heroesRepository
        ]
    );

    function heroesRepository($q,
                              DataStore,
                              TableNames) {


        var _cache = [];

        /**
         * @description: make factory methods exposed
         * */
        var _this = {
            init: init,
            get: get,
            randomHero: randomHero
        };

        /**
         * @description : initializes the repository and loads data into memory
         * */
        function init() {
            var selectQuery = squel.select()
                .from(TableNames.Heroes.Name)
                .field(TableNames.Heroes.Column.NAME)
                .field(TableNames.Heroes.Column.AVATAR)
                .field(TableNames.Heroes.Column.VIEWS);

            return DataStore.ExecuteQuery(selectQuery.toString())
                .then(function (results) {
                    if (results.rows.length > 0) {
                        for (var count = 0; count < results.rows.length; count++) {
                            var rowValue = results.rows.item(count);
                            var hero = {};
                            hero.name = rowValue[TableNames.Heroes.Column.NAME];
                            hero.avatar = rowValue[TableNames.Heroes.Column.AVATAR];
                            hero.views = rowValue[TableNames.Heroes.Column.VIEWS];
                            _cache.push(hero);
                        }

                    }
                    return $q.resolve();
                });
        }

        /**
         * @description: Gets heroes from the local storage
         * */
        function get() {
            return _cache;
        }

        /**
         * @description: returns a random hero name from the local cache.
         * TODO:// add logic to put weightage on few parameters like
         * 1. Keep count of how many times the user has selected a particular hero.
         * 2. Keep count of how many times he accepted to view a movie of that hero.
         * */
        function randomHero() {
            var randomNumber = _.random(0, _cache.length - 1);
            return _cache[randomNumber].name;
        }

        return _this;
    }
})();