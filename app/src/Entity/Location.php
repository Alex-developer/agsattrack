<?php
namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="locations")
 */
class Location {
    /**
     * @ORM\Id
     * @ORM\Column(name="id", type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=10)
     */
    protected $prefix;

    /**
     * @ORM\Column(type="decimal", precision=30, scale=20)
     */
    protected $lon;

    /**
     * @ORM\Column(type="decimal", precision=30, scale=20)
     */
    protected $lat;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $country;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $area;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     */
    protected $population;

    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id) {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getPrefix() {
        return $this->prefix;
    }

    /**
     * @param mixed $prefix
     */
    public function setPrefix($prefix) {
        $this->prefix = $prefix;
    }

    /**
     * @return mixed
     */
    public function getLon() {
        return $this->lon;
    }

    /**
     * @param mixed $lon
     */
    public function setLon($lon) {
        $this->lon = $lon;
    }

    /**
     * @return mixed
     */
    public function getLat() {
        return $this->lat;
    }

    /**
     * @param mixed $lat
     */
    public function setLat($lat) {
        $this->lat = $lat;
    }

    /**
     * @return mixed
     */
    public function getName() {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name) {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getCountry() {
        return $this->country;
    }

    /**
     * @param mixed $country
     */
    public function setCountry($country) {
        $this->country = $country;
    }

    /**
     * @return mixed
     */
    public function getArea() {
        return $this->area;
    }

    /**
     * @param mixed $area
     */
    public function setArea($area) {
        $this->area = $area;
    }

    /**
     * @return mixed
     */
    public function getPopulation() {
        return $this->population;
    }

    /**
     * @param mixed $population
     */
    public function setPopulation($population) {
        $this->population = $population;
    }

    public function getArrayCopy() {
        return get_object_vars($this);
    } 
}