<?php
require_once 'php/php-activerecord/ActiveRecord.php';

ActiveRecord\Config::initialize(function($cfg)
{
	$cfg->set_model_directory(dirname(__FILE__) . '/php/models');
	$cfg->set_connections(array('development' => 'mysql://alex_agsattrack:Xac06T9TQe@127.0.0.1/alex_agsattrack'));
});

if (isset($_GET['keps'])) {
	$keysId = $_GET['keps'];
	$keps = Kep::find('first', array('conditions' => array('kepsgroup = ?', $keysId)));
	
    $ageData = checkAge($keps->elements);
    
	$data = Array(
		'id' => $keysId,
        'averageage' => $ageData,
        'updateat' => 5,
		'keps' => $keps->elements
	);
	header("Content-type: application/json");
	echo(json_encode($data));
	die();	
}


if (isset($_GET['id'])) {
	$satId = $_GET['id'];
	$satData = SATCAT::find('first', array('conditions' => array('norad = ?', $satId)));

	$data = Array();
	$data[] = Array('field'=>'noradid', 'value'=>$satData->norad);
	$data[] = Array('field'=>'name', 'value'=>$satData->name);
	$data[] = Array('field'=>'owner', 'value'=>$satData->owner);
	$data[] = Array('field'=>'Launch date', 'value'=>$satData->launchdate);
	//$data[] = Array('field'=>'Launch Site', 'value'=>$satData->site_id->location);
	$data[] = Array('field'=>'period', 'value'=>$satData->period);
	$data[] = Array('field'=>'inclination', 'value'=>$satData->inclination);
	$data[] = Array('field'=>'apogee', 'value'=>$satData->apogee);
	$data[] = Array('field'=>'perigee', 'value'=>$satData->perigee);
	
	/*
	$sat->norad = $this->getField($satellite,'norad');
	$sat->multiple = $this->getField($satellite,'multiple');
	$sat->payload = $this->getField($satellite,'payload');
	$sat->operationalstatus = $this->getField($satellite,'operationalstatus');
	$sat->name = $this->getField($satellite,'name');
	$sat->owner = $this->getField($satellite,'owner');
	$sat->launchdate = $this->getField($satellite,'launchdate');
	$sat->site_id = $this->getField($satellite,'launchsite');
	$sat->decaydate = $this->getField($satellite,'decaydate');
	$sat->period = $this->getField($satellite,'period');
	$sat->inclination = $this->getField($satellite,'inclination');
	$sat->apogee = $this->getField($satellite,'apogee');
	$sat->perigee = $this->getField($satellite,'perigee');
	$sat->radarcrosssection = $this->getField($satellite,'radarcrosssection');
	$sat->status = $this->getField($satellite,'status');
	*/
	
	header("Content-type: application/json");
	echo(json_encode($data));
	die();	
	print_r($data);die();
}


$groups = Array();
foreach (Tlegroup::find('all') as $group) {
	$groups[] = Array(
		'id'=>$group->id,
		'name'=>$group->name,
		'selected' => ($group->default?true:false)
	);
}

header("Content-type: application/json");
echo(json_encode($groups));

function checkAge($elements) {
    
    $kepsArray = explode("\n", $elements);
    $length = count($kepsArray);
    $totalSets = 0;
    $total = 0;
    $today = new DateTime('now');
    for ($i=0; $i<$length;$i++) {
        $start = substr($kepsArray[$i],0,2);
        switch($start) {
            case '1 ':
                $line1 = $kepsArray[$i];
                break;

            case '2 ':
                $line2 = $kepsArray[$i];
                $result = new Predict_TLE($header, $line1, $line2);
                $year = $result->epoch_year;
                $date = new DateTime($year . '-01-01');
                $date->add(new DateInterval('P'.$result->epoch_day.'D'));
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

class Predict_TLE
{
    public $header;     /* Header line of TLE file */
    public $line1;      /* Line 1 of TLE */
    public $line2;      /* Line 2 of TLE */
    public $epoch;      /*!< Epoch Time in NORAD TLE format YYDDD.FFFFFFFF */
    public $epoch_year; /*!< Epoch: year */
    public $epoch_day;  /*!< Epoch: day of year */
    public $epoch_fod;  /*!< Epoch: Fraction of day. */
    public $xndt2o;     /*!< 1. time derivative of mean motion */
    public $xndd6o;     /*!< 2. time derivative of mean motion */
    public $bstar;      /*!< Bstar drag coefficient. */
    public $xincl;      /*!< Inclination */
    public $xnodeo;     /*!< R.A.A.N. */
    public $eo;         /*!< Eccentricity */
    public $omegao;     /*!< argument of perigee */
    public $xmo;        /*!< mean anomaly */
    public $xno;        /*!< mean motion */

    public $catnr;      /*!< Catalogue Number.  */
    public $elset;      /*!< Element Set number. */
    public $revnum;     /*!< Revolution Number at epoch. */

    public $sat_name;   /*!< Satellite name string. */
    public $idesg;      /*!< International Designator. */
    public $status;     /*!< Operational status. */

    /* values needed for squint calculations */
    public $xincl1;
    public $xnodeo1;
    public $omegao1;


    /* Converts the strings in a raw two-line element set  */
    /* to their intended numerical values. No processing   */
    /* of these values is done, e.g. from deg to rads etc. */
    /* This is done in the select_ephemeris() function.    */
    public function __construct($header, $line1, $line2)
    {
        if (!$this->Good_Elements($line1, $line2)) {
            return false;
        }

        $this->header = $header;
        $this->line1  = $line1;
        $this->line2  = $line2;

        /** Decode Card 1 **/
        /* Satellite's catalogue number */
        $this->catnr = (int) substr($line1, 2, 5);

        /* International Designator for satellite */
        $this->idesg = substr($line1, 9, 8);

        /* Epoch time; this is the complete, unconverted epoch. */
        $this->epoch = (float) substr($line1, 18, 14);

        /* Now, convert the epoch time into year, day
           and fraction of day, according to:

           YYDDD.FFFFFFFF
        */

        // Adjust for 2 digit year through 2056
        $this->epoch_year = (int) substr($line1, 18, 2);
        if ($this->epoch_year > 56) {
            $this->epoch_year = $this->epoch_year + 1900;
        } else {
            $this->epoch_year = $this->epoch_year + 2000;
        }

        /* Epoch day */
        $this->epoch_day = (int) substr($line1, 20, 3);

        /* Epoch fraction of day */
        $this->epoch_fod = (float) substr($line1, 23, 9);


        /* Satellite's First Time Derivative */
        $this->xndt2o = (float) substr($line1, 33, 10);

        /* Satellite's Second Time Derivative */
        $this->xndd6o = (float) (substr($line1, 44, 1) . '.' . substr($line1, 45, 5) . 'E' . substr($line1, 50, 2));

        /* Satellite's bstar drag term
           FIXME: How about buff[0] ????
        */
        $this->bstar = (float) (substr($line1, 53, 1) . '.' . substr($line1, 54, 5) . 'E' . substr($line1, 59, 2));

        /* Element Number */
        $this->elset = (int) substr($line1, 64, 4);

        /** Decode Card 2 **/
        /* Satellite's Orbital Inclination (degrees) */
        $this->xincl = (float) substr($line2, 8, 8);

        /* Satellite's RAAN (degrees) */
        $this->xnodeo = (float) substr($line2, 17, 8);

        /* Satellite's Orbital Eccentricity */
        $this->eo = (float) ('.' . substr($line2, 26, 7));

        /* Satellite's Argument of Perigee (degrees) */
        $this->omegao = (float) substr($line2, 34, 8);

        /* Satellite's Mean Anomaly of Orbit (degrees) */
        $this->xmo = (float) substr($line2, 43, 8);

        /* Satellite's Mean Motion (rev/day) */
        $this->xno = (float) substr($line2, 52, 11);

        /* Satellite's Revolution number at epoch */
        $this->revnum = (float) substr($line2, 63, 5);
    }

    /* Calculates the checksum mod 10 of a line from a TLE set and */
    /* returns true if it compares with checksum in column 68, else false.*/
    /* tle_set is a character string holding the two lines read    */
    /* from a text file containing NASA format Keplerian elements. */
    /* NOTE!!! The stuff about two lines is not quite true.
       The function assumes that tle_set[0] is the begining
       of the line and that there are 68 elements - see the consumer
    */
    public function Checksum_Good($tle_set)
    {
        if (strlen($tle_set) < 69) {
            return false;
        }

        $checksum = 0;

        for ($i = 0; $i < 68; $i++) {
            if (($tle_set[$i] >= '0') && ($tle_set[$i] <= '9')) {
                $value = $tle_set[$i] - '0';
            } else if ($tle_set[$i] == '-' ) {
                $value = 1;
            } else {
                $value = 0;
            }

            $checksum += $value;
        }

        $checksum   %= 10;
        $check_digit = $tle_set[68] - '0';

        return $checksum == $check_digit;
    }

    /* Carries out various checks on a TLE set to verify its validity */
    /* $line1 is the first line of the TLE, $line2 is the second line */
    /* from a text file containing NASA format Keplerian elements. */
    public function Good_Elements($line1, $line2)
    {
        /* Verify checksum of both lines of a TLE set */
        if (!$this->Checksum_Good($line1) || !$this->Checksum_Good($line2)) {
            return false;
        }

        /* Check the line number of each line */
        if (($line1[0] != '1') || ($line2[0] != '2')) {
            return false;
        }

        /* Verify that Satellite Number is same in both lines */
        if (strncmp($line1[2], $line2[2], 5) != 0) {
            return false;
        }

        /* Check that various elements are in the right place */
        if (($line1[23] != '.') ||
            ($line1[34] != '.') ||
            ($line2[11] != '.') ||
            ($line2[20] != '.') ||
            ($line2[37] != '.') ||
            ($line2[46] != '.') ||
            ($line2[54] != '.') ||
            (strncmp(substr($line1, 61), ' 0 ', 3) != 0)) {

            return false;
        }

        return true;
    }
}