Mosaic.prototype.ias = function(options) {
    var defaults = {
        container: options.container,
        item: 'li',
        pagination: '.pagination',
        next: 'a.next',
        delay: 1200,
        showSpinner: true,
        topics: {
            start: 'ias-start',
            end: 'ias-end',
            next: 'ias-next'
        }
    };

    if ($.ias) {
        this.log('Initialising Mosaic.ias extension', this);

        this.config.ias = $.extend(true, {}, this.config.ias || {}, defaults, options);

        var ias = $.ias(this.config.ias);

        if (this.config.ias.showSpinner) {
            this.log('Adding spinner ias extension');
            ias.extension(new IASSpinnerExtension());
        }

        ias.on('render', function(items) {
            this.pub.ui(this.config.ias.topics.start, items);
        }.bind(this));

        ias.on('rendered', function(items) {
            this.pub.ui(this.config.ias.topics.end, items);
        }.bind(this));

        ias.on('next', function() {
            this.pub.ui(this.config.ias.topics.next);
        }.bind(this));

    } else {
        this.log("Can't initialise Mosaic.ias, ias library not loaded");
    }
};