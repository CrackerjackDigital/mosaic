(function() {
	console.log('ckeditor');

//	CKEDITOR.disableAutoInline = true;

	$('textarea.ckeditorinlineedit').each( function() {
		CKEDITOR.inline(this,
			{
				// Define the toolbar groups as it is a more accessible solution.
				toolbarGroups: [
					{"name":"basicstyles","groups":["basicstyles"]},
					{"name":"links","groups":["links"]},
					{"name":"paragraph","groups":["list","blocks"]},
					{"name":"document","groups":["mode"]},
					{"name":"insert","groups":["insert"]},
					{"name":"styles","groups":["styles"]},
					{"name":"about","groups":["about"]}
				],
				// Remove the redundant buttons from toolbar groups defined above.
				removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar,scayt'
			}
		);
	});


	CKEDITOR.replace('.ckeditor');
})();