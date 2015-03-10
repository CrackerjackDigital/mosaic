<?php
/**
 * Attaches to ContentController and configures requirements for mosaic.
 */
class MosaicControllerExtension extends Extension {
    // path mosaic module is installed in relative to site root, no leading '/', trailing OK.
    private static $install_dir;

    // what we load and when to load.
    private static $components = [
        'before' => [
            '/components/select2/select2.css'
        ],
        'after' => [
            'js/widgets/expando.js',
            'js/widgets/list.js',
            '/components/select2/select2.js',
            'js/widgets/select2field.js',
            'js/lib/ckeditor/ckeditor.js',
            'js/widgets/ckeditor.js'
        ]
    ];

    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onBeforeInit() {
        $this->addRequirements('before');
    }

    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onAfterInit() {
        $this->addRequirements('after');
    }

    /**
     * Adds javascript files to requirements based on them ending in '.js' using config.install_dir as base path.
     * @param string $when - look at before or after components.
     */
    protected function addRequirements($when) {
        $installDir = MosaicModule::get_module_path();

        foreach (self::get_config_setting('components', $when) as $path) {
            if (substr($path, 0, 1) !== '/') {
                $path = $this->owner->join_links(
                    $installDir,
                    $path
                );
            }
            $path = substr($path, 1);

            if (substr($path, -3, 3) === '.js') {
                Requirements::javascript($path);
            }
            if (substr($path, -4, 4) === '.css') {
                Requirements::css($path);
            }
        }

    }

    /**
     * Return a setting from config.MosaicControllerInstance optionally returning the key if the setting is an array.
     *
     * NB: Extension doesn't inherit from Object so 'normal' config behaviour available hence Config.inst().
     *
     * @param $varName
     * @param null $key
     * @return array|scalar
     */
    private static function get_config_setting($varName, $key = null) {
        $setting = Config::inst()->get(get_called_class(), $varName);
        if ($key && is_array($setting)) {
            return $setting[$key];
        }
        return $setting;
    }
}