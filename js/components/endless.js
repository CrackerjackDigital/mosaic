Mosaic.prototype.endless = function(options) {
    // if ias and masonry extensions registered then link them via pub/sub
    var defaults = {
        topics: {
            start: 'endless-start',
            end: 'endless-end'
        }
    }
    this.config.endless = $.extend(true, {}, this.config.endless || {}, defaults, options);

    if (this.ias && this.masonry) {
        this.sub.ui(function(items) {
            jQuery(items).css({opacity: 0});
        }.bind(this), 'ias-start');

        this.sub.ui(function(items) {
            this.masonry.appended(items);
        }.bind(this), 'ias-end');
    }
};
