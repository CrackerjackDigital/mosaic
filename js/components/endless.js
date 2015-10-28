Mosaic.prototype.endless = function(options) {
    // if ias and masonry extensions registered then link them via pub/sub
    var defaults = {};

    this.config.endless = $.extend(true, {}, this.config.endless || {}, defaults, options);

    this.log('Initialising Mosaic.ias extension', this);

    if (this.ias && this.masonry) {
        this.sub.ui(
            function(items) {
                jQuery(items).css({opacity: 0});
            }.bind(this),

            this.config.ias.topics.start
        );

        this.sub.ui(
            function(items) {
                this.log('Appending', items);
                this.appendItems(items);
            }.bind(this),

            this.config.ias.topics.end
        );
    }
};
