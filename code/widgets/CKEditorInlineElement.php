<?php
class CKEditorInlineElement extends LiteralField {
    public function __construct($name, $content = null) {
        Requirements::javascript('mosaic/js/lib/ckeditor/ckeditor.js');
        Requirements::javascript('mosaic/js/widgets/ckeditor.js');
        parent::__construct($name, $content);
    }
}