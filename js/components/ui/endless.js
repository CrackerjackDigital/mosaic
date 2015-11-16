Mosaic.prototype.endless = function(options, mosaic) {
    // if ias and masonry extensions registered then link them via pub/sub
    var defaults = {};

    this.config.endless = $.extend(true, {}, this.config.endless || {}, defaults, options);

    this.log('Initialising Mosaic.ias extension', this);

    if (this.ias && this.masonry) {
	    // subscribe to start of endless loading on ui channel to hide items
        mosaic.sub.ui(
            function(items) {
                jQuery(items).css({opacity: 0});
            }.bind(this),
            this.config.ias.topics.start
        );

	    // subscribe to end of endless loading on ui channel to fire appended on grid
        mosaic.sub.ui(
            function(items) {
                this.grid.appended(items);
            }.bind(this),
            this.config.ias.topics.end
        );
    }
};
