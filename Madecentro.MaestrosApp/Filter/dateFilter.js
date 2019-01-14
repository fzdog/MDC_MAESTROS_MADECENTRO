/**
 * Created by Johnny IV Young Ospino.
 * email:  asesordeprogramacion@gmail.com
 * github: github.com/johnny4young
 */
(function() {
    'use strict';

    /*

     */
    angular.module('appmadecentro')

    //permite este filtro, poder traducir el html de una variable en el navegador.
    .filter('dateFormatDateWithoutTime', function($filter) {
        return function(input) {

            if (input === null) {
                return "";
            }

            var _date = $filter('date')(new Date(input), 'dd/MM/yyyy');

            return _date.toUpperCase();

        };
    })

    .filter('dateFormatTime', function($filter) {
        return function(input) {
            if (input === null) {
                return "";
            }

            var _date = $filter('date')(new Date(input), 'HH:mm:ss');

            return _date.toUpperCase();

        };
    })

    .filter('dateFormatDate', function($filter) {
        return function(input) {
            if (input === null) {
                return "";
            }

            var _date = $filter('date')(new Date(input),
                'dd/MM/yyyy - hh:mm:ss a');

            return _date.toUpperCase();

        };
    })

    .filter('dateFormatDateWithMoment', function($filter) {
        return function(input) {
            if (input === null) {
                return "";
            }

            var _date = $filter('date')(new Date(input),
                'dd/MM/yyyy - hh:mm:ss a');

            return moment.utc(input).format("DD/MM/YYYY - HH:mm:ss").toUpperCase();

        };
    })

    .filter('customFilter', ['$filter', function($filter) {
        var filterFilter = $filter('filter');
        var standardComparator = function standardComparator(obj, text) {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
        };

        return function customFilter(array, expression) {
            function customComparator(actual, expected) {

                var isBeforeActivated = expected.before;
                var isAfterActivated = expected.after;
                var isLower = expected.lower;
                var isHigher = expected.higher;
                var higherLimit;
                var lowerLimit;
                var itemDate;
                var queryDate;


                if (angular.isObject(expected)) {

                    //date range
                    if (expected.before || expected.after) {
                        try {
                            if (isBeforeActivated) {
                                higherLimit = expected.before;

                                itemDate = new Date(actual);
                                queryDate = new Date(higherLimit);

                                if (itemDate > queryDate) {
                                    return false;
                                }
                            }

                            if (isAfterActivated) {
                                lowerLimit = expected.after;


                                itemDate = new Date(actual);
                                queryDate = new Date(lowerLimit);

                                if (itemDate < queryDate) {
                                    return false;
                                }
                            }

                            return true;
                        } catch (e) {
                            return false;
                        }

                    } else if (isLower || isHigher) {
                        //number range
                        if (isLower) {
                            higherLimit = expected.lower;

                            if (actual > higherLimit) {
                                return false;
                            }
                        }

                        if (isHigher) {
                            lowerLimit = expected.higher;
                            if (actual < lowerLimit) {
                                return false;
                            }
                        }

                        return true;
                    }
                    //etc

                    return true;

                }
                return standardComparator(actual, expected);
            }

            var output = filterFilter(array, expression, customComparator);
            return output;
        };
    }]);


})();
