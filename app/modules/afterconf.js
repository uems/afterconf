'use strict';

angular.module('templates', []);

angular
  .module('ac', [
    'templates',
    'ac.services.auth',
    'ac.controllers.nav',
    'ac.controllers.auth',
    'ac.controllers.home',
    'ac.controllers.certificate',
  ])
  .controller('AfterConfCtrl', function($rootScope, $scope, $state, Session) {
    $scope.$watchCollection(Session.current,
      function(newValue) { $scope.session = newValue; }
    );

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (Session.isLogged()) { return; }
      if (toState.name.match(/^auth/)) { return; }
      event.preventDefault();
      $state.go('auth');
    });

    $scope.logout = function() {
      Session.logout();
    };
  })
 .config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });
