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
  .controller('AfterConfCtrl', function($rootScope, $scope, $state, Config, Session) {
    $scope.$watchCollection(Session.current,
      function(newValue) { $scope.session = newValue; }
    );

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (Session.isLogged()) { return; }
      if (toState.name.match(/^auth/)) { return; }
      event.preventDefault();
      $state.go('auth');
    });

    $scope.$on('$stateChangeSuccess', function(event, newState) {
      $scope.topState = newState.name.split('.')[0];
      $scope.state    = newState;
    });

    $scope.logout = function() {
      Session.logout();
      $state.go('auth');
    };

    $scope.logged = Session.isLogged();

    $scope.Config = Config;
  })
 .config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });
