/**
 * @ngdoc overview
 * @name tripitflightsexport
 * @description
 * # tripitflightsexport
 *
 * Main module of the application.
 */

(() => {
    'use strict';

    angular
        .module('tripitflightsexport', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ngMaterial',
        'ngFabForm'
  ]);
})();
/**
 * @ngdoc overview
 * @name tripitflightsexport.routes
 * @description
 * # tripitflightsexport.routes
 *
 * Routes module. All app states are defined here.
 */

(() => {
    'use strict';

    angular
        .module('tripitflightsexport')
        .config(routerHelperProvider);

    /* @ngInject */
    function routerHelperProvider($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeCtrl',
                controllerAs: 'vm',
                templateUrl: 'scripts/routes/home/home-c.html'
            })
            /* STATES-NEEDLE - DO NOT REMOVE THIS */;
    }
})();

/**
 * @ngdoc function
 * @name tripitflightsexport.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the tripitflightsexport
 */

(() => {
    'use strict';

    class HomeCtrl {
        /* @ngInject */
        constructor($scope, $http, $location, $mdDialog) {
            function form2Json(str) {
                "use strict";
                var obj, i, pt, keys, j, ev;
                if (typeof form2Json.br !== 'function') {
                    form2Json.br = function (repl) {
                        if (repl.indexOf(']') !== -1) {
                            return repl.replace(/\](.+?)(,|$)/g, function ($1, $2, $3) {
                                return form2Json.br($2 + '}' + $3);
                            });
                        }
                        return repl;
                    };
                }
                str = '{"' + (str.indexOf('%') !== -1 ? decodeURI(str) : str) + '"}';
                obj = str.replace(/\=/g, '":"').replace(/&/g, '","').replace(/\[/g, '":{"');
                obj = JSON.parse(obj.replace(/\](.+?)(,|$)/g, function ($1, $2, $3) {
                    return form2Json.br($2 + '}' + $3);
                }));
                pt = ('&' + str).replace(/(\[|\]|\=)/g, '"$1"').replace(/\]"+/g, ']').replace(/&([^\[\=]+?)(\[|\=)/g, '"&["$1]$2');
                pt = (pt + '"').replace(/^"&/, '').split('&');
                for (i = 0; i < pt.length; i++) {
                    ev = obj;
                    keys = pt[i].match(/(?!:(\["))([^"]+?)(?=("\]))/g);
                    for (j = 0; j < keys.length; j++) {
                        if (!ev.hasOwnProperty(keys[j])) {
                            if (keys.length > (j + 1)) {
                                ev[keys[j]] = {};
                            }
                            else {
                                ev[keys[j]] = pt[i].split('=')[1].replace(/"/g, '');
                                break;
                            }
                        }
                        ev = ev[keys[j]];
                    }
                }
                return obj;
            }

            function getAuthString($scope, httpMethod, url, requestToken) {
                if (requestToken) {
                    let parameters = {
                        oauth_consumer_key: $scope.client_key,
                        oauth_nonce: Math.round((new Date()).getTime() / 1000.0) + Math.random().toString(36).substring(10),
                        oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                        oauth_signature_method: 'HMAC-SHA1',
                        oauth_version: '1.0',
                    };
                    let consumerSecret = $scope.client_secret;
                    var oauth_signature = oauthSignature.generate(
                        httpMethod,
                        url,
                        parameters,
                        consumerSecret);


                    return {
                        'Authorization': "OAuth "
                        + 'oauth_consumer_key="' + parameters.oauth_consumer_key + '",'
                        + 'oauth_signature_method="' + parameters.oauth_signature_method + '",'
                        + 'oauth_timestamp="' + parameters.oauth_timestamp + '",'
                        + 'oauth_nonce="' + parameters.oauth_nonce + '",'
                        + 'oauth_version="' + parameters.oauth_version + '",'
                        + 'oauth_signature="' + oauth_signature + '"',
                        "origin": location.origin
                    }
                } else {
                    let parameters = {
                        oauth_consumer_key: $scope.client_key,
                        oauth_token: $scope.oauth_token,
                        oauth_nonce: Math.round((new Date()).getTime() / 1000.0) + Math.random().toString(36).substring(10),
                        oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                        oauth_signature_method: 'HMAC-SHA1',
                        oauth_version: '1.0',
                    };
                    let consumerSecret = $scope.client_secret;
                    let tokenSecret = $scope.oauth_token_secret;
                    var oauth_signature = oauthSignature.generate(
                        httpMethod,
                        url,
                        parameters,
                        consumerSecret,
                        tokenSecret);


                    return {
                        'Authorization': "OAuth "
                        + 'oauth_consumer_key="' + parameters.oauth_consumer_key + '",'
                        + 'oauth_token="' + parameters.oauth_token + '",'
                        + 'oauth_signature_method="' + parameters.oauth_signature_method + '",'
                        + 'oauth_timestamp="' + parameters.oauth_timestamp + '",'
                        + 'oauth_nonce="' + parameters.oauth_nonce + '",'
                        + 'oauth_version="' + parameters.oauth_version + '",'
                        + 'oauth_signature="' + oauth_signature + '"',
                        "origin": location.origin
                    }
                }
            }

            function getParameterByName(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            }

            function queryList() {
                let httpMethod = 'GET';
                let url = 'https://api.tripit.com/v1/list/trip/traveler/true/past/true/format/json/page_size/500/include_objects/true';

                $http({
                    method: httpMethod,
                    url: "https://cors-anywhere.herokuapp.com/" + url,
                    withCredentials: false,
                    headers: getAuthString($scope, httpMethod, url, false),
                }).then(function (response) {
                    $scope.listTripTraveler = response.data
                }).catch(function (reason) {
                    console.log(reason);
                    if (reason.data.Error.description) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error')
                                .textContent(reason.data.Error.description)
                                .ok('Got it!')
                        );
                    }
                });
            }

            $scope.client_key = getParameterByName('client_key');
            $scope.client_secret = getParameterByName('client_secret');
            $scope.oauth_token = getParameterByName('oauth_token');
            $scope.oauth_token_secret = getParameterByName('oauth_token_secret');


            if ($scope.oauth_token) {
                if (getParameterByName('request_token')) {
                    let httpMethod = 'POST';
                    let url = 'https://api.tripit.com/oauth/access_token';

                    $http({
                        method: httpMethod,
                        url: "https://cors-anywhere.herokuapp.com/" + url,
                        withCredentials: false,
                        headers: getAuthString($scope, httpMethod, url, false),
                    }).then(function (response) {
                        $scope.oauth_token = form2Json(response.data)['oauth_token'];
                        $scope.oauth_token_secret = form2Json(response.data)['oauth_token_secret'];
                        $location
                            .search({
                                'oauth_token': $scope.oauth_token,
                                'oauth_token_secret': $scope.oauth_token_secret,
                                'client_key': $scope.client_key,
                                'client_secret': $scope.client_secret,
                            });

                        queryList();
                    }).catch(function (reason) {
                        console.log(reason);
                        if (reason.data.Error.description) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Error')
                                    .textContent(reason.data.Error.description)
                                    .ok('Got it!')
                            );
                        }
                    });
                } else {
                    queryList();
                }
            } else {
                $scope.loading = false;
            }
            $scope.getToken = function () {
                $scope.loading = true;

                let url = "https://api.tripit.com/oauth/request_token";
                $http({
                    method: "POST",
                    url: "https://cors-anywhere.herokuapp.com/" + url,
                    withCredentials: false,
                    headers: getAuthString($scope, "POST", url, true),
                }).then(function (response) {
                    $location
                        .search({
                            'oauth_token': form2Json(response.data)['oauth_token'],
                            'oauth_token_secret': form2Json(response.data)['oauth_token_secret'],
                            'client_key': $scope.client_key,
                            'client_secret': $scope.client_secret,
                            'request_token': 1,
                        });
                    setTimeout(function () {
                        location.href = "https://www.tripit.com/oauth/authorize?" + response.data + "&oauth_callback=" + encodeURIComponent(location.href);
                    }, 1000);
                    $scope.loading = false;
                });
            }
        }
    }

    angular
        .module('tripitflightsexport')
        .controller('HomeCtrl', HomeCtrl);

    // hacky fix for ff
    HomeCtrl.$$ngIsClass = true;

})();
