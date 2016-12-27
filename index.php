<?php
try {
    require_once 'php/framework/bootstrap.php';  
    $bootstrap->run();
} catch (Exception $e) {
    echo 'Error: ',  $e->getMessage(), "\n";
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