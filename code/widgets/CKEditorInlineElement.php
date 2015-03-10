<?php
class CKEditorInlineElement extends LiteralField {
    public function __construct($name, $content = null) {
        Requirements::javascript(MosaicModule::get_module_path() . '/js/lib/ckeditor/ckeditor.js');
        Requirements::javascript(MosaicModule::get_module_path() . '/js/widgets/ckeditor.js');
        parent::__construct($name, $content);
    }
}