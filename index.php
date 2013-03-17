<?php
try {
    require_once 'php/framework/bootstrap.php';
    
    $bootstrap->run();
    
} catch (Exception $e) {
    echo 'Error: ',  $e->getMessage(), "\n";
}

die('done');

if (isset($_GET['controller']) && isset($_GET['method'])) {
    $controller = $_GET['controller'];
    $method = $_GET['method'];

    $basePath = dirname(__FILE__);
    $controllerBasePath = $basePath . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'controllers' . DIRECTORY_SEPARATOR;
    $componentsBasePath = $controllerBasePath . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR;

    $appControllerPath = $basePath . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'app_controller.php';
    
    $result = @include_once($appControllerPath);
    if ($result !== false) {
        $controllerFileName = strtolower($controller) . '.php';
        $controllerPath = $controllerBasePath . $controllerFileName;
        
        $result = @include_once($controllerPath);
        if ($result !== false) {
            $className = strtoupper($controller);
            $class = new $className();
            
            if (isset($class->components)) {
                foreach($class->components as $component) {
                    $componentFilename = strtolower($component) . '.php';
                    $componentPath = $componentsBasePath . $componentFilename;
                    $result = @include_once($componentPath);
                    if ($result !== false) {
                        $componentClass = new $component();
                        $class->$component = $componentClass;
                    } else {
                        die('FATAL - Missing Component ' . $component);
                    }                    
                }    
            }
            if (is_callable(array($class, $method))) {
                $result = $class->$method();   
            } else {
                die('FATAL - Cannot call method ' . $method);                
            }
        } else {
            die('FATAL - Cannot load class ' . $controller);
        }
    } else {
        die('FATAL - Cannot load app controller');
    }
    die();
}

function prd($data) {
    pr($data); 
    die();   
}

function pr($data) {
    echo '<pre>';    
    print_r($data);
    echo '</pre>';    
}

function vdd($data) {
    vd($data); 
    die();   
}

function vd($data) {
    echo '<pre>';    
    var_dump($data);
    echo '</pre>'; 
}