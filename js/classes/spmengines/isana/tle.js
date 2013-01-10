/*
Copyright 2012 Alex Greenland

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */ 
var AGTLE = function(line0, line1, line2) {
	'use strict';

	var name = line0;
	var sgp4 = null;
	var _displaying = false;
	
	var orbital_elements = {
		line_number_1 : Number(line1.slice(0, 0)),
		catalog_no_1 : line1.slice(2, 7),
		security_classification : Number(line1.slice(8, 8)),
		international_identification : Number(line1.slice(9, 17)),
		epoch_year : Number(line1.slice(18, 20)),
		epoch : Number(line1.substring(20, 32)),
		first_derivative_mean_motion : Number(line1.substring(33, 43)),
		second_derivative_mean_motion : Number(line1.substring(44, 52)),
		bstar_mantissa : Number(line1.substring(53, 59)),
		bstar_exponent : Number(line1.substring(59, 61)),
		ephemeris_type : Number(line1.substring(62, 63)),
		element_number : Number(line1.substring(64, 68)),
		check_sum_1 : Number(line1.substring(69, 69)),
		line_number_2 : Number(line1.slice(0, 0)),
		catalog_no_2 : Number(line2.slice(2, 7)),
		inclination : Number(line2.substring(8, 16)),
		right_ascension : Number(line2.substring(17, 25)),
		eccentricity : Number(line2.substring(26, 33)),
		argument_of_perigee : Number(line2.substring(34, 42)),
		mean_anomaly : Number(line2.substring(43, 51)),
		mean_motion : Number(line2.substring(52, 63)),
		rev_number_at_epoch : Number(line2.substring(64, 68)),
		check_sum_2 : Number(line1.substring(68, 69))
	}
	
    
	return {
		
		isDisplaying: function() {
			return _displaying;
		},
		setDisplaying: function(displaying) {
			_displaying = displaying;
		},
		getElements: function() {
			return orbital_elements;
		},
		getName : function() {
			return name;	
		},
		getCatalogNumber : function() {
			return orbital_elements.catalog_no_1;
		},		
		elapsedTime : function(epoch_year, epoch, date) {
			var d = new Date();
			d.setTime(date.getTime())
			var year = d.getUTCFullYear();
			var month = d.getUTCMonth() + 1;
			var day = d.getUTCDate();
			var hours = d.getUTCHours();
			var minutes = d.getUTCMinutes();
			var seconds = d.getUTCSeconds();
			var year2 = epoch_year - 1;
			var now_sec = Date.UTC(year, month - 1, day, hours, minutes,
					seconds);
			var epoch_sec = Date.UTC(year2, 11, 31, 0, 0, 0)
					+ (epoch * 24 * 60 * 60 * 1000);
			var elapsed_time = (now_sec - epoch_sec) / (60 * 1000);
			return elapsed_time; // .toFixed(2);
		}

	}
}