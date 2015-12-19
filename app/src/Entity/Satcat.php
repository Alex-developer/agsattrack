<?php

namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="satcats")
 */
class SatCat
{
    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=20)
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=20)
     */
    protected $norad;

    /**
     * @ORM\Column(type="string", length=1)
     */
    protected $multiple;

    /**
     * @ORM\Column(type="string", length=1)
     */
    protected $payload;

    /**
     * @ORM\Column(type="string", length=1)
     */
    protected $operationalstatus;

    /**
     * @ORM\Column(type="string", length=40)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=10)
     */
    protected $owner;

    /**
     * @ORM\Column(type="string", length=20)
     */
    protected $launchdate;

    /**
     * @ORM\Column(type="string", length=20)
     */
    protected $site_id;

    /**
     * @ORM\Column(type="string", length=20)
     */
    protected $decaydate;

    /**
     * @ORM\Column(type="string", length=10)
     */
    protected $period;

    /**
     * @ORM\Column(type="string", length=10)
     */
    protected $inclination;

    /**
     * @ORM\Column(type="string", length=10)
     */
    protected $apogee;

    /**
     * @ORM\Column(type="string", length=10)
     */
    protected $perigee;

    /**
     * @ORM\Column(type="string", length=20)
     */
    protected $radarcrosssection;

    /**
     * @ORM\Column(type="string", length=10)
     */
    protected $status;

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
    public function getNorad() {
        return $this->norad;
    }

    /**
     * @param mixed $norad
     */
    public function setNorad($norad) {
        $this->norad = $norad;
    }

    /**
     * @return mixed
     */
    public function getMultiple() {
        return $this->multiple;
    }

    /**
     * @param mixed $multiple
     */
    public function setMultiple($multiple) {
        $this->multiple = $multiple;
    }

    /**
     * @return mixed
     */
    public function getPayload() {
        return $this->payload;
    }

    /**
     * @param mixed $payload
     */
    public function setPayload($payload) {
        $this->payload = $payload;
    }

    /**
     * @return mixed
     */
    public function getOperationalstatus() {
        return $this->operationalstatus;
    }

    /**
     * @param mixed $operationalstatus
     */
    public function setOperationalstatus($operationalstatus) {
        $this->operationalstatus = $operationalstatus;
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
    public function getOwner() {
        return $this->owner;
    }

    /**
     * @param mixed $owner
     */
    public function setOwner($owner) {
        $this->owner = $owner;
    }

    /**
     * @return mixed
     */
    public function getLaunchdate() {
        return $this->launchdate;
    }

    /**
     * @param mixed $launchdate
     */
    public function setLaunchdate($launchdate) {
        $this->launchdate = $launchdate;
    }

    /**
     * @return mixed
     */
    public function getSiteId() {
        return $this->site_id;
    }

    /**
     * @param mixed $site_id
     */
    public function setSiteId($site_id) {
        $this->site_id = $site_id;
    }

    /**
     * @return mixed
     */
    public function getDecaydate() {
        return $this->decaydate;
    }

    /**
     * @param mixed $decaydate
     */
    public function setDecaydate($decaydate) {
        $this->decaydate = $decaydate;
    }

    /**
     * @return mixed
     */
    public function getPeriod() {
        return $this->period;
    }

    /**
     * @param mixed $period
     */
    public function setPeriod($period) {
        $this->period = $period;
    }

    /**
     * @return mixed
     */
    public function getInclination() {
        return $this->inclination;
    }

    /**
     * @param mixed $inclination
     */
    public function setInclination($inclination) {
        $this->inclination = $inclination;
    }

    /**
     * @return mixed
     */
    public function getApogee() {
        return $this->apogee;
    }

    /**
     * @param mixed $apogee
     */
    public function setApogee($apogee) {
        $this->apogee = $apogee;
    }

    /**
     * @return mixed
     */
    public function getPerigee() {
        return $this->perigee;
    }

    /**
     * @param mixed $perigee
     */
    public function setPerigee($perigee) {
        $this->perigee = $perigee;
    }

    /**
     * @return mixed
     */
    public function getRadarcrosssection() {
        return $this->radarcrosssection;
    }

    /**
     * @param mixed $radarcrosssection
     */
    public function setRadarcrosssection($radarcrosssection) {
        $this->radarcrosssection = $radarcrosssection;
    }

    /**
     * @return mixed
     */
    public function getStatus() {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status) {
        $this->status = $status;
    }
}