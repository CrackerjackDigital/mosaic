/**
 * Packed grid implementation using masonry javascript library.
 *
 * @param options
 * @param mosaic
 */
Mosaic.prototype.masonry = function(options, mosaic) {
    var defaults = {
            itemSelector: 'li',
            gutter: 10
        };

    mosaic.config.masonry = jQuery.extend({}, mosaic.config.masonry || {}, defaults, options);

    if (_.isUndefined(this.ui)) {
        this.ui = {};
    }

    mosaic.ui.grid = new function() {
        var $container = $(mosaic.config.masonry.container);

        if (Masonry && $container) {
            this.log('Initialising Mosaic.grid extension', this);

            $container.masonry(mosaic.config.masonry);

            // append items to end of list
            /**
             * Add items to bottom of list and call appended
             * @param items
             * @api
             */
            this.append = function(items) {
                mosaic.log('appending', items);
                this.appended(items);
            };
            /**
             * Tell masonry some items where appended
             * @param items
             * @api
             */
            this.appended = function(items) {
                $container.masonry('appended', items);
            };
            /**
             * Insert items at head of list and call prepended
             * @param items
             * @api
             */
            this.prepend = function(items) {
                mosaic.log('prepending', items);
                $container.prepend(items);
                this.prepended(items);
            };
            /**
             * Call through to redraw
             * @param items
             * @api
             */
            this.prepended = function(items) {
                this.redraw();
            };
            /**
             * Tell masonry to reload/redraw itself
             * @api
             */
            this.redraw = function() {
                $container.masonry('reloadItems');
                $container.masonry('layout');
            };
        } else {
            this.append = this.prepend = this.appended = this.prepended = this.redraw = function() {
                mosaic.log('Masonry library not loaded or invalid container');
            };
        }
    };

};



