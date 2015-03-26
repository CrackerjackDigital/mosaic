(function() {
	// if we have tab-bar handle hiding/showing tab-body with ID
	if ($('.tab-bar').length) {
		var first = $('.tab-bar > ul li:first-child a'),
			rel = first.attr('rel');

		// select the tab
		first.closest('li').addClass('current');

		// show the first tab body
		$(rel).addClass('current');


		$('.tab-bar > ul li').on('click', function() {
			// remove current from list item
			$('.tab-bar > ul li').removeClass('current');

			// add current to this list item
			$(this).addClass('current');

			// remove current from all tab bodies
			$('.tab-body').removeClass('current');

			// show the tab-body for clicked item
			$($('a', $(this)).attr('rel')).addClass('current');
		});
	}
})();