<?php

class CKEditorField extends TextareaField {
    public function __construct($name, $title = null, $value = null) {
        parent::__construct($name, $title, $value);
        Requirements::javascript('mosaic/js/lib/ckeditor/ckeditor.js');
        Requirements::javascript('mosaic/js/widgets/ckeditor.js');
    }
}