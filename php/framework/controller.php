<?php
class AGSATTRACKCONTROLLER {
    protected $output = '';
    protected $controllerName = '';
    protected $view = 'json';
    private $basePath = null;
    private $viewPath = null;
            
    public function __construct($initData) {

        $modelsPath = $initData['modelsPath'];

        $cfg = ActiveRecord\Config::instance();
        $cfg->set_model_directory($modelsPath);
        $username = AGSATTRACK_CONFIG::$database['user'];
        $password = AGSATTRACK_CONFIG::$database['pass'];
        $db = AGSATTRACK_CONFIG::$database['db'];
        $host = AGSATTRACK_CONFIG::$database['host'];
        $cfg->set_connections(array('development' => 'mysql://'.$username.':'.$password.'@'.$host.'/' . $db ));
        
        $this->basePath = dirname(dirname(dirname(__FILE__))) . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR;
        $this->viewPath = $this->basePath . 'application' . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR;
        
    }
    
    public function getView() {
        return $this->view;   
    }

    public function getOutput() {
        return $this->output;   
    }

    public function setControllerName($name) {
        $this->controllerName = $name;
    }     
     
     
    public function displayView() {
        $viewPaths = Array();
        $viewPaths[] = $this->viewPath . DIRECTORY_SEPARATOR . $this->view . '.php';
        $viewPaths[] = $this->viewPath . $this->controllerName . DIRECTORY_SEPARATOR . $this->view . '.php';

        $output = $this->output;
        $found = false;
    
        foreach($viewPaths as $path) {
            if (@include_once($path)) {
                $found = true;
                break;    
            }    
        }
        
        if (!$found) {
            throw new AGSATTRACK_EXCEPTION('FATAL - Missing view ' . $this->view);     
        }
    }
            
    protected function checkQS($qsItems) {
        foreach($qsItems as $item) {
            if (!isset($_GET[$item['qsvar']])) {
                if ($item['fatal']) {
                    throw new AGSATTRACK_EXCEPTION('FATAL - Missing paramater ' . $item['qsvar']);    
                } else {
                    $_GET[$item['qsvar']] = $item['default'];    
                }
            }
        }
    }
        
}