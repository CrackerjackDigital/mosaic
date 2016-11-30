<?php
class MosaicFileFieldExtension extends Modular\ModelExtension {
    public function Filename() {
        return isset($this()->values['Filename']) ? $this()->value['Filename'] : '';
    }
}