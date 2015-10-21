<?php
class MosaicDisplayValueExtension extends Extension {
    /**
     * Convenience method return extension's owner.
     *
     * @return Object
     */
    public function __invoke() {
        return $this->owner;
    }

    /**
     * Yes, we have a display value.
     * @return bool
     */
    public function HasDisplayValue() {
        return true;
    }
}