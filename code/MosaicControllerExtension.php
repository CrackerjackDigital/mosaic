<?php
/**
 * Attaches to ContentController and configures requirements for mosaic.
 */
class MosaicControllerExtension extends Extension {
    // path mosaic module is installed in relative to site root, no leading '/', trailing OK.
    private static $install_dir;

    // what we load and when to load.
    private static $components = [
        'before' => [],
        'after' => [
            'js/widgets/expando.js',
            'js/widgets/list.js',
            'js/widgets/select2field.js'
        ]
    ];

    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onBeforeInit() {
        $this->addJavascript('before');
    }

    /**
     *  Loads requirements for after main controller init has been called.
     */
    public function onAfterInit() {
        $this->addJavascript('after');
    }

    /**
     * Adds javascript files to requirements based on them ending in '.js' using config.install_dir as base path.
     * @param string $when - look at before or after components.
     */
    protected function addJavascript($when) {
        $installDir = self::get_config_setting('install_dir');

        foreach (self::get_config_setting('components', $when) as $relativePath) {
            if (substr($relativePath, -3, 3) === '.js') {
                Requirements::javascript(
                    $this->owner->join_links(
                        $installDir,
                        $relativePath
                    )
                );
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