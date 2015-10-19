(function($) {
    var containerSel = 'ul.list-view',
        itemSel = 'li',
        paginationSel = '.pagination',
        nextSel = 'a.next';

    // load masonry if browser doesn't do csscolumns
    if (!Modernizr.csscolumns) {

        var container = document.querySelector(containerSel);
        var msnry = new Masonry( container, {
            // options
            itemSelector: itemSel,
            gutter: 10
        });

        if ($.ias) {

            var ias = $.ias({
                container: containerSel,
                item: itemSel,
                pagination: paginationSel,
                next: nextSel,
                delay: 1200
            });

            ias.on('render', function (items) {
                $(items).css({opacity: 0});
            });

            ias.on('rendered', function (items) {
                msnry.appended(items);
            });

            ias.extension(new IASSpinnerExtension());
        }
    } else {
        if ($.ias) {

            var ias = $.ias({
                container: containerSel,
                item: itemSel,
                pagination: paginationSel,
                next: nextSel,
                delay: 1200
            });

            ias.extension(new IASSpinnerExtension());
        }
    }
})(jQuery);