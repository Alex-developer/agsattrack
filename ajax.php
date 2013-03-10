<?php
require_once 'php/php-activerecord/ActiveRecord.php';

ActiveRecord\Config::initialize(function($cfg)
{
	$cfg->set_model_directory(dirname(__FILE__) . '/php/models');
	$cfg->set_connections(array('development' => 'mysql://alex_agsattrack:Xac06T9TQe@127.0.0.1/alex_agsattrack'));
});

if (isset($_GET['keps'])) {
	$keysId = $_GET['keps'];
	$keps = Kep::find('first', array('conditions' => array('kepsgroup = ?', $keysId)));
	
	$data = Array(
		'id' => $keysId,
		'keps' => $keps->elements
	);
	header("Content-type: application/json");
	echo(json_encode($data));
	die();	
}


if (isset($_GET['id'])) {
	$satId = $_GET['id'];
	$satData = SATCAT::find('first', array('conditions' => array('norad = ?', $satId)));

	$data = Array();
	$data[] = Array('field'=>'noradid', 'value'=>$satData->norad);
	$data[] = Array('field'=>'name', 'value'=>$satData->name);
	$data[] = Array('field'=>'owner', 'value'=>$satData->owner);
	$data[] = Array('field'=>'Launch date', 'value'=>$satData->launchdate);
	//$data[] = Array('field'=>'Launch Site', 'value'=>$satData->site_id->location);
	$data[] = Array('field'=>'period', 'value'=>$satData->period);
	$data[] = Array('field'=>'inclination', 'value'=>$satData->inclination);
	$data[] = Array('field'=>'apogee', 'value'=>$satData->apogee);
	$data[] = Array('field'=>'perigee', 'value'=>$satData->perigee);
	
	/*
	$sat->norad = $this->getField($satellite,'norad');
	$sat->multiple = $this->getField($satellite,'multiple');
	$sat->payload = $this->getField($satellite,'payload');
	$sat->operationalstatus = $this->getField($satellite,'operationalstatus');
	$sat->name = $this->getField($satellite,'name');
	$sat->owner = $this->getField($satellite,'owner');
	$sat->launchdate = $this->getField($satellite,'launchdate');
	$sat->site_id = $this->getField($satellite,'launchsite');
	$sat->decaydate = $this->getField($satellite,'decaydate');
	$sat->period = $this->getField($satellite,'period');
	$sat->inclination = $this->getField($satellite,'inclination');
	$sat->apogee = $this->getField($satellite,'apogee');
	$sat->perigee = $this->getField($satellite,'perigee');
	$sat->radarcrosssection = $this->getField($satellite,'radarcrosssection');
	$sat->status = $this->getField($satellite,'status');
	*/
	
	header("Content-type: application/json");
	echo(json_encode($data));
	die();	
	print_r($data);die();
}


$groups = Array();
foreach (Tlegroup::find('all') as $group) {
	$groups[] = Array(
		'id'=>$group->id,
		'name'=>$group->name,
		'selected' => ($group->default?true:false)
	);
}

//print_r($groups);
//$a = '[{"CompanyName":"Alfreds Futterkiste","ContactName":"Maria Anders","ContactTitle":"Sales Representative","Address":"Obere Str. 57","City":"Berlin","Country":"Germany"},{"CompanyName":"Ana Trujillo Emparedados y helados","ContactName":"Ana Trujillo","ContactTitle":"Owner","Address":"Avda. de la Constitucin 2222","City":"Mxico D.F.","Country":"Mexico"},{"CompanyName":"Antonio Moreno Taquera","ContactName":"Antonio Moreno","ContactTitle":"Owner","Address":"Mataderos 2312","City":"Mxico D.F.","Country":"Mexico"},{"CompanyName":"Around the Horn","ContactName":"Thomas Hardy","ContactTitle":"Sales Representative","Address":"120 Hanover Sq.","City":"London","Country":"UK"},{"CompanyName":"Berglunds snabbkp","ContactName":"Christina Berglund","ContactTitle":"Order Administrator","Address":"Berguvsvgen 8","City":"Lule","Country":"Sweden"},{"CompanyName":"Blauer See Delikatessen","ContactName":"Hanna Moos","ContactTitle":"Sales Representative","Address":"Forsterstr. 57","City":"Mannheim","Country":"Germany"},{"CompanyName":"Blondesddsl pre et fils","ContactName":"Frdrique Citeaux","ContactTitle":"Marketing Manager","Address":"24, place Klber","City":"Strasbourg","Country":"France"},{"CompanyName":"Blido Comidas preparadas","ContactName":"Martn Sommer","ContactTitle":"Owner","Address":"C\/ Araquil, 67","City":"Madrid","Country":"Spain"},{"CompanyName":"Bon app","ContactName":"Laurence Lebihan","ContactTitle":"Owner","Address":"12, rue des Bouchers","City":"Marseille","Country":"France"},{"CompanyName":"Bottom-Dollar Markets","ContactName":"Elizabeth Lincoln","ContactTitle":"Accounting Manager","Address":"23 Tsawassen Blvd.","City":"Tsawassen","Country":"Canada"},{"CompanyName":"Bs Beverages","ContactName":"Victoria Ashworth","ContactTitle":"Sales Representative","Address":"Fauntleroy Circus","City":"London","Country":"UK"},{"CompanyName":"Cactus Comidas para llevar","ContactName":"Patricio Simpson","ContactTitle":"Sales Agent","Address":"Cerrito 333","City":"Buenos Aires","Country":"Argentina"},{"CompanyName":"Centro comercial Moctezuma","ContactName":"Francisco Chang","ContactTitle":"Marketing Manager","Address":"Sierras de Granada 9993","City":"Mxico D.F.","Country":"Mexico"},{"CompanyName":"Chop-suey Chinese","ContactName":"Yang Wang","ContactTitle":"Owner","Address":"Hauptstr. 29","City":"Bern","Country":"Switzerland"},{"CompanyName":"Comrcio Mineiro","ContactName":"Pedro Afonso","ContactTitle":"Sales Associate","Address":"Av. dos Lusadas, 23","City":"Sao Paulo","Country":"Brazil"},{"CompanyName":"Consolidated Holdings","ContactName":"Elizabeth Brown","ContactTitle":"Sales Representative","Address":"Berkeley Gardens 12 Brewery","City":"London","Country":"UK"},{"CompanyName":"Drachenblut Delikatessen","ContactName":"Sven Ottlieb","ContactTitle":"Order Administrator","Address":"Walserweg 21","City":"Aachen","Country":"Germany"},{"CompanyName":"Du monde entier","ContactName":"Janine Labrune","ContactTitle":"Owner","Address":"67, rue des Cinquante Otages","City":"Nantes","Country":"France"},{"CompanyName":"Eastern Connection","ContactName":"Ann Devon","ContactTitle":"Sales Agent","Address":"35 King George","City":"London","Country":"UK"},{"CompanyName":"Ernst Handel","ContactName":"Roland Mendel","ContactTitle":"Sales Manager","Address":"Kirchgasse 6","City":"Graz","Country":"Austria"}]';
//print_r(json_decode($a));
header("Content-type: application/json");
echo(json_encode($groups));