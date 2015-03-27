<?php
class MosaicFileFieldExtension extends ModelExtension {
    public function Filename() {
        return isset($this()->values['Filename']) ? $this()->value['Filename'] : '';
    }
}