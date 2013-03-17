<?php
require_once 'php/php-activerecord/ActiveRecord.php';

set_time_limit(0);

ActiveRecord\Config::initialize(function($cfg)
{
	$cfg->set_model_directory(dirname(__FILE__) . '/php/models');
	$cfg->set_connections(array('development' => 'mysql://alex_agsattrack:Xac06T9TQe@127.0.0.1/alex_agsattrack'));
});

$parser = new KEPS();
$parser->update();

class KEPS {
	private $baseUrl = 'http://www.celestrak.com/NORAD/elements/';
	
	public function update() {
		$groups = Tlegroup::find('all');	
		foreach ($groups as $group) {
			$groupFilename = $group->id . '.txt';
			
			$tle = $this->getTLE($groupFilename);
			if (strlen($tle) > 0) {
				Kep::delete_all(array('conditions' => array('kepsgroup' => $group->id)));

				$sat = new Kep();
				$sat->kepsgroup = $group->id;
				$sat->elements = $tle;
				$sat->date = time();
				$sat->save();
			}        
		}
	}
	
	private function getTLE($fileName) {

		$url = $this->baseUrl . '/' . $fileName;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$tmp = curl_exec($ch);
		curl_close($ch);

		return $tmp;
	}	
}