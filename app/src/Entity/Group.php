<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="tlegroups")
 */
class Group
{
    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=100)
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $name;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    protected $default;
    
    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getName() {
        return $this->name;
    }

    /**
     * @param mixed $id
     */
    public function setName($name) {
        $this->name = $name;
    }    
    
    /**
     * @return mixed
     */
    public function getDefault()
    {
        return $this->default;
    }

    /**
     * @param mixed $id
     */
    public function setDefault($default)
    {
        $this->id = $default;
    }
    
    public function getArrayCopy() {
        return get_object_vars($this);
    }    
}