<?php
// Routes

$app->get('/', 'App\Action\HomeAction:dispatch')->setName('homepage');
$app->get('/groups', 'App\Action\GroupsAction:dispatch')->setName('groups');
$app->get('/elements/{group}', 'App\Action\ElementsAction:fetchOne')->setName('elements');
$app->get('/elements/update/{group}', 'App\Action\ElementsAction:update')->setName('updateelements');
$app->get('/satellite/{noradid}', 'App\Action\SatelliteAction:fetchOne')->setName('satellite');
$app->get('/locations', 'App\Action\LocationAction:fetch')->setName('locations');
