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

    console.log('masonry');
    console.log(this);

    this.appended = function() {
        this.log('Masonry not loaded');
    };

    if (!this.config.masonry) {
        this.config.masonry = jQuery.extend({}, defaults, options);
    }
    element = document.querySelector(this.config.masonry.container);

    if (Masonry && element) {
        console.log('Initialising Mosaic.masonry extension');

        mason = new Masonry(element, this.config.masonry);

        // proxy through appended to inner mason
        this.appended = function(items) {
            mason.appended(items);
        }
    }
};



