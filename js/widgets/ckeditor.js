(function() {
	CKEDITOR.disableAutoInline = true;
	console.log('ckeditor');
	CKEDITOR.replace('.ckeditor');
	CKEDITOR.inline('.ckeditorinline');
})();