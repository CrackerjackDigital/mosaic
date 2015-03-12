(function($) {
	$('.select2field').each( function() {
		var $this = $(this),
			seperator = $this.attr('tagseperator') ? $this.attr('tagseperator') : ',',
			tags = $this.attr('tags') ? $this.attr('tags').split(seperator) : false,
			placeholder = $this.attr('placeholder')
			options = tags ? {
				tags: tags,
				tokenSeparators: [ seperator ],
				placeholder: placeholder
			} : {
				placeholder: placeholder
			};

		// add options to options map which may contain tags if tags attribute set.
		$this.select2(
			options
		);
	});
})(jQuery);