<?php
namespace App\Action;

use Slim\Views\Twig;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManager;

final class ElementsAction {
    private $view;
    private $logger;
    private $baseUrl = 'http://www.celestrak.com/NORAD/elements/';
    
    public function __construct(EntityManager $em) {
        $this->em = $em;      
    }

    public function fetchOne($request, $response, $args) {
        $group = $args['group'];        
        $result = array(
            'id' => $group,
            'averageage' => 0,
            'updateat' => 5,
            'keps' => ''
        );  
       
        $elements = $this->em->getRepository('App\Entity\Elements')->findOneBy(
            array('kepsgroup' => $group)
        );       
        if ($elements) {
            $result['keps'] = $elements->getElements();
            $result['averageage'] = $this->getAverageAge($elements->getElements());
        }
                    
        return  $response->withJSON($result);
    }
    
    public function update($request, $response, $args) {
        $group = $args['group'];
        
        $elements = $this->em->getRepository('App\Entity\Elements')->findOneBy(
            array('kepsgroup' => $group)
        );
                    
        if ($elements) {
            $fileName = $group . '.txt';
            $tle = $this->curlElements($fileName);
            $elements->setElements($tle);
            
            $this->em->persist($elements);
            $this->em->flush();
        }                
    }
    
    private function curlElements($fileName) {
        $url = $this->baseUrl . '/' . $fileName;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $elements = curl_exec($ch);
        curl_close($ch);

        return $elements;        
    }
    
    private function getAverageAge($elements) {
        
        $kepsArray = explode("\n", $elements);
        $length = count($kepsArray);
        $totalSets = 0;
        $total = 0;
        $today = new \DateTime('now');
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
                    $date = new \DateTime($epoch_year . '-01-01');
                    $date->add(new \DateInterval('P'.$epoch_day.'D'));
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
        $averageAge = ceil($total / $totalSets);
        return $averageAge;
    }      
}