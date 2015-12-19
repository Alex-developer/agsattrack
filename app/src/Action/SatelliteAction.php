<?php
namespace App\Action;

use Slim\Views\Twig;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManager;

final class satelliteAction {
    private $em;

    public function __construct(EntityManager $em) {
        $this->em = $em;      
    }

    public function fetchOne($request, $response, $args) {
        $noradid = $args['noradid'];        

        $result = [];
       
        $satData = $this->em->getRepository('App\Entity\SatCat')->findOneBy(
            array('norad' => $noradid)
        );            
        if ($satData) {
            $result[] = Array('field'=>'noradid', 'value'=>$satData->getNorad());
            $result[] = Array('field'=>'name', 'value'=>$satData->getName());
            $result[] = Array('field'=>'owner', 'value'=>$satData->getOwner());
            $result[] = Array('field'=>'Launch date', 'value'=>$satData->getLaunchdate());
            $result[] = Array('field'=>'period', 'value'=>$satData->getPeriod());
            $result[] = Array('field'=>'inclination', 'value'=>$satData->getInclination());
            $result[] = Array('field'=>'apogee', 'value'=>$satData->getApogee());
            $result[] = Array('field'=>'perigee', 'value'=>$satData->getPerigee());
        }
                    
        return  $response->withJSON($result);
    }
}