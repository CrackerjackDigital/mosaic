<?php

class ExtraImagesField extends FormField {

    public $images = [];

    public function Value() {
        return $this->images ? $this->images[0] : [];
    }
    public function setValue($value) {
        $this->images = $value ?: [];
    }
    public function Field($properties = []) {
        $image = $this->Value();

        return $this->renderWith(
            'ExtraImagesField',
            [
                'Image' => $image
            ]
        );
    }
}