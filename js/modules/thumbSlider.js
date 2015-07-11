/*globals alert: true, window:true, navigator:true*/
var $ = require('jquery'),
  Hammer = require('./../node_modules/hammerjs/hammer'),
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  thumbSlider = {};


if (!Function.prototype.bind) {
  Function.prototype.bind = function (scope) {
    var fn = this;
    return function () {
      return fn.apply(scope);
    };
  };
}

thumbSlider.create = function (slider, options) {
  this.options = options || {};
  this.options.totalThumbs = this.options.totalThumbs || 1;
  this.options.controls = this.options.controls || false;
  this.options.autoSlide = this.options.autoSlide || false;
  this.options.timer = this.options.timer || 5;
  this.options.fullScreen = this.options.fullScreen || false;
  this.options.sliderEl = this.options.sliderEl || 'ul';
  this.options.arrowLeftClass = this.options.arrowLeftClass || '';
  this.options.arrowRightClass = this.options.arrowRightClass || '';
  this.options.sliderListEl = this.options.sliderListEl || 'li';
  this.options.margin = this.options.margin || 0;
  this.$slider = $(slider);
  if (!this.$slider.length) {
    return;
  }
  this.$items = this.$slider.find(this.options.sliderListEl);
  this.$gal = this.$slider.find(this.options.sliderEl);
  this.total = this.$items.length;
  this.offset = 0;
  this.curPos = 0;
  this.direction = 1;
  this.curX = 0;
  this.curPanel = 0;
  this.oldPos = 0;
  this.totalSlides = 0;
  this.maskWidth = !this.options.fullScreen ? this.$slider.innerWidth() : $(window).width();
  this.leftPos = this.$slider.offset().left;
  this.hammer = new Hammer(this.$slider.find(this.options.sliderEl)[0]);
  this.resize();
  this.listenToWindowResize();
  this.$items.each(function () {
    var imgURL = $(this).find('img').attr('src'),
      el = $(this),
      thumb = $(this).find('.thumb');
    el = thumb.length ? thumb : el;
    el.css({ backgroundImage: 'url(' + imgURL + ')'});
  });
  if (this.options.autoSlide) {
    this.autoSlide();
  }
};

thumbSlider.create.prototype = {
  resize: function () {
    var totalWidth = 0;
    this.maskWidth = this.$slider.innerWidth();

    this.$items.width((this.maskWidth / this.options.totalThumbs) - this.options.margin);
    totalWidth = this.total * (this.$items.innerWidth() + this.options.margin);

    this.$gal.width(totalWidth + this.$items.innerWidth());
    this.totalSlides = Math.ceil(totalWidth / this.maskWidth);

    if (this.options.controls) {
      this.createControls();
    }
    if (this.onResize) {
      this.onResize(this.maskWidth, totalWidth);
    }
    this.listenToPaning();
  },

  setTotalThumbs: function (thumbs) {
    this.options.totalThumbs = thumbs || this.options.totalThumbs;
  },

  createControls: function () {
    var bullets = [], i = 0;

    if (this.$items.length < 2) {
      return;
    }

    if (this.$slider.find('.thumbSliderBullets__list').length) {
      return;
    }
    if (this.$slider.find('.thumbSlider').length) {
      return;
    }

    this.$slider.append([
      '<span class="thumbSlider next next__btn ' + this.options.arrowRightClass + '"></span>',
      '<span class="thumbSlider prev prev__btn ' + this.options.arrowLeftClass + '"></span>'
    ].join(''));
    bullets.push('<ol class="thumbSliderBullets__list">');
    while (i < this.totalSlides) {
      bullets.push('<li></li>');
      i += 1;
    }
    bullets.push('</ol>');
    this.$slider.append(bullets.join(''));
    this.$bullControls = this.$slider.find('.thumbSliderBullets__list');
    this.$bullControls.find('li').eq(0).addClass('current');
    this.$controls = this.$slider.find('.thumbSlider');
    this.$slider.find('.prev__btn').hide();

  },

  listenToWindowResize: function () {
    $(window).on('resize', this.resize.bind(this));
  },

  movePanel: function (e) {
    this.pos = (this.leftPos - e.center.x) * -1;
    if (this.pos < 0) {
      this.pos = 0;
    }
    if (this.pos >= this.maskWidth) {
      this.pos = this.maskWidth;
    }
    if (this.oldPos > this.pos) {
      this.direction = -1;
    } else {
      this.direction = 1;
    }

    this.curX = this.pos - this.offset;

    this.$gal.css({
      transform: 'translate3d(' + this.curX + 'px,0,0)',
      transition: 'none'
    });

    this.oldPos = this.pos;
  },

  autoSlide: function () {
    this.timer = setInterval(function () {
      this.onTimer = true;
      this.slideTo(false);
    }.bind(this), this.options.timer * 1000);
  },

  animeSlide: function () {
    this.curPos = ((this.curPanel * this.maskWidth) * -1);
    this.$gal.css({
      transform: 'translate3d(' + this.curPos + 'px,0,0)',
      transition: 'transform 1s',
      '-webkit-transition': '-webkit-transform 1s'
    });
  },

  controlPanel: function (e) {
    clearInterval(this.timer);
    this.onTimer = false;
    this.slideTo($(e.currentTarget).hasClass('prev'));
  },

  gotoPanel: function (e) {
    var index = $(e.currentTarget).index();
    clearInterval(this.timer);
    this.onTimer = false;
    this.curPanel = index - 1;
    this.slideTo(false);
  },

  slideTo: function (type) {

    if (type) {
      this.curPanel = this.curPanel <= 0 ? (this.onTimer ? this.totalSlides - 1 : 0) : this.curPanel - 1;
    } else {
      this.curPanel = this.curPanel >= this.totalSlides - 1 ? (this.onTimer ? 0 : this.totalSlides - 1) : this.curPanel + 1;
    }

    this.$controls.show();
    if (this.curPanel === 0) {
      this.$slider.find('.prev__btn').hide();
    }
    if (this.curPanel === this.totalSlides - 1) {
      this.$slider.find('.next__btn').hide();
    }
    this.$bullControls.find('li').removeClass('current');
    this.$bullControls.find('li').eq(this.curPanel).addClass('current');
    this.animeSlide();
  },

  startMoving: function (e) {
    this.offset = isMobile ? (this.leftPos - e.center.x) * -1 : (this.leftPos - e.clientX)  * -1;
    this.offset = this.offset - this.curPos;
  },

  stopMoving: function () {
    clearInterval(this.timer);
    this.onTimer = false;
    if (Math.abs(this.curX - this.curPos) > 100) {
      this.slideTo(this.curX > this.curPos);
    }
  },

  listenToPaning: function () {
    var self = this;
    if (this.$items.length < 2) {
      return;
    }
    if (this.$controls.length) {
      this.$controls.off('click');
      this.$bullControls.find('li').off('click');
      this.$controls.on('click', function (e) {
        self.controlPanel(e);
      });
      this.$bullControls.find('li').on('click', function (e) {
        self.gotoPanel(e);
      });
    }
    if (isMobile) {
      this.hammer.off('panmove');
      this.hammer.on('panmove', function (e) {
        this.movePanel(e);
      });
      this.hammer.off('panend');
      this.hammer.off('panstart');
      this.hammer.on('panstart', function (e) {
        this.startMoving(e);
      });
      this.hammer.on('panend', function (e) {
        this.stopMoving(e);
      });
    } else {
      this.$slider.find(this.options.sliderEl)[0].removeEventListener('mouseup', function (e) {
        self.stopMoving(e);
      });
      this.$slider.find(this.options.sliderEl)[0].removeEventListener('mousedown', function (e) {
        self.startMoving(e);
      });
      this.$slider.find(this.options.sliderEl)[0].addEventListener('mousedown', function (e) {
        self.startMoving(e);
      });
      this.$slider.find(this.options.sliderEl)[0].addEventListener('mouseup', function (e) {
        self.stopMoving(e);
      });

    }
  }
};

module.exports = thumbSlider;
