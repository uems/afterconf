/* global _ */
'use strict';

angular
  .module('ac.controllers.auth', [
    'ac',
    'ui.keypress',
    'ac.services.auth',
    'ac.directives.focusOn'
  ])
  .controller('AuthCtrl', function($state) {
    $state.go('auth.login');
  })
  .controller('AuthLoginCtrl', function($scope, $state, focus, Auth) {
    focus('email');

    $scope.focusPassword = _.partial(focus, 'password');
    $scope.focusEmail    = _.partial(focus, 'email');

    $scope.doLogin = function() {
      Auth.fromLogin($scope.credential).then(function() {
        $state.go('home');
      });
    };
  })
  .controller('AuthHashCtrl', function($scope, $state, $stateParams, Auth) {
    Auth.fromHash($stateParams.hash).then(function() {
      $state.go('home');
    });
  })
  .config(function($stateProvider) {
    $stateProvider
      .state('auth', {
        url: '^/auth/',
        views: {
          header: {                          templateUrl: 'modules/views/nav.html' },
          main:   { controller: 'AuthCtrl',  template: '<ui-view name="auth" />' }
        }
      })
      .state('auth.login', {
        url: '^/auth/login',
        views: {
          auth: { controller: 'AuthLoginCtrl', templateUrl: 'modules/views/login.html' }
        }
      })
      .state('auth.hash', {
        url: '^/auth/hash/:hash',
        views: {
          auth: { controller: 'AuthHashCtrl',  template: '<h1>Hash</h1>' }
        }
      });
  });

