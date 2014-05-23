'use strict';

angular
  .module('ac.controllers.certificate', [
    'ac.directives.focusOn',
    'ac.services.people',
    'ac.services.auth',
    'angularMoment',
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
  .filter('fixType', function() {
    return function(input) {
      switch (input) {
        case 'speaker':     return 'Palestrante';
        case 'participant': return 'Participante';
        default:            return 'Participante';
      }
    };
  })
  .controller('CertificateCtrl', function($scope, $window, focus, People, person) {
    var locator = { xid: person.xid };
    $scope.person = person;

    $scope.certificate = person.issuableCertificate;

    function success() {
      $window.location.reload();
    }

    function failure(err) {
      $scope.loading = false;
      $scope.error = err;
    }

    $scope.issueCertificate = function() {
      People.issueCertificate(locator, {}, success, failure);
    };

    $scope.setCertificateName = function() {
      $scope.loading = true;
      var data = { certificateName: $scope.certificate.name };
      People.setCertificateName(locator, data, $scope.issueCertificate, failure);
    };

    focus('certificateName');
  });
