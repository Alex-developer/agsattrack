var planets = new AGPLANETS();
    var _sunMoon = new AGSUNMOON();

            julianDate = Date.Date2Julian(new Date());
            
            obs = new AGOBSERVER();
            obs.setLat(52);
            obs.setLon(0);
var pos = planets.update(julianDate, obs);


debugger
                