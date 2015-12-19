<?php
namespace App\Action;

use Slim\Views\Twig;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManager;

final class LocationAction {
    private $em;

    public function __construct(EntityManager $em) {
        $this->em = $em;      
    }

    public function fetch($request, $response, $args) {
        $locations = $this->em->getRepository('App\Entity\Location')->findAll();
        $locations = array_map(
            function ($location) {              
                return [
                    'prefix' => $location->getPrefix(),
                    'shortname' => $location->getName(),
                    'name' => $location->getName() . ',' . $location->getCountry(),
                    'lat' => $location->getLat(),
                    'lon' => $location->getLon(),
                    'pop' => $location->getPopulation()
                ];
            },
            $locations
        );      
        return $response->withJSON($locations);
    }
}