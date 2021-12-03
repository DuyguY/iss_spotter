const request = require('request');

 const fetchMyIP = function(callback) { 
  //Makes a single API request to retrieve the user's IP address.
  request('https://api.ipify.org/?format=json', (error, response, body) => {
   // A callback (to pass back an error or the IP string)
  if (error) return callback(error, null);

  if (response.statusCode !== 200) {
    callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
    return;
  }
  // use request to fetch IP address from JSON API
  const ip = JSON.parse(body).ip;
  callback(null, ip);
  });
 };

 const  fetchCoordsByIP = function (ip, callback) {
   request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
      // inside the request callback ...
      // error can be set if invalid domain, user is offline, etc.
     if (error) {
       callback(error, null);
       return;
     }
     // if non-200 status, assume server error
     if (response.statusCode !== 200) {
       callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP:${body}`), null);
       return;
     }

     const { latitude, longitude } = JSON.parse(body);

     callback(null, { latitude, longitude });
   });
};




 const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request (url, (error,response,body) => {
    if (error) {
      callback (error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback (Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
 };

 const nextISSTimesForMyLocation = function(callback) {
   fetchMyIP((error,ip) => {
     if (error) {
       return callback(error,null);
     }

     fetchCoordsByIP(ip, (error, loc) => {
       if (error) {
         return callback(error,null);
       }

       fetchISSFlyOverTimes(loc, (error, nextPasses) => {
         if (error) {
           return callback(error,null);
         }

         callback(null, nextPasses);
       });
     });
   });
 };


 module.exports = { nextISSTimesForMyLocation };


  
  
  
  
  
  

 

