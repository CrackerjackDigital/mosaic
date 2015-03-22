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
})(jQuery);