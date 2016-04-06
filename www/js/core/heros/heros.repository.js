;
(function () {
    "use strict";

    angular.module("starter")
        .factory("heroes.repository",
        [
            "$q",
            heroesRepository
        ]
    );

    function heroesRepository($q){


        var _cache = [
            {
                id: 0,
                name: "Storm",
                avatar: "http://x.annihil.us/u/prod/marvel/i/mg/c/c0/537bc5db7c77d/standard_xlarge.jpg"
            },
            {
                id: 1,
                name: "Hulk",
                avatar: "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg"
            },
            {
                id: 2,
                name: "Spider-man",
                avatar: "http://i.annihil.us/u/prod/marvel/i/mg/9/30/538cd33e15ab7/standard_xlarge.jpg"
            },
            {
                id: 3,
                name: "Fantastic four",
                avatar: "http://i.annihil.us/u/prod/marvel/i/mg/9/60/50febc4f55525/standard_xlarge.jpg"
            },
            {
                id: 4,
                name: "Captain America",
                avatar: "http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087/standard_xlarge.jpg"
            }
        ];;

        /**
        * @description: make factory methods exposed
        * */
        var _this = {
            get : get,
            randomHero : randomHero
        };

        /**
        * @description: Gets heroes from the local storage
        * */
        function get(){
            return _cache;
        }

        /**
        * @description: returns a random hero name from the local cache.
         * TODO:// add logic to put weightage on few parameters like
         * 1. Keep count of how many times the user has selected a particular hero.
         * 2. Keep count of how many times he accepted to view a movie of that hero.
        * */
        function randomHero(){
            var randomNumber = _.random(0,_cache.length - 1);
            return _cache[randomNumber].name;
        }

        return _this;
    }
})();