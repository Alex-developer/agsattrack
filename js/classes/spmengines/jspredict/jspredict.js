// jsPredict 0.0.1 by Peter Scott / OZ2ABA / OZ7SAT.
//

// Derived from:
// phpPredict 1.0.4 by Carl Fretwell
// Last Updated: 16 February 2011

// Implementation of NORAD SGP4/SDP4 algorithms in PHP for determining a satellites location and velocity in Earth orbit.
// Features now include sun tracking, sun predictions, moon tracking and moon predictions.

// This program is free software. You can redistribute it and/or modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2 of the License or any later version.

// Please feel free to send me any comments, suggestions or bug reports to carlfretwell@live.co.uk
// or visit my contact page at http://carlfretwell.com/contact




// Constants used throughout SGP4/SDP4 code

Globals = new function () {
    this.km2mi     = 0.621371;
    this.deg2rad   = 1.745329251994330E-2;
    this.pi        = 3.14159265358979323846;
    this.pio2      = 1.57079632679489656;
    this.x3pio2    = 4.71238898038468967;
    this.twopi     = 6.28318530717958623;
    this.e6a       = 1.0E-6;
    this.tothrd    = 6.6666666666666666E-1;
    this.xj2       = 1.0826158E-3;
    this.xj3       = -2.53881E-6;
    this.xj4       = -1.65597E-6;
    this.xke       = 7.43669161E-2;
    this.xkmper    = 6.378137E3;
    this.xmnpda    = 1.44E3;
    this.ae        = 1.0;
    this.ck2       = 5.413079E-4;
    this.ck4       = 6.209887E-7;
    this.f         = 3.35281066474748E-3;
    this.ge        = 3.986008E5;
    this.s         = 1.012229;
    this.qoms2t    = 1.880279E-09;
    this.secday    = 8.6400E4;
    this.omega_E   = 1.00273790934;
    this.omega_ER  = 6.3003879;
    this.zns       = 1.19459E-5;
    this.c1ss      = 2.9864797E-6;
    this.zes       = 1.675E-2;
    this.znl       = 1.5835218E-4;
    this.c1l       = 4.7968065E-7;
    this.zel       = 5.490E-2;
    this.zcosis    = 9.1744867E-1;
    this.zsinis    = 3.9785416E-1;
    this.zsings    = -9.8088458E-1;
    this.zcosgs    = 1.945905E-1;
    this.zcoshs    = 1;
    this.zsinhs    = 0;
    this.q22       = 1.7891679E-6;
    this.q31       = 2.1460748E-6;
    this.q33       = 2.2123015E-7;
    this.g22       = 5.7686396;
    this.g32       = 9.5240898E-1;
    this.g44       = 1.8014998;
    this.g52       = 1.0508330;
    this.g54       = 4.4108898;
    this.root22    = 1.7891679E-6;
    this.root32    = 3.7393792E-7;
    this.root44    = 7.3636953E-9;
    this.root52    = 1.1428639E-7;
    this.root54    = 2.1765803E-9;
    this.thdt      = 4.3752691E-3;
    this.rho       = 1.5696615E-1;
    this.mfactor   = 7.292115E-5;
    this.sr        = 6.96000E5;
    this.AU        = 1.49597870691E8;
}


// Classes
function vector () {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
}


// Two-line element satellite orbital data class used directly by the SGP4/SDP4 code.

function tle (name, line1, line2) {
    this.sat_name = name.replace (/^\s+|\s+$/g,"");
    this.idesg    = line1.substr (9, 8);
    this.catnum   = parseInt (line1.substr (2, 5));
    this.year     = parseInt (line1.substr (18, 2));
    this.refepoch = parseFloat (line1.substr (20, 12));
    this.epoch    = (1000.0 * this.year) + this.refepoch;
    this.xndt2o   = parseFloat (line1.substr (33, 10));
    this.drag     = this.xndt2o;
    this.xndd6o   = (1.0e-5 * parseFloat (line1.substr (44, 6)) / Math.pow (10.0, parseFloat (line1.substr (51, 1))));
    this.bstar    = (1.0e-5 * parseFloat (line1.substr (53, 6)) / Math.pow (10.0, parseFloat (line1.substr (60, 1))));
    this.xincl    = parseFloat (line2.substr (8, 8));
    this.incl     = this.xincl;
    this.xnodeo   = parseFloat (line2.substr (17, 8));
    this.eo       = 1.0e-07 * parseFloat (line2.substr (26, 7));
    this.eccn     = this.eo;
    this.omegao   = parseFloat (line2.substr (34, 8));
    this.xmo      = parseFloat (line2.substr (43, 8));
    this.meanan   = this.xmo;
    this.xno      = parseFloat (line2.substr (52, 11));
    this.meanmo   = this.xno;
    this.orbitnum = parseInt (line2.substr (63, 5));

    // Preprocess the values in the tle set so that they are
    // appropriate for the SGP4/SDP4 routines
    this.xnodeo   *= Globals.deg2rad;
    this.omegao   *= Globals.deg2rad;
    this.xmo      *= Globals.deg2rad;
    this.xincl    *= Globals.deg2rad;
    temp = ((Globals.twopi / Globals.xmnpda) / Globals.xmnpda);
    this.xno      = this.xno * temp * Globals.xmnpda;
    this.xndt2o   = this.xndt2o * temp;
    this.xndd6o   = this.xndd6o * temp / Globals.xmnpda;
    this.bstar    = this.bstar / Globals.ae;
    this.period   = 1440.0 / this.meanmo;
    sma = 331.25 * Math.exp (Math.log (1440.0 / this.meanmo) * (2.0 / 3.0));
    c1 = Math.cos (this.incl * Globals.deg2rad);
    e2 = 1.0 - (this.eccn * this.eccn);
    this.nodal_period = (this.period * 360.0) / (360.0 + (4.97 * Math.pow ((Globals.xkmper/sma), 3.5) * ((5.0 * c1 * c1) -1.0) / (e2 * e2)) / this.meanmo);

    // A period > 225 minutes is a deep space orbit satellite
    dd1 = (Globals.xke / this.xno);
    dd2 = Globals.tothrd;
    a1 = Math.pow (dd1, dd2);
    r1 = Math.cos (this.xincl);
    dd1 = (1.0 - this.eo * this.eo);
    temp = Globals.ck2 * 1.5 * (r1 * r1 * 3.0 - 1.0) / Math.pow (dd1, 1.5);
    del1 = temp / (a1 * a1);
    ao = a1 * (1.0 - del1 * (Globals.tothrd * 0.5 + del1 * (del1 * 1.654320987654321+1.0)));
    delo = temp / (ao * ao);
    xnodp = this.xno / (delo + 1.0);

    // Select a deep-space or near-earth ephemeris
    if (Globals.twopi / xnodp / Globals.xmnpda >= 0.15625) {
        this.deep = 1;
    } else {
        this.deep = 0;
    }
    // TODO: Fix this
    this.deep = 0;
}

// Satellite position class used by jsPredict
function sat () {
    this.lat = 0;
    this.lon = 0;
    this.alt = 0;
    this.footprint = 0;
    this.range = 0;
    this.range_rate = 0;
    this.vel = 0;
    this.azi = 0;
    this.ele = 0;
    this.eclipsed = 0;
    this.eclipse_depth = 0;
    this.visible = 0;
    this.age = 0;
}

// Sun position class used by jsPredict
function sun () {
    this.lat = 0;
    this.lon = 0;
    this.azi = 0;
    this.ele = 0;
    this.range = 0;
    this.range_rate = 0;
    this.ra = 0;
    this.dec = 0;
}

// Moon position class used by jsPredict
function moon () {
    this.lat = 0;
    this.lon = 0;
    this.azi = 0;
    this.ele = 0;
    this.dv = 0;
    this.ra = 0;
    this.dec = 0;
    this.gha = 0;
}

// Predict class used by jsPredict
function predict () {
    this.aos_daynum = 0;
    this.aos_ele = 0;
    this.aos_azi = 0;
    this.aos_lat = 0;
    this.aos_lon = 0;
    this.aos_range = 0;
    this.aos_ts = 0;
    this.aos_orbitnum = 0;
    this.los_daynum = 0;
    this.los_azi = 0;
    this.los_ele = 0;
    this.los_lat = 0;
    this.los_lon = 0;
    this.los_range = 0;
    this.los_ts = 0;
    this.los_orbitnum = 0;
    this.duration = 0;
}


// Geodetic position class used by SGP4/SDP4 code.
// The lat and lon needs to be passed in decimal degrees
function geodetic (lat, lon, alt) {
    this.lat   = lat;
    this.lon   = lon;
    this.alt   = alt;
    this.theta = 0;
}


// The workhorse of it all.
function jsPredict () {
    // Private flags
    this.SGP4_INITIALIZED_FLAG = 0;
    this.SDP4_INITIALIZED_FLAG = 0;
    this.SIMPLE_FLAG           = 0;
    this.LUNAR_TERMS_DONE_FLAG = 0;
    this.RESONANCE_FLAG        = 0;
    this.SYNCHRONOUS_FLAG      = 0;
    this.DO_LOOP_FLAG          = 0;
    this.EPOCH_RESTART_FLAG    = 0;

    // Private variables
    this.io_lat  = 'N';
    this.io_lon  = 'W';
    this.rv      = 0;
    this.irk     = 0;
    this.isplat  = 0;
    this.isplong = 0;
    this.iaz     = 0;
    this.iel     = 0;

    // Public variables
    this.sun_azi = 0;
    this.sun_ele = 0;
}

// Add in all the methods of jsPredict

// Private function.
jsPredict.prototype.reset_flags = function () {
    // Resets all flags
    this.SGP4_INITIALIZED_FLAG = 0;
    this.SDP4_INITIALIZED_FLAG = 0;
    this.SIMPLE_FLAG           = 0;
    this.LUNAR_TERMS_DONE_FLAG = 0;
    this.RESONANCE_FLAG        = 0;
    this.SYNCHRONOUS_FLAG      = 0;
    this.DO_LOOP_FLAG          = 0;
    this.EPOCH_RESTART_FLAG    = 0;
}

// Private function.
jsPredict.prototype.AosHappens = function (tle, obs_geodetic) {
    // This function returns a 1 if the satellite pointed to by
    // tle can ever rise above the horizon of the ground station.

    if (tle.meanmo == 0.0) {
        return 0;
    } else {
        lin = tle.incl;

        if (lin >= 90.0) {
            lin = 180.0 - lin;
        }

        sma = 331.25 * Math.exp (Math.log (1440.0 / tle.meanmo) * (2.0 / 3.0));
        apogee = sma * (1.0 + tle.eccn) - Globals.xkmper;

        if ((Math.acos (Globals.xkmper / (apogee + Globals.xkmper)) + (lin * Globals.deg2rad)) > Math.abs (obs_geodetic.lat)) {
            return 1;
        } else {
            return 0;
        }
    }
}


// Private function.
jsPredict.prototype.Geostationary = function (tle) {
    // This function returns a 1 if the satellite
    // appears to be in a geostationary orbit

    if (Math.abs (tle.meanmo - 1.0027) < 0.0002) {
        return 1;
    } else {
        return 0;
    }
}


// Private function.
jsPredict.prototype.Decayed = function (tle, time) {
    // This function returns a 1 if it appears that the
    // satellite pointed to by 'x' has decayed at the
    // time of 'time'.  If 'time' is 0.0, then the
    // current date/time is used.

    if (time == 0.0)
        time = this.current_daynum ();

    satepoch = this.DayNum (1,0, tle.year) + tle.refepoch;

    if (satepoch + ((16.666666 - tle.meanmo) / (10.0 * Math.abs (tle.drag))) < time) {
        return 1;
    }
    return 0;
}


// Private function.
jsPredict.prototype.FindAOS = function (tle, obs_geodetic, sat_data, daynum) {
    // This function finds and returns the time of AOS (aostime).

    if (this.AosHappens (tle, obs_geodetic) &&
        this.Geostationary (tle) == 0 &&
        this.Decayed (tle, daynum) == 0) {
        // Calculate initial position.
        this.calc (tle, obs_geodetic, sat_data, daynum);

        // Get the satellite in range
        while (sat_data.ele < -1.0) {
            // Shift time and recalculate.
            daynum -= 0.00035 * (sat_data.ele * ((sat_data.alt / 8400.0) + 0.46) - 2.0);
            this.calc (tle, obs_geodetic, sat_data, daynum);
        }

        // Find AOS
        while (Math.abs (sat_data.ele) > 0.03) {
            // Shift time and recalculate.
            daynum -= sat_data.ele * Math.sqrt (sat_data.alt) / 530000.0;
            this.calc (tle, obs_geodetic, sat_data, daynum);
        }
    }

    return daynum;    // Return the updated daynum variable.
}


// Private function.
jsPredict.prototype.NextAOS = function (tle, obs_geodetic, sat_data, daynum) {
    // This function finds and returns the time of the next
    // AOS for a satellite that is currently in range.

    if (this.AosHappens (tle, obs_geodetic) &&
        this.Geostationary (tle) == 0 &&
        this.Decayed (tle, daynum)==0) {
        daynum = this.FindLOS2 (tle, obs_geodetic, sat_data, daynum);  /* Move to LOS + 20 minutes */
    }

    daynum += 0.014;
    daynum = this.FindAOS (tle, obs_geodetic, sat_data, daynum);

    return daynum;    // Return the updated daynum variable.
}


// Private function.
jsPredict.prototype.FindLOS = function (tle, obs_geodetic, sat_data, daynum) {
    if (this.AosHappens (tle, obs_geodetic) &&
        this.Geostationary (tle) == 0 &&
        this.Decayed (tle, daynum) == 0) {
        // Calculate initial location.
        this.calc (tle, obs_geodetic, sat_data, daynum);

        do {
            daynum += sat_data.ele * sqrt (sat_data.alt) / 502500.0;
            this.calc (tle, obs_geodetic, sat_data, daynum);
        } while (abs (sat_data.ele) > 0.03);
    }

    return daynum;    // Return the updated daynum variable.
}


// Private function.
jsPredict.prototype.FindLOS2 = function (tle, obs_geodetic, sat_data, daynum) {
    // This function steps through the pass to find LOS.
    // FindLOS() is called to "fine tune" and return the result.

    do {
        daynum += Math.cos ((sat_data.ele - 1.0) * Globals.deg2rad) * Math.sqrt (sat_data.alt) / 25000.0;
        this.calc (tle, obs_geodetic, sat_data, daynum);
    } while (sat_data.ele >= 0.0);

    daynum = this.FindLOS (tle, obs_geodetic, sat_data, daynum);

    return daynum;    // Return the updated daynum variable.
}



// Public function.
jsPredict.prototype.current_daynum = function () {
    // Gets the current decimal day number from the Date class.
    var t = new Date ();
    return (t.getTime () / 86400000.0) - 3651.0;
}


// Public function.
jsPredict.prototype.unix2daynum = function (ts, usec) {
    // Converts a UNIX timestamp to a decimal day number
    if (usec != null) {
        return (((ts + 0.0000001 * usec) / 86400.0) - 3651.0);
    } else {
        return ((ts / 86400.0) - 3651.0);
    }
}


// Public function.
jsPredict.prototype.daynum2unix = function (daynum) {
    // Converts a daynum to a UNIX timestamp
    return (86400.0 * (daynum + 3651.0));
}


// Private function.
jsPredict.prototype.toint = function (x) {
    // Produce integer truncation correctly for negative values too.
    if (x < 0) {
        return Math.ceil (x);
    } else {
        return Math.floor (x);
    }
}

// Public function.
jsPredict.prototype.DayNum = function (m, d, y) {
    // This function calculates the day number from m/d/y.
    var yy, mm, dn;

    if (m < 3) {
        y --;
        m += 12;
    }

    if (y < 57) {
        y += 100;
    }

    yy = y;
    mm = m;
    dn = this.toint ((this.toint (365.25 * (yy - 80.0)) - this.toint (19.0 + yy / 100.0) + this.toint (4.75 + yy / 400.0) - 16.0));
    dn += this.toint (d) + 30 * m + Math.floor (0.6 * mm - 0.3);

    return dn;
}


// Private function.
jsPredict.prototype.Julian_Date_of_Year = function (year) {
    // The function Julian_Date_of_Year calculates the Julian Date
    // of Day 0.0 of {year}. This function is used to calculate the
    // Julian Date of any date by using Julian_Date_of_Year, DOY, and Fraction_of_Day.

    // Astronomical Formulae for Calculators, Jean Meeus,
    // pages 23-25. Calculate Julian Date of 0.0 Jan year

    var year, i, A, B;
    year = year - 1;
    i = this.toint (year / 100);
    A = i;
    i = this.toint (A / 4);
    B = (2 - A) + i;
    i = this.toint (365.25 * year);
    i = i + this.toint (30.6001 * 14);

    return i + 1720994.5 + B;
}


// Private function.
jsPredict.prototype.Julian_Date_of_Epoch = function (epoch) { 
    // The function Julian_Date_of_Epoch returns the Julian Date of
    // an epoch specified in the format used in the NORAD two-line
    // element sets. It has been modified to support dates beyond
    // the year 1999 assuming that two-digit years in the range 00-56
    // correspond to 2000-2056. Until the two-line element set format
    // is changed, it is only valid for dates through 2056 December 31.

    var year, day;
    year = this.toint (epoch * 1E-3);
    day = ((epoch * 1E-3) - year) * 1E3;

    // Modification to support Y2K (Valid 1957 through 2056)
    if (year < 57) {
        year = year + 2000;
    } else {
        year = year + 1900;
    }

    return (this.Julian_Date_of_Year (year) + day);
}


// Private function.
jsPredict.prototype.AcTan = function (sinx, cosx) {
    // Four-quadrant arctan function
    if (cosx == 0.0) {
        if (sinx > 0.0) {
            return (Globals.pio2);
        } else {
            return (Globals.x3pio2);
        }
    } else if (cosx > 0.0) {
        if (sinx > 0.0) {
            return Math.atan (sinx / cosx);
        } else {
            return Globals.twopi + Math.atan (sinx / cosx);
        }
    } else {
        return Globals.pi + Math.atan (sinx / cosx);
    }
}


// Private function.
jsPredict.prototype.ArcSin = function (arg) {
    // Returns the arcsine of the argument
    if (Math.abs (arg) >= 1.0) {
        return this.Sign (arg) * Globals.pio2;
    } else {
        return Math.atan (arg / Math.sqrt (1.0 - arg * arg));
    }
}


// Private function.
jsPredict.prototype.Sign = function (arg) {
    // Returns sign of a double
    if (arg > 0) {
        return 1;
    } else if (arg < 0) {
        return -1;
    } else {
        return 0;
    }
}


// Private function.
jsPredict.prototype.Dot = function (v1, v2) {
    // Returns the dot product of two vectors
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}


// Private function.
jsPredict.prototype.Vec_Sub = function (v1, v2, v3) {
    // Subtracts vector v2 from v1 to produce v3
    v3.x = v1.x - v2.x;
    v3.y = v1.y - v2.y;
    v3.z = v1.z - v2.z;
    this.Magnitude (v3);
}


// Private function.
jsPredict.prototype.Scalar_Multiply = function (k, v1, v2) {
    // Multiplies the vector v1 by the scalar k to produce the vector v2
    v2.x = k * v1.x;
    v2.y = k * v1.y;
    v2.z = k * v1.z;
    v2.w = Math.abs (k) * v1.w;
}


// Private function.
jsPredict.prototype.Angle = function (v1, v2) {
    // Calculates the angle between vectors v1 and v2
    this.Magnitude (v1);
    this.Magnitude (v2);
    return this.ArcCos (this.Dot (v1, v2) / (v1.w * v2.w));
}


// Private function.
jsPredict.prototype.ArcCos = function (arg) {
    // Returns arccosine of argument
    return Globals.pio2 - this.ArcSin (arg);
}


// Private function.
jsPredict.prototype.FMod2p = function (x) {
    // Returns mod 2PI of argument
    var ret_val, i;

    ret_val = x;
    i = this.toint (ret_val) / Globals.twopi;
    ret_val -= this.toint (i) * Globals.twopi;

    if (ret_val < 0.0) {
        ret_val += Globals.twopi;
    }

    return ret_val;
}


// Private function.
jsPredict.prototype.Convert_Sat_State = function (pos, vel) {
    // Converts the satellite's position and velocity
    // vectors from normalized values to km and km/sec

    this.Scale_Vector (Globals.xkmper, pos);
    this.Scale_Vector (Globals.xkmper * Globals.xmnpda / Globals.secday, vel);
}


// Private function.
jsPredict.prototype.Scale_Vector = function (k, v) {
    // Multiplies the vector v1 by the scalar k

    v.x *= k;
    v.y *= k;
    v.z *= k;
    this.Magnitude (v);
}


// Private function.
jsPredict.prototype.Magnitude = function (v) {
    // Calculates scalar magnitude of a vector argument

    v.w = Math.sqrt (this.Sqr (v.x) + this.Sqr (v.y) + this.Sqr (v.z));
}


// Private function.
jsPredict.prototype.Sqr = function (arg) {
    // Returns square of a double

    return arg * arg;
}


// Private function.
jsPredict.prototype.Frac = function (arg) {
    // Returns fractional part of double argument

    return arg - this.toint (arg);
}


// Private function.
jsPredict.prototype.Modulus = function (arg1, arg2) {
    // Returns arg1 mod arg2

    var ret_val, i;

    ret_val = arg1;
    i = this.toint (arg1 / arg2);
    ret_val -= this.toint (i * arg2);

    if (ret_val < 0.0) {
        ret_val += arg2;
    }
    return ret_val;
}


// Private function.
jsPredict.prototype.FixAngle = function (x) {
    // This function reduces angles greater than
    // two pi by subtracting two pi from the angle

    while (x > Globals.twopi) {
        x -= Globals.twopi;
    }
    return x;
}


// Private function.
jsPredict.prototype.PrimeAngle = function (x) {
    // This function is used in the FindMoon() function.

    x = x - 360.0 * Math.floor (x / 360.0);
    return x;
}


// Private function.
jsPredict.prototype.Sat_Eclipsed = function (pos, sol, sat_data) {
    // Calculates stellite's eclipse status and depth

    var Rho, earth, sd_earth, sd_sun, delta;

    Rho   = new vector ();
    earth = new vector ();

    // Determine partial eclipse
    sd_earth = this.ArcSin (Globals.xkmper / pos.w);
    this.Vec_Sub (sol, pos, Rho);
    sd_sun = this.ArcSin (Globals.sr / Rho.w);
    this.Scalar_Multiply (-1, pos, earth);
    delta = this.Angle (sol, earth);
    sat_data.eclipse_depth = sd_earth - sd_sun - delta;

    if (sd_earth < sd_sun) {
        return 0;
    } else if (sat_data.eclipse_depth >= 0) {
        return 1;
    } else {
        return 0;
    }
}


// Private function.
// FIXME: deep_arg_ds50 is a simple variable which is passed as reference.
// FIXME: later as it is only used by function Deep.
jsPredict.prototype.ThetaG = function (epoch, deep_arg_ds50) {
    // The function ThetaG calculates the Greenwich Mean Sidereal Time 
    // for an epoch specified in the format used in the NORAD two-line 
    // element sets. It has now been adapted for dates beyond the year 
    // 1999, as described above. The function ThetaG_JD provides the   
    // same calculation except that it is based on an input in the     
    // form of a Julian Date. 

    // Reference: The 1992 Astronomical Almanac, page B6. 

    var year, day, UT, jd, TU, GMST;

    year = this.toint (epoch * 1E-3);
    day = ((epoch * 1E-3) - year) * 1E3;

    // Modification to support Y2K (valid 1957 through 2056)
    if (year<57) {
        year += 2000;
    } else {
        year += 1900;
    }

    UT = day - this.toint (day);
    day = this.toint (day);
    jd = this.Julian_Date_of_Year (year) + day;
    TU = (jd - 2451545.0) / 36525;
    GMST = 24110.54841 + TU * (8640184.812866 + TU * (0.093104 - TU * 6.2E-6));
    GMST = this.Modulus (GMST + Globals.secday * Globals.omega_E * UT, Globals.secday);
    deep_arg_ds50 = jd - 2433281.5 + UT;

    return this.FMod2p (6.3003880987 * deep_arg_ds50 + 1.72944494);
}


// Private function.
jsPredict.prototype.ThetaG_JD = function (jd) {
    // Reference: The 1992 Astronomical Almanac, page B6.

    var UT, TU, GMST;

    UT = this.Frac (jd + 0.5);
    jd = jd - UT;
    TU = (jd - 2451545.0) / 36525;
    GMST = 24110.54841 + TU * (8640184.812866 + TU * (0.093104 - TU * 6.2E-6));
    GMST = this.Modulus (GMST + Globals.secday * Globals.omega_E * UT, Globals.secday);

    return Globals.twopi * GMST / Globals.secday;
}


// Private function.
jsPredict.prototype.Delta_ET = function (year) {
    // The function Delta_ET has been added to allow calculations on
    // the position of the sun.  It provides the difference between UT
    // (approximately the same as UTC) and ET (now referred to as TDT).
    // This function is based on a least squares fit of data from 1950
    // to 1991 and will need to be updated periodically.

    // Values determined using data from 1950-1991 in the 1990
    // Astronomical Almanac. See DELTA_ET.WQ1 for details.

    return 26.465 + 0.747622 * (year - 1950) + 1.886913 * Math.sin (Globals.twopi * (year - 1975) / 33);
}


// Private function.
jsPredict.prototype.Calculate_Solar_Position = function (time, solar_vector) {
    // Calculates solar position vector

    var mjd, year, T, M, L, e, C, O, Lsa, nu, R, eps;

    mjd = time - 2415020.0;
    year = 1900 + mjd / 365.25;
    T = (mjd + this.Delta_ET (year) / Globals.secday) / 36525.0;
    M = ((this.Modulus (358.47583 + this.Modulus (35999.04975 * T, 360.0) - (0.000150 + 0.0000033 * T) * this.Sqr (T), 360.0)) * Globals.deg2rad);
    L = ((this.Modulus (279.69668 + this.Modulus (36000.76892 * T, 360.0) + 0.0003025 * this.Sqr (T), 360.0)) * Globals.deg2rad);
    e = 0.01675104 - (0.0000418 + 0.000000126 * T) * T;
    C = (((1.919460 - (0.004789 + 0.000014 * T) * T) * Math.sin (M) + (0.020094 - 0.000100 * T) * Math.sin (2 * M) + 0.000293 * Math.sin (3 * M)) * Globals.deg2rad);
    O = ((this.Modulus (259.18 - 1934.142 * T, 360.0)) * Globals.deg2rad);
    Lsa = this.Modulus (L + C -((0.00569 - 0.00479 * Math.sin (O)) * Globals.deg2rad), Globals.twopi);
    nu = this.Modulus (M + C, Globals.twopi);
    R = 1.0000002 * (1.0 - this.Sqr (e)) / (1.0 + e * Math.cos (nu));
    eps = ((23.452294 - (0.0130125 + (0.00000164 - 0.000000503 * T) * T) * T + 0.00256 * Math.cos (O)) * Globals.deg2rad);
    R = Globals.AU * R;

    solar_vector.x = R * Math.cos (Lsa);
    solar_vector.y = R * Math.sin (Lsa) * Math.cos (eps);
    solar_vector.z = R * Math.sin (Lsa) * Math.sin (eps);
    solar_vector.w = R;
}


// Private function.
jsPredict.prototype.Calculate_User_PosVel = function (time, geodetic, obs_pos, obs_vel) {
    // Calculate_User_PosVel() passes the user's geodetic position
    // and the time of interest and returns the ECI position and
    // velocity of the observer.  The velocity calculation assumes
    // the geodetic position is stationary relative to the earth's surface.

    // Reference: The 1992 Astronomical Almanac, page K11.

    var c, sq, achcp;

    geodetic.theta = this.FMod2p (this.ThetaG_JD (time) + geodetic.lon); // LMST
    c = 1 / Math.sqrt (1 + Globals.f * (Globals.f - 2) * this.Sqr (Math.sin (geodetic.lat)));
    sq = this.Sqr (1 - Globals.f) * c;
    achcp = (Globals.xkmper * c + geodetic.alt) * Math.cos (geodetic.lat);

    obs_pos.x = achcp * Math.cos (geodetic.theta); // kilometers
    obs_pos.y = achcp * Math.sin (geodetic.theta);
    obs_pos.z = (Globals.xkmper * sq + geodetic.alt) * Math.sin (geodetic.lat);

    obs_vel.x = -Globals.mfactor * obs_pos.y; // kilometers/second
    obs_vel.y = Globals.mfactor * obs_pos.x;
    obs_vel.z = 0;

    this.Magnitude (obs_pos);
    this.Magnitude (obs_vel);
}


// Private function.
jsPredict.prototype.Calculate_LatLonAlt = function (time, pos, geodetic) {
    // Procedure Calculate_LatLonAlt will calculate the geodetic
    // position of an object given its ECI position pos and time.
    // It is intended to be used to determine the ground track of
    // a satellite.  The calculations  assume the earth to be an
    // oblate spheroid as defined in WGS '72.

    // Reference: The 1992 Astronomical Almanac, page K12.

    var r, e2, c, phi;

    geodetic.theta = this.AcTan (pos.y, pos.x); // radians
    geodetic.lon = this.FMod2p (geodetic.theta - this.ThetaG_JD (time)); // radians
    r = Math.sqrt (this.Sqr (pos.x) + this.Sqr (pos.y));
    e2 = Globals.f * (2 - Globals.f);
    geodetic.lat = this.AcTan (pos.z, r); // radians

    do {
        phi = geodetic.lat;
        c = 1 / Math.sqrt (1 - e2 * this.Sqr (Math.sin (geodetic.lat)));
        geodetic.lat = this.AcTan (pos.z + Globals.xkmper * c * e2 * Math.sin (geodetic.lat), r);
    } while (Math.abs (geodetic.lat - phi) >= 1E-10);

    geodetic.alt = r / Math.cos (geodetic.lat) - Globals.xkmper * c; // kilometers

    if (geodetic.lat > Globals.pio2) {
        geodetic.lat -= Globals.twopi;
    }
}


// Private function.
jsPredict.prototype.Calculate_Obs = function (time, pos, vel, geodetic, obs_set) {
    // The procedures Calculate_Obs and Calculate_RADec calculate         
    // the *topocentric* coordinates of the object with ECI position,     
    // {pos}, and velocity, {vel}, from location {geodetic} at {time}.    
    // The {obs_set} returned for Calculate_Obs consists of azimuth,      
    // elevation, range, and range rate (in that order) with units of     
    // radians, radians, kilometers, and kilometers/second, respectively. 
    // The WGS '72 geoid is used and the effect of atmospheric refraction 
    // (under standard temperature and pressure) is incorporated into the 
    // elevation calculation; the effect of atmospheric refraction on     
    // range and range rate has not yet been quantified.                  

    // The {obs_set} for Calculate_RADec consists of right ascension and  
    // declination (in that order) in radians.  Again, calculations are   
    // based on *topocentric* position using the WGS '72 geoid and        
    // incorporating atmospheric refraction.                              

    var obs_pos, obs_vel, range, rgvel, sin_lat, cos_lat, sin_theta, cos_theta, top_s, top_e, top_z, azim, el;

    obs_pos = new vector ();
    obs_vel = new vector ();
    range   = new vector ();
    rgvel   = new vector ();

    this.Calculate_User_PosVel (time, geodetic, obs_pos, obs_vel);

    range.x = pos.x - obs_pos.x;
    range.y = pos.y - obs_pos.y;
    range.z = pos.z - obs_pos.z;

    rgvel.x = vel.x - obs_vel.x;
    rgvel.y = vel.y - obs_vel.y;
    rgvel.z = vel.z - obs_vel.z;

    this.Magnitude (range);

    sin_lat = Math.sin (geodetic.lat);
    cos_lat = Math.cos (geodetic.lat);
    sin_theta = Math.sin (geodetic.theta);
    cos_theta = Math.cos (geodetic.theta);
    top_s = sin_lat * cos_theta * range.x + sin_lat * sin_theta * range.y - cos_lat * range.z;
    top_e = -sin_theta * range.x + cos_theta * range.y;
    top_z = cos_lat * cos_theta * range.x + cos_lat * sin_theta * range.y + sin_lat * range.z;
    azim = Math.atan (-(top_e / top_s)); // Azimuth

    if (top_s > 0.0) {
        azim = azim + Globals.pi;
    }

    if (azim < 0.0) {
        azim = azim + Globals.twopi;
    }

    el = this.ArcSin (top_z / range.w);
    obs_set.x = azim; // Azimuth (radians)
    obs_set.y = el; // Elevation (radians)
    obs_set.z = range.w; // Range (kilometers)

    // Range Rate (kilometers/second)
    obs_set.w = (this.Dot (range, rgvel) / range.w);

    // Corrections for atmospheric refraction
    // Reference:  Astronomical Algorithms by Jean Meeus, pp. 101-104
    // Correction is meaningless when apparent elevation is below horizon
    if (obs_set.y >= 0.0) {
        //FIXME: Seems like something is missing here.
    }
}


// Private function.
jsPredict.prototype.Calculate_RADec = function (time, pos, vel, geodetic, obs_set) {
    // Reference:  Methods of Orbit Determination by
    // Pedro Ramon Escobal, pp. 401-402

    this.Calculate_Obs (time, pos, vel, geodetic, obs_set);

    var az = obs_set.x;
    var el = obs_set.y;
    var phi = geodetic.lat;
    var theta = this.FMod2p (this.ThetaG_JD (time) + geodetic.lon);
    var sin_theta = Math.sin (theta);
    var cos_theta = Math.cos (theta);
    var sin_phi = Math.sin (phi);
    var cos_phi = Math.cos (phi);
    var Lxh = -Math.cos (az) * Math.cos (el);
    var Lyh = Math.sin (az) * Math.cos (el);
    var Lzh = Math.sin (el);
    var Sx = sin_phi * cos_theta;
    var Ex = -sin_theta;
    var Zx = cos_theta * cos_phi;
    var Sy = sin_phi * sin_theta;
    var Ey = cos_theta;
    var Zy = sin_theta * cos_phi;
    var Sz = -cos_phi;
    var Ez = 0.0;
    var Zz = sin_phi;
    var Lx = Sx * Lxh + Ex * Lyh + Zx * Lzh;
    var Ly = Sy * Lxh + Ey * Lyh + Zy * Lzh;
    var Lz = Sz * Lxh + Ez * Lyh + Zz * Lzh;

    obs_set.y = this.ArcSin (Lz); // Declination (radians) 
    var cos_delta = Math.sqrt (1.0 - this.Sqr (Lz));
    var sin_alpha = Ly / cos_delta;
    var cos_alpha = Lx / cos_delta;
    obs_set.x = this.AcTan (sin_alpha, cos_alpha); // Right Ascension (radians) 
    obs_set.x = this.FMod2p (obs_set.x);
}


// Public function.
// WARNING: sun_pos should already be an object of type sun before invocation.
jsPredict.prototype.FindSun = function (daynum, obs_geodetic, sun_pos) {
    // This function finds the position of the Sun

    // Convert the observers geodetic position data into radians
    obs_geodetic.lat *= Globals.deg2rad;
    obs_geodetic.lon *= -Globals.deg2rad;
    obs_geodetic.alt /= 1000.0;

    // Zero vector for initializations
    var zero_vector = new vector ();

    // Solar ECI position vector
    var solar_vector = new vector ();

    // Solar observed azi and ele vectors
    var solar_set = new vector ();
    var solar_rad = new vector ();

    // Satellite's predicted geodetic position
    var solar_latlonalt = new geodetic (0, 0, 0);

    var jul_utc = daynum + 2444238.5;

    this.Calculate_Solar_Position (jul_utc, solar_vector);
    this.Calculate_Obs (jul_utc, solar_vector, zero_vector, obs_geodetic, solar_set);

    var sun_azi = solar_set.x / Globals.deg2rad;
    var sun_ele = solar_set.y / Globals.deg2rad;
    var sun_range = 1.0 + ((solar_set.z - Globals.AU) / Globals.AU);
    var sun_range_rate = 1000.0 * solar_set.w;

    this.Calculate_LatLonAlt (jul_utc, solar_vector, solar_latlonalt);

    var sun_lat = solar_latlonalt.lat / Globals.deg2rad;
    var sun_lon = 360.0 - (solar_latlonalt.lon / Globals.deg2rad);

    this.Calculate_RADec (jul_utc, solar_vector, zero_vector, obs_geodetic, solar_rad);

    var sun_ra = solar_rad.x / Globals.deg2rad;
    var sun_dec = solar_rad.y / Globals.deg2rad;

    // var sun_pos = new sun ();
    sun_pos.azi = sun_azi;
    sun_pos.ele = sun_ele;
    sun_pos.range = sun_range;
    sun_pos.range_rate = sun_range_rate;
    sun_pos.lat = sun_lat;
    sun_pos.lon = sun_lon;
    sun_pos.ra = sun_ra;
    sun_pos.dec = sun_dec;

    // Convert the observers geodetic position data back into degrees
    obs_geodetic.lat /= Globals.deg2rad;
    obs_geodetic.lon /= -Globals.deg2rad;
    obs_geodetic.alt *= 1000.0;
}


// Public function.
// WARNING: moon_pos should be an object of type moon() before invocation-
jsPredict.prototype.FindMoon = function (daynum, obs_geodetic, moon_pos) {
    // This function determines the position of the moon, including
    // the azimuth and elevation headings, relative to the latitude
    // and longitude of the tracking station.  This code was derived
    // from a Javascript implementation of the Meeus method for
    // determining the exact position of the Moon found at:
    // http://www.geocities.com/s_perona/ingles/poslun.htm.

    var jd = daynum + 2444238.5;

    var t = (jd - 2415020.0) / 36525.0;
    var t2 = t * t;
    var t3 = t2 * t;
    var l1 = 270.434164 + 481267.8831 * t - 0.001133 * t2 + 0.0000019 * t3;
    var m = 358.475833 + 35999.0498 * t - 0.00015 * t2 - 0.0000033 * t3;
    var m1 = 296.104608 + 477198.8491 * t + 0.009192 * t2 + 0.0000144 * t3;
    var d = 350.737486 + 445267.1142 * t - 0.001436 * t2 + 0.0000019 * t3;
    var ff = 11.250889 + 483202.0251 * t - 0.003211 * t2 - 0.0000003 * t3;
    var om = 259.183275 - 1934.142 * t + 0.002078 * t2 + 0.0000022 * t3;
    om = om * Globals.deg2rad;

    // Additive terms
    l1 = l1 + 0.000233 * Math.sin ((51.2 + 20.2 * t) * Globals.deg2rad);
    var ss = 0.003964 * Math.sin ((346.56 + 132.87 * t - 0.0091731 * t2) * Globals.deg2rad);
    l1 = l1 + ss + 0.001964 * Math.sin (om);
    m = m - 0.001778 * Math.sin ((51.2 + 20.2 * t) * Globals.deg2rad);
    m1 = m1 + 0.000817 * Math.sin ((51.2 + 20.2 * t) * Globals.deg2rad);
    m1 = m1 + ss + 0.002541 * Math.sin (om);
    d = d + 0.002011 * Math.sin ((51.2 + 20.2 * t) * Globals.deg2rad);
    d = d + ss + 0.001964 * Math.sin (om);
    ff = ff + ss - 0.024691 * Math.sin (om);
    ff = ff - 0.004328 * Math.sin (om + (275.05 - 2.3 * t) * Globals.deg2rad);
    var ex = 1.0 - 0.002495 * t - 0.00000752 * t2;
    om = om * Globals.deg2rad;

    l1 = this.PrimeAngle (l1);
    m  = this.PrimeAngle (m);
    m1 = this.PrimeAngle (m1);
    d  = this.PrimeAngle (d);
    ff = this.PrimeAngle (ff);
    om = this.PrimeAngle (om);

    m  = m  * Globals.deg2rad;
    m1 = m1 * Globals.deg2rad;
    d  = d  * Globals.deg2rad;
    ff = ff * Globals.deg2rad;

    // Ecliptic Longitude
    l = l1 + 6.28875 * Math.sin (m1) +
                1.274018 * Math.sin (2.0 * d - m1) +
                0.658309 * Math.sin (2.0 * d);
    l = l + 0.213616 * Math.sin (2.0 * m1) -
           ex * 0.185596 * Math.sin (m) -
                0.114336 * Math.sin (2.0 * ff);
    l = l + 0.058793 * Math.sin (2.0 * d - 2.0 * m1) +
           ex * 0.057212 * Math.sin (2.0 * d - m - m1) +
                 0.05332 * Math.sin (2.0 * d + m1);
    l = l + ex * 0.045874 * Math.sin (2.0 * d - m) +
                ex * 0.041024 * Math.sin (m1 - m) -
                     0.034718 * Math.sin (d);
    l = l - ex * 0.030465 * Math.sin (m + m1) +
                     0.015326 * Math.sin (2.0 * d - 2.0 * ff) -
                     0.012528 * Math.sin (2.0 * ff + m1);
    
    l = l - 0.01098 * Math.sin (2.0 * ff - m1) +
               0.010674 * Math.sin (4.0 * d - m1) +
               0.010034 * Math.sin (3.0 * m1);
    l = l + 0.008548 * Math.sin (4.0 * d - 2.0 * m1) -
            ex * 0.00791 * Math.sin (m - m1 + 2.0 * d) -
            ex * 0.006783 * Math.sin (2.0 * d + m);
    
    l = l + 0.005162 * Math.sin (m1 - d) +
              ex * 0.005 * Math.sin (m + d) +
              ex * 0.004049 * Math.sin (m1 - m + 2.0 * d);
    l = l + 0.003996 * Math.sin (2.0 * m1 + 2.0 * d) +
                0.003862 * Math.sin (4.0 * d) +
                0.003665 * Math.sin (2.0 * d - 3.0 * m1);

    l = l + ex * 0.002695 * Math.sin (2.0 * m1 - m) +
                     0.002602 * Math.sin (m1 - 2.0 * ff - 2.0 * d) +
                ex * 0.002396 * Math.sin (2.0 * d - m - 2.0 * m1);

    l = l - 0.002349 * Math.sin (m1 + d) +
      ex * ex * 0.002249 * Math.sin (2.0 * d - 2.0 * m) -
           ex * 0.002125 * Math.sin (2.0 * m1 + m);

    l = l - ex * ex * 0.002079 * Math.sin (2.0 * m) +
                ex * ex * 0.002059 * Math.sin (2.0 * d - m1 - 2.0 * m) -
                          0.001773 * Math.sin (m1 + 2.0 * d - 2.0 * ff);

    l = l + ex * 0.00122 * Math.sin (4.0 * d - m - m1) -
                     0.00111 * Math.sin (2.0 * m1 + 2.0 * ff) +
                    0.000892 * Math.sin (m1 - 3.0 * d);

    l = l - ex * 0.000811 * Math.sin (m + m1 + 2.0 * d) +
                ex * 0.000761 * Math.sin (4.0 * d - m - 2.0 * m1) +
           ex * ex * 0.000717 * Math.sin (m1 - 2.0 * m);

    l =l + ex * ex * 0.000704 * Math.sin (m1 - 2.0 * m - 2.0 * d) +
                    ex * 0.000693 * Math.sin (m - 2.0 * m1 + 2.0 * d) +
                    ex * 0.000598 * Math.sin (2.0 * d - m - 2.0 * ff) +
                         0.00055  * Math.sin (m1 + 4.0 * d);

    l = l + 0.000538 * Math.sin (4.0 * m1) + 
             ex * 0.000521 * Math.sin (4.0 * d - m) +
                  0.000486 * Math.sin (2.0 * m1 - d);

    l = l - 0.001595 * Math.sin (2.0 * ff + 2.0 * d);

    // Ecliptic latitude
    var b;
    b = 5.128189 * Math.sin (ff) +
            0.280606 * Math.sin (m1 + ff) +
            0.277693 * Math.sin (m1 - ff) +
            0.173238 * Math.sin (2.0 * d - ff);
    b = b + 0.055413 * Math.sin (2.0 * d + ff - m1) +
                0.046272 * Math.sin (2.0 * d - ff - m1) +
                0.032573 * Math.sin (2.0 * d + ff);

    b = b + 0.017198 * Math.sin (2.0 * m1 + ff) +
                9.266999e-03 * Math.sin (2.0 * d + m1 - ff) +
                0.008823 * Math.sin (2.0 * m1 - ff);
    b = b + ex * 0.008247 * Math.sin (2.0 * d - m - ff) +
                     0.004323 * Math.sin (2.0 * d - ff - 2.0 * m1) +
                     0.0042   * Math.sin (2.0 * d + ff + m1);

    b = b + ex * 0.003372 * Math.sin (ff - m - 2.0 * d) +
                ex * 0.002472 * Math.sin (2.0 * d + ff - m - m1) +
                ex * 0.002222 * Math.sin (2.0 * d + ff - m);

    b = b + 0.002072 * Math.sin (2.0 * d - ff - m - m1) +
              ex * 0.001877 * Math.sin (ff - m + m1) +
                0.001828 * Math.sin (4.0 * d - ff - m1);

    b = b - ex * 0.001803 * Math.sin (ff + m) -
                     0.00175  * Math.sin (3.0 * ff) +
                ex * 0.00157  * Math.sin (m1 - m - ff) -
                     0.001487 * Math.sin (ff + d) -
                ex * 0.001481 * Math.sin (ff + m + m1) +
                ex * 0.001417 * Math.sin (ff - m - m1) +
                ex * 0.00135  * Math.sin (ff - m) +
                     0.00133  * Math.sin (ff - d);

    b = b + 0.001106 * Math.sin (ff + 3.0 * m1) +
                0.00102  * Math.sin (4.0 * d - ff) +
                0.000833 * Math.sin (ff + 4.0 * d - m1);

    b = b + 0.000781 * Math.sin (m1 - 3.0 * ff) +
                0.00067  * Math.sin (ff + 4.0 * d - 2.0 * m1) +
                0.000606 * Math.sin (2.0 * d - 3.0 * ff);

    b = b + 0.000597 * Math.sin (2.0 * d + 2.0 * m1 - ff) +
           ex * 0.000492 * Math.sin (2.0 * d + m1 - m - ff) +
                0.00045  * Math.sin (2.0 * m1 - ff - 2.0 * d);

    b = b + 0.000439 * Math.sin (3.0 * m1 - ff) +
                0.000423 * Math.sin (ff + 2.0 * d + 2.0 * m1) +
                0.000422 * Math.sin (2.0 * d - ff - 3.0 * m1);

    b = b - ex * 0.000367 * Math.sin (m + ff + 2.0 * d - m1) -
                ex * 0.000353 * Math.sin (m + ff + 2.0 * d) +
                     0.000331 * Math.sin (ff + 4.0 * d);

    b = b + ex * 0.000317 * Math.sin (2.0 * d + ff - m + m1) +
                ex * ex * 0.000306 * Math.sin (2.0 * d - 2.0 * m - ff) -
                     0.000283 * Math.sin (m1 + 3.0 * ff);

    var w1 = 0.0004664 * Math.cos (om * Globals.deg2rad);
    var w2 = 0.0000754 * Math.cos ((om + 275.05 - 2.3 * t) * Globals.deg2rad);
    var bt = b * (1.0 - w1 - w2);

    // parallax calculations
    var p;
    p = 0.950724 + 0.051818 * Math.cos (m1) +
                       0.009531 * Math.cos (2.0 * d - m1) +
                       0.007843 * Math.cos (2.0 * d) +
                       0.002824 * Math.cos (2.0 * m1) +
                       0.000857 * Math.cos (2.0 * d + m1) +
                  ex * 0.000533 * Math.cos (2.0 * d - m) +
                  ex * 0.000401 * Math.cos (2.0 * d - m - m1);

    p = p + 0.000173 * Math.cos (3.0 * m1) +
                0.000167 * Math.cos (4.0 * d - m1) -
           ex * 0.000111 * Math.cos (m) +
                0.000103 * Math.cos (4.0 * d - 2.0 * m1) -
                0.000084 * Math.cos (2.0 * m1 - 2.0 * d) -
           ex * 0.000083 * Math.cos (2.0 * d + m) +
                0.000079 * Math.cos (2.0 * d + 2.0 * m1);

    p = p + 0.000072 * Math.cos (4.0 * d) +
           ex * 0.000064 * Math.cos (2.0 * d - m + m1) -
           ex * 0.000063 * Math.cos (2.0 * d + m - m1);

    p = p + ex * 0.000041 * Math.cos (m + d) + 
                ex * 0.000035 * Math.cos (2.0 * m1 - m) -
                     0.000033 * Math.cos (3.0 * m1 - 2.0 * d);

    p = p - 0.00003 * Math.cos (m1 + d) -
                0.000029 * Math.cos (2.0 * ff - 2.0 * d) -
           ex * 0.000029 * Math.cos (2.0 * m1 + m);

    p = p + ex * ex * 0.000026 * Math.cos (2.0 * d - 2.0 * m) -
                          0.000023 * Math.cos (2.0 * ff - 2.0 * d + m1) +
                     ex * 0.000019 * Math.cos (4.0 * d - m - m1);

    b = bt * Globals.deg2rad;
    var lm = l * Globals.deg2rad;
    var moon_dx = 3.0 / (Globals.pi * p);

    // Convert ecliptic coordinates to equatorial coordinates
    var z = (jd - 2415020.5) / 365.2422;
    var ob = 23.452294 - (0.46845 * z + 5.9e-07 * z * z) / 3600.0;
    ob = ob * Globals.deg2rad;
    var dec = Math.asin (Math.sin (b) * Math.cos (ob) + Math.cos (b) * Math.sin (ob) * Math.sin (lm));
    var ra = Math.acos (Math.cos (b) * Math.cos (lm) / Math.cos (dec));

    if (lm > Globals.pi) {
        ra = Globals.twopi - ra;
    }
    // ra = right ascension
    // dec = declination

    var n = obs_geodetic.lat * Globals.deg2rad;    // North latitude of tracking station
    var e = -obs_geodetic.lon * Globals.deg2rad;    // East longitude of tracking station

    // Find siderial time in radians
    var t = (jd - 2451545.0) / 36525.0;
    var teg = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + (0.000387933 * t - t * t / 38710000.0) * t;
    while (teg > 360.0) {
        teg -= 360.0;
    }

    var th = this.FixAngle ((teg - obs_geodetic.lon) * Globals.deg2rad);
    var h = th - ra;

    var az = Math.atan2 (Math.sin (h), Math.cos (h) * Math.sin (n) - Math.tan (dec) * Math.cos (n)) + Globals.pi;
    var el = Math.asin (Math.sin (n) * Math.sin (dec) + Math.cos (n) * Math.cos (dec) * Math.cos (h));

    var moon_az = az / Globals.deg2rad;
    var moon_el = el / Globals.deg2rad;

    // Radial velocity approximation.  This code was derived
    // from "Amateur Radio Software", by John Morris, GM4ANB,
    // published by the RSGB in 1985.
//WARNING: Variable name reuse: t2, t3
    var mm = this.FixAngle (1.319238 + daynum * 0.228027135);  // mean moon position
    t2 = 0.10976;
    var t1 = mm + t2 * Math.sin (mm);
    var dv = 0.01255 * moon_dx * moon_dx * Math.sin (t1) * (1.0 + t2 * Math.cos (mm));
    dv = dv * 4449.0;
    t1 = 6378.0;
    t2 = 384401.0;
    t3 = t1 * t2 * (Math.cos (dec) * Math.cos (n) * Math.sin (h));
    t3 = t3 / Math.sqrt (t2 * t2 - t2 * t1 * Math.sin (el));
    var moon_dv = dv + t3 * 0.0753125;

    var moon_dec = dec / Globals.deg2rad;
    var moon_ra  = ra  / Globals.deg2rad;
    var moon_gha = teg - moon_ra;

    if (moon_gha < 0.0) {
        moon_gha += 360.0;
    }

    //$moon_pos = new moon();
    moon_pos.lat = 0;
    moon_pos.lon = 0;
    moon_pos.dv  = moon_dv;
    moon_pos.dec = moon_dec;
    moon_pos.ra  = moon_ra;
    moon_pos.gha = moon_gha;
    moon_pos.azi = moon_az;
    moon_pos.ele = moon_el;
}


// Private function.
jsPredict.prototype.SGP4 = function (tsince, tle, pos, vel) {
    // This function is used to calculate the position and velocity 
    // of near-earth (period < 225 minutes) satellites. tsince is   
    // time since epoch in minutes, tle is a pointer to a tle     
    // structure with Keplerian orbital elements and pos and vel    
    // are vector structures returning ECI satellite position and  
    // velocity. Use Convert_Sat_State() to convert to km and km/s. 

    // Variables of format this.SGP4_ are statics that are local to the SGP4 function.
/*
    static $aodp;
    static $aycof;
    static $c1;
    static $c4;
    static $c5;
    static $cosio;
    static $d2;
    static $d3;
    static $d4;
    static $delmo;
    static $omgcof;
    static $eta;
    static $omgdot;
    static $sinio;
    static $xnodp;
    static $sinmo;
    static $t2cof;
    static $t3cof;
    static $t4cof;
    static $t5cof;
    static $x1mth2;
    static $x3thm1;
    static $x7thm1;
    static $xmcof;
    static $xmdot;
    static $xnodcf;
    static $xnodot;
    static $xlcof;
*/

    // Local variables used through out the function.
    var a1, theta2, eosq, betao2, betao, del1, ao, delo; 
    var s4, qoms24, perigee;
    var pinvsq, tsi, etasq, eeta, psisq, coef, coef1, c2, a3ovk2, c3;
    var theta4, temp1, temp2, temp3, x1m5th, xhdot1;
    var c1sq, temp;

    var xmdf, omgadf, xnoddf, omega, xmp, tsq, xnode, tempa, tempe, templ;
    var delomg, delm, temp, xmp, tcube, tfour;
    var a, e, xl, beta, xn;

    var axn, xll, aynl, xlt, ayn;
    var capu, i, sinepw, cosepw, temp3, temp4, temp5, temp6, epw;

    var ecose, esine, elsq, pl, r, rdot, rfdot, betal, cosu, sinu, u, sin2u, cos2u;

    var rk, uk, xnodek, xinck, rdotk, rfdotk;

    var sinuk, cosuk, sinik, cosik, sinnok, cosnok, xmx, xmy, ux, uy, uz, vx, vy, vz;


    // Initialization
    if (!this.SGP4_INITIALIZED_FLAG) {
        // Recover original mean motion (xnodp) and
        // semimajor axis (aodp) from input elements.
        a1 = Math.pow (Globals.xke / tle.xno, Globals.tothrd);
        this.SGP4_cosio = Math.cos (tle.xincl);
        theta2 = this.SGP4_cosio * this.SGP4_cosio;
        this.SGP4_x3thm1 = 3 * theta2 - 1.0;
        eosq = tle.eo * tle.eo;
        betao2 = 1.0 - eosq;
        betao = Math.sqrt (betao2);
        del1 = 1.5 * Globals.ck2 * this.SGP4_x3thm1 / (a1 * a1 * betao * betao2);
        ao = a1 * (1.0 - del1 * (0.5 * Globals.tothrd + del1 * (1.0 + 134.0 / 81.0 * del1)));
        delo = 1.5 * Globals.ck2 * this.SGP4_x3thm1 / (ao * ao * betao * betao2);
        this.SGP4_xnodp = tle.xno / (1.0 + delo);
        this.SGP4_aodp = ao / (1.0 - delo);

        // For perigee less than 220 kilometers, the "simple"     
        // flag is set and the equations are truncated to linear  
        // variation in sqrt a and quadratic variation in mean    
        // anomaly.  Also, the c3 term, the delta omega term, and 
        // the delta m term are dropped.                          
        if ((this.SGP4_aodp * (1 - tle.eo) / Globals.ae) < (220 / Globals.xkmper + Globals.ae)) {
            this.SIMPLE_FLAG=1;
        } else {
            this.SIMPLE_FLAG=0;
        }

        // For perigees below 156 km, the      
        // values of s and qoms2t are altered. 
        s4 = Globals.s;
        qoms24 = Globals.qoms2t;
        perigee = (this.SGP4_aodp * (1 - tle.eo) - Globals.ae) * Globals.xkmper;
        if (perigee < 156.0) {
            if (perigee <= 98.0) {
                s4 = 20;
            } else {
                s4 = perigee - 78.0;
            }

            qoms24 = Math.pow ((120 - s4) * Globals.ae / Globals.xkmper, 4);
            s4 = s4 / Globals.xkmper + Globals.ae;
        }

        pinvsq = 1 / (this.SGP4_aodp * this.SGP4_aodp * betao2 * betao2);
        tsi = 1 / (this.SGP4_aodp - s4);
        this.SGP4_eta = this.SGP4_aodp * tle.eo * tsi;
        etasq = this.SGP4_eta * this.SGP4_eta;
        eeta = tle.eo * this.SGP4_eta;
        psisq = Math.abs (1 - etasq);
        coef = qoms24 * Math.pow (tsi, 4);
        coef1 = coef / Math.pow (psisq, 3.5);
        c2 = coef1 * this.SGP4_xnodp * (this.SGP4_aodp * (1 + 1.5 * etasq + eeta * (4 + etasq)) + 0.75 * Globals.ck2 * tsi / psisq * this.SGP4_x3thm1 * (8 + 3 * etasq * (8 + etasq)));
        this.SGP4_c1 = tle.bstar * c2;
        this.SGP4_sinio = Math.sin (tle.xincl);
        a3ovk2 = -Globals.xj3 / Globals.ck2 * Math.pow (Globals.ae, 3);
        c3 = coef * tsi * a3ovk2 * this.SGP4_xnodp * Globals.ae * this.SGP4_sinio / tle.eo;
        this.SGP4_x1mth2 = 1 - theta2;

        this.SGP4_c4 = 2 * this.SGP4_xnodp * coef1 * this.SGP4_aodp * betao2 * (this.SGP4_eta * (2 + 0.5 * etasq) + tle.eo * (0.5 + 2 * etasq) - 2 * Globals.ck2 * tsi / (this.SGP4_aodp * psisq) * (-3 * this.SGP4_x3thm1 * (1 - 2 * eeta + etasq * (1.5 - 0.5 * eeta)) + 0.75 * this.SGP4_x1mth2 * (2 * etasq - eeta * (1 + etasq)) * Math.cos (2 * tle.omegao)));
        this.SGP4_c5 = 2 * coef1 * this.SGP4_aodp * betao2 * (1 + 2.75 * (etasq + eeta) + eeta * etasq);

        theta4 = theta2 * theta2;
        temp1 = 3 * Globals.ck2 * pinvsq * this.SGP4_xnodp;
        temp2 = temp1 * Globals.ck2 * pinvsq;
        temp3 = 1.25 * Globals.ck4 * pinvsq * pinvsq * this.SGP4_xnodp;
        this.SGP4_xmdot = this.SGP4_xnodp + 0.5 * temp1 * betao * this.SGP4_x3thm1 + 0.0625 * temp2 * betao * (13 - 78 * theta2 + 137 * theta4);
        x1m5th = 1 - 5 * theta2;
        this.SGP4_omgdot = -0.5 * temp1 * x1m5th + 0.0625 * temp2 * (7 - 114 * theta2 + 395 * theta4) + temp3 * (3 - 36 * theta2 + 49 * theta4);
        xhdot1 = -temp1 * this.SGP4_cosio;
        this.SGP4_xnodot = xhdot1 + (0.5 * temp2 * (4 - 19 * theta2) + 2 * temp3 * (3 - 7 * theta2)) * this.SGP4_cosio;
        this.SGP4_omgcof = tle.bstar * c3 * Math.cos (tle.omegao);
        this.SGP4_xmcof = -Globals.tothrd * coef * tle.bstar * Globals.ae / eeta;
        this.SGP4_xnodcf = 3.5 * betao2 * xhdot1 * this.SGP4_c1;
        this.SGP4_t2cof = 1.5 * this.SGP4_c1;
        this.SGP4_xlcof = 0.125 * a3ovk2 * this.SGP4_sinio * (3 + 5 * this.SGP4_cosio) / (1 + this.SGP4_cosio);
        this.SGP4_aycof = 0.25 * a3ovk2 * this.SGP4_sinio;
        this.SGP4_delmo = Math.pow (1 + this.SGP4_eta * Math.cos (tle.xmo), 3);
        this.SGP4_sinmo = Math.sin (tle.xmo);
        this.SGP4_x7thm1 = 7 * theta2 - 1;

        if (!this.SIMPLE_FLAG) {
            c1sq = this.SGP4_c1 * this.SGP4_c1;
            this.SGP4_d2 = 4 * this.SGP4_aodp * tsi * c1sq;
            temp = this.SGP4_d2 * tsi * this.SGP4_c1 / 3;
            this.SGP4_d3 = (17 * this.SGP4_aodp + s4) * temp;
            this.SGP4_d4 = 0.5 * temp * this.SGP4_aodp * tsi * (221 * this.SGP4_aodp + 31 * s4) * this.SGP4_c1;
            this.SGP4_t3cof = this.SGP4_d2 + 2 * c1sq;
            this.SGP4_t4cof = 0.25 * (3 * this.SGP4_d3 + this.SGP4_c1 * (12 * this.SGP4_d2 + 10 * c1sq));
            this.SGP4_t5cof = 0.2 * (3 * this.SGP4_d4 + 12 * this.SGP4_c1 * this.SGP4_d3 + 6 * this.SGP4_d2 * this.SGP4_d2 + 15 * c1sq * (2 * this.SGP4_d2 + c1sq));
        }

        this.SGP4_INITIALIZED_FLAG = 1;
    }

    // Update for secular gravity and atmospheric drag.
    xmdf = tle.xmo + this.SGP4_xmdot * tsince;
    omgadf = tle.omegao + this.SGP4_omgdot * tsince;
    xnoddf = tle.xnodeo + this.SGP4_xnodot * tsince;
    omega = omgadf;
    xmp = xmdf;
    tsq = tsince * tsince;
    xnode = xnoddf + this.SGP4_xnodcf * tsq;
    tempa = 1 - this.SGP4_c1 * tsince;
    tempe = tle.bstar * this.SGP4_c4 * tsince;
    templ = this.SGP4_t2cof * tsq;

    if (!this.SIMPLE_FLAG) {
        delomg = this.SGP4_omgcof * tsince;
        delm = this.SGP4_xmcof * (Math.pow (1 + this.SGP4_eta * Math.cos (xmdf), 3) - this.SGP4_delmo);
        temp = delomg + delm;
        xmp = xmdf + temp;
        omega = omgadf - temp;
        tcube = tsq * tsince;
        tfour = tsince * tcube;
        tempa = tempa - this.SGP4_d2 * tsq - this.SGP4_d3 * tcube - this.SGP4_d4 * tfour;
        tempe = tempe + tle.bstar * this.SGP4_c5 * (Math.sin (xmp) - this.SGP4_sinmo);
        templ = templ + this.SGP4_t3cof * tcube + tfour * (this.SGP4_t4cof + tsince * this.SGP4_t5cof);
    }

    a = this.SGP4_aodp * Math.pow (tempa, 2);
    e = tle.eo - tempe;
    xl = xmp + omega + xnode + this.SGP4_xnodp * templ;
    beta = Math.sqrt (1 - e * e);
    xn = Globals.xke / Math.pow (a, 1.5);

    // Long period periodics
    axn = e * Math.cos (omega);
    temp = 1 / (a * beta * beta);
    xll = temp * this.SGP4_xlcof * axn;
    aynl = temp * this.SGP4_aycof;
    xlt = xl + xll;
    ayn = e * Math.sin (omega) + aynl;

    // Solve Kepler's Equation
    capu = this.FMod2p (xlt - xnode);
    temp2 = capu;
    for (i = 0; i < 10; i++) {
        sinepw = Math.sin (temp2);
        cosepw = Math.cos (temp2);
        temp3  = axn * sinepw;
        temp4  = ayn * cosepw;
        temp5  = axn * cosepw;
        temp6  = ayn * sinepw;
        epw    = (capu - temp4 + temp3 - temp2) / (1 - temp5 - temp6) + temp2;

        if (Math.abs (epw - temp2) <= Globals.e6a) {
            break;
        }

        temp2 = epw;
    }

    // Short period preliminary quantities 
    ecose = temp5 + temp6;
    esine = temp3 - temp4;
    elsq  = axn * axn + ayn * ayn;
    temp = 1 - elsq;
    pl = a * temp;
    r = a * (1 - ecose);
    temp1 = 1 / r;
    rdot = Globals.xke * Math.sqrt (a) * esine * temp1;
    rfdot = Globals.xke * Math.sqrt (pl) * temp1;
    temp2 = a * temp1;
    betal = Math.sqrt (temp);
    temp3 = 1 / (1 + betal);
    cosu = temp2 * (cosepw - axn + ayn * esine * temp3);
    sinu = temp2 * (sinepw - ayn - axn * esine * temp3);
    u = this.AcTan (sinu, cosu);
    sin2u = 2 * sinu * cosu;
    cos2u = 2 * cosu * cosu - 1;
    temp = 1 / pl;
    temp1 = Globals.ck2 * temp;
    temp2 = temp1 * temp;

    // Update for short periodics
    rk = r * (1 - 1.5 * temp2 * betal * this.SGP4_x3thm1) + 0.5 * temp1 * this.SGP4_x1mth2 * cos2u;
    uk = u - 0.25 * temp2 * this.SGP4_x7thm1 * sin2u;
    xnodek = xnode + 1.5 * temp2 * this.SGP4_cosio * sin2u;
    xinck = tle.xincl + 1.5 * temp2 * this.SGP4_cosio * this.SGP4_sinio * cos2u;
    rdotk = rdot - xn * temp1 * this.SGP4_x1mth2 * sin2u;
    rfdotk = rfdot + xn * temp1 * (this.SGP4_x1mth2 * cos2u + 1.5 * this.SGP4_x3thm1);

    // Orientation vectors 
    sinuk = Math.sin (uk);
    cosuk = Math.cos (uk);
    sinik = Math.sin (xinck);
    cosik = Math.cos (xinck);
    sinnok = Math.sin (xnodek);
    cosnok = Math.cos (xnodek);
    xmx = -sinnok * cosik;
    xmy = cosnok * cosik;
    ux = xmx * sinuk + cosnok * cosuk;
    uy = xmy * sinuk + sinnok * cosuk;
    uz = sinik * sinuk;
    vx = xmx * cosuk - cosnok * sinuk;
    vy = xmy * cosuk - sinnok * sinuk;
    vz = sinik * cosuk;

    // Position and velocity 
    pos.x = rk * ux;
    pos.y = rk * uy;
    pos.z = rk * uz;

    vel.x = rdotk * ux + rfdotk * vx;
    vel.y = rdotk * uy + rfdotk * vy;
    vel.z = rdotk * uz + rfdotk * vz;
}


// Private function
//jsPredict.prototype.Deep = function ($ientry,&$tle,&$deep_arg_eosq,&$deep_arg_sinio,&$deep_arg_cosio,&$deep_arg_betao,&$deep_arg_aodp,&$deep_arg_theta2,&$deep_arg_sing,&$deep_arg_cosg,&$deep_arg_betao2,&$deep_arg_xmdot,&$deep_arg_omgdot,&$deep_arg_xnodot,&$deep_arg_xnodp,&$deep_arg_xll,&$deep_arg_omgadf,&$deep_arg_xnode,&$deep_arg_em,&$deep_arg_xinc,&$deep_arg_xn,&$deep_arg_t,&$deep_arg_ds50)
jsPredict.prototype.Deep = function (ientry, tle, deep_arg_eosq, deep_arg_sinio, deep_arg_cosio, deep_arg_betao, deep_arg_aodp,
                                     deep_arg_theta2, deep_arg_sing, deep_arg_cosg, deep_arg_betao2, deep_arg_xmdot,
                                     deep_arg_omgdot, deep_arg_xnodot, deep_arg_xnodp, deep_arg_t, deep_arg_ds50) {
    // This function is used by SDP4 to add lunar and solar
    // perturbation effects to deep-space orbit objects.

    // Variables prefixed by this.DEEP_ are private static variables used by this function.
    // Variables preficed by this.deep_ are shared static between deep and SDP4.
/*
    static $thgr;
    static $xnq;
    static $xqncl;
    static $omegaq;
    static $zmol;
    static $zmos;
    static $savtsn;
    static $ee2;
    static $e3;
    static $xi2;
    static $xl2;
    static $xl3;
    static $xl4;
    static $xgh2;
    static $xgh3;
    static $xgh4;
    static $xh2;
    static $xh3;
    static $sse;
    static $ssi;
    static $ssg;
    static $xi3;
    static $se2;
    static $si2;
    static $sl2;
    static $sgh2;
    static $sh2;
    static $se3;
    static $si3;
    static $sl3;
    static $sgh3;
    static $sh3;
    static $sl4;
    static $sgh4;
    static $ssl;
    static $ssh;
    static $d3210;
    static $d3222;
    static $d4410;
    static $d4422;
    static $d5220;
    static $d5232;
    static $d5421;
    static $d5433;
    static $del1;
    static $del2;
    static $del3;
    static $fasx2;
    static $fasx4;
    static $fasx6;
    static $xlamo;
    static $xfact;
    static $xni;
    static $atime;
    static $stepp;
    static $stepn;
    static $step2;
    static $preep;
    static $pl;
    static $sghs;
    static $xli;
    static $d2201;
    static $d2211;
    static $sghl;
    static $sh1;
    static $pinc;
    static $pe;
    static $shs;
    static $zsingl;
    static $zcosgl;
    static $zsinhl;
    static $zcoshl;
    static $zsinil;
    static $zcosil;
*/

    // Local variables.
    var eq, aqnv, xmao, xpidot, sini2, sinq, cosq;
    var day, xnodce, stem, ctem, c, gam, zx, zy, zx;
    var zcosg, zsing, zcosi, zsini, zcosh, zsinh, cc, zn, ze, zmo, xnoi;

    var a1, a3, a7, a8, a9, a10, a2, a4, a5, a6;
    var x1, x2, x3, x4, x5, x6, x7, x8;
    var z31, z32, z33, z1, z2, z3, z11, z12, z13, z21, z22, z23;
    var s3, s2, s4, s1, s5, s6, s7, se, si, sl, sgh, sh;

    var eoc, g201, g211, g310, g322, g410, g422, g520, g533, g521, g532, g200, g300;
    var f220, f221, f321, f322, f441, f442, f522, f523, f542, f543, f311, f330;
    var xno2, ainv2, temp1, temp, bfact;
    var delt, ft, xndot, xnddt, xomi, x2omi, x2li, xldot, xl, sinis, cosis, zm, zf;
    var sinzf, f2, f3, ses, sis, sls, sel, sil, sll, pgh, ph;  
    var sinok, cosok, alfdp, betdp, dalf, dbet, xls, dls, xnoh;


    switch (ientry) {
        case 1:    // Entrance for deep space initialization
            this.DEEP_thgr = this.ThetaG (tle.epoch, deep_arg_ds50);
            eq = tle.eo;
            this.DEEP_xnq = deep_arg_xnodp;
            aqnv = 1 / deep_arg_aodp;
            this.DEEP_xqncl = tle.xincl;
            xmao = tle.xmo;
            xpidot = deep_arg_omgdot + deep_arg_xnodot;
            sinq = Math.sin (tle.xnodeo);
            cosq = Math.cos (tle.xnodeo);
            this.DEEP_omegaq = tle.omegao;

            // Initialize lunar solar terms
            day = deep_arg_ds50 + 18261.5;    // Days since 1900 Jan 0.5

            if (day != this.DEEP_preep) {
                this.DEEP_preep = day;
                xnodce = 4.5236020 - 9.2422029E-4 * day;
                stem = Math.sin (xnodce);
                ctem = Math.cos (xnodce);
                this.DEEP_zcosil = 0.91375164 - 0.03568096 * ctem;
                this.DEEP_zsinil = Math.sqrt (1 - this.DEEP_zcosil * this.DEEP_zcosil);
                this.DEEP_zsinhl = 0.089683511 * stem / this.DEEP_zsinil;
                this.DEEP_zcoshl = Math.sqrt (1 - this.DEEP_zsinhl * this.DEEP_zsinhl);
                c = 4.7199672 + 0.22997150 * day;
                gam = 5.8351514 + 0.0019443680 * day;
                this.DEEP_zmol = this.FMod2p (c - gam);
                zx = 0.39785416 * stem / this.DEEP_zsinil;
                zy = this.DEEP_zcoshl * ctem + 0.91744867 * this.DEEP_zsinhl * stem;
                zx = this.AcTan (zx, zy);
                zx = gam + zx - xnodce;
                this.DEEP_zcosgl = Math.cos (zx);
                this.DEEP_zsingl = Math.sin (zx);
                this.DEEP_zmos = 6.2565837 + 0.017201977 * day;
                this.DEEP_zmos = this.FMod2p (this.DEEP_zmos);
            }

            // Do solar terms
            this.DEEP_savtsn = 1E20;
            zcosg = Globals.zcosgs;
            zsing = Globals.zsings;
            zcosi = Globals.zcosis;
            zsini = Globals.zsinis;
            zcosh = cosq;
            zsinh = sinq;
            cc = Globals.c1ss;
            zn = Globals.zns;
            ze = Globals.zes;
            zmo = this.DEEP_zmos;
            xnoi = 1 / this.DEEP_xnq;

            // Loop breaks when Solar terms are done a second
            // time, after Lunar terms are initialized
            for (;;) {
                // Solar terms done again after Lunar terms are done
                a1  =  zcosg * zcosh + zsing * zcosi * zsinh;
                a3  = -zsing * zcosh + zcosg * zcosi * zsinh;
                a7  = -zcosg * zsinh + zsing * zcosi * zcosh;
                a8  =  zsing * zsini;
                a9  =  zsing * zsinh + zcosg * zcosi * zcosh;
                a10 =  zcosg * zsini;
                a2  =  deep_arg_cosio * a7 + deep_arg_sinio * a8;
                a4  =  deep_arg_cosio * a9 + deep_arg_sinio * a10;
                a5  = -deep_arg_sinio * a7 + deep_arg_cosio * a8;
                a6  = -deep_arg_sinio * a9 + deep_arg_cosio * a10;
                x1  =  a1 * deep_arg_cosg + a2 * deep_arg_sing;
                x2  =  a3 * deep_arg_cosg + a4 * deep_arg_sing;
                x3  = -a1 * deep_arg_sing + a2 * deep_arg_cosg;
                x4  = -a3 * deep_arg_sing + a4 * deep_arg_cosg;
                x5  =  a5 * deep_arg_sing;
                x6  =  a6 * deep_arg_sing;
                x7  =  a5 * deep_arg_cosg;
                x8  =  a6 * deep_arg_cosg;
                z31 =  12 * x1 * x1 - 3 * x3 * x3;
                z32 =  24 * x1 * x2 - 6 * x3 * x4;
                z33 =  12 * x2 * x2 - 3 * x4 * x4;
                z1  =   3 * (a1 * a1 + a2 * a2) + z31 * deep_arg_eosq;
                z2  =   6 * (a1 * a3 + a2 * a4) + z32 * deep_arg_eosq;
                z3  =   3 * (a3 * a3 + a4 * a4) + z33 * deep_arg_eosq;
                z11 =  -6 * a1 * a5 + deep_arg_eosq * (-24 * x1 * x7 - 6 * x3 * x5);
                z12 =  -6 * (a1 * a6 + a3 * a5) + deep_arg_eosq * (-24 * (x2 * x7 + x1 * x8) - 6 * (x3 * x6 + x4 * x5));
                z13 =  -6 * a3 * a6 + deep_arg_eosq * (-24 * x2 * x8 - 6 * x4 * x6);
                z21 =   6 * a2 * a5 + deep_arg_eosq * ( 24 * x1 * x5 - 6 * x3 * x7);
                z22 =   6 * (a4 * a5 + a2 * a6) + deep_arg_eosq * ( 24 * (x2 * x5 + x1 * x6) - 6 * (x4 * x7 + x3 * x8));
                z23 =   6 * a4 * a6 + deep_arg_eosq * ( 24 * x2 * x6 - 6 * x4 * x8);
                z1  = z1 + z1 + deep_arg_betao2 * z31;
                z2  = z2 + z2 + deep_arg_betao2 * z32;
                z3  = z3 + z3 + deep_arg_betao2 * z33;
                s3  = cc * xnoi;
                s2  = -0.5 * s3 / deep_arg_betao;
                s4  =        s3 * deep_arg_betao;
                s1  = -15 * eq * s4;
                s5  = x1 * x3 + x2 * x4;
                s6  = x2 * x3 + x1 * x4;
                s7  = x2 * x4 - x1 * x3;
                se  = s1 * zn * s5;
                si  = s2 * zn * (z11 + z13);
                sl  = -zn * s3 * (z1 + z3 - 14 - 6 * deep_arg_eosq);
                sgh =  s4 * zn * (z31 + z33 - 6);
                sh  = -zn * s2 * (z21 + z23);
            
                if (this.DEEP_xqncl < 5.2359877E-2) {
                    sh = 0;
                }

                this.DEEP_ee2  =  2 * s1 * s6;
                this.DEEP_e3   =  2 * s1 * s7;
                this.DEEP_xi2  =  2 * s2 * z12;
                this.DEEP_xi3  =  2 * s2 * (z13 - z11);
                this.DEEP_xl2  = -2 * s3 * z2;
                this.DEEP_xl3  = -2 * s3 * (z3 - z1);
                this.DEEP_xl4  = -2 * s3 * (-21 - 9 * deep_arg_eosq) * ze;
                this.DEEP_xgh2 =  2 * s4 * z32;
                this.DEEP_xgh3 =  2 * s4 * (z33 - z31);
                this.DEEP_xgh4 =-18 * s4 * ze;
                this.DEEP_xh2  = -2 * s2 * z22;
                this.DEEP_xh3  = -2 * s2 * (z23 - z21);

                if (this.LUNAR_TERMS_DONE_FLAG) {
                    break;
                }

                // Do lunar terms
                this.DEEP_sse  = se;
                this.DEEP_ssi  = si;
                this.DEEP_ssl  = sl;
                this.DEEP_ssh  = sh / deep_arg_sinio;
                this.DEEP_ssg  = sgh - deep_arg_cosio * this.DEEP_ssh;
                this.DEEP_se2  = this.DEEP_ee2;
                this.DEEP_si2  = this.DEEP_xi2;
                this.DEEP_sl2  = this.DEEP_xl2;
                this.DEEP_sgh2 = this.DEEP_xgh2;
                this.DEEP_sh2  = this.DEEP_xh2;
                this.DEEP_se3  = this.DEEP_e3;
                this.DEEP_si3  = this.DEEP_xi3;
                this.DEEP_sl3  = this.DEEP_xl3;
                this.DEEP_sgh3 = this.DEEP_xgh3;
                this.DEEP_sh3  = this.DEEP_xh3;
                this.DEEP_sl4  = this.DEEP_xl4;
                this.DEEP_sgh4 = this.DEEP_xgh4;
                zcosg = this.DEEP_zcosgl;
                zsing = this.DEEP_zsingl;
                zcosi = this.DEEP_zcosil;
                zsini = this.DEEP_zsinil;
                zcosh = this.DEEP_zcoshl * cosq + this.DEEP_zsinhl * sinq;
                zsinh = sinq * this.DEEP_zcoshl - cosq * this.DEEP_zsinhl;
                zn  = Globals.znl;
                cc  = Globals.c1l;
                ze  = Globals.zel;
                zmo = this.DEEP_zmol;
                this.LUNAR_TERMS_DONE_FLAG = 1;
            }

            this.DEEP_sse = this.DEEP_sse + se;
            this.DEEP_ssi = this.DEEP_ssi + si;
            this.DEEP_ssl = this.DEEP_ssl + sl;
            this.DEEP_ssg = this.DEEP_ssg + sgh - deep_arg_cosio / deep_arg_sinio * sh;
            this.DEEP_ssh = this.DEEP_ssh + sh / deep_arg_sinio;

            // Geopotential resonance initialization for 12 hour orbits
            if (!((this.DEEP_xnq < 0.0052359877) && (this.DEEP_xnq > 0.0034906585))) {
                if ((this.DEEP_xnq < 0.00826) || (this.DEEP_xnq > 0.00924)) {
                    return;
                }
                if (eq < 0.5) {
                    return;
                }

                this.RESONANCE_FLAG = 1;
                eoc  = eq * deep_arg_eosq;
                g201 = -0.306 - (eq - 0.64) * 0.440;
            
                if (eq <= 0.65) {
                    g211 =    3.616 -   13.2470 * eq +   16.2900 * deep_arg_eosq;
                    g310 =  -19.302 +  117.3900 * eq -  228.4190 * deep_arg_eosq +  156.5910 * eoc;
                    g322 = -18.9068 +  109.7927 * eq -  214.6334 * deep_arg_eosq +  146.5816 * eoc;
                    g410 =  -41.122 +  242.6940 * eq -  471.0940 * deep_arg_eosq +  313.9530 * eoc;
                    g422 = -146.407 +  841.8800 * eq - 1629.0140 * deep_arg_eosq + 1083.4350 * eoc;
                    g520 = -532.114 + 3017.9770 * eq - 5740.0000 * deep_arg_eosq + 3708.2760 * eoc;
                } else {
                    g211 =   -72.099 +   331.819 * eq -   508.738 * deep_arg_eosq +   266.724 * eoc;
                    g310 =  -346.844 +  1582.851 * eq -  2415.925 * deep_arg_eosq +  1246.113 * eoc;
                    g322 =  -342.585 +  1554.908 * eq -  2366.899 * deep_arg_eosq +  1215.972 * eoc;
                    g410 = -1052.797 +  4758.686 * eq -  7193.992 * deep_arg_eosq +  3651.957 * eoc;
                    g422 = -3581.690 + 16178.110 * eq - 24462.770 * deep_arg_eosq + 12422.520 * eoc;
                  
                    if (eq <= 0.715) {
                        g520 =  1464.74 -  4664.75 * eq +  3763.64 * deep_arg_eosq;
                    } else {
                        g520 = -5149.66 + 29936.92 * eq - 54087.36 * deep_arg_eosq + 31324.56 * eoc;
                    }
                }

                if (eq < 0.7) {
                    g533 = -919.22770 + 4988.6100 * eq - 9064.7700 * deep_arg_eosq + 5542.210 * eoc;
                    g521 = -822.71072 + 4568.6173 * eq - 8491.4146 * deep_arg_eosq + 5337.524 * eoc;
                    g532 = -853.66600 + 4690.2500 * eq - 8624.7700 * deep_arg_eosq + 5341.400 * eoc;
                } else {
                    g533 = -37995.780 + 161616.52 * eq - 229838.20 * deep_arg_eosq + 109377.94 * eoc;
                    g521 = -51752.104 + 218913.95 * eq - 309468.16 * deep_arg_eosq + 146349.42 * eoc;
                    g532 = -40023.880 + 170470.89 * eq - 242699.48 * deep_arg_eosq + 115605.82 * eoc;
                }

                sini2 = deep_arg_sinio * deep_arg_sinio;
                f220  = 0.75 * (1 + 2 * deep_arg_cosio + deep_arg_theta2);
                f221  = 1.5 * sini2;
                f321  =  1.875 * deep_arg_sinio * (1 - 2 * deep_arg_cosio - 3 * deep_arg_theta2);
                f322  = -1.875 * deep_arg_sinio * (1 + 2 * deep_arg_cosio - 3 * deep_arg_theta2);
                f441  = 35 * sini2 * f220;
                f442  = 39.3750 * sini2 * sini2;
                f522  = 9.84375 * deep_arg_sinio * (sini2 * (1 - 2 * deep_arg_cosio - 5 * deep_arg_theta2) +
                                        0.33333333 * (-2 + 4 * deep_arg_cosio + 6 * deep_arg_theta2));
                f523  = deep_arg_sinio * (4.92187512 * sini2 * (-2 - 4 * deep_arg_cosio + 10 * deep_arg_theta2) +
                                        6.56250012 * ( 1 + 2 * deep_arg_cosio - 3 * deep_arg_theta2));
                f542  = 29.53125 * deep_arg_sinio * ( 2 - 8 * deep_arg_cosio + deep_arg_theta2 * (-12 + 8 * deep_arg_cosio + 10 * deep_arg_theta2));
                f543  = 29.53125 * deep_arg_sinio * (-2 - 8 * deep_arg_cosio + deep_arg_theta2 * ( 12 + 8 * deep_arg_cosio - 10 * deep_arg_theta2));
                xno2  = this.DEEP_xnq * this.DEEP_xnq;
                ainv2 = aqnv * aqnv;
                temp1 = 3 * xno2 * ainv2;
                temp  = temp1 * Globals.root22;
                this.DEEP_d2201 = temp * f220 * g201;
                this.DEEP_d2211 = temp * f221 * g211;
                temp1 = temp1 * aqnv;
                temp = temp1 * Globals.root32;
                this.DEEP_d3210 = temp * f321 * g310;
                this.DEEP_d3222 = temp * f322 * g322;
                temp1 = temp1 * aqnv;
                temp = 2 * temp1 * Globals.root44;
                this.DEEP_d4410 = temp * f441 * g410;
                this.DEEP_d4422 = temp * f442 * g422;
                temp1 = temp1 * aqnv;
                temp  = temp1 * Globals.root52;
                this.DEEP_d5220 = temp * f522 * g520;
                this.DEEP_d5232 = temp * f523 * g532;
                temp  = 2 * temp1 * Globals.root54;
                this.DEEP_d5421 = temp * f542 * g521;
                this.DEEP_d5433 = temp * f543 * g533;
                this.DEEP_xlamo = xmao + tle.xnodeo + tle.xnodeo - this.DEEP_thgr - this.DEEP_thgr;
                bfact = deep_arg_xmdot + deep_arg_xnodot + deep_arg_xnodot - Globals.thdt - Globals.thdt;
                bfact = bfact + this.DEEP_ssl + this.DEEP_ssh + this.DEEP_ssh;
            } else {
                this.RESONANCE_FLAG   = 1;
                this.SYNCHRONOUS_FLAG = 1;

                // Synchronous resonance terms initialization
                g200 = 1 + deep_arg_eosq * (-2.5 + 0.8125 * deep_arg_eosq);
                g310 = 1 + 2 * deep_arg_eosq;
                g300 = 1 + deep_arg_eosq * (-6 + 6.60937 * deep_arg_eosq);
                f220 = 0.75 * (1 + deep_arg_cosio) * (1 + deep_arg_cosio);
                f311 = 0.9375 * deep_arg_sinio * deep_arg_sinio * (1 + 3 * deep_arg_cosio) - 0.75 * (1 + deep_arg_cosio);
                f330 = 1 + deep_arg_cosio;
                f330 = 1.875 * f330 * f330 * f330;
                this.DEEP_del1  = 3 * this.DEEP_xnq  * this.DEEP_xnq * aqnv * aqnv;
                this.DEEP_del2  = 2 * this.DEEP_del1 * f220 * g200 * Globals.q22;
                this.DEEP_del3  = 3 * this.DEEP_del1 * f330 * g300 * Globals.q33 * aqnv;
                this.DEEP_del1  =     this.DEEP_del1 * f311 * g310 * Globals.q31 * aqnv;
                this.DEEP_fasx2 = 0.13130908;
                this.DEEP_fasx4 = 2.8843198;
                this.DEEP_fasx6 = 0.37448087;
                this.DEEP_xlamo = xmao + tle.xnodeo + tle.omegao - this.DEEP_thgr;
                bfact = deep_arg_xmdot + xpidot - Globals.thdt;
                bfact = bfact + this.DEEP_ssl + this.DEEP_ssg + this.DEEP_ssh;
            }

            this.DEEP_xfact = bfact - this.DEEP_xnq;

            // Initialize integrator
            this.DEEP_xli   = this.DEEP_xlamo;
            this.DEEP_xni   = this.DEEP_xnq;
            this.DEEP_atime = 0;
            this.DEEP_stepp = 720;
            this.DEEP_stepn = -720;
            this.DEEP_step2 = 259200;

            return;

        case 2:    // Entrance for deep space secular effects
            this.deep_arg_xll    = this.deep_arg_xll    + this.DEEP_ssl * deep_arg_t;
            this.deep_arg_omgadf = this.deep_arg_omgadf + this.DEEP_ssg * deep_arg_t;
            this.deep_arg_xnode  = this.deep_arg_xnode  + this.DEEP_ssh * deep_arg_t;
            this.deep_arg_em     = tle.eo          + this.DEEP_sse * deep_arg_t;
            this.deep_arg_xinc   = tle.xincl       + this.DEEP_ssi * deep_arg_t;

            if (this.deep_arg_xinc < 0) {
                this.deep_arg_xinc   = -this.deep_arg_xinc;
                this.deep_arg_xnode  = this.deep_arg_xnode  + Globals.pi;
                this.deep_arg_omgadf = this.deep_arg_omgadf - Globals.pi;
            }
        
            if (!this.RESONANCE_FLAG) {
                  return;
            }

            do {
                if ((this.DEEP_atime == 0) ||
                    ((deep_arg_t >= 0) && (this.DEEP_atime  < 0)) ||
                    ((deep_arg_t  < 0) && (this.DEEP_atime >= 0))) {
                    // Epoch restart
                    if (deep_arg_t >= 0) {
                        delt = this.DEEP_stepp;
                    } else {
                        delt = this.DEEP_stepn;
                    }

                    this.DEEP_atime = 0;
                    this.DEEP_xni   = this.DEEP_xnq;
                    this.DEEP_xli   = this.DEEP_xlamo;
                } else {
                    if (Math.abs (deep_arg_t) >= Math.abs (this.DEEP_atime)) {
                        if (deep_arg_t > 0) {
                            delt = this.DEEP_stepp;
                        } else {
                            delt = this.DEEP_stepn;
                        }
                    }
                }
            
                do {
                    if (Math.abs (deep_arg_t - this.DEEP_atime) >= this.DEEP_stepp) {
                        this.DO_LOOP_FLAG = 1;
                        this.EPOCH_RESTART_FLAG = 0;
                    } else {
                        ft = deep_arg_t - this.DEEP_atime;
                        this.DO_LOOP_FLAG = 0;
                    }

                    if (Math.abs (deep_arg_t) < Math.abs (this.DEEP_atime)) {
                        if (deep_arg_t >= 0) {
                            delt = this.DEEP_stepn;
                        } else {
                            delt = this.DEEP_stepp;
                        }

                        this.DO_LOOP_FLAG = 1;
                        this.EPOCH_RESTART_FLAG = 1;
                    }

                    // Dot terms calculated
                    if (this.SYNCHRONOUS_FLAG) {
                        xndot =     this.DEEP_del1 * Math.sin (     this.DEEP_xli - this.DEEP_fasx2) +
                                                            this.DEEP_del2 * Math.sin (2 * (this.DEEP_xli - this.DEEP_fasx4)) +
                                                            this.DEEP_del3 * Math.sin (3 * (this.DEEP_xli - this.DEEP_fasx6));
                        xnddt =     this.DEEP_del1 * Math.cos (     this.DEEP_xli - this.DEEP_fasx2) +
                                 2 * this.DEEP_del2 * Math.cos (2 * (this.DEEP_xli - this.DEEP_fasx4)) +
                                3 * this.DEEP_del3 * Math.cos (3 * (this.DEEP_xli - this.DEEP_fasx6));
                    } else {
                        xomi = this.DEEP_omegaq + deep_arg_omgdot * this.DEEP_atime;
                        x2omi = xomi + xomi;
                        x2li = this.DEEP_xli + this.DEEP_xli;
                        xndot = this.DEEP_d2201 * Math.sin ( x2omi + this.DEEP_xli - Globals.g22) +
                                                        this.DEEP_d2211 * Math.sin (         this.DEEP_xli - Globals.g22) +
                                this.DEEP_d3210 * Math.sin ( xomi  + this.DEEP_xli - Globals.g32) +
                                this.DEEP_d3222 * Math.sin (-xomi  + this.DEEP_xli - Globals.g32) +
                                this.DEEP_d4410 * Math.sin ( x2omi + x2li          - Globals.g44) +
                            this.DEEP_d4422 * Math.sin ( x2li                  - Globals.g44) +
                                this.DEEP_d5220 * Math.sin ( xomi  + this.DEEP_xli - Globals.g52) +
                                this.DEEP_d5232 * Math.sin (-xomi  + this.DEEP_xli - Globals.g52) +
                                this.DEEP_d5421 * Math.sin ( xomi  + x2li          - Globals.g54) +
                            this.DEEP_d5433 * Math.sin (-xomi  + x2li          - Globals.g54);
                        xnddt = this.DEEP_d2201 * Math.cos ( x2omi + this.DEEP_xli - Globals.g22) +
                            this.DEEP_d2211 * Math.cos (         this.DEEP_xli - Globals.g22) +
                            this.DEEP_d3210 * Math.cos ( xomi  + this.DEEP_xli - Globals.g32) +
                            this.DEEP_d3222 * Math.cos (-xomi  + this.DEEP_xli - Globals.g32) +
                            this.DEEP_d5220 * Math.cos ( xomi  + this.DEEP_xli - Globals.g52) +
                            this.DEEP_d5232 * Math.cos (-xomi  + this.DEEP_xli - Globals.g52) +
                            2 * (this.DEEP_d4410 * Math.cos ( x2omi + x2li - Globals.g44) +
                                 this.DEEP_d4422 * Math.cos ( x2li         - Globals.g44) +
                                 this.DEEP_d5421 * Math.cos ( xomi  + x2li - Globals.g54) +
                                 this.DEEP_d5433 * Math.cos (-xomi  + x2li - Globals.g54));
                    }

                    xldot = this.DEEP_xni + this.DEEP_xfact;
                    xnddt = xnddt * xldot;

                    if (this.DO_LOOP_FLAG) {
                        this.DEEP_xli   = this.DEEP_xli   + xldot * delt + xndot * this.DEEP_step2;
                        this.DEEP_xni   = this.DEEP_xni   + xndot * delt + xnddt * this.DEEP_step2;
                        this.DEEP_atime = this.DEEP_atime + delt;
                    }
                } while (this.DO_LOOP_FLAG && !this.EPOCH_RESTART_FLAG);
            } while (this.DO_LOOP_FLAG && this.EPOCH_RESTART_FLAG);

            this.deep_arg_xn = this.DEEP_xni + xndot * ft + xnddt * ft * ft * 0.5;
            xl          = this.DEEP_xli + xldot * ft + xndot * ft * ft * 0.5;
            temp        = -this.deep_arg_xnode + this.DEEP_thgr + deep_arg_t * Globals.thdt;

            if (!this.SYNCHRONOUS_FLAG) {
                this.deep_arg_xll = xl + temp + temp;
            } else {
                this.deep_arg_xll = xl - this.deep_arg_omgadf + temp;
            }

            return;

        case 3:    // Entrance for lunar-solar periodics
            sinis = Math.sin (this.deep_arg_xinc);
            cosis = Math.cos (this.deep_arg_xinc);

            if (Math.abs (this.DEEP_savtsn - deep_arg_t) >= 30) {
                this.DEEP_savtsn = deep_arg_t;
                zm = this.DEEP_zmos + Globals.zns * deep_arg_t;
                zf = zm + 2 * Globals.zes * Math.sin (zm);
                sinzf = Math.sin (zf);
                f2 =  0.5 * sinzf * sinzf - 0.25;
                f3 = -0.5 * sinzf * Math.cos (zf);
                ses = this.DEEP_se2 * f2 + this.DEEP_se3 * f3;
                sis = this.DEEP_si2 * f2 + this.DEEP_si3 * f3;
                sls = this.DEEP_sl2 * f2 + this.DEEP_sl3 * f3 + this.DEEP_sl4 * sinzf;
                this.DEEP_sghs = this.DEEP_sgh2 * f2 + this.DEEP_sgh3 * f3 + this.DEEP_sgh4 * sinzf;
                this.DEEP_shs  = this.DEEP_sh2  * f2 + this.DEEP_sh3  * f3;
                zm = this.DEEP_zmol + Globals.znl * deep_arg_t;
                zf = zm + 2 * Globals.zel * Math.sin (zm);
                sinzf = Math.sin (zf);
                f2 =  0.5 * sinzf * sinzf - 0.25;
                f3 = -0.5 * sinzf * Math.cos (zf);
                sel = this.DEEP_ee2 * f2 + this.DEEP_e3  * f3;
                sil = this.DEEP_xi2 * f2 + this.DEEP_xi3 * f3;
                sll = this.DEEP_xl2 * f2 + this.DEEP_xl3 * f3 + this.DEEP_xl4 * sinzf;
                this.DEEP_sghl = this.DEEP_xgh2 * f2 + this.DEEP_xgh3 * f3 + this.DEEP_xgh4 * sinzf;
                this.DEEP_sh1  = this.DEEP_xh2  * f2 + this.DEEP_xh3  * f3;
                this.DEEP_pe   = ses + sel;
                this.DEEP_pinc = sis + sil;
                this.DEEP_pl   = sls + sll;
            }

            pgh = this.DEEP_sghs + this.DEEP_sghl;
            ph  = this.DEEP_shs  + this.DEEP_sh1;
            this.deep_arg_xinc = this.deep_arg_xinc + this.DEEP_pinc;
            this.deep_arg_em = this.deep_arg_em + this.DEEP_pe;

            if (this.DEEP_xqncl >= 0.2) {
                // Apply periodics directly
                ph  = ph  / deep_arg_sinio;
                pgh = pgh - deep_arg_cosio * ph;
                this.deep_arg_omgadf = this.deep_arg_omgadf + pgh;
                this.deep_arg_xnode = this.deep_arg_xnode + ph;
                this.deep_arg_xll = this.deep_arg_xll + this.DEEP_pl;
            } else     {
                // Apply periodics with Lyddane modification
                sinok = Math.sin (this.deep_arg_xnode);
                cosok = Math.cos (this.deep_arg_xnode);
                alfdp = sinis * sinok;
                betdp = sinis * cosok;
                dalf  =  ph * cosok + this.DEEP_pinc * cosis * sinok;
                dbet  = -ph * sinok + this.DEEP_pinc * cosis * cosok;
                alfdp = alfdp + dalf;
                betdp = betdp + dbet;
                this.deep_arg_xnode = this.FMod2p (this.deep_arg_xnode);
                xls = this.deep_arg_xll + this.deep_arg_omgadf + cosis * this.deep_arg_xnode;
                dls = this.DEEP_pl + pgh - this.DEEP_pinc * this.deep_arg_xnode * sinis;
                xls = xls + dls;
                xnoh = this.deep_arg_xnode;
                this.deep_arg_xnode = this.AcTan (alfdp, betdp);

                // This is a patch to Lyddane modification
                // suggested by Rob Matson.
                if (Math.abs (xnoh - this.deep_arg_xnode) > Globals.pi) {
                    if (this.deep_arg_xnode < xnoh) {
                        this.deep_arg_xnode += Globals.twopi;
                    } else {
                        this.deep_arg_xnode -= Globals.twopi;
                    }
                }

                this.deep_arg_xll = this.deep_arg_xll + this.DEEP_pl;
                this.deep_arg_omgadf = xls - this.deep_arg_xll - Math.cos (this.deep_arg_xinc) * this.deep_arg_xnode;
            }
            return;
    }
}




// Private function
jsPredict.prototype.SDP4 = function (tsince, tle, pos, vel) {
    // This function is used to calculate the position and velocity
    // of deep-space (period > 225 minutes) satellites. tsince is
    // time since epoch in minutes, tle is a pointer to a tle
    // structure with Keplerian orbital elements and pos and vel
    // are vector structures returning ECI satellite position and
    // velocity. Use Convert_Sat_State() to convert to km and km/s.

    // Variables of format this.SDP4_ are statics that are local to the SDP4 function.

/*
    static $x3thm1;
    static $c1;
    static $x1mth2;
    static $c4;
    static $xnodcf;
    static $t2cof;
    static $xlcof;
    static $aycof;
    static $x7thm1;

    // Used by dpinit part of Deep()
    static $deep_arg_eosq;
    static $deep_arg_sinio;
    static $deep_arg_cosio;
    static $deep_arg_betao;
    static $deep_arg_aodp;
    static $deep_arg_theta2;
    static $deep_arg_sing;
    static $deep_arg_cosg;
    static $deep_arg_betao2;
    static $deep_arg_xmdot;
    static $deep_arg_omgdot;
    static $deep_arg_xnodot;
    static $deep_arg_xnodp;

    // Used by dpsec and dpper parts of Deep()

    // static $deep_arg_xll;
    // static $deep_arg_omgadf;
    // static $deep_arg_xnode;
    // static $deep_arg_em;
    // static $deep_arg_xinc;
    // static $deep_arg_xn;
    static $deep_arg_t;

    // Used by thetg and Deep()
//FIXME: uninitialized and posibly wrong context.
    static $deep_arg_ds50;
*/

    // Initialization
    if (!this.SDP4_INITIALIZED_FLAG) {
        // Recover original mean motion (xnodp) and semimajor axis (aodp) from input elements.
        a1 = Math.pow (Globals.xke / tle.xno, Globals.tothrd);
        this.SDP4_deep_arg_cosio = Math.cos (tle.xincl);
        this.SDP4_deep_arg_theta2 = this.SDP4_deep_arg_cosio * this.SDP4_deep_arg_cosio;
        this.SDP4_x3thm1 = 3 * this.SDP4_deep_arg_theta2 - 1;
        this.SDP4_deep_arg_eosq = tle.eo * tle.eo;
        this.SDP4_deep_arg_betao2 = 1 - this.SDP4_deep_arg_eosq;
        this.SDP4_deep_arg_betao = Math.sqrt (this.SDP4_deep_arg_betao2);
        del1 = 1.5 * Globals.ck2 * this.SDP4_x3thm1 / (a1 * a1 * this.SDP4_deep_arg_betao * this.SDP4_deep_arg_betao2);
        ao = a1 * (1 - del1 * (0.5 * Globals.tothrd + del1 * (1 + 134 / 81 * del1)));
        delo = 1.5 * Globals.ck2 * this.SDP4_x3thm1 / (ao * ao * this.SDP4_deep_arg_betao * this.SDP4_deep_arg_betao2);
        this.SDP4_deep_arg_xnodp = tle.xno / (1 + delo);
        this.SDP4_deep_arg_aodp = ao / (1 - delo);

        // For perigee below 156 km, the values of s and qoms2t are altered.
        s4 = Globals.s;
        qoms24 = Globals.qoms2t;
        perigee = (this.SDP4_deep_arg_aodp * (1 - tle.eo) - Globals.ae) * Globals.xkmper;
        if (perigee < 156.0) {
            if ($perigee<=98.0) {
                s4 = 20.0;
            } else {
                s4 = perigee - 78.0;
            }

            qoms24 = Math.pow ((120 - s4) * Globals.ae / Globals.xkmper, 4);
            s4 = s4 / Globals.xkmper + Globals.ae;
        }

        pinvsq = 1 / (this.SDP4_deep_arg_aodp * this.SDP4_deep_arg_aodp * this.SDP4_deep_arg_betao2 * this.SDP4_deep_arg_betao2);
        this.SDP4_deep_arg_sing = Math.sin (tle.omegao);
        this.SDP4_deep_arg_cosg = Math.cos (tle.omegao);
        tsi = 1 / (this.SDP4_deep_arg_aodp - s4);
        eta = this.SDP4_deep_arg_aodp * tle.eo * tsi;
        etasq = eta * eta;
        eeta = tle.eo * eta;
        psisq = Math.abs (1 - etasq);
        coef = qoms24 * Math.pow (tsi, 4);
        coef1 = coef / Math.pow (psisq, 3.5);
        c2 = coef1 * this.SDP4_deep_arg_xnodp * (this.SDP4_deep_arg_aodp * (1 + 1.5 * etasq + eeta * (4 + etasq)) + 0.75 * Globals.ck2 * tsi / psisq * this.SDP4_x3thm1 * (8 + 3 * etasq * (8 + etasq)));
        this.SDP4_c1 = tle.bstar * c2;
        this.SDP4_deep_arg_sinio = Math.sin (tle.xincl);
        a3ovk2 = -Globals.xj3 / Globals.ck2 * Math.pow (Globals.ae, 3);
        this.SDP4_x1mth2 = 1 - this.SDP4_deep_arg_theta2;
        this.SDP4_c4 = 2 * this.SDP4_deep_arg_xnodp * coef1 * this.SDP4_deep_arg_aodp * this.SDP4_deep_arg_betao2 * (eta * (2 + 0.5 * etasq) + tle.eo * (0.5 + 2 * etasq) - 2 * Globals.ck2 * tsi / (this.SDP4_deep_arg_aodp * psisq) * (-3 * this.SDP4_x3thm1 * (1 - 2 * eeta + etasq * (1.5 - 0.5 * eeta)) + 0.75 * this.SDP4_x1mth2 * (2 * etasq - eeta * (1 + etasq)) * Math.cos (2 * tle.omegao)));
        theta4 = this.SDP4_deep_arg_theta2 * this.SDP4_deep_arg_theta2;
        temp1 = 3 * Globals.ck2 * pinvsq * this.SDP4_deep_arg_xnodp;
        temp2 = temp1 * Globals.ck2 * pinvsq;
        temp3 = 1.25 * Globals.ck4 * pinvsq * pinvsq * this.SDP4_deep_arg_xnodp;
        this.SDP4_deep_arg_xmdot = this.SDP4_deep_arg_xnodp + 0.5 * temp1 * this.SDP4_deep_arg_betao * this.SDP4_x3thm1 + 0.0625 * temp2 * this.SDP4_deep_arg_betao * (13 - 78 * this.SDP4_deep_arg_theta2 + 137 * theta4);
        x1m5th = 1 - 5 * this.SDP4_deep_arg_theta2;
        this.SDP4_deep_arg_omgdot = -0.5 * temp1 * x1m5th + 0.0625 * temp2 * (7 - 114 * this.SDP4_deep_arg_theta2 + 395 * theta4) + temp3 * (3 - 36 * this.SDP4_deep_arg_theta2 + 49 * theta4);
        xhdot1 = -temp1 * this.SDP4_deep_arg_cosio;
        this.SDP4_deep_arg_xnodot = xhdot1 + (0.5 * temp2 * (4 - 19 * this.SDP4_deep_arg_theta2) + 2 * temp3 * (3 - 7 * this.SDP4_deep_arg_theta2)) * this.SDP4_deep_arg_cosio;
        this.SDP4_xnodcf = 3.5 * this.SDP4_deep_arg_betao2 * xhdot1 * this.SDP4_c1;
        this.SDP4_t2cof = 1.5 * this.SDP4_c1;
        this.SDP4_xlcof = 0.125 * a3ovk2 * this.SDP4_deep_arg_sinio * (3 + 5 * this.SDP4_deep_arg_cosio) / (1 + this.SDP4_deep_arg_cosio);
        this.SDP4_aycof = 0.25 * a3ovk2 * this.SDP4_deep_arg_sinio;
        this.SDP4_x7thm1 = 7 * this.SDP4_deep_arg_theta2 - 1;

        // Initialize Deep()
        this.Deep (1, tle, this.SDP4_deep_arg_eosq, this.SDP4_deep_arg_sinio, this.SDP4_deep_arg_cosio, this.SDP4_deep_arg_betao, this.SDP4_deep_arg_aodp, this.SDP4_deep_arg_theta2, this.SDP4_deep_arg_sing, this.SDP4_deep_arg_cosg, this.SDP4_deep_arg_betao2, this.SDP4_deep_arg_xmdot, this.SDP4_deep_arg_omgdot, this.SDP4_deep_arg_xnodot, this.SDP4_deep_arg_xnodp, this.SDP4_deep_arg_t, this.SDP4_deep_arg_ds50);

        this.SDP4_INITIALIZED_FLAG = 1;
    }

    // Update for secular gravity and atmospheric drag
    xmdf = tle.xmo + this.SDP4_deep_arg_xmdot * tsince;
    this.deep_arg_omgadf = tle.omegao + this.SDP4_deep_arg_omgdot * tsince;
    xnoddf = tle.xnodeo + this.SDP4_deep_arg_xnodot * tsince;
    tsq = tsince * tsince;
    this.deep_arg_xnode = xnoddf + this.SDP4_xnodcf * tsq;
    tempa = 1 - this.SDP4_c1 * tsince;
    tempe = tle.bstar * this.SDP4_c4 * tsince;
    templ = this.SDP4_t2cof * tsq;
    this.deep_arg_xn = this.SDP4_deep_arg_xnodp;

    // Update for deep-space secular effects
    this.deep_arg_xll = xmdf;
    this.SDP4_deep_arg_t = tsince;

    this.Deep (2, tle, this.SDP4_deep_arg_eosq, this.SDP4_deep_arg_sinio, this.SDP4_deep_arg_cosio, this.SDP4_deep_arg_betao, this.SDP4_deep_arg_aodp, this.SDP4_deep_arg_theta2, this.SDP4_deep_arg_sing, this.SDP4_deep_arg_cosg, this.SDP4_deep_arg_betao2, this.SDP4_deep_arg_xmdot, this.SDP4_deep_arg_omgdot, this.SDP4_deep_arg_xnodot, this.SDP4_deep_arg_xnodp, this.SDP4_deep_arg_t, this.SDP4_deep_arg_ds50);

    xmdf = this.deep_arg_xll;
    a = Math.pow (Globals.xke / this.deep_arg_xn, Globals.tothrd) * tempa * tempa;
    this.deep_arg_em = this.deep_arg_em - tempe;
    xmam = xmdf + this.SDP4_deep_arg_xnodp * templ;

    // Update for deep-space periodic effects
    this.deep_arg_xll = xmam;

    this.Deep (3, tle, this.SDP4_deep_arg_eosq, this.SDP4_deep_arg_sinio, this.SDP4_deep_arg_cosio, this.SDP4_deep_arg_betao, this.SDP4_deep_arg_aodp, this.SDP4_deep_arg_theta2, this.SDP4_deep_arg_sing, this.SDP4_deep_arg_cosg, this.SDP4_deep_arg_betao2, this.SDP4_deep_arg_xmdot, this.SDP4_deep_arg_omgdot, this.SDP4_deep_arg_xnodot, this.SDP4_deep_arg_xnodp, this.SDP4_deep_arg_t, this.SDP4_deep_arg_ds50);

    xmam = this.deep_arg_xll;
    xl = xmam + this.deep_arg_omgadf + this.deep_arg_xnode;
    beta = Math.sqrt (1 - this.deep_arg_em * this.deep_arg_em);
    this.deep_arg_xn = Globals.xke / Math.pow (a, 1.5);

    // Long period periodics
    axn = this.deep_arg_em * Math.cos (this.deep_arg_omgadf);
    temp = 1 / (a * beta * beta);
    xll = temp * this.SDP4_xlcof * axn;
    aynl = temp * this.SDP4_aycof;
    xlt = xl + xll;
    ayn = this.deep_arg_em * Math.sin (this.deep_arg_omgadf) + aynl;

    // Solve Kepler's Equation
    capu = this.FMod2p (xlt - this.deep_arg_xnode);
    temp2 = capu;
    for (i = 0; i < 10; i++) {
        sinepw = Math.sin (temp2);
        cosepw = Math.cos (temp2);
        temp3  = axn * sinepw;
        temp4  = ayn * cosepw;
        temp5  = axn * cosepw;
        temp6  = ayn * sinepw;
        epw = (capu - temp4 + temp3 - temp2) / (1 - temp5 - temp6) + temp2;

        if (Math.abs (epw - temp2) <= Globals.e6a) {
            break;
        }
        temp2 = epw;
    }

    // Short period preliminary quantities
    ecose = temp5 + temp6;
    esine = temp3 - temp4;
    elsq  = axn * axn + ayn * ayn;
    temp  = 1 - elsq;
    pl    = a * temp;
    r     = a * (1 - ecose);
    temp1 = 1/r;
    rdot  = Globals.xke * Math.sqrt (a) * esine * temp1;
    rfdot = Globals.xke * Math.sqrt (pl) * temp1;
    temp2 = a * temp1;
    betal = Math.sqrt (temp);
    temp3 = 1 / (1 + betal);
    cosu  = temp2 * (cosepw - axn + ayn * esine * temp3);
    sinu  = temp2 * (sinepw - ayn - axn * esine * temp3);
    u     = this.AcTan (sinu, cosu);
    sin2u = 2 * sinu * cosu;
    cos2u = 2 * cosu * cosu - 1;
    temp  = 1 / pl;
    temp1 = Globals.ck2 * temp;
    temp2 = temp1 * temp;

    // Update for short periodics
    rk = r * (1 - 1.5 * temp2 * betal * this.SDP4_x3thm1) + 0.5 * temp1 * this.SDP4_x1mth2 * cos2u;
    uk = u - 0.25 * temp2 * this.SDP4_x7thm1 * sin2u;
    xnodek = this.deep_arg_xnode + 1.5 * temp2 * this.SDP4_deep_arg_cosio * sin2u;
    xinck = this.deep_arg_xinc + 1.5 * temp2 * this.SDP4_deep_arg_cosio * this.SDP4_deep_arg_sinio * cos2u;
    rdotk = rdot - this.deep_arg_xn * temp1 * this.SDP4_x1mth2 * sin2u;
    rfdotk = rfdot + this.deep_arg_xn * temp1 * (this.SDP4_x1mth2 * cos2u + 1.5 * this.SDP4_x3thm1);

    // Orientation vectors
    sinuk  = Math.sin (uk);
    cosuk  = Math.cos (uk);
    sinik  = Math.sin (xinck);
    cosik  = Math.cos (xinck);
    sinnok = Math.sin (xnodek);
    cosnok = Math.cos (xnodek);
    xmx    = -sinnok * cosik;
    xmy    =  cosnok * cosik;
    ux     = xmx * sinuk + cosnok * cosuk;
    uy     = xmy * sinuk + sinnok * cosuk;
    uz     =               sinik  * sinuk;
    vx     = xmx * cosuk - cosnok * sinuk;
    vy     = xmy * cosuk - sinnok * sinuk;
    vz     =               sinik  * cosuk;

    // Position and velocity
    pos.x = rk * ux;
    pos.y = rk * uy;
    pos.z = rk * uz;
    vel.x = rdotk * ux + rfdotk * vx;
    vel.y = rdotk * uy + rfdotk * vy;
    vel.z = rdotk * uz + rfdotk * vz;
}



// Private function.
jsPredict.prototype.calc = function (tle, obs_geodetic, sat_data, daynum) {
    // This is the stuff we need to do repetitively...

    // Zero vector for initializations
    var zero_vector = new vector ();

    // Satellite position and velocity vectors
    var vel = new vector ();
    var pos = new vector ();

    // Satellite Az, El, Range, Range rate
    var obs_set = new vector ();

    // Solar ECI position vector
    var solar_vector = new vector ();

    // Solar observed azi and ele vector
    var solar_set = new vector ();

    // Satellite's predicted geodetic position
    var sat_geodetic = new geodetic (0, 0, 0);

    var jul_utc = daynum + 2444238.5;

    // Convert satellite's epoch time to Julian and calculate time since epoch in minutes
    var jul_epoch = this.Julian_Date_of_Epoch (tle.epoch);
    var tsince = (jul_utc - jul_epoch) * Globals.xmnpda;
    sat_data.age = jul_utc - jul_epoch;

    if (tle.deep) {
        this.SDP4 (tsince, tle, pos, vel);
    } else {
        this.SGP4 (tsince, tle, pos, vel);
    }

    // Scale position and velocity vectors to km and km/sec
    this.Convert_Sat_State (pos, vel);

    // Calculate velocity of satellite
    this.Magnitude (vel);
    sat_data.vel = vel.w;

    // All angles in rads. Distance in km. Velocity in km/s
    // Calculate satellite Azi, Ele, Range and Range-rate
    this.Calculate_Obs (jul_utc, pos, vel, obs_geodetic, obs_set);

    // Calculate satellite Lat North, Lon East and Alt.
    this.Calculate_LatLonAlt (jul_utc, pos, sat_geodetic);

    // Calculate solar position and satellite eclipse depth.
    // Also set or clear the satellite eclipsed flag accordingly.
    this.Calculate_Solar_Position (jul_utc, solar_vector);
    this.Calculate_Obs (jul_utc, solar_vector, zero_vector, obs_geodetic, solar_set);
    sat_data.eclipsed = this.Sat_Eclipsed (pos, solar_vector, sat_data);

    // Check if the satellite is currently visible to the observer
    if (obs_set.y >= 0.0) {
        sat_data.visible = 1;
    } else {
        sat_data.visible = 0;
    }

    sat_data.azi = obs_set.x / Globals.deg2rad;
    sat_data.ele = obs_set.y / Globals.deg2rad;

    sat_data.range = obs_set.z;
    sat_data.range_rate = obs_set.w;

    sat_data.lat = sat_geodetic.lat / Globals.deg2rad;
    if (this.io_lat != 'N') {
        sat_data.lat *= -1;
    }

    if (tle.catnum === 20439) {
        debugger;
    }
    
    if (this.io_lon == 'W') {
        sat_data.lon = 360.0 - (sat_geodetic.lon / Globals.deg2rad);
    } else {
        sat_data.lon = (sat_geodetic.lon / Globals.deg2rad);
    }
    
    sat_data.lon = (sat_geodetic.lon / Globals.deg2rad);

    sat_data.alt = sat_geodetic.alt;

    this.sun_azi = solar_set.x / Globals.deg2rad; 
    this.sun_ele = solar_set.y / Globals.deg2rad;

    sat_data.footprint = 12756.33 * Math.acos (Globals.xkmper / (Globals.xkmper + sat_data.alt));
    
    this.rv = Math.floor ((tle.xno * Globals.xmnpda / Globals.twopi + sat_data.age * tle.bstar * Globals.ae) * sat_data.age + tle.xmo / Globals.twopi) + tle.orbitnum;
    this.irk = sat_data.range;
    this.isplat = sat_data.lat;
    this.isplong = sat_data.lon;
    this.iaz = Math.round (sat_data.azi);
    this.iel = Math.round (sat_data.ele);
}


// Public function.
// FIXME: Problems with predict_data. It is a array of objects passed by reference - how to initialize.??
jsPredict.prototype.predict = function (tle, obs_geodetic, predict_data, daynum, days, visible_only) {
    // This function predicts satellite passes.

    // Handle default values for the last two parameers.
    if (days == null) {
        days = 1;
    }
    if (visible_only == null) {
        visible_only = 0;
    }

    var days_sec = 86400 * (days - 1);
    var end_secs = this.daynum2unix (daynum) + days_sec;

    // Convert observers geodetic position to radians
    obs_geodetic.lat *= +Globals.deg2rad;
    obs_geodetic.lon *= -Globals.deg2rad;
    obs_geodetic.alt /= 1000.0;

    // Resets all flags
    this.reset_flags ();

    // Trap geostationary orbits and passes that cannot occur.
    if (this.AosHappens (tle, obs_geodetic) &&
        this.Geostationary (tle) == 0 &&
        this.Decayed (tle, daynum) == 0) {

        var index = 0;
        var sat_data = new sat ();

        do {
            daynum = this.FindAOS (tle, obs_geodetic, sat_data, daynum);

            var aos_ts = this.daynum2unix (daynum);
            var aos_lat = this.isplat;
            var aos_lon = this.isplong;
            var aos_range = this.irk;
            var aos_daynum = daynum;
            var aos_ele = this.iel;
            var aos_azi = this.iaz;
            var aos_orbitnum = this.rv;

            // Get the satellite passes
            while (this.iel >= 0) {
                lastel = this.iel;

                daynum += Math.cos ((sat_data.ele - 1.0) * Globals.deg2rad)* Math.sqrt (sat_data.alt) / 25000.0;
                this.calc (tle, obs_geodetic, sat_data, daynum);
            }

            // Make sure we found the satellites AOS
            if (lastel != 0) {
                daynum = this.FindLOS (tle, obs_geodetic, sat_data, daynum);
                this.calc (tle, obs_geodetic, sat_data, daynum);

                predict_data[index] = new predict ();
                predict_data[index].aos_lat      = aos_lat;
                predict_data[index].aos_lon      = aos_lon;
                predict_data[index].aos_range    = aos_range;
                predict_data[index].aos_daynum   = aos_daynum;
                predict_data[index].aos_ele      = aos_ele;
                predict_data[index].aos_azi      = aos_azi;
                predict_data[index].aos_orbitnum = aos_orbitnum;
                predict_data[index].aos_ts       = aos_ts;
                predict_data[index].los_lat      = this.isplat;
                predict_data[index].os_lon       = this.isplong;
                predict_data[index].los_range    = this.irk;
                predict_data[index].los_daynum   = daynum;
                predict_data[index].los_ele      = this.iel;
                predict_data[index].los_azi      = this.iaz;
                predict_data[index].los_orbitnum = this.rv;
                predict_data[index].los_ts       = this.daynum2unix (daynum);
                predict_data[index].duration     = (predict_data[index].los_ts - aos_ts) / 60;

                index++;

                if (visible_only && !sat_data.visible) {
                    // Drop it again.
                    unset (predict_data[index]);
                    index--;
                }
            }

            daynum = this.NextAOS (tle, obs_geodetic, sat_data, daynum);

            start_secs = this.daynum2unix (daynum);

        }  while (this.AosHappens (tle, obs_geodetic) && this.Decayed (tle, daynum) == 0 && start_secs <= end_secs);

        unset (sat_data);
    }

    // Convert observers geodetic position back to degrees

    obs_geodetic.lat /= +Globals.deg2rad;
    obs_geodetic.lon /= -Globals.deg2rad;
    obs_geodetic.alt *= 1000.0;
}


// Public function.
jsPredict.prototype.track = function (tle, obs_geodetic, sat_data, daynum) {
    // Convert observers geodetic position to radians
    obs_geodetic.lat *=  Globals.deg2rad;
    obs_geodetic.lon *= -Globals.deg2rad;
    obs_geodetic.alt /= 1000.0;

    // Resets all flags
    this.reset_flags ();

    // Calculate the satellites position and velocity in earth orbit
    this.calc (tle, obs_geodetic, sat_data, daynum);

    // Convert observers geodetic position back to degrees
    obs_geodetic.lat /=  Globals.deg2rad;
    obs_geodetic.lon /= -Globals.deg2rad;
    obs_geodetic.alt *= 1000.0;
}


// Public function.
// This version does not reset the state for each invocation. Have to be
// preceeded by a call to track on the same satellite & observer set.
jsPredict.prototype.track_next = function (tle, obs_geodetic, sat_data, daynum) {
    // Convert observers geodetic position to radians
    obs_geodetic.lat *=  Globals.deg2rad;
    obs_geodetic.lon *= -Globals.deg2rad;
    obs_geodetic.alt /= 1000.0;

    // Calculate the satellites position and velocity in earth orbit
    this.calc (tle, obs_geodetic, sat_data, daynum);

    // Convert observers geodetic position back to degrees
    obs_geodetic.lat /=  Globals.deg2rad;
    obs_geodetic.lon /= -Globals.deg2rad;
    obs_geodetic.alt *= 1000.0;
}