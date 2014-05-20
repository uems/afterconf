'use strict';

angular
  .module('ac.controllers.nav', [
    'ui.router',
  ])
  .controller('NavCtrl', function($state) {
    $state.go('certificate');
  });
