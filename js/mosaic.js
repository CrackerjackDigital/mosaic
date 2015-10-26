var Mosaic = function () {
    this.config = {
        masonry: {

        },
        ias: {
            item: 'li',
            pagination: '.pagination',
            next: 'a.next',
            delay: 1200,
            showSpinner: true
        }
    };
    this.endless = function (selector) {
        var $container = $(selector);

        if ($container.length) {
            $container.each(function () {
                this.imagesLoaded(function () {
                    var msnry = new Masonry(container, this.config.masonry);

                    if ($.ias) {

                        var ias = $.ias(this.config.ias);

                        ias.on('render', function (items) {
                            $(items).css({opacity: 0});
                        });

                        ias.on('rendered', function (items) {
                            msnry.appended(items);
                        });

                        ias.on('next', function() {
                            mosaic.publish()
                        });

                        if (this.config.ias.showSpinner) {
                            ias.extension(new IASSpinnerExtension());
                        }
                    }
                });
            });
        }
    }
};
(function($) {
    console.log("Initialising mosaic");
    window.mosaic = new Mosaic();
    console.log(mosaic);
})(jQuery);
