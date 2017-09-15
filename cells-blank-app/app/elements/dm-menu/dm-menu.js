(function() {
  'use strict';
  Polymer({
    is: 'dm-menu',
    properties: {
      menu: {
        type: Array,
        notify: true
      },
      user: {
        type: Object,
        notify: true
      }
    },
    getMenu: function() {
      this.set('user', {
        firstName: 'Admin',
        avatar: {
          url: 'https://http.cat/404'
        }
      });
      this.set('menu', [{
        label: 'Notificaciones',
        icon: 'coronita:alarm',
        link: '#notifications',
        action: 'notifications-event',
        count: 10,
        show: true
      }, {
        label: 'Asistencia',
        icon: 'coronita:communication',
        link: '#help',
        show: false
      }, {
        label: 'Productos para mí',
        icon: 'coronita:supermarket',
        link: '#products',
        count: 2,
        show: false
      }, {
        label: 'Ajustes',
        icon: 'coronita:settings',
        action: 'settings-event',
        show: true
      }, {
        label: 'Ajustes',
        icon: 'coronita:settings',
        action: 'settings-event',
        show: true
      }]);
    }
  });
}());
