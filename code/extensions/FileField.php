<?php
class FileFieldExtension extends ModelExtension {
    public function Filename() {
        return $this()->value['Filename'];
    }
}