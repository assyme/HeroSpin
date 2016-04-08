(function () {
    "use strict";

    angular.module('starter')
        .factory('DbUpgrade',
        [
            '$q',
            'DataStore',
            'TableNames',
            DbUpgrade
        ]
    );

    /**
     * @description: upgrades databases and keeps track of its version in the localStorage.
     * */
    function DbUpgrade($q,
                       DataStore,
                       TableNames) {

        var CURRENT_VERSION_KEY = "_dbVersion";

        var _this = {
            upgrade: upgrade
        };


        function upgrade() {

            var currentVersion = window.localStorage.getItem(CURRENT_VERSION_KEY);
            var upgrade_status = []; // to store promises of upgrades
            if (currentVersion === null) {
                // upgrade to first version.
                upgrade_status.push(_upgrade1().then(function () {
                    _set_version(1);
                    return $q.resolve();
                }));
            }

            return $q.all(upgrade_status);
            //future code for upgrade 2 should check for the upgrade one or currentVersion.
        }


        //region private members

        /**
         * @description: Saves the version.
         * @inputs: [ver: integer], saves the version in the localStorage
         * */
        function _set_version(ver) {
            window.localStorage.setItem(CURRENT_VERSION_KEY, ver);
        }

        function _upgrade1() {

            var promises = [];

            var promise;

            //tables
            promise = DataStore.ExecuteQuery(createTable(TableNames.Heroes.Name,
                [
                    TableNames.Heroes.Column.ID + ' integer primary key autoincrement',
                    TableNames.Heroes.Column.NAME + ' text',
                    TableNames.Heroes.Column.AVATAR + ' text',
                    TableNames.Heroes.Column.VIEWS + ' integer'
                ]
            ));
            promises.push(promise);

            //Add some default heroes
            var insertHeroes = squel.insert()
                .into(TableNames.Heroes.Name)
                .set(TableNames.Heroes.Column.NAME)
                .set(TableNames.Heroes.Column.AVATAR)
                .set(TableNames.Heroes.Column.VIEWS)
                .toParam();

            var heroes = [];
            heroes.push(["Avengers","https://i.annihil.us/u/prod/marvel/i/mg/3/a0/537ba3793915b/standard_xlarge.jpg",0]);
            heroes.push(["Iron Man","https://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg",0]);
            heroes.push(["Captain America","https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087/standard_xlarge.jpg",0]);
            heroes.push(["Hulk","https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg",0]);
            heroes.push(["Spider-man","https://i.annihil.us/u/prod/marvel/i/mg/9/30/538cd33e15ab7/standard_xlarge.jpg",0]);
            heroes.push(["Thor","http://x.annihil.us/u/prod/marvel/i/mg/c/c0/537bc5db7c77d/standard_xlarge.jpg",0]);
            heroes.push(["X-Men","https://i.annihil.us/u/prod/marvel/i/mg/8/03/510c08f345938/standard_xlarge.jpg",0]);
            heroes.push(["Fantastic four","https://i.annihil.us/u/prod/marvel/i/mg/9/60/50febc4f55525/standard_xlarge.jpg",0]);
            heroes.push(["Black Widow","https://i.annihil.us/u/prod/marvel/i/mg/9/10/537ba3f27a6e0/standard_xlarge.jpg",0]);
            heroes.push(["SHEILD","https://i.annihil.us/u/prod/marvel/i/mg/6/20/51097abb8e306/standard_xlarge.jpg",0]);


            promise = DataStore.insertCollection(insertHeroes.text,heroes);
            promises.push(promise);

            promise = DataStore.ExecuteQuery(createTable(TableNames.Movies.Name,
                    [
                        TableNames.Movies.Column.key + ' text',
                        TableNames.Movies.Column.value + ' text'
                    ]
                )
            );
            promises.push(promise);

            promise = DataStore.ExecuteQuery(createTable(TableNames.Images.Name,
                    [
                        TableNames.Images.Column.key + " text primary key",
                        TableNames.Images.Column.value + " text"

                    ]
                )
            );
            promises.push(promise);

            return $q.all(promises);
        }

        //endregion

        return _this;
    }

    function createTable(tableName, columns) {

        var query = "CREATE TABLE IF NOT EXISTS " + tableName + "(";

        _.forEach(columns, function (item, index) {
            if (index !== 0) {
                query += ",";
            }
            query += item;

        });

        query += ");";
        return query;

    }
})();