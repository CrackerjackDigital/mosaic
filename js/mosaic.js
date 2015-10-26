var Mosaic = function () {
    window.mosaic = this;

    this.config = {
        listView: 'ul.list-view',
        masonry: {
            itemSelector: 'li',
            gutter: 10
        },
        ias: {
            item: 'li',
            pagination: '.pagination',
            next: 'a.next',
            delay: 1200,
            showSpinner: true
        }
    };
    this.endless = function () {
        var containerElement = document.querySelector(this.config.listView);

        if (containerElement) {
            if (imagesLoaded) {
                console.log('using imagesLoaded component');
                imagesLoaded(
                    containerElement,
                    function() {
                        mosaic.masonry(containerElement)
                    }
                )
            } else {
                console.log('using raw masonry');
                this.masonry(containerElement);
            }
        }
    };
    /**
     * Apply masonry to containerElement using infinite-ajax-scroll if defined ($.ias exists)
     * @param containerElement
     */
    this.masonry = function (containerElement) {
        var msnry = new Masonry(containerElement, this.config.masonry),
            ias = $.ias ? $.ias(this.config.ias) : null;

        if (ias) {

            ias.on('render', function (items) {
                $(items).css({opacity: 0});
            });

            ias.on('rendered', function (items) {
                msnry.appended(items);
            });

            if (this.config.ias.showSpinner) {
                ias.extension(new IASSpinnerExtension());
            }

            // TODO: hook event-bus in
            ias.on('next', function () {
                //                            mosaic.publish()
            });
        }
    }
    this.init = function() {
        console.log("Initialising mosaic");
        // keep ias container in step with main list view
        this.config.ias.container = this.config.listView;
    }
    this.init();
};
(function($) {
    new Mosaic();
})(jQuery);
