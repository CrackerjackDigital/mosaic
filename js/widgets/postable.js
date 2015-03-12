(function() {
	$('.postable-widget input').on('focus', function() {
		$('.postable-widget').toggleClass('open').toggleClass('closed');
	});
})();