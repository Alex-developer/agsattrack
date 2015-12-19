<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="keps")
 */
class Elements
{
    /**
     * @ORM\Id
     * @ORM\Column(name="id", type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $kepsgroup;

    /**
     * @ORM\Column(type="text")
     */
    protected $elements;

    /**
     * @ORM\Column(type="integer")
     */
    protected $date;

    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getKepsgroup() {
        return $this->kepsgroup;
    }

    /**
     * @param mixed $kepsgroup
     */
    public function setKepsgroup($kepsgroup) {
        $this->kepsgroup = $kepsgroup;
    }

    /**
     * @return mixed
     */
    public function getElements() {
        return $this->elements;
    }

    /**
     * @param mixed $elements
     */
    public function setElements($elements) {
        $this->elements = $elements;
    }

    /**
     * @return mixed
     */
    public function getDate() {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date) {
        $this->date = $date;
    }

    public function getArrayCopy() {
        return get_object_vars($this);
    } 
}