(function() {
  'use strict';
  Polymer({
    is: 'dm-title',
    properties: {
      title: {
        type: String,
        notify: true
      }
    },
    getTitle: function() {
      this.async(() =>
        this.set('title', 'Title from DM'),
      1500);
    }
  });
}());
