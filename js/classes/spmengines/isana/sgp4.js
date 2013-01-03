
// Orbital Propagation Model 'SGP4' for NORAD mean element sets
// Felix R. Hoots, Ronald L. Roehrich, "Space Track Report No.3 : Models for Propagation of NORAD Elements Sets"
// JavaScript version by KASHIWAI, Isana (isana at lizard-tail dot com)
// License::  GPL
// Update:: 2010.03.03

Clock = function(){}

Clock.prototype.JulianDay = function(date){
  d = new Date();
  d.setTime(date.getTime())
  var year=d.getUTCFullYear();
  var month=d.getUTCMonth()+1;
  var day=d.getUTCDate();
  var calender="";

  if(month <= 2){
    var year = year - 1;
    var month = month + 12;
  } 

  var julian_day = Math.floor(365.25*(year+4716))+Math.floor(30.6001*(month+1))+day-1524.5;
  
  if (calender == "julian"){ 
    var transition_offset=0;
  }else if(calender == "gregorian"){
    var tmp = Math.floor(year/100);
    var transition_offset=2-tmp+Math.floor(tmp/4);
  }else if(julian_day<2299160.5){
    var transition_offset=0;
  }else{
    var tmp = Math.floor(year/100);
    var transition_offset=2-tmp+Math.floor(tmp/4);
  }
    var jd=julian_day+transition_offset;
    this.jd = jd;
    return jd
}


Clock.prototype.GMST = function(date){
//load default values
  d = new Date();
  d.setTime(date.getTime())
  var hours=d.getUTCHours();
  var minutes=d.getUTCMinutes();
  var seconds=d.getUTCSeconds();
  var time_in_sec=hours*3600+minutes*60+seconds;
  var clock = new Clock()
  var jd = clock.JulianDay(date);
  var rad=Math.PI/180;
  var deg=180/Math.PI;
  
  var t = (jd-2451545.0)/36525;
  var gmst_at_zero = (24110.5484 + 8640184.812866*t+0.093104*t*t+0.0000062*t*t*t)/3600;
  var gmst=gmst_at_zero+(time_in_sec * 1.00273790925)/3600;

  if(gmst<0){gmst=gmst%24+24;}
  if(gmst>24){gmst=gmst%24;}
  this.gmst=gmst
  return gmst
}

TLE = function(){}

TLE.prototype.decode = function(line1,line2){
  var orbital_elements={
    line_number_1 :   Number(line1.slice(0,0)),
    catalog_no_1 :  Number(line1.slice(2,6)),
    security_classification :  Number(line1.slice(7,7)),
    international_identification : Number(line1.slice(9,17)),
    epoch_year : Number(line1.slice(18,20)),
    epoch : Number(line1.substring(20,32)),
    first_derivative_mean_motion : Number(line1.substring(33,43)),
    second_derivative_mean_motion : Number(line1.substring(44,52)),
    bstar_mantissa: Number(line1.substring(53,59)),
    bstar_exponent : Number(line1.substring(59,61)),
    ephemeris_type :  Number(line1.substring(62,63)),
    element_number :  Number(line1.substring(64,68)),
    check_sum_1 :   Number(line1.substring(69,69)),
    line_number_2 :   Number(line1.slice(0,0)),
    catalog_no_2 :  Number(line2.slice(2,7)),
    inclination : Number(line2.substring(8,16)),
    right_ascension : Number(line2.substring(17,25)),
    eccentricity : Number(line2.substring(26,33)),
    argument_of_perigee : Number(line2.substring(34,42)),
    mean_anomaly : Number(line2.substring(43,51)),
    mean_motion : Number(line2.substring(52,63)),
    rev_number_at_epoch : Number(line2.substring(64,68)),
    check_sum_2 :   Number(line1.substring(68,69))
   }
  return orbital_elements;
}

TLE.prototype.elapsedTime = function(epoch_year,epoch,date){
  var d = new Date();
  d.setTime(date.getTime())
  var year=d.getUTCFullYear();
  var month=d.getUTCMonth()+1;
  var day=d.getUTCDate();
  var hours=d.getUTCHours();
  var minutes=d.getUTCMinutes();
  var seconds=d.getUTCSeconds();
  var year2=epoch_year-1;
  var now_sec=Date.UTC(year, month-1, day, hours, minutes, seconds);
  var epoch_sec=Date.UTC(year2, 11, 31, 0, 0, 0)+(epoch*24*60*60*1000);
  var elapsed_time=(now_sec-epoch_sec)/(60*1000);
  return elapsed_time; //.toFixed(2);
}

SGP4 = function(orbital_elements){
  var torad = Math.PI/180;
  var e6a = 1.0e-6;
  var tothrd = 0.66666667;
  var xj2 = 1.082616e-3;
  var xj4 = -1.65597e-6;
  var xj3 = -0.253881e-5;
  var xke = 0.743669161e-1;
  var xkmper = 6378.135;
  var min_par_day = 1440.0;
  var ae = 1.0;
  var qo = ae +120.0/xkmper;
  var ck2 =5.413080e-4;
  var ck4 = 0.62098875e-6;
  var qoms2t = 1.88027916e-9;
  var s = 1.0+78.0/xkmper;
  var de2ra = 0.174532925e-1;
  var pi = 3.14159265;
  var pio2 = 1.57079633;
  var twopi = 6.2831853;
  var x3pio2 = 4.71238898;

  var epy = Number(orbital_elements["epoch_year"]);
  //epoch_year should be smaller than 2057.
  if(epy<57){var epoch_year=epy+2000}else{var epoch_year=epy+1900};
  var epoch = orbital_elements["epoch"];
  var bstar_mantissa = orbital_elements["bstar_mantissa"]*1e-5;
  var bstar_exponent = Number("1e" + orbital_elements["bstar_exponent"]);
  var xincl = orbital_elements["inclination"]*torad;
  var xnodeo = orbital_elements["right_ascension"]*torad;
  var eo = orbital_elements["eccentricity"]*1e-7;
  var omegao  = orbital_elements["argument_of_perigee"]*torad;
  var xmo = orbital_elements["mean_anomaly"]*torad;
  var xno  = orbital_elements["mean_motion"]*2.0*Math.PI/1440.0;
  var bstar = bstar_mantissa*bstar_exponent

  var a1 = Math.pow(xke/xno,(2.0/3.0));
  var cosio=Math.cos(xincl);
  var theta2=cosio*cosio;
  var x3thm1=3*theta2-1.0;
  var eosq=eo*eo;
  var betao2=1-eosq;
  var betao=Math.sqrt(betao2);
  var del1=1.5*ck2*x3thm1/(a1*a1*betao*betao2);
  var ao=a1*(1-del1*((1.0/3.0)+del1*(1.0+(134.0/81.0)*del1)));
  var delo=1.5*ck2*x3thm1/(ao*ao*betao*betao2);
  var xnodp=xno/(1.0+delo); //original_mean_motion
  var aodp=ao/(1.0-delo); //semi_major_axis

  var isimp=0;
  if ((aodp*(1.0-eo)/ae) < (220.0/xkmper+ae)){
    isimp=1;
  }

  var s4=s;
  var qoms24=qoms2t;
  var perige=(aodp*(1.0-eo)-ae)*xkmper;
  if (perige < 156.0){
    s4 = perige-78.0;
    if (perige <= 98.0){
      s4 = 20.0;
    }else{
      var qoms24=Math.pow(((120.0-s4)*ae/xkmper),4);
      s4 = s4/xkmper+ae;
	}
  }
  var pinvsq=1.0/(aodp*aodp*betao2*betao2);
  var tsi=1.0/(aodp-s4);
  var eta=aodp*eo*tsi;
  var etasq=eta*eta;
  var eeta=eo*eta;
  var psisq=Math.abs(1.0-etasq);
  var coef=qoms24*Math.pow(tsi,4);
  var coef1=coef/Math.pow(psisq,3.5);
  
  var c2=coef1*xnodp*(aodp*(1.0+1.5*etasq+eeta*(4.0+etasq))+0.75*ck2*tsi/psisq*x3thm1*(8.0+3.*etasq*(8.0+etasq)));
  var c1=bstar*c2;
  var sinio=Math.sin(xincl);
  var a3ovk2=-xj3/ck2*Math.pow(ae,3);
  var c3=coef*tsi*a3ovk2*xnodp*ae*sinio/eo;
  var x1mth2=1.0-theta2;
  var c4=2.0*xnodp*coef1*aodp*betao2*(eta*(2.0+0.5*etasq)+eo*(0.5+2.0*etasq)-2.0*ck2*tsi/(aodp*psisq)*(-3.0*x3thm1*(1.0-2.0*eeta+etasq*(1.5-0.5*eeta))+0.75*x1mth2*(2.0*etasq-eeta*(1.0+etasq))*Math.cos((2.0*omegao))));
  var c5=2.0*coef1*aodp*betao2*(1.0+2.75*(etasq+eeta)+eeta*etasq);

  var theta4=theta2*theta2;
  var temp1=3.0*ck2*pinvsq*xnodp;
  var temp2=temp1*ck2*pinvsq;
  var temp3=1.25*ck4*pinvsq*pinvsq*xnodp;
  var xmdot=xnodp+0.5*temp1*betao*x3thm1+0.0625*temp2*betao*(13.0-78.0*theta2+137.0*theta4);

  var x1m5th=1.0-5.0*theta2;
  var omgdot=-0.5*temp1*x1m5th+0.0625*temp2*(7.0-114.0*theta2+395.0*theta4)+temp3*(3.0-36.0*theta2+49.0*theta4);
  var xhdot1=-temp1*cosio;
  var xnodot=xhdot1+(0.5*temp2*(4.0-19.0*theta2)+2.0*temp3*(3.0-7.0*theta2))*cosio;
  var omgcof=bstar*c3*Math.cos(omegao);
  var xmcof=-tothrd*coef*bstar*ae/eeta;
  var xnodcf=3.5*betao2*xhdot1*c1;
  var t2cof=1.5*c1;
  var xlcof=0.125*a3ovk2*sinio*(3.0+5.0*cosio)/(1.0+cosio);
  var aycof=0.25*a3ovk2*sinio;
  var delmo=Math.pow((1.0+eta*Math.cos(xmo)),3);
  var sinmo=Math.sin(xmo);
  var x7thm1=7.*theta2-1.0;

  if (isimp != 1){
    var c1sq=c1*c1;
    var d2=4.*aodp*tsi*c1sq;
    var temp=d2*tsi*c1/3.0;
    var d3=(17.0*aodp+s4)*temp;
    var d4=0.5*temp*aodp*tsi*(221.0*aodp+31.*s4)*c1;
    var t3cof=d2+2.0*c1sq;
    var t4cof=0.25*(3.0*d3+c1*(12.0*d2+10.0*c1sq));
    var t5cof=0.2*(3.0*d4+12.0*c1*d3+6.0*d2*d2+15.*c1sq*(2.0*d2+c1sq));
  }  

//set accesser
  this.epoch_year=epoch_year;
  this.epoch=epoch;
  this.xmo = xmo;
  this.xmdot = xmdot;
  this.omegao = omegao;
  this.omgdot = omgdot;
  this.xnodeo = xnodeo;
  this.xnodot = xnodot;
  this.xnodcf = xnodcf
  this.bstar = bstar;
  this.t2cof = t2cof;
  this.omgcof = omgcof;
  this.isimp = isimp;
  this.xmcof = xmcof;
  this.eta = eta;
  this.delmo = delmo;
  this.c1 = c1;
  this.c4 = c4;
  this.c5 = c5;
  this.d2 = d2;
  this.d3 = d3;
  this.d4 = d4;
  this.sinmo = sinmo;
  this.t3cof = t3cof;
  this.t4cof = t4cof;
  this.t5cof = t5cof;
  this.aodp = aodp;
  this.eo = eo;
  this.xnodp = xnodp;
  this.xke = xke;
  this.xlcof = xlcof;
  this.aycof = aycof;
  this.x3thm1 = x3thm1;
  this.x1mth2 = x1mth2;
  this.xincl = xincl;
  this.cosio = cosio;
  this.sinio = sinio;
  this.e6a = e6a;
  this.ck2 = ck2;
  this.x7thm1 = x7thm1;
  this.xkmper = xkmper;
  
  this.isvect = 0;
  
}

SGP4.prototype.calc = function(date){
  var d = new Date();
  d.setTime(date.getTime());
  var rad = Math.PI/180;

  //variable from SGP4.setConstant
  var xmo=this.xmo;
  var xmdot=this.xmdot;
  var omegao=this.omegao;
  var omgdot=this.omgdot;
  var xnodeo=this.xnodeo;
  var xnodot=this.xnodot;
  var xnodcf = this.xnodcf
  var bstar=this.bstar;
  var t2cof=this.t2cof;
  var omgcof=this.omgcof;
  var isimp=this.isimp;
  var xmcof=this.xmcof;
  var eta=this.eta;
  var delmo=this.delmo;
  var c1=this.c1;
  var c4=this.c4;
  var c5=this.c5;
  var d2=this.d2;
  var d3=this.d3;
  var d4=this.d4;
  var sinmo=this.sinmo;
  var t3cof=this.t3cof;
  var t4cof=this.t4cof;
  var t5cof=this.t5cof;
  var aodp=this.aodp;
  var eo=this.eo;
  var xnodp=this.xnodp;
  var xke=this.xke;
  var xlcof=this.xlcof;
  var aycof=this.aycof;
  var x3thm1=this.x3thm1;
  var x1mth2=this.x1mth2;
  var xincl=this.xincl;
  var cosio=this.cosio;
  var sinio=this.sinio;
  var e6a=this.e6a;
  var ck2=this.ck2;
  var x7thm1=this.x7thm1;
  var xkmper = this.xkmper;
  var epoch_year=this.epoch_year;
  var epoch=this.epoch;

  var tle = new TLE();
  var tsince = tle.elapsedTime(epoch_year,epoch,date);

  var xmdf=xmo+xmdot*tsince;
  var omgadf=omegao+omgdot*tsince;
  var xnoddf=xnodeo+xnodot*tsince;
  var omega=omgadf;
  var xmp=xmdf;
  var tsq=tsince*tsince;
  var xnode=xnoddf+xnodcf*tsq;
  var tempa=1.0-c1*tsince;
  var tempe=bstar*c4*tsince;
  var templ=t2cof*tsq;

  if (isimp != 1){
    var delomg=omgcof*tsince;
    var delm=xmcof*(Math.pow((1.0+eta*Math.cos(xmdf)),3)-delmo);
    var temp=delomg+delm;
    var xmp=xmdf+temp;
    var omega=omgadf-temp;
    var tcube=tsq*tsince;
    var tfour=tsince*tcube;
    var tempa=tempa-d2*tsq-d3*tcube-d4*tfour;
    var tempe=tempe+bstar*c5*(Math.sin(xmp)-sinmo);
    var templ=templ+t3cof*tcube+tfour*(t4cof+tsince*t5cof);
  }
  var a=aodp*tempa*tempa;
  var e=eo-tempe;
  var xl=xmp+omega+xnode+xnodp*templ;
  var beta=Math.sqrt(1.0-e*e);
  var xn=xke/Math.pow(a,1.5);

  // long period periodics
  var axn=e*Math.cos(omega);
  var temp=1.0/(a*beta*beta);
  var xll=temp*xlcof*axn;
  var aynl=temp*aycof;
  var xlt=xl+xll;
  var ayn=e*Math.sin(omega)+aynl;

  // solve keplers equation

  //var capu=Number(fmod2p(xlt-xnode));
  var capu = (xlt-xnode)%(2.0*Math.PI);
  var temp2=capu;
  for (i=1; i<=10; i++){
    var sinepw=Math.sin(temp2);
    var cosepw=Math.cos(temp2);
    var temp3=axn*sinepw;
    var temp4=ayn*cosepw;
    var temp5=axn*cosepw;
    var temp6=ayn*sinepw;
    var epw=(capu-temp4+temp3-temp2)/(1.0-temp5-temp6)+temp2;
  if (Math.abs(epw-temp2) <= e6a){
    break
  };
  temp2=epw;
}
     // short period preliminary quantities

  var ecose=temp5+temp6;
  var esine=temp3-temp4;
  var elsq=axn*axn+ayn*ayn;
  var temp=1.0-elsq;
  var pl=a*temp;
  var r=a*(1.0-ecose);
  var temp1=1.0/r;
  var rdot=xke*Math.sqrt(a)*esine*temp1;
  var rfdot=xke*Math.sqrt(pl)*temp1;
  var temp2=a*temp1;
  var betal=Math.sqrt(temp);
  var temp3=1.0/(1.0+betal);
  var cosu=temp2*(cosepw-axn+ayn*esine*temp3);
  var sinu=temp2*(sinepw-ayn-axn*esine*temp3);
  var u=Math.atan2(sinu,cosu);
  if (u<0){u+= 2* Math.PI;}
  var sin2u=2.0*sinu*cosu;
  var cos2u=2.0*cosu*cosu-1.;
  var temp=1.0/pl;
  var temp1=ck2*temp;
  var temp2=temp1*temp;

  // update for short periodics

  var rk=r*(1.0-1.5*temp2*betal*x3thm1)+0.5*temp1*x1mth2*cos2u;
  var uk=u-0.25*temp2*x7thm1*sin2u;
  var xnodek=xnode+1.5*temp2*cosio*sin2u;
  var xinck=xincl+1.5*temp2*cosio*sinio*cos2u;
  var rdotk=rdot-xn*temp1*x1mth2*sin2u;
  var rfdotk=rfdot+xn*temp1*(x1mth2*cos2u+1.5*x3thm1);

  // orientation vectors

  var sinuk=Math.sin(uk);
  var cosuk=Math.cos(uk);
  var sinik=Math.sin(xinck);
  var cosik=Math.cos(xinck);
  var sinnok=Math.sin(xnodek);
  var cosnok=Math.cos(xnodek);
  var xmx=-sinnok*cosik;
  var xmy=cosnok*cosik;
  var ux=xmx*sinuk+cosnok*cosuk;
  var uy=xmy*sinuk+sinnok*cosuk;
  var uz=sinik*sinuk;
  var vx=xmx*cosuk-cosnok*sinuk;
  var vy=xmy*cosuk-sinnok*sinuk;
  var vz=sinik*cosuk;
  var x=rk*ux;
  var y=rk*uy;
  var z=rk*uz;
  var xdot=rdotk*ux+rfdotk*vx;
  var ydot=rdotk*uy+rfdotk*vy;
  var zdot=rdotk*uz+rfdotk*vz;

  var xkm = (x*xkmper);
  var ykm = (y*xkmper);
  var zkm = (z*xkmper);
  var xdotkmps = (xdot*xkmper/60);
  var ydotkmps = (ydot*xkmper/60);
  var zdotkmps = (zdot*xkmper/60);


  // PHOBOS Patch =========
  if (this.isvect == 1)
  {
  
	var tmjd = ConvertToJD(d);
  
	var mmx = Math.floor((tmjd - vct)*24*60*60 + 0.5 + 66.182999);
  
	if (mmx < 0) mmx = 0;
	if (mmx > vcx.length -1 ) mmx = vcx.length-1;
  
	xkm = vcx[mmx];
	ykm = vcy[mmx];
	zkm = vcz[mmx];
	
	// Access to second vector table
	
	if (tmjd > v2jd1) tmjd = v2jd1;
	if (tmjd > v2jd0)
	{
		mmx = Math.floor((tmjd-v2jd0)/0.027778*40+0.5);
		if (mmx > 40)
		{
			mmx = Math.floor((mmx-40)/5+40+0.5);
		}
		if (mmx >= vect2ok) mmx = vect2ok-1;
		
		// Linear Interpolation
		
		var tt1;
		var tt2;
		tmjd = tmjd - v2jd0;
		
		if (vct2[mmx] < tmjd)
		{
			t1 = vct2[mmx];
			t2 =  vct2[mmx+1];
		}
		else
		{
			t1 = vct2[mmx-1];
			t2 =  vct2[mmx];
			mmx = mmx - 1;
		}
		
		if ((t1 > tmjd) || ( t2 < tmjd)) alert('Interpolation Error');
		
		var xp1 = vcx2[mmx];
		var xp2 = vcx2[mmx+1];
		var yp1 = vcy2[mmx];
		var yp2 = vcy2[mmx+1];
		var zp1 = vcz2[mmx];
		var zp2 = vcz2[mmx+1];
		
		var kkk = (tmjd-t1)/(t2-t1);
		
		xkm = xp1 + (xp2-xp1)*kkk;
		ykm = yp1 + (yp2-yp1)*kkk;
		zkm = zp1 + (zp2-zp1)*kkk;
	
	}
	
  }  
  
  // ======================

  this.x = xkm;
  this.y = ykm;
  this.z = zkm;
  
  this.xdot = xdotkmps;
  this.ydot = ydotkmps;
  this.zdot = zdotkmps;
  
  
  

  this.latlng = function(){
    var clock = new Clock()
    var gmst = clock.GMST(date);
    var lst = gmst*15;

    var f = 0.00335277945 //Earth's flattening term in WGS-72 (= 1/298.26)
    var a = 6378.135  //Earth's equational radius in WGS-72 (km)

	//var f = 1/298.257223563		// WGS84
	//var a = 6378.137			// WGS84
    var r = Math.sqrt(xkm*xkm+ykm*ykm);
    var lng = Math.atan2(ykm,xkm)/rad - lst;
    if(lng>360){lng = lng%360;}
    if(lng<0){lng = lng%360+360;}    
    if(lng>180){lng=lng-360}
   
    var lat = Math.atan2(zkm,r);
    var e2 = f*(2-f);
    var tmp_lat = 0

    do{
      tmp_lat = lat;
      var sin_lat= Math.sin(tmp_lat)
      var c = 1/Math.sqrt(1-e2*sin_lat*sin_lat);
      lat= Math.atan2(zkm+a*c*e2*(Math.sin(tmp_lat)),r);
    }while(Math.abs(lat-tmp_lat)>0.0001);

    var alt = r/Math.cos(lat)-a*c;
    var v = Math.sqrt(xdotkmps*xdotkmps + ydotkmps*ydotkmps + zdotkmps*zdotkmps);

    
	var footprint = 12756.33*Math.acos(a/(a+alt));
	
	
    this.longitude = lng
    this.latitude = lat/rad;
    this.altitude = alt;
    this.velocity = v;
    this.footprint = footprint;
    return this;
  }


  this.look = function(lat,lng,alt){
    var clock = new Clock()
    var gmst = clock.GMST(date);
    var lst = gmst*15 + lng;

    var a = 6378.135  //Earth's equational radius in WGS-72 (km)
    var f = 0.00335277945 //Earth's flattening term in WGS-72 (= 1/298.26)
    var sin_lat =Math.sin(lat*rad);
    var c = 1/Math.sqrt(1+f*(f-2)*sin_lat*sin_lat);
    var s = (1-f)*(1-f)*c;  
    var xo = a*c*Math.cos(lat*rad)*Math.cos(lst*rad);
    var yo = a*c*Math.cos(lat*rad)*Math.sin(lst*rad);
    var zo = a*s*Math.sin(lat*rad);


    var xs = xkm;
    var ys = ykm;
    var zs = zkm;

    var rx0= xs - xo;
    var ry0= ys - yo
    var rz0= zs - zo

    var rs = Math.sin(lat*rad)*Math.cos(lst*rad)*rx0 + Math.sin(lat*rad)*Math.sin(lst*rad)*ry0-Math.cos(lat*rad)*rz0;
    var re = -Math.sin(lst*rad)*rx0 + Math.cos(lst*rad)*ry0;
    var rz = Math.cos(lat*rad)*Math.cos(lst*rad)*rx0+Math.cos(lat*rad)*Math.sin(lst*rad)*ry0 + Math.sin(lat*rad)*rz0;
    var range = Math.sqrt(rs*rs+re*re+rz*rz);
    var elevation = Math.asin(rz/range);
    var azimuth  = Math.atan2(-re,rs);
    azimuth = azimuth/rad+180;
    if (azimuth>360){
    azimuth = azimuth%360;
    }
    
    this.range = range;
    this.elevation = elevation/rad;
    this.azimuth  = azimuth;
    return this;
  }
  return this;
}
