$(document).ready(function() {

  /*
  In this challenge, you'll learn how to use promises to make independent requests as well as how to make dependendent requests

  Part 1: Return what the current weather is based on a user's location (you can't use the location API though ;)

  - When you click the Weather button, the current weather should be shown in the #weather-results section
  - Use http://www.ip-api.com/json/ to get a user's location. This uses your IP address to get an estimate of your location
  - With the result of that request, make another request to determine the current weather
    - Use http://openweathermap.org/current
    - The API is really straightforward, but you'll have to pass an additional parameter to getJSON in order to get it working!
      - Take a look at jQuery's getJSON() API to see what that extra parameter is! http://api.jquery.com/jquery.getjson/
  
  Part 2: Show the difference between parallel and serial promises

  - Below I've implemented a couple of promises that just use timeouts, and return numbers
  - When the user clicks the serial button: each of the promises will execute one by one,
    and you will return the result in #slow-result
  - When the user clicks the parallel button: each of the promises will execute at the same time,
     and you will return the result in #fast-result
  - This is to show the immense importance of network optimization!
  
  Part 3: Modify the promise factory to create promises that can FAIL
  
  - The promise factory currently only returns promises that resolve
  - Use the deferred.fail() method to instead make it fail (https://api.jquery.com/deferred.fail/)
  - Now update you're code to handle dealing with these errors!
  - Congrats, you can now model asynchronous events entirely in your code :)
  */

  // The stuff below is for part 2 and 3

  // Creates a promise that will take delay ms before resolving with the given value
  // Don't worry about how this works, but if you want you're curious feel free to ask!

  $('#fetch-weather').click(function () {
    getLoc()
      .then(getWeather)
      .then(function (result) {
        var desc = result.weather[0].description;
        var temp = result.main.temp + " Kelvin";
        $('#weather-results')
          .html("<h3>Today's weather</h1><p>Description : " + 
            desc + 
            "</p><p>Temperature : " +
            temp + 
            "</p>");
      })
  })

  function getLoc() {
    var url = 'http://www.ip-api.com/json/';
    return $.get(url);
  }

  function getWeather(res) {    
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + res.city + '&appid=bd82977b86bf27fb59a04b61b657fb6f';
    return $.getJSON(url);
  }

  function promiseFactory(delay, val) {
    function f() {
      var d = $.Deferred();

      setTimeout(function() {
        d.resolve(val);
        // d.reject(val);
      }, delay);

      return d.promise();      
    }

    return f;
  }

  var quick = promiseFactory(500, 5);
  var medium = promiseFactory(1000, 2);
  var slow = promiseFactory(2000, 30)

  $('#serial-promise').click(function () {
    var sum = 0
    var promFns = [slow, medium, quick];
    promFns.reduce(function (sequence, promiseFn) {
      return sequence
        .then(promiseFn)
        .then(function (data) {
          sum += data;
        });
    }, $.Deferred().resolve())
      .then(function () {
        $('#result-slow').text(sum);
      })
  });

  $('#parallel-promise').click(function () {
      var proms = $.when(quick(), medium(), slow());
      proms
        .done(function (data1, data2, data3) {
          $('#result-fast').text(data1 + data2 + data3);
          console.log("fast done");
        })
        .fail(function () {
          $('#result-fast').text("Failed");
        })
  });

  $('#reset').click(function () {
    $('#result-slow').text("");
    $('#result-fast').text("");
  });
});
