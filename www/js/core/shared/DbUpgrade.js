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
                    TableNames.Heroes.Column.AVATAR + ' text'
                ]
            ));
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