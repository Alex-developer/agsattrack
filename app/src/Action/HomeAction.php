<?php
namespace App\Action;

use Slim\Views\Twig;
use Psr\Log\LoggerInterface;

final class HomeAction {
    private $view;
    private $logger;

    public function __construct(Twig $view, LoggerInterface $logger) {
        $this->view = $view;
        $this->logger = $logger;
    }

    public function dispatch($request, $response, $args) {
        $this->view->render($response, 'home/home.twig');
        return $response;
    }
}
