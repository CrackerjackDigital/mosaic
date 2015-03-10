<?php

class CKEditorField extends TextareaField {
    public function __construct($name, $title = null, $value = null) {
        parent::__construct($name, $title, $value);
        Requirements::javascript(MosaicModule::get_module_path() . '/js/lib/ckeditor/ckeditor.js');
        Requirements::javascript(MosaicModule::get_module_path() . '/js/widgets/ckeditor.js');
    }
}