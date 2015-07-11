
Object.prototype.extends = function (opts) {
  var n;
  for (n in opts) {
    this[n] = opts[n];
  }
};

modules.exports.tip = function (options) {
  var default = {
    el: '',
    content: '',
  }.extends(options);
};