<?php
class FileFieldExtension extends ModelExtension {
    public function Filename() {
        return isset($this()->values['Filename']) ? $this()->value['Filename'] : '';
    }
}