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
        constructor($scope, $http) {
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

            function getParameterByName(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            }

            $scope.client_key = getParameterByName('client_key');
            $scope.client_secret = getParameterByName('client_secret');
            $scope.oauth_token = getParameterByName('oauth_token');
            $scope.oauth_token_secret = getParameterByName('oauth_token_secret');


            $scope.getToken = function () {
                var newurl = location.origin + location.pathname + '#!/?client_key=' + $scope.client_key + "&client_secret=" + $scope.client_secret;
                window.history.pushState({path: newurl}, '', newurl);

                let nonceObj = new jsSHA(Math.round((new Date()).getTime() / 1000.0), "TEXT");
                let endpoint = "https://api.tripit.com/oauth/request_token";
                let requiredParameters = {
                    oauth_consumer_key: $scope.client_key,
                    oauth_nonce: nonceObj.getHash("SHA-1", "HEX"),
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                    oauth_version: "1.0"
                };

                let base_signature_string = "POST&" + encodeURIComponent(endpoint) + "&";
                var requiredParameterKeys = Object.keys(requiredParameters);
                for (var i = 0; i < requiredParameterKeys.length; i++) {
                    if (i == requiredParameterKeys.length - 1) {
                        base_signature_string += encodeURIComponent(requiredParameterKeys[i] + "=" + requiredParameters[requiredParameterKeys[i]]);
                    } else {
                        base_signature_string += encodeURIComponent(requiredParameterKeys[i] + "=" + requiredParameters[requiredParameterKeys[i]] + "&");
                    }
                }

                let shaObj = new jsSHA(base_signature_string, "TEXT");
                let hmac_sha1 = encodeURIComponent(shaObj.getHMAC($scope.client_secret + "&", "TEXT", "SHA-1", "B64"));

                let headers = {
                    "Authorization": 'OAuth oauth_consumer_key="' + requiredParameters.oauth_consumer_key + '",oauth_timestamp="' + requiredParameters.oauth_timestamp + '",oauth_signature_method="HMAC-SHA1",oauth_nonce="' + requiredParameters.oauth_nonce + '",oauth_version="1.0",oauth_signature="' + hmac_sha1 + '"'
                };
                console.log(headers);

                $http({
                    method: "POST",
                    url: "https://cors-anywhere.herokuapp.com/" + endpoint,
                    withCredentials: false,
                    headers: headers
                }).then(function (response) {
                    location.href = "https://www.tripit.com/oauth/authorize?" + response.data + "&oauth_callback=" + encodeURIComponent(location.href + "&oauth_token_secret=" + form2Json(response.data)['oauth_token_secret']);
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
