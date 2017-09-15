(function() {
  'use strict';
  Polymer({
    is: 'dm-login',
    properties: {
    },
    doLogin: function(userData) {
      this.async(() =>
        this.fire('login-timeout'),
      10000);
      if (userData && userData.userId) {
        if (userData.userId === 'admin') {
          let user = {
            firstName: userData.userId,
            avatar: {
              url: 'https://http.cat/404'
            }
          };
          this.async(() =>
            this.fire('login-success', user),
          1500);
        } else {
          this.async(() =>
            this.fire('login-error'),
          1500);
        }
      }
    }
  });
}());
