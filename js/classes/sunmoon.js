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
var AGSUNMOON = function() {
    'use strict';
    
	var DEG2RAD = Math.PI / 180.0;
	var RAD2DEG = 180.0 / Math.PI;

	function sunxyz(jday) {
		// return x,y,z ecliptic coordinates, distance, true longitude
		// days counted from 1999 Dec 31.0 UT
		var d = jday - 2451543.5;
		var w = 282.9404 + 4.70935E-5 * d;
		// argument of perihelion
		var e = 0.016709 - 1.151E-9 * d;
		var M = rev(356.0470 + 0.9856002585 * d);
		// mean anomaly
		var E = M + e * RAD2DEG * sind(M) * (1.0 + e * cosd(M));
		var xv = cosd(E) - e;
		var yv = Math.sqrt(1.0 - e * e) * sind(E);
		var v = atan2d(yv, xv);
		// true anomaly
		var r = Math.sqrt(xv * xv + yv * yv);
		// distance
		var lonsun = rev(v + w);
		// true longitude
		var xs = r * cosd(lonsun);
		// rectangular coordinates, zs = 0 for sun
		var ys = r * sind(lonsun);
		return new Array(xs, ys, 0, r, lonsun, 0);
	}
	function SunAlt(jday, obs) {
		// return alt, az, time angle, ra, dec, ecl. long. and lat=0, illum=1, 0,
		// dist, brightness
		var sdat = sunxyz(jday);
		var ecl = 23.4393 - 3.563E-7 * (jday - 2451543.5);
		var xe = sdat[0];
		var ye = sdat[1] * cosd(ecl);
		var ze = sdat[1] * sind(ecl);
		var ra = rev(atan2d(ye, xe));
		var dec = atan2d(ze, Math.sqrt(xe * xe + ye * ye));
		var topo = radec2aa(ra, dec, jday, obs);
		return new Array(topo[0], topo[1], topo[2], ra, dec, sdat[4], 0, 1, 0,
				sdat[3], -26.74);
	}
	// Sun rise and set times (if twilight==-0.833) or desired twilight time. Return
	// julian days
	function sunrise(obs, twilight) {
		// obs is a reference variable make a copy
		var obscopy = {};
		for ( var i in obs) {
			obscopy[i] = obs[i];
		}
		obscopy.hours = 12;
		obscopy.minutes = 0;
		obscopy.seconds = 0;
		var riseset = new Array(0.0, 0.0, false, 0.0, 0.0);
		var lst = local_sidereal(obscopy);
		var jday = jd(obscopy);
		var radec = SunAlt(jday, obscopy);
		var ra = radec[3];
		var dec = radec[4];
		var UTsun = 12.0 + ra / 15.0 - lst;
		if (UTsun < 0.0) {
			UTsun += 24.0;
		}
		if (UTsun > 24.0) {
			UTsun -= 24.0;
		}
		var cosLHA = (sind(twilight) - sind(obs.latitude) * sind(dec))
				/ (cosd(obs.latitude) * cosd(dec));
		// Check for midnight sun and midday night. "riseset[2]" false if no rise
		// and set found
		riseset[2] = false;
		if (cosLHA <= 1.0 && cosLHA >= -1.0) {
			// rise/set times allowing for not today.
			riseset[2] = true;
			var lha = acosd(cosLHA) / 15.0;
			if ((UTsun - lha) < 0.0) {
				var rtime = 24.0 + UTsun - lha;
			} else {
				var rtime = UTsun - lha;
			}
			riseset[0] = jday + rtime / 24.0 - 0.5;
			if ((UTsun + lha) > 24.0) {
				var stime = UTsun + lha - 24.0;
			} else {
				var stime = UTsun + lha;
				riseset[4] = stime;
			}
			riseset[1] = jday + stime / 24.0 - 0.5;
			// riseset[3] and [4] are times in UT hours
			riseset[3] = rtime;
			riseset[4] = stime;
		}
		return (riseset);
	}
	function MoonPos(jday, obs) {
		// MoonPos calculates the Moon position and distance, based on Meeus chapter
		// 47
		// and the illuminated percentage from Meeus equations 48.4 and 48.1
		// OPN: This version of MoonPos calculates the position to a precision of
		// about 2' or so
		// All T^2, T^3 and T^4 terms skipped. NB: Time is not taken from obs but
		// from jday (julian day)
		// Returns alt, az, hour angle, ra, dec (geocentr!), eclip. long and lat
		// (geocentr!),
		// illumination, distance, brightness and phase angle
		var T = (jday - 2451545.0) / 36525;
		// Moons mean longitude L'
		var LP = rev(218.3164477 + 481267.88123421 * T);
		// Moons mean elongation
		var D = rev(297.8501921 + 445267.1114034 * T);
		// Suns mean anomaly
		var M = rev(357.5291092 + 35999.0502909 * T);
		// Moons mean anomaly M'
		var MP = rev(134.9633964 + 477198.8675055 * T);
		// Moons argument of latitude
		var F = rev(93.2720950 + 483202.0175233 * T);
		// The "further arguments" A1, A2 and A3 and the term E have been ignored
		// Sum of most significant terms from table 45.A and 45.B (terms less than
		// 0.004 deg / 40 km dropped)
		var Sl = 6288774 * sind(MP) + 1274027 * sind(2 * D - MP) + 658314
				* sind(2 * D) + 213618 * sind(2 * MP) - 185116 * sind(M) - 114332
				* sind(2 * F) + 58793 * sind(2 * D - 2 * MP) + 57066
				* sind(2 * D - M - MP) + 53322 * sind(2 * D + MP) + 45758
				* sind(2 * D - M) - 40923 * sind(M - MP) - 34720 * sind(D) - 30383
				* sind(M + MP) + 15327 * sind(2 * D - 2 * F) - 12528
				* sind(MP + 2 * F) + 10980 * sind(MP - 2 * F) + 10675
				* sind(4 * D - MP) + 10034 * sind(3 * MP) + 8548
				* sind(4 * D - 2 * MP) - 7888 * sind(2 * D + M - MP) - 6766
				* sind(2 * D + M) - 5163 * sind(D - MP) + 4987 * sind(D + M) + 4036
				* sind(2 * D - M + MP);
		var Sb = 5128122 * sind(F) + 280602 * sind(MP + F) + 277602 * sind(MP - F)
				+ 173237 * sind(2 * D - F) + 55413 * sind(2 * D - MP + F) + 46271
				* sind(2 * D - MP - F) + 32573 * sind(2 * D + F) + 17198
				* sind(2 * MP + F) + 9266 * sind(2 * D + MP - F) + 8822
				* sind(2 * MP - F) + 8216 * sind(2 * D - M - F) + 4324
				* sind(2 * D - 2 * MP - F) + 4200 * sind(2 * D + MP + F);
		var Sr = (-20905355) * cosd(MP) - 3699111 * cosd(2 * D - MP) - 2955968
				* cosd(2 * D) - 569925 * cosd(2 * MP) + 246158
				* cosd(2 * D - 2 * MP) - 152138 * cosd(2 * D - M - MP) - 170733
				* cosd(2 * D + MP) - 204586 * cosd(2 * D - M) - 129620
				* cosd(M - MP) + 108743 * cosd(D) + 104755 * cosd(M + MP) + 79661
				* cosd(MP - 2 * F) + 48888 * cosd(M);
		// geocentric longitude, latitude
		var mglong = rev(LP + Sl / 1000000.0);
		var mglat = Sb / 1000000.0;
		// Obliquity of Ecliptic
		var obl = 23.4393 - 3.563E-7 * (jday - 2451543.5);
		var ra = rev(atan2d(sind(mglong) * cosd(obl) - tand(mglat) * sind(obl),
				cosd(mglong)));
		var dec = asind(sind(mglat) * cosd(obl) + cosd(mglat) * sind(obl)
				* sind(mglong));
		var moondat = radec2aa(ra, dec, jday, obs);
		// phase angle (48.4)
		var pa = Math.abs(180.0 - D - 6.289 * sind(MP) + 2.100 * sind(M) - 1.274
				* sind(2 * D - MP) - 0.658 * sind(2 * D) - 0.214 * sind(2 * MP)
				- 0.11 * sind(D));
		var k = (1 + cosd(pa)) / 2;
		var mr = Math.round(385000.56 + Sr / 1000.0);
		var h = moondat[0];
		// correct for parallax, equatorial horizontal parallax, see Meeus p. 337
		h -= asind(6378.14 / mr) * cosd(h);
		// brightness, use Paul Schlyter's formula (based on common phase law for
		// Moon)
		var sdat = sunxyz(jday);
		var r = sdat[3];
		// Earth (= Moon) distance to Sun in AU
		var R = mr / 149598000;
		// Moon distance to Earth in AU
		var mag = 0.23 + 5 * log10(r * R) + 0.026 * pa + 4.0E-9 * pa * pa * pa * pa;
		
		
		
        var j;
        var ip, ag;
        ip = (jday + 4.867) / 29.53059;
        ip = ip - Math.floor(ip);
        if(ip < 0.5)
        {
            ag = ip * 29.53059 + 29.53059 / 2;
        }
        else
        {
            ag = ip * 29.53059 - 29.53059 / 2;
        }
        ag = Math.floor(ag) + 1;
        
        
		return new Array(h, moondat[1], moondat[2], ra, dec, mglong, mglat, k, r,
				mr, mag, ag);
	}
	
	// Moonpos()
	function radec2aa(ra, dec, jday, obs) {
		// Convert ra/dec to alt/az, also return hour angle, azimut = 0 when north
		// DOES NOT correct for parallax!
		// TH0=Greenwich sid. time (eq. 12.4), H=hour angle (chapter 13)
		var TH0 = 280.46061837 + 360.98564736629 * (jday - 2451545.0);
		var H = rev(TH0 - obs.longitude - ra);
		var alt = asind(sind(obs.latitude) * sind(dec) + cosd(obs.latitude)
				* cosd(dec) * cosd(H));
		var az = atan2d(sind(H), (cosd(H) * sind(obs.latitude) - tand(dec)
				* cosd(obs.latitude)));
		return new Array(alt, rev(az + 180.0), H);
	}
	
	function rev(angle) {
		return angle - Math.floor(angle / 360.0) * 360.0;
	}
	// 0<=a<360
	function rev2(angle) {
		var a = rev(angle);
		return (a >= 180 ? a - 360.0 : a);
	}
	// -180<=a<180
	function sind(angle) {
		return Math.sin(angle * DEG2RAD);
	}
	function cosd(angle) {
		return Math.cos(angle * DEG2RAD);
	}
	function tand(angle) {
		return Math.tan(angle * DEG2RAD);
	}
	function asind(c) {
		return RAD2DEG * Math.asin(c);
	}
	function acosd(c) {
		return RAD2DEG * Math.acos(c);
	}
	function atand(c) {
		return RAD2DEG * Math.atan(c);
	}
	function atan2d(y, x) {
		return RAD2DEG * Math.atan2(y, x);
	}
	function log10(x) {
		return Math.LOG10E * Math.log(x);
	}
	function sqr(x) {
		return x * x;
	}
	function cbrt(x) {
		return Math.pow(x, 1 / 3.0);
	}
	function SGN(x) {
		return (x < 0) ? -1 : +1;
	}
	
	return {
		getMoonPos : function(jday, obs) {
			return MoonPos(jday, obs);
		},
		getSunPos : function(jday, obs) {
			return SunAlt(jday, obs);
		},
		getMoonPhase : function(jday) {
	        var j;
	        var ip, ag;
	        ip = (jday + 4.867) / 29.53059;
	        ip = ip - Math.floor(ip);
	        if(ip < 0.5)
	        {
	            ag = ip * 29.53059 + 29.53059 / 2;
	        }
	        else
	        {
	            ag = ip * 29.53059 - 29.53059 / 2;
	        }
	        ag = Math.floor(ag) + 1;
	        
	        return ag;
		}		
	}
};