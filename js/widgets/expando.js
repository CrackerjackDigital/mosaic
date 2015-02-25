(function($) {
	// Toggle open and closed classes when expando clicked. Expando element should start with one or the other
	// so they will alternate. Having both makes css transitions easier to implement.

	$('.expando').on('click', function(ev) {
		$(this).toggleClass('closed').toggleClass('open');

		// need to cancel bubble incase this expando is inside another one.
		ev.stopImmediatePropagation();
	});
})(jQuery);