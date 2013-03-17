<?php
class AGSATTRACK_CLASSLOADER {
    private $basePath = null;
    private $controllerPath = null;
    private $componentPath = null;
    private $modelsPath = null;
    private $config = null;
     
    public function __construct() {
        $this->basePath = dirname(dirname(dirname(__FILE__))) . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR;
        $this->controllerPath = $this->basePath . 'application' . DIRECTORY_SEPARATOR . 'controllers' . DIRECTORY_SEPARATOR;
        $this->componentPath = $this->controllerPath . 'components' . DIRECTORY_SEPARATOR;
        $this->modelsPath = $this->basePath . 'application' . DIRECTORY_SEPARATOR . 'models';
        
        $appControllerPath = $this->basePath . DIRECTORY_SEPARATOR . 'application' . DIRECTORY_SEPARATOR . 'app_controller.php';
        $this->loadFile($appControllerPath, false);
        
        $configPath = $this->basePath . DIRECTORY_SEPARATOR . 'application' . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'config.php';
        $this->loadFile($configPath, 'FATAL - Cannot Load Config');
    }

    private function loadFile($fileName, $error) {
        $result = @include_once($fileName);

        if ($result === false && $error !== false) {
            throw new AGSATTRACK_EXCEPTION($error);
        }
        
        return $result;      
    }
    
    public function isCallable($class, $method) {
        if (is_callable(array($class, $method))) {
            return true;
        } else {
            return false;
        }
    }

    private function loadComponents(&$class, $fatal = true) {
        if (isset($class->components)) {
            foreach($class->components as $component) {
                $componentFilename = strtolower($component) . '.php';
                $componentPath = $this->componentPath . $componentFilename;
                $result = @include_once($componentPath);
                if ($result !== false) {
                    $componentClassname = 'AGSATTRACK_' . strtoupper($component);
                    $componentClass = new $componentClassname();
                    $class->$componentClassname = $componentClass;
                } else {
                    if ($fatal) {
                        throw new AGSATTRACK_EXCEPTION('FATAL - Missing Component ' . $component);
                    }
                }                    
            }    
        }           
    }
        
    public function loadClass($classFileName) {
        $controllerFileName = strtolower($classFileName) . '.php';
        $controllerPath = $this->controllerPath . $controllerFileName;
            
        $this->loadFile($controllerPath,'FATAL - Failed to load controller ' . $controllerFileName);
                
        $className = 'AGSATTRACK_' . strtoupper($classFileName);
        $initData = Array(
            'modelsPath' => $this->modelsPath
        );
        $class = new $className($initData);
        
        $this->loadComponents($class);
        
        $class->setControllerName($classFileName);
        
        return $class;
    }        

}