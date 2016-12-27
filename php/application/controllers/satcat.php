<?php
class AGSATTRACK_SATCAT extends APPCONTROLLER {
    
    private $baseUrl = 'http://www.celestrak.com/pub/satcat.txt';
    
    public function __construct($initData) {
        parent::__construct($initData);
    }
        
    public function update() {
        set_time_limit(600);
        $rawCatalog = $this->getCatalog();
        
        $catalog = explode("\n", $rawCatalog);
        foreach ($catalog as $entry) {
            
            $satId = $this->getChunk($entry, 14,18);
            
            $satData = SATCAT::find('first', array('conditions' => array('norad = ?', $satId)));
            
            if ($satData == null) {                
                $satData = new SATCAT();
            }
            
            $satData->id = $this->getChunk($entry, 1,11);
            $satData->norad = $satId;
            $satData->multiple = $this->getChunk($entry, 20,20);
            $satData->payload = $this->getChunk($entry, 21,21);
            $satData->operationalstatus = $this->getChunk($entry, 22,22);
            $satData->name = $this->getChunk($entry, 24,47);
            $satData->owner = $this->getChunk($entry, 50,54);
            $satData->launchdate = $this->getChunk($entry, 57,66);
            $satData->site_id = $this->getChunk($entry, 69,73);
            $satData->decaydate = $this->getChunk($entry, 76,85);
            $satData->period = $this->getChunk($entry, 88,94);
            $satData->inclination = $this->getChunk($entry, 97,101);
            $satData->apogee = $this->getChunk($entry, 104,109);
            $satData->perigee = $this->getChunk($entry, 112,117);
            $satData->radarcrosssection = $this->getChunk($entry, 120,127);
            $satData->status = $this->getChunk($entry, 130,132);
            $satData->save();
        }
        die('done');
    }  
    
    private function getChunk($line, $start, $end) {
        return trim(substr($line, $start - 1, $end - $start + 1));
    }
    
    private function getCatalog() {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $tmp = curl_exec($ch);
        curl_close($ch);

        return $tmp;
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
Columns    Description
001-011    International Designator
Launch Year (001-004)
Launch of the Year (006-008)
Piece of the Launch (009-011)
014-018    NORAD Catalog Number
020-020    Multiple Name Flag ("M" if multiple names exist; alternate names found in satcat-annex.txt)
021-021    Payload Flag ("*" if payload; blank otherwise)
022-022    Operational Status Code
Note: The "U" code indicates that the satellite is considered operational according to the Union of Concerned Scientists (UCS) Satellite Database.
024-047    Satellite Name(s)
Standard Nomeclature
R/B(1) = Rocket body, first stage
R/B(2) = Rocket body, second stage
DEB = Debris
PLAT = Platform
Items in parentheses are alternate names
Items in brackets indicate type of object
(e.g., BREEZE-M DEB [TANK] = tank)
An ampersand (&) indicates two or more objects are attached
050-054    Source or Ownership
057-066    Launch Date [year-month-day]
069-073    Launch Site
076-085    Decay Date, if applicable [year-month-day]
088-094    Orbital period [minutes]
097-101    Inclination [degrees]
104-109    Apogee Altitude [kilometers]
112-117    Perigee Altitude [kilometers]
120-127    Radar Cross Section [meters2]; N/A if no data available
130-132    Orbital Status Code
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



CREATE TABLE `satcats` (
  `id` varchar(20) NOT NULL,
  `norad` varchar(20) NOT NULL,
  `multiple` varchar(1) NOT NULL,
  `payload` varchar(1) NOT NULL,
  `operationalstatus` varchar(1) NOT NULL,
  `name` varchar(40) NOT NULL,
  `owner` varchar(10) NOT NULL,
  `launchdate` varchar(20) NOT NULL,
  `site_id` varchar(20) NOT NULL,
  `decaydate` varchar(20) NOT NULL,
  `period` varchar(10) NOT NULL,
  `inclination` varchar(10) NOT NULL,
  `apogee` varchar(10) NOT NULL,
  `perigee` varchar(10) NOT NULL,
  `radarcrosssection` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

*/
