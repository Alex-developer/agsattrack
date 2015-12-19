<?php
namespace App\Action;

use Slim\Views\Twig;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManager;

final class GroupsAction {
    private $em;

    public function __construct(EntityManager $em) {
        $this->em = $em;      
    }

    public function dispatch($request, $response, $args) {
        $groups = $this->em->getRepository('App\Entity\Group')->findAll();
        $groups = array_map(
            function ($group) {              
                return $group->getArrayCopy();
            },
            $groups
        );
        return $response->withJSON($groups);
    }
}