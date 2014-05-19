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
    $scope.person = person;

    $scope.certificate = {
      name:     person.certificateName || person.name,
      category: person.category,
      hours:    36
    };

    $scope.doCertificate = function() {
      var locator = { xid: person.xid };
      People.setCertificateName(locator, { certificateName: $scope.certificate.name }).$promise.then(function() {
        return People.issueCertificate(locator).$promise;
      }).then(function(result) {
        console.log(result);
        console.log('it seems like this worked!');
      }).fail(function(err) {
        console.log(err);
      });
    };

    focus('certificateName');
  });
