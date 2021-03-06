var Map = require('./modules/Map'),
  Route = require('./modules/onhash'),
  App = {};
  $ = require('jquery');

App.fbURL = 'https://graph.facebook.com/215204421868328/posts?access_token=582087205265792|0iL1fWaQ4CkG8WZdyVT5Mh1a-iw';

App.onHash = function (hash) {
  var q = hash.split('/');
  if (q[0] === 'menu') {
    App.$menu.attr('href', '#menu/' + (q[1] === 'add' ? 'remove' : 'add'));
    App.$nav[q[1] + 'Class']('show');
  }
};

App.addFB = function () {
  var el = $('.fbMessages'),
    renderMessages,
    counter = 0;
    fbMessages = [];

  renderMessages = function () {
    setInterval(function () {
      var formatedMessage = fbMessages[counter].message;
      if (formatedMessage) {
        formatedMessage = formatedMessage.length > 100 ? formatedMessage.substring(0, 100) + '...' : formatedMessage;
        el.html(formatedMessage);
      }
      counter = counter > 5 ? 0 : counter + 1;
      
    }, 2000);
  };

  $.getJSON(App.fbURL, function (fb) {
      fbMessages = fb.data;
      renderMessages();
  });
};

App.articleClasses = function () {
  var rows = 0;
  $('.post-list article').each(function (i) {
    if ((rows + 1) % 2 === 1) {
      $(this).addClass('row');
    }
    if ((i + 1) % 3 === 0) {
      rows += 1;
    }
  });
};

App.video = function () {
  var vid = document.getElementById('bgvid');
  if (vid) {
    vid.muted = true;
  }
};

App.crumblePad = function () {
  var list = ['<li><a href="/">home</a><span class="separator"></span></li>'],
    url,
    querys;

  if (!$('.crumle_pad').length) {
    return;
  }

  url = window.location.toString().split('//')[1],
  querys = url.split('/');

  $.each(querys, function (i, data) {
    if (i > 0 && data.length && i < querys.length - 2) {
      list.push('<li><a href="/' + data + '">' + data.replace(/\-/g, ' ') + '</a><span class="separator"></span></li>');
    } else if (i > 0 && data.length && i < querys.length - 1) {
      list.push('<li>' + data.replace(/\-/g, ' ') + '</li>');
    }
  });

  $('.crumle_pad').append([
    '<ul>{{list}}</ul>'
  ].join('').replace('{{list}}', list.join('')));
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
    icon: '/images/assets/icon_kaart@2x.png'
  });

  App.articleClasses();
  App.crumblePad();
  App.video();

  App.addFB();
});