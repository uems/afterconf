'use strict';

angular
  .module('ac.services.people', [
    'ac',
    'ac.config',
    'ngResource'
  ])
  .factory('LoggedPerson', function(People, Session) {
    var xid = Session.current().scope;
    return People.get({ xid: xid });

  })
  .service('People', function($resource, GatewayHost) {
    var endpoint = GatewayHost + '/people/:xid';
    var actions = {
      'setCertificateName': { method: 'POST', url: endpoint + '/set-certificate-name' },
      'issueCertificate':   { method: 'POST', url: endpoint + '/issue-certificate'    }
    };
    return $resource(endpoint, {}, actions);
  });
