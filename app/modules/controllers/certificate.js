'use strict';

angular
  .module('ac.controllers.certificate', [
    'ac.directives.focusOn',
    'ac.services.people',
    'ac.services.auth',
    'ui.router',
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('certificate', {
        url: '^/certificate',
        resolve: {
          person: function(LoggedPerson) { return LoggedPerson.$promise; }
        },
        views: {
          header: { controller: 'NavCtrl',         templateUrl: 'modules/views/nav.html'         },
          main:   { controller: 'CertificateCtrl', templateUrl: 'modules/views/certificate.html' }
        }
      });
  })
  .controller('CertificateCtrl', function($scope, focus, People, person) {
    var locator = { xid: person.xid };
    $scope.person = person;

    $scope.certificate = {
      name:     person.certificateName || person.name,
      category: person.category,
      hours:    36
    };

    function success(result) {
      console.log(result);
    }

    function failure(err) {
      $scope.error = err;
    }

    $scope.issueCertificate = function() {
      People.issueCertificate(locator, {}, success, failure);
    };

    $scope.setCertificateName = function() {
      var data = { certificateName: $scope.certificate.name };
      People.setCertificateName(locator, data, $scope.issueCertificate, failure);
    };

    focus('certificateName');
  });
