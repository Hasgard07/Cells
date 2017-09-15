(function(window) {
  'use strict';
  window.AppEnvironments = {
    'selected': {
      'app': 'default',
      'environment': 'local'
    },
    'availableApps': {
      'default': {
        'local': {
          'composerEndpoint': './composerMocks/',
          'coreCache': true
        }
      }
    }
  };
}(window));