"use strict";

$(document).ready(function() {
  $('.hero-slides').slick({
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 8000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    pauseOnHover: false,
    useAutoplayToggleButton: false  // removes the pause/play button

  });


  const scrollTop = document.getElementById("scrollToTopBtn");

  window.addEventListener("scroll", function(){
    if(window.pageYOffset > 200){
      scrollTop.style.display="block";
    }else{
      scrollTop.style.display="none";
    }
  });

  scrollTop.addEventListener("click", function(){
    window.scrollTo({
      top:0, 
      behavior:"smooth"
    })

  });

  const header = document.querySelector("header.primary");
  const toggleBtn = document.querySelector(".nav-toggle");

  toggleBtn.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");

  });

  $("#myform").validate({
    rules: { location: { required: true } },
    messages: { location: "Please enter a location." }
  });

  // Buttons
  $("#DisplayTemp").on("click", getWeatherForecast);

  // Default + auto-fetch
  $("#location").val("Mountain Pine");
  getWeatherForecast();



async function getWeatherForecast() {
  "use strict";


  let form = $("#myform");


  if (form.valid()) {
    let locationInput = document.getElementById("location").value;
    if (!locationInput) {
      alert("Please enter a location");
      return;
    }

    let geocodeURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationInput)}&count=10&format=json`;

    let geocodeResponse = await fetch(geocodeURL);
    if (geocodeResponse.status >= 200 && geocodeResponse.status <= 299) {
      let geocodeData = await geocodeResponse.json();
      if (!geocodeData.results || geocodeData.results.length === 0) {
        alert("No location found.");
        return;
      }
      let locationData = geocodeData.results[0];


      let weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${locationData.latitude}&longitude=${locationData.longitude}&hourly=temperature_2m&temperature_unit=fahrenheit`;
      let weatherResponse = await fetch(weatherURL);
      if (weatherResponse.status >= 200 && weatherResponse.status <= 299) {
        let weatherData = await weatherResponse.json();
        let weatherHourly = weatherData.hourly;


        document.getElementById(
          "location-info"
        ).innerHTML = `<h3>${locationData.name}, ${locationData.admin1}, ${locationData.country}</h3>
     <p><strong>Latitude =</strong> ${locationData.latitude} - <strong>Longitude =</strong> ${locationData.longitude}</p>`;


        let forecastTable =
          "<table>" + "<caption><strong>Temperature</strong></caption>" + "<tr><th>Date</th><th>Temp</th></tr>";
        let labels = [];
        let temperatures = [];
        // chart-only arrays
        let chartLabels = [];
        let chartTemps = [];

        // pick 3 hours per day (8 AM, 2 PM, 8 PM)
        const keepHours = [8, 14, 20];


        for (let i = 0; i < weatherHourly.time.length; i++) {
          let unixTime = Date.parse(weatherHourly.time[i]);
          let tmpDate = new Date(unixTime);
          let formattedTime = tmpDate.toLocaleString();

          // ✅ TABLE: keep every hour
          forecastTable += `<tr><td>${formattedTime}</td><td>${weatherHourly.temperature_2m[i]}</td></tr>`;

          // ✅ CHART: only 3 points per day
          if (keepHours.includes(tmpDate.getHours())) {
            chartLabels.push(formattedTime);
            chartTemps.push(weatherHourly.temperature_2m[i]);
          }
        }
        forecastTable += "</table>";
        document.getElementById("forecast-table").innerHTML = forecastTable;


        if (window.myChart) {
          window.myChart.destroy();
        }


        let ctx = document.getElementById("forecast-chart").getContext("2d");
        window.myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: chartLabels,
            datasets: [
              {
                label: "Temperature (°F)",
                data: chartTemps,
                borderColor: "#b5d9a0",
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } else {
        alert("Failed to fetch weather data.");
      }
    } else {
      alert("Failed to fetch location data.");
    }
  }
}


function clearForm() {
  "use strict";
  document.getElementById("location").value = "";
  document.getElementById("location-info").innerHTML = "";
  document.getElementById("forecast-table").innerHTML = "";


  if (window.myChart) {
    window.myChart.destroy();
  }
}


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("location").value = "New York"; // Set Default Location
  getWeatherForecast(); // Automatically fetch forecast on page load
});


}); 
 


