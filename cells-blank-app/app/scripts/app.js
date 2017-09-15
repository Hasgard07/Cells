(function(document) {
  'use strict';

  var webComponentsSupported = ('registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template'));

  var webappCache = window.applicationCache;

  // Global Polymer settings
  window.Polymer = {
    dom: 'shadow',
    lazyRegister: 'max',
    useNativeCSSProperties: true
  };

  function updateCache() {
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      webappCache.swapCache();
    }
  }

  function removeSplashScreen() {
    var loadEl = document.getElementById('splash');
    loadEl.parentNode.removeChild(loadEl);
    document.body.classList.remove('loading');
  }

  function fireComponentsLoadEvent() {
    var eventComponentsLoaded = document.createEvent('Event');
    eventComponentsLoaded.initEvent('componentsLoaded', true, true);
    document.body.dispatchEvent(eventComponentsLoaded);
  }

  function finishLazyLoading() {
    removeSplashScreen();
    fireComponentsLoadEvent();
  }

  function loadElements() {
    var bundle = document.createElement('link');
    bundle.rel = 'import';
    bundle.href = window.AppConfig.deployEndpoint + window.AppConfig.componentsPath + 'initial-components.html';
    bundle.onload = finishLazyLoading;
    document.head.appendChild(bundle);
  }

  function loadWebComponentPolyfill(cb) {
    var polyfill = document.createElement('script');
    polyfill.onload = cb || null;
    polyfill.src = window.AppConfig.deployEndpoint + window.AppConfig.componentsPath + 'webcomponentsjs/webcomponents-lite.min.js';
    document.head.appendChild(polyfill);
  }

  function announcer(msg) {
    var customEvent = new CustomEvent('aria-announce', {
      detail: msg.detail.page
    });
    document.body.dispatchEvent(customEvent);
  }

  function onAnnounce(msg) {
    document.querySelector('#announcer').innerHTML = msg.detail;
  }

  function loadAppElements() {
    document.removeEventListener('componentsInTemplateLoaded', loadAppElements);
    var nextBundle = document.createElement('link');
    nextBundle.rel = 'import';
    nextBundle.href = window.AppConfig.deployEndpoint + window.AppConfig.componentsPath + 'app-components.html';
    nextBundle.setAttribute('async', '');
    document.body.appendChild(nextBundle);
  }

  function shouldLoadAppElements() {
    return window.AppConfig.initialBundle;
  }

  function detectPlatform(which, orelse) {
    return window.bowser[which] ? which : orelse;
  }

  //TODO: write a proper platform detection
  function getPlatform() {
    return detectPlatform('ios', detectPlatform('android', 'desktop'));
  }

  (function appendCordovaScript() {
    if (getPlatform() !== 'desktop'
      && window.AppConfig.cordovaScript
      && window.AppConfig.cordovaScript.trim().length > 0) {

      var script = document.createElement('script');
      script.setAttribute('src', window.AppConfig.cordovaScript);
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('charset', 'utf-8');

      document.body.appendChild(script);
    }
  }());

  function _renderTemplate(template) {
    return function(tuples) {
      return tuples.reduce(function(tmpl, tuple) {
        return tmpl.replace(tuple[0], tuple[1]);
      }, template);
    };
  }

  function _mocksTemplate() {
    return _renderTemplate(window.AppConfig.composerEndpoint + '{page}.json');
  }

  function _endpointTemplate() {
    return _renderTemplate(
      _renderTemplate(window.AppConfig.composerEndpoint)([
        [/{appId}/, window.AppConfig.appId],
        [/{platform}/, getPlatform()]]));
  }

  function isLocalComposer() {
    return window.AppConfig.composerEndpoint.indexOf('http') !== 0;
  }

  var _renderComposerEndpoint = isLocalComposer() ? _mocksTemplate() : _endpointTemplate();

  function generateRequestHeaders() {
    var composerHeader = {};
    if (window.AppConfig.composerHeaderKey && window.AppConfig.composerHeaderValue) {
      composerHeader[window.AppConfig.composerHeaderKey] = window.AppConfig.composerHeaderValue;
    }
    return composerHeader;
  }

  function startCore() {
    window.removeEventListener('componentsLoaded', startCore);
    var bridge = new window.CellsPolymerBridge({
      mainNode: 'app__content',
      debug: window.AppConfig.debug,
      cache: window.AppConfig.coreCache,
      binding: 'ui', //'currentview',
      componentsPath: window.AppConfig.componentsPath,
      prplLevel: window.AppConfig.prplLevel,
      generateRequestUrl: function generateRequestUrl(page) {
        return _renderComposerEndpoint([ [/{page}/, page] ]);
      },
      headers: generateRequestHeaders(),
      routes: {
        'login': '/',
        'dashboard': '/dashboard',
        'detail': '/detail/:product-id'
      },
      onRender: function onrender(template) {
        if (!template.parentNode) {
          document.getElementById(this.mainNode).appendChild(template);
          if (shouldLoadAppElements()) {
            var eventComponentsLoaded = document.createEvent('Event');
            eventComponentsLoaded.initEvent('componentsInTemplateLoaded', true, true);
            document.body.dispatchEvent(eventComponentsLoaded);
          }
        }
      }
    });
    document.getElementById('app__content').addEventListener('nav-request', function(e) {
      announcer(e.detail);
    });
  }

  webappCache.addEventListener('updateready', updateCache, false);

  window.addEventListener('componentsLoaded', startCore);

  document.body.addEventListener('aria-announce', onAnnounce);
  if (shouldLoadAppElements()) {
    document.body.addEventListener('componentsInTemplateLoaded', loadAppElements);
  }

  if (webComponentsSupported) {
    loadElements();
  } else {
    loadWebComponentPolyfill(loadElements);
  }

}(document));
