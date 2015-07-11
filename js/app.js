var Map = require('./modules/Map'),
  Route = require('./modules/onhash'),
  App = {};
  $ = require('jquery');

App.onHash = function (hash) {
  var q = hash.split('/');
  if (q[0] === 'menu') {
    App.$menu.attr('href', '#menu/' + (q[1] === 'add' ? 'remove' : 'add'));
    App.$nav[q[1] + 'Class']('show');
  }
};

$(function () {
  App.$menu = $('header .menu__btn');
  App.$nav = $('header');
  Route.hashed = App.onHash;
  Route.start();

  $('#map').maps({
    lat: 51.931922,
    long: 4.459878,
    marker: true,
    zoom: 14,
    panControl: true,
    zoomControl: true,
    scaleControl: false,
    draggable: true,
    scrollwheel: true,
    icon: '/images/assets/icon_kaart.png'
  });
});