(function($) {
	// add remove hover class for older browsers
	$('ul.list').on('hover', 'li',
		function() {
			$(this).addClass('hover');
		},
		function() {
			$(this).removeClass('hover')
		}
	)

	// Make list items clickable, they should have the correct attributes to identify the class, id and link to
	// do something with the link.
	$('ul.list').on('click', 'li', function(ev) {
		var href = $(this).data('rel');
		console.log('going to ' + href);

		if (href) {
			window.location.replace(href);
		}
	});
})(jQuery);