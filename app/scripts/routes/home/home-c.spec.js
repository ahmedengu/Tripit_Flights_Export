'use strict';

describe('Controller: HomeCtrl', () => {

    // load the controller's module
    beforeEach(module('tripitflightsexport'));

    let HomeCtrl;
    let scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(($controller, $rootScope) => {
        scope = $rootScope.$new();
        HomeCtrl = $controller('HomeCtrl', {
             $scope: scope
             // place mocked dependencies here
        });
    }));

    it('should ...', () => {
         expect(true).toBe(true);
    });
});