<?php
class AGSATTRACK_SATELLITE extends APPCONTROLLER {
    public $components = Array('ELEMENTSET');
    
    public function __construct($initData) {
        parent::__construct($initData);
    }
    
    public function getSatelliteData() {
        $this->checkQS(array(
            'group' => array(
                'qsvar' => 'id',
                'default' => '',
                'fatal' => true
            )
        ));
        $satId = $_GET['id'];
        $satData = SATCAT::find('first', array('conditions' => array('norad = ?', $satId)));

        $this->output = Array();
        $this->output[] = Array('field'=>'noradid', 'value'=>$satData->norad);
        $this->output[] = Array('field'=>'name', 'value'=>$satData->name);
        $this->output[] = Array('field'=>'owner', 'value'=>$satData->owner);
        $this->output[] = Array('field'=>'Launch date', 'value'=>$satData->launchdate);
        //$this->output[] = Array('field'=>'Launch Site', 'value'=>$satData->site_id->location);
        $this->output[] = Array('field'=>'period', 'value'=>$satData->period);
        $this->output[] = Array('field'=>'inclination', 'value'=>$satData->inclination);
        $this->output[] = Array('field'=>'apogee', 'value'=>$satData->apogee);
        $this->output[] = Array('field'=>'perigee', 'value'=>$satData->perigee);
    }

    public function getLocationDatabase() {
        $locData = Location::find('all');
        $data = Array();
        foreach ($locData as $location) {
            $data[] = Array(
                'prefix' => $location->prefix,
                'name' => $location->name,
                'lat' => $location->lat,
                'lon' => $location->lon
            );
        }
        $this->output = $data;
    }
    
    public function getDX() {
        $this->checkQS(array(
            'lat' => array(
                'qsvar' => 'lat',
                'default' => '',
                'fatal' => true
            ),
            'lon' => array(
                'qsvar' => 'lon',
                'default' => '',
                'fatal' => true
            ),
            'fp' => array(
                'qsvar' => 'fp',
                'default' => '',
                'fatal' => true
            )                       
        ));
        
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
        $fp = $_GET['fp'];
        
        $locData = Location::find('all');
        foreach ($locData as $location) {
            $locLat =  $location->lat;   
            $locLon =  $location->lon;
            
            $result = $this->locationVisible($lat, $lon, $fp, $locLat, $locLon);
            if ($result !== false) {
                echo($location->name . " " . $result. "\n");
            }
               
        }
               
    }
    
    private function locationVisible($lat1, $lon1, $radius, $lat2, $lon2) {
        $lat1 = deg2rad($lat1); $lat2 = deg2rad($lat2);
        $lon1 = deg2rad($lon1); $lon2 = deg2rad($lon2);
        $dlon = $lon2 - $lon1;
        $distance =
          6372.795 *
          atan2(
                sqrt(
                     pow(cos($lat2) * sin($dlon), 2) +
                     pow(cos($lat1) * sin($lat2) - sin($lat1) * cos($lat2) * cos($dlon), 2)
                )
                ,
                sin($lat1) * sin($lat2) + 
                cos($lat1) * cos($lat2) * cos($dlon)
          );

        if ($distance < $radius) {
            return $distance;
        }
        return false;            
        
    }
}