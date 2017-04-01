<?php
class AGSATTRACK_FREQUENCY extends APPCONTROLLER {
    
    private $rawFile = 'http://www.ne.jp/asahi/hamradio/je9pel/satslist.csv';
    
    public function __construct($initData) {
        parent::__construct($initData);
    }
    
    public function update() {
        
        Frequency::query('delete from frequencies');
        
        $rawData = $this->getRawData();
        
        $rawDataArray = explode("\r\n", $rawData);
        foreach ($rawDataArray as $entry) {
            $rawLine = explode(';', $entry);
            $noradId = $rawLine[1];
            if ($noradId !== '') {
                $uplink = $rawLine[2];
                $downlink = $rawLine[3];
                $beacon = $rawLine[4];
                $mode = $rawLine[5];
                $callsign = $rawLine[6];
                $type = $rawLine[7];
                
                $frequency = new Frequency();
                $frequency->norad = $noradId;
                $frequency->uplink = $uplink;
                $frequency->downlink = $downlink;
                $frequency->beacon = $beacon;
                $frequency->mode = $mode;
                $frequency->callsign = $callsign;
                $frequency->type = $type;
                $frequency->save();
                            
            }
        }
            
prd($rawDataArray) ;          
        die();
    }
    
    private function getRawData() {
        $url = $this->rawFile;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $tmp = curl_exec($ch);
        curl_close($ch);

        return $tmp;
    } 
        
}

/**
*                                                                                                                       Active (*)
                                                                                                                      Deep space (d)
                                                                                                                      Failure (f)
                                                                                                                      Inactive (i)
                                                                                                                      Non-amateur (n)
                                                                                                                      Re-entered (r)
                                                                                                                      Unknown (u)
Satellite               Number   Uplink            Downlink          Beacon      Mode                  Callsign       Weather sat (w)
-----------------       -----    -----------       -----------       -------     -----------------     ------------   ---------------
*/
