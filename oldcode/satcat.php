<?php
require_once 'php/php-activerecord/ActiveRecord.php';

set_time_limit(0);

ActiveRecord\Config::initialize(function($cfg)
{
	$cfg->set_model_directory(dirname(__FILE__) . '/php/models');
	$cfg->set_connections(array('development' => 'mysql://alex_agsattrack:Xac06T9TQe@127.0.0.1/alex_agsattrack'));
});

$parser = new SATCATALOG();
$parser->update();

class SATCATALOG {
	private $url = 'http://celestrak.com/pub/satcat.txt';
	private $fields = Array(
		'designator' => Array(
			'start' => 1,
			'end' => 11,
			'trim' => true
		),
		'norad' => Array(
				'start' => 14,
				'end' => 18
		),
		'multiple' => Array(
				'start' => 20,
				'end' => 20
		),
		'payload' => Array(
				'start' => 21,
				'end' => 21
		),
		'operationalstatus' => Array(
				'start' => 22,
				'end' => 22
		),
		'name' => Array(
				'start' => 24,
				'end' => 47
		),
		'owner' => Array(
				'start' => 50,
				'end' => 54
		),
		'launchdate' => Array(
				'start' => 57,
				'end' => 66
		),
		'launchsite' => Array(
				'start' => 69,
				'end' => 73
		),
		'decaydate' => Array(
				'start' => 76,
				'end' => 85
		),
		'period' => Array(
				'start' => 88,
				'end' => 94
		),
		'inclination' => Array(
				'start' => 97,
				'end' => 101
		),
		'apogee' => Array(
				'start' => 104,
				'end' => 109
		),
		'perigee' => Array(
				'start' => 112,
				'end' => 117
		),
		'radarcrosssection' => Array(
				'start' => 120,
				'end' => 127
		),
		'status' => Array(
				'start' => 130,
				'end' => 132
		)																								
	);
	
	
	
	private function getCatalog() {
		/*
		$test = '1957-001A    00001   D SL-1 R/B                  CIS    1957-10-04  TYMSC  1957-12-01     96.2   65.1     938     214   20.4200     
1957-001B    00002  *D SPUTNIK 1                 CIS    1957-10-04  TYMSC  1958-01-03     96.1   65.0     945     227     N/A       
1957-002A    00003  *D SPUTNIK 2                 CIS    1957-11-03  TYMSC  1958-04-14    103.7   65.3    1659     211    0.0800     
1958-001A    00004  *D EXPLORER 1                US     1958-02-01  AFETR  1970-03-31     88.5   33.1     215     183     N/A       
1958-002B    00005  *  VANGUARD 1                US     1958-03-17  AFETR                132.8   34.2    3837     654    0.1178     
1958-003A    00006  *D EXPLORER 3                US     1958-03-26  AFETR  1958-06-28    103.6   33.5    1739     117     N/A       
1958-004A    00007   D SL-1 R/B                  CIS    1958-05-15  TYMSC  1958-12-03    102.7   65.1    1571     206     N/A       
1958-004B    00008  *D SPUTNIK 3                 CIS    1958-05-15  TYMSC  1960-04-06     88.4   65.1     255     139   11.8400     
1958-005A    00009  *D EXPLORER 4                US     1958-07-26  AFETR  1959-10-23     92.8   50.2     585     239     N/A       
1958-006A    00010  *D SCORE                     US     1958-12-18  AFETR  1959-01-21     98.2   32.3    1187     159     N/A       
1959-001A    00011  *  VANGUARD 2                US     1959-02-17  AFETR                121.7   32.9    2958     553    0.3810     
1959-001B    00012     VANGUARD R/B              US     1959-02-17  AFETR                126.1   32.9    3346     556    0.5254 
1998-058B    25502     ATLAS 2A CENTAUR R/B      US     1998-10-20  AFETR                372.5   27.0   21249     291   15.7640     
1998-059A    25503  *  MAQSAT 3 & ARIANE 5 R/B   FR     1998-10-21  FRGUI                641.2    6.8   35513     995   29.3490 ';
		
		$return = explode("\n",$test);
		return $return;
		*/
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_URL, $this->url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$tmp = curl_exec($ch);
		curl_close($ch);
		if ($tmp != false){
			$return = explode("\n",$tmp);
			return $return;
		}		
	}
	
	private function parseCatalog($catalog) {
		foreach ($catalog as $satellite) {
			$designator = $this->getField($satellite,'designator');
			
			try {
				$sat = SATCAT::find($designator);
			} catch (ActiveRecord\RecordNotFound $e) {
				$sat = new SATCAT();
				$sat->id = $designator;
			}			
	
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
			$sat->save();
				
		}
	}
	
	private function getField($catalogEntry, $fieldName) {
		if (isset($this->fields[$fieldName])) {
			$start = $this->fields[$fieldName]['start'];	
			$end = $this->fields[$fieldName]['end'];

			$field = substr($catalogEntry, $start-1, ($end-$start)+1);
			
			if (isset($this->fields[$fieldName]['trim']) && $this->fields[$fieldName]['trim']) {
				$field = trim($field);
			}
			return $field;
		} else {
			return '';
		}
	}
	
	public function update() {
		$catalog = $this->getCatalog();
		$this->parseCatalog($catalog);
	}
}

/**
 * ------------------------------------------------------------------------------------------------------------------------------------
Column
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111
000000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999000000000011111111112222222222333
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012
------------------------------------------------------------------------------------------------------------------------------------
yyyy-nnnaaa  nnnnn M*O aaaaaaaaaaaaaaaaaaaaaaaa  aaaaa  yyyy-mm-dd  aaaaa  yyyy-mm-dd  nnnnn.n  nnn.n  nnnnnn  nnnnnn  nnn.nnnn  aaa
------------------------------------------------------------------------------------------------------------------------------------

Columns	Description
001-011	International Designator

    Launch Year (001-004)
    Launch of the Year (006-008)
    Piece of the Launch (009-011)

014-018	NORAD Catalog Number
020-020	Multiple Name Flag ("M" if multiple names exist; alternate names found in satcat-annex.txt)
021-021	Payload Flag ("*" if payload; blank otherwise)
022-022	Operational Status Code
Note: The "U" code indicates that the satellite is considered operational according to the Union of Concerned Scientists (UCS) Satellite Database.
024-047	Satellite Name(s)

    Standard Nomeclature
        R/B(1) = Rocket body, first stage
        R/B(2) = Rocket body, second stage
        DEB = Debris
        PLAT = Platform
        Items in parentheses are alternate names
        Items in brackets indicate type of object
        (e.g., BREEZE-M DEB [TANK] = tank)
        An ampersand (&) indicates two or more objects are attached

050-054	Source or Ownership
057-066	Launch Date [year-month-day]
069-073	Launch Site
076-085	Decay Date, if applicable [year-month-day]
088-094	Orbital period [minutes]
097-101	Inclination [degrees]
104-109	Apogee Altitude [kilometers]
112-117	Perigee Altitude [kilometers]
120-127	Radar Cross Section [meters2]; N/A if no data available
130-132	Orbital Status Code

    NCE = No Current Elements
    NIE = No Initial Elements
    NEA = No Elements Available
    DOC = Permanently Docked
    ISS = Docked to International Space Station
    XXN = Central Body (XX) and Orbit Type (N)
        AS = Asteroid
        EA = Earth (default if blank)
        EL = Earth Lagrange
        EM = Earth-Moon Barycenter
        JU = Jupiter
        MA = Mars
        ME = Mercury
        MO = Moon (Earth)
        NE = Neptune
        PL = Pluto
        SA = Saturn
        SS = Solar System Escape
        SU = Sun
        UR = Uranus
        VE = Venus
        0 = Orbit
        1 = Landing
        2 = Impact
        3 = Roundtrip
    (e.g., SU0 = Heliocentric Orbit, MO2 = Lunar Impact) 
 */