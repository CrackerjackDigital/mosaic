<?php

/**
 * Adds hooks for mosaic data layer to forms.
 *
 * - Adds Mosaic Data Attributes to getAttributesHTML
 */
class MosaicForm extends ModularForm {
	use Modular\json;

	const AttributeCharset = 'UTF-8';
	const AttributeDoubleEncode = false;
	const AttributeQuoteStyle = ENT_COMPAT;

	// prefix excluding terminal '-'
	private static $attribute_prefix = 'data-mosaic';

	// automatically merge MosaicDataAttributes in getAttribute call.
	private static $attribute_merge = true;


	public function __construct(\Controller $controller, $name, \FieldList $fields, \FieldList $actions, $validator = null) {
		if (!$controller instanceof Controller) {
			user_error("Controller not a controller, if in model scope in template please call 'Top.Form' using Controller::curr", E_USER_WARNING);
			$controller = Controller::curr();
		}
		if (!$controller instanceof MosaicFormControllerInterface) {
			throw new MosaicException("Controller doesn't implement MosaicFormControllerInterface (it should)");
		}
		parent::__construct($controller, $name, $fields, $actions, $validator);
	}

	/**
	 * @return MosaicFormControllerInterface
	 */
	public function controller() {
		return $this->controller;
	}
	/**
	 * Return data attributes for the model being shown
	 * prefixed by 'data-mosaic-' :
	 *
	 * -    model:      model class name
	 * -    id:         model id (empty if new model)
	 * -    state:      json representation of ModelState (fields, values)
	 * -    meta:       json representation of ModelMeta (formats, validation
	 * etc)
	 *
	 */
	public function MosaicDataAttributes() {
		$controller = $this->controller();

		return $this->encodeAttributes(
			[
			    'id' => $controller->getModelID(),
			    'state' => $this->modelState(),
			    'meta' => $this->modelMeta(),
			],
			$this->config()->get('attribute_prefix')
		);
	}

	/**
	 * Override to merge in MosaicDataAttributes if config.attribute_merge is true.
	 * @return array
	 */
	public function getAttributes() {
		return array_merge(
			parent::getAttributes(),
			$this->config()->get('attribute_merge') ? $this->MosaicDataAttributes() : []
		);
	}

	/**
	 * Return passed in attributes with key prefixed as for data- attribute and
	 * values encoded to be valid html attributes.
	 *
	 * @param array $attributes
	 * @return array
	 */
	public static function encodeAttributes(array $attributes, $prefix) {
		foreach ($attributes as $name => $value) {
			$attributes["$prefix-$name"] = self::encodeAttributeValue($value);
			unset($attributes[$name]);
		}
		return $attributes;
	}

	/**
	 * Encode values suitable for use as an html attribute with '"' as
	 * sorround. Can handle json as a value to encode. Expects values to not be
	 * html or otherwise encoded already.
	 *
	 * @param string $value plain value or json string
	 * @return string
	 */
	public static function encodeAttributeValue($value) {
		return htmlentities(
			$value,
			static::AttributeQuoteStyle,
			static::AttributeCharset,
			static::AttributeDoubleEncode
		);
	}

	/**
	 * Return the current state of the model.
	 * @return string
	 */
	protected function modelState() {
		/** @var array $fields */
		$fields = $this->Fields()->dataFields();
//		$fields['ID'] = $this->controller()->getModelID();

		// call trait to encode
		return $this->encode(
			array_map(
				function($field) {
					return $this->encodeAttributeValue($field->Value());
				},
				$fields
			)
		);
	}

	/**
	 * Return meta-data about the model as a whole, including fields.
	 * @return string
	 */
	protected function modelMeta() {
		$fields = $this->Fields()->dataFields();
		$validator = $this->getValidator();

		$meta = [
			'model' => $this->controller()->getModelClass(),
		    'fields' => [],
		];

		if ($validator) {

			/** @var FormField $field */
			foreach ($fields as $field) {
				$fieldName = $field->getName();

				$meta['fields'][$fieldName] = $this->fieldMeta($field);
			}
		}
		return $this->encode($meta);
	}

	/**
	 * Return meta-data about a single field
	 * @param \FormField $field
	 * @return array
	 */
	protected function fieldMeta(FormField $field) {
		$fieldName = $field->getName();

		$meta = [];

		if ($field->hasMethod('provideValidationRegEx')) {
			$meta['regex'] = $field->provideValidationRegEx();
		}

		return $meta + [
			'required' => $this->getValidator()->fieldIsRequired($fieldName),
		    'name' => $fieldName,
		    'title' => $field->Title(),
		    'leftTitle' => $field->LeftTitle(),
		    'rightTitle' => $field->RightTitle(),
		    'css' => $field->CSSClasses(),
		    'readOnly' => $field->isReadonly(),
		    'disabled' => $field->isDisabled()
		];
	}
}