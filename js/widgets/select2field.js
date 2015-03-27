(function() {
	$.fn.select2ify = function(container) {
		container = container || $(document);

		$('select.select2field,input.select2field', container).each( function() {
			console.log('select2ifiying');
			console.log(this);

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

			console.log(options);

			// add options to options map which may contain tags if tags attribute set.
			$this.select2(
				options
			);
		});
	}

	$.fn.unselect2ify = function(container) {
		container = container || $(document);

		$('select.select2field,input.select2field', container).each( function() {
			$(this).select2('destroy');
		});

	}

	// select2ify the whole page (wont' do modals).
	$.fn.select2ify();

})();