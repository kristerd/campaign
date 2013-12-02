'use strict';

describe('Controller: CampaignviewCtrl', function () {

  // load the controller's module
  beforeEach(module('campaignApp'));

  var CampaignviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CampaignviewCtrl = $controller('CampaignviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
