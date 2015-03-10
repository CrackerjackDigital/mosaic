<?php

class CKEditorField extends TextareaField {
    public function __construct($name, $title = null, $value = null) {
        parent::__construct($name, $title, $value);
    }
}