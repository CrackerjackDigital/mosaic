/**
 * Apply masonry to containerElement using infinite-ajax-scroll if defined ($.ias exists)
 * @param options
 */
Mosaic.prototype.masonry = function(options) {
    var defaults = {
            itemSelector: 'li',
            gutter: 10
        },
        mason,
        element;

    this.config.masonry = jQuery.extend({}, this.config.masonry || {}, defaults, options);

    element = document.querySelector(this.config.masonry.container);

    if (Masonry && element) {
        this.log('Initialising Mosaic.ias extension', this);

        mason = new Masonry(element, this.config.masonry);

        // proxy through appended to inner mason
        this.appended = function(items) {
            mason.appended(items);
        }

    } else {
        this.appended = function() {
            this.log('Masonry not loaded');
        };

        this.log("Can't initialise Masonry, library not loaded or no element found");
    }
};



