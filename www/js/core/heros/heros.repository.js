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
            update: update,
            randomHero: randomHero
        };

        /**
         * @description : initializes the repository and loads data into memory
         * */
        function init() {
            var selectQuery = squel.select()
                .from(TableNames.Heroes.Name)
                .field(TableNames.Heroes.Column.ID)
                .field(TableNames.Heroes.Column.NAME)
                .field(TableNames.Heroes.Column.AVATAR)
                .field(TableNames.Heroes.Column.VIEWS);

            return DataStore.ExecuteQuery(selectQuery.toString())
                .then(function (results) {
                    if (results.rows.length > 0) {
                        for (var count = 0; count < results.rows.length; count++) {
                            var rowValue = results.rows.item(count);
                            var hero = {};
                            hero.id = rowValue[TableNames.Heroes.Column.ID];
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
         * @descripiton: updates a selected hero
         * */
        function update(hero) {
            //TODO: Add validations

            var updateQuery = squel.update()
                .table(TableNames.Heroes.Name)
                .set(TableNames.Heroes.Column.NAME, hero.name)
                .set(TableNames.Heroes.Column.AVATAR, hero.avatar)
                .set(TableNames.Heroes.Column.VIEWS, hero.views)
                .where(TableNames.Heroes.Column.ID + " == " + hero.id);

            return DataStore.ExecuteQuery(updateQuery.toString());

        }

        /**
         * @description: returns a random hero name from the local cache.
         * //TODO:
         * 2. Keep count of how many times he accepted to view a movie of that hero.
         * */
        function randomHero() {

            //create a list of hero names with duplicate values based on how many times a user has selected the hero.
            var duplicatedList = [];

            _.each(_cache, function (hero) {
                duplicatedList.push(hero.name);
                for (var i = 0 ; i < hero.views ; i++){
                    //add the hero as many times as he has been views. this will add more probability for him.
                    duplicatedList.push(hero.name);
                }
            });

            //shuffle the list, and then sample out one (randomizes) and gets the value
            return _.chain(duplicatedList).shuffle().sample().value();
        }

        return _this;
    }
})();