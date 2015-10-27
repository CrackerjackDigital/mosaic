Mosaic.prototype.ias = function(options) {
    var defaults = {
        container: options.container,
        item: 'li',
        pagination: '.pagination',
        next: 'a.next',
        delay: 1200,
        showSpinner: true
    };

    if (jQuery.ias && !Mosaic.prototype.ias) {

        this.log('Initialising Mosaic.ias extension');

        if (!this.config.ias) {
            this.config.ias = jQuery.extend({}, defaults, options);
        }
        jQuery.ias(this.config.ias);

        if (this.config.ias.showSpinner) {
            jQuery.ias.extension(new IASSpinnerExtension());
        }

        jQuery.ias.on('render', function(items) {
            this.pub.ui('ias-start', items);
        }.bind(this));

        jQuery.ias.on('rendered', function(items) {
            this.pub.ui('ias-end', items);
        }.bind(this));

        jQuery.ias.on('next', function() {
            this.pub.ui('ias-next');
        }.bind(this));
    }
};