<?php
class SATCAT extends ActiveRecord\Model {

	static $belongs_to = array(
		array('SITE')
	);
}