(function() {
	$('.field.password input').each(function() {
		$(this).attr('placeholder', $(this).attr('data-placeholder'));
	});
})()