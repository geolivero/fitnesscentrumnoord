var scroller = {},
  $ = require('jquery');

scroller.x = scroller.posX = scroller.offset = 0;

scroller.move = function () {
  var xdist = scroller.x - scroller.center;
  scroller.posX += xdist / 4;

  scroller.$el.scrollLeft(scroller.posX);
};

scroller.over = function (e) {
  scroller.timer = setInterval(scroller.move, 50);
};

scroller.out = function () {
  clearInterval(scroller.timer);
};

scroller.moving = function (e) {
  scroller.x = e.clientX;
};

exports.init = function (scrollerEL, placeholderEl, els, p, ev) {
  var padding = p || 50;
  try {
    scroller.$el = $(scrollerEL);
    scroller.$scrolled = scroller.$el.find(placeholderEl);
    scroller.$els = scroller.$scrolled.find(els);
    scroller.$scrolled.width((scroller.$els.width() + padding) * scroller.$els.length);
    if (ev) {
      scroller.$el.mousemove(scroller.moving);
      scroller.$el.mouseenter(scroller.over);
      scroller.$el.mouseleave(scroller.out);
      scroller.center = scroller.$el.width() / 2;
    }
  } catch (e) {
    console.error('Pleace specify a scrolling div, and element to be scrolled');
  }
};