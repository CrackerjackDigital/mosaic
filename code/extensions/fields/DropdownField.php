<?php
/**
 * Extension to add 'DisplayValue' to dropdown fields which is required to get correct value for
 * disabled version which is a dl/dt/dd.
 */
class MosaicDropdownFieldExtension extends MosaicDisplayValueExtension {
    /**
     * Returns the value from the source array using the drop-down's dataValue() as the key.
     * @return mixed
     */
    public function DisplayValue() {
        $value = $this()->dataValue();
        $source = $this()->getSource();

        if ($source instanceof SS_List && $source->offsetExists($value)) {

            $displayValue = $source->offsetGet($value);

        } else if ($source instanceof ArrayAccess) {

            $displayValue = $source[$value];

        } else if (is_array($source) && array_key_exists($value, $source)) {

            $displayValue = $source[$value];

        } else {

            $displayValue = $this()->getEmptyString();

        }
        return $displayValue;
    }
}