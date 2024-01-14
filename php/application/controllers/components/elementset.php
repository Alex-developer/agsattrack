<?php
class AGSATTRACK_ELEMENTSET {

    function getAverageAge($elements) {
        
        $kepsArray = explode("\n", $elements);
        $length = count($kepsArray);
        $totalSets = 0;
        $total = 0;
        $today = new DateTime('now');
        for ($i=0; $i<$length;$i++) {
            $start = substr($kepsArray[$i],0,2);
            switch($start) {
                case '1 ':
                    $line1 = $kepsArray[$i];
                    break;

                case '2 ':
                    $line2 = $kepsArray[$i];
                    $epoch = (float) substr($line1, 18, 14);
                    $epoch_year = (int) substr($line1, 18, 2);
                    if ($epoch_year > 56) {
                        $epoch_year = $epoch_year + 1900;
                    } else {
                        $epoch_year = $epoch_year + 2000;
                    }                
                    $epoch_day = (int) substr($line1, 20, 3);
                    $date = new DateTime($epoch_year . '-01-01');
                    $date->add(new DateInterval('P'.$epoch_day.'D'));
                    $diff = $date->diff($today);
                    $total += $diff->format('%a');
                    $totalSets++;           
                    break;

                default:
                    $header = $kepsArray[$i];
                    $line1 = '';
                    $line2 = '';
                    break;
                        
            }
        }
        $averageAge = 999999;
        if ($totalSets > 0) {
            $averageAge = ceil($total / $totalSets);
        } 
        return $averageAge;
    }    
  
}