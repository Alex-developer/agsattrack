<?php
namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
* @ORM\Entity
* @ORM\Table(name="sites")
*/
class Locations
{
    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=20)
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $location;
}