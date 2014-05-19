'use strict';

angular
  .module('ac.services.auth', [
    'ac',
    'ac.config',
    'ui.router',
    'ngResource',
    'http-auth-interceptor'
  ])
  .factory('authTokenInterceptor', function($window, Session) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer '+ Session.current().token;
        return config;
      }
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authTokenInterceptor');
  })
  .service('Session', function($window) {
    var self = {};

    self.current = function() {
      return {
        token:  $window.sessionStorage.token  || null,
        grants: $window.sessionStorage.grants || null,
        scope:  $window.sessionStorage.scope  || null
      };
    };

    self.setCurrent = function(token, grants, scope) {
      $window.sessionStorage.setItem('token',  token);
      $window.sessionStorage.setItem('grants', grants);
      $window.sessionStorage.setItem('scope',  scope);
      return self.current();
    };

    self.isLogged = function() {
      return !!$window.sessionStorage.token;
    };

    self.logout = function() {
      $window.sessionStorage.removeItem('token');
      $window.sessionStorage.removeItem('grants');
      $window.sessionStorage.removeItem('scope');
    };

    return self;
  })
  .service('Auth', function($state, $resource, $q, GatewayHost, Session, authService) {
    var self = {};

    var endpoint = GatewayHost + '/token';
    var resource = $resource(endpoint, {}, {
      'fromLogin': { method: 'POST', url: endpoint + '/from-login' },
      'fromHash':  { method: 'POST', url: endpoint + '/from-hash' },
    });

    function success(deferred) {
      return function(result) {
        var session = Session.setCurrent(result.token, result.grants, result.scope);
        authService.loginConfirmed(session);
        deferred.resolve(session);
      };
    }

    function failure(deferred) {
      return function failure(err) {
        authService.loginCancelled();
        self.logout();
        deferred.reject(err);
      };
    }

    self.fromLogin = function(credentials) {
      var deferred = $q.defer();
      resource.fromLogin(credentials, success(deferred), failure(deferred));
      return deferred.promise;
    };
    self.fromHash = function(hash) {
      var deferred = $q.defer();
      resource.fromHash({ hash: hash }, success(deferred), failure(deferred));
      return deferred.promise;
    };

    return self;
  });
