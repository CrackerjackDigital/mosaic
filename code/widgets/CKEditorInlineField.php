<?php
class CKEditorInlineField extends TextareaField {
    public function __construct($name, $label, $content = null) {
        parent::__construct($name, $label, $content);
        $this->addExtraClass('ckeditorinline');
    }
    public function Field($properties = []) {
        return $this->renderWith('CKEditorInlineField');
    }
    public function Value() {
        return parent::Value();
    }
    public function setValue($value) {
        return parent::setValue($value);
    }
}