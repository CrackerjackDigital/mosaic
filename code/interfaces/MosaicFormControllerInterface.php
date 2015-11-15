<?php

/**
 * Interface a controller must implement to be used with MosaicForm.
 */
interface MosaicFormControllerInterface {
	public function getModelClass();
	public function getModelID();
}