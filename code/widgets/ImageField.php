<?php

class ImageField extends FormField {

    public function Value() {
        return $this->Field();
    }
    public function Field($properties = []) {
        return $this->renderWith(['ImageField'], $this->value);
    }
}