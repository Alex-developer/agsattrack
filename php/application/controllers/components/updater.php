<?php
class AGSATTRACK_UPDATER {

    private $baseUrl = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=';
    
    public function updateAll() {
        $groups = Tlegroup::find('all');    
        foreach ($groups as $group) {
            $groupFilename = $group->id . '.txt';
            $this->updateGroup($groupFilename);       
        }
    }
    
    public function updateGroup($groupFilename) {
        $id =str_replace('.txt','',$groupFilename);
        $tle = $this->getTLE($groupFilename);
        if (strlen($tle) > 0) {
            Kep::delete_all(array('conditions' => array('kepsgroup' => $id)));

            $sat = new Kep();
            $sat->kepsgroup = $id;
            $sat->elements = $tle;
            $sat->date = time();
            $sat->save();
            return true;
        }
        return false;
    }
    
    private function getTLE($fileName) {

        $url = $this->baseUrl . $fileName;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $tmp = curl_exec($ch);
        curl_close($ch);

        return $tmp;
    }   
  
}