'use strict';

angular
  .module('ac.controllers.home', [
    'ui.router',
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '^/',
        views: {
          header: { controller: 'NavCtrl',  templateUrl: 'modules/views/nav.html'    },
          main:   { controller: 'HomeCtrl', templateUrl: 'modules/views/home.html'   }
        }
      });
  })
  .controller('HomeCtrl', function() {
  });
