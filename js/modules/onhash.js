var HASH = {};
HASH.options = {
    hashTimer: 0.1
};

HASH.start = function() {
    var self = this;
    this.timer = setInterval(function() {
        self.testHash();
    }, this.options.hashTimer * 1000);
};

HASH.testHash = function() {
    this.currentHash = window.location.hash, hash = this.currentHash.split('#')[1];
    clearInterval(this.timer);
    if (this.currentHash !== this.oldHash) {
        if (typeof(this.hashed) !== 'undefined') {
            if (typeof(hash) !== 'undefined') {
                this.hashed(hash);
            }
        }
        this.oldHash = this.currentHash;
    }
    this.start();
};


module.exports = HASH;