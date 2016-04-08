;
(function () {
    "use strict";

    angular.module('starter')
        .run(
        [
            "$ionicPlatform",
            "GlobalSettings",
            runIonic
        ]
    );

    /**
     * @description: Main entry to the ionic app
     * */
    function runIonic($ionicPlatform,
                      GlobalSettings) {

        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            //Set prefix/file location path for images and other resources.
            if (window.cordova) {
                GlobalSettings.APP_DATA_PATH = cordova.file.dataDirectory + "agency_data/";
            } else {
                GlobalSettings.APP_DATA_PATH = "";
            }
        });

    }
})();