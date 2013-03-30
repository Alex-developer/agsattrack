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
}