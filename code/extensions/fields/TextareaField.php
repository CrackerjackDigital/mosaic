<?php
class MosaicTextareaFieldExtension extends MosaicDisplayValueExtension {
    public function DisplayValue() {
        return $this()->value;
    }
}