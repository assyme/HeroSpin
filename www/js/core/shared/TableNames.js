(function () {
    "use strict";

    /**
     * @description: Constants for table informations.
     * */
    var TableNames = {
        Heroes: {
            Name : "Heroes",
            Column : {
                ID : 'id',
                NAME : 'name',
                AVATAR : 'avatar',
                VIEWS : 'views'
            }
        },
        Images: {
            Name: "Images",
            Column: {
                key: "key",
                value: "value"
            }
        },
        Movies: {
            Name: "Movies",
            Column: {
                key: 'key',
                value : 'value'
            }
        }
    };

    angular.module("starter")
        .constant("TableNames", TableNames);

})();