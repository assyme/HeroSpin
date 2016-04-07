(function () {
    'use strict';

    angular.module('starter')
        .factory('image.api',
        [
            '$q',
            '$cordovaFileTransfer',
            'GlobalSettings',
            imageCommunicator
        ]
    );

    function imageCommunicator($q,
                               $cordovaFileTransfer,
                               GlobalSettings) {

        var _this = {
            getImage: getImage,
            downloadImage: downloadImage
        };

        function getImage(imageObj) {

            var defer = $q.defer();

            function toDataUrl(url, callback, outputFormat) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function () {
                    var canvas = document.createElement('CANVAS');
                    var ctx = canvas.getContext('2d');
                    var dataURL;
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);
                    dataURL = canvas.toDataURL(outputFormat);
                    callback(dataURL);
                    canvas = null;
                };
                img.src = url;
            }

            toDataUrl(imageObj, function (base64) {
                return defer.resolve(base64);
            });

            return defer.promise;
        }

        function downloadImage(imageObj) {

            if (!window.cordova) {
                // for browsers, use traditional base64 image rendering.
                return _this.getImage(imageObj);
            }


            var uri = imageObj;
            var fileNameIndex = imageObj.lastIndexOf("/") + 1;
            var filename = imageObj.substr(fileNameIndex);
            var targetPath = GlobalSettings.APP_DATA_PATH + filename;
            var headers = {};

            return $cordovaFileTransfer.download(uri, targetPath, {headers: headers}, true).then(function (result) {
                return $q.resolve(filename);
            }, function (error) {
                return $q.reject(error);
            });

        }

        return _this;
    }
})();
