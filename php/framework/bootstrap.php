<?php
require_once 'php/framework/exception.php';
require_once 'php/framework/classloader.php';
require_once 'php/framework/controller.php';
require_once 'php/framework/libs/php-activerecord/ActiveRecord.php';

class AGSATTRACK_BOOTSTRAP {
    private $classLoader = null;
    
    public function __construct() {
        $this->classLoader = new AGSATTRACK_CLASSLOADER();
        $this->cleanGPC();
    }
    
    private function cleanGPC() {
        
    }
    
    public function run() {
        if (isset($_GET['controller']) && isset($_GET['method'])) {
            $class = $this->classLoader->loadClass($_GET['controller']);
            
            $method = $_GET['method'];
            
            if ($this->classLoader->isCallable($class, $method)) {
                $result = $class->$method();
                
                $class->displayView();
                     
            } else {
                throw new AGSATTRACK_EXCEPTION('FATAL - Missing Method ' . $method);
            }
            
            return $class;
        } else {
            throw new AGSATTRACK_EXCEPTION('FATAL - Missing controller or method');
        }       
    }   
}

$bootstrap = new AGSATTRACK_BOOTSTRAP();


    