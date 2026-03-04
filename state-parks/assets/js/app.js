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

  "use strict";

const form = document.getElementById("weatherForm");
const input = document.getElementById("locationInput");
const errorMsg = document.getElementById("errorMsg");
const placeBox = document.getElementById("placeBox");
const tbody = document.querySelector("#forecastTable tbody");
const chartCanvas = document.getElementById("tempChart");

let tempChart = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";
  placeBox.innerHTML = "";
  tbody.innerHTML = "";

  const userLocation = input.value.trim();

  // 1) Validate required input
  if (userLocation === "") {
    errorMsg.textContent = "Location is required. Please enter a location.";
    return;
  }

  try {
    // 2) Geocode (take first match)
    const geoUrl =
      "https://geocoding-api.open-meteo.com/v1/search" +
      `?name=${encodeURIComponent(userLocation)}` +
      "&count=10&language=en&format=json";

    const geoResp = await fetch(geoUrl);
    if (!geoResp.ok) throw new Error("Geocoding request failed.");

    const geoData = await geoResp.json();

    if (!geoData.results || geoData.results.length === 0) {
      errorMsg.textContent = "No matching location found. Try a different search.";
      return;
    }

    const first = geoData.results[0];

    // Required display fields from assignment
    const name = first.name ?? "";
    const admin1 = first.admin1 ?? "";
    const country = first.country ?? "";
    const latitude = first.latitude;
    const longitude = first.longitude;

    placeBox.innerHTML = `
      <h3>Location Match</h3>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Admin1:</strong> ${escapeHtml(admin1)}</li>
        <li><strong>Country:</strong> ${escapeHtml(country)}</li>
        <li><strong>Latitude:</strong> ${latitude}</li>
        <li><strong>Longitude:</strong> ${longitude}</li>
      </ul>
    `;

    // 3) Forecast: hourly temperature_2m for 7 days in Fahrenheit
    // Open-Meteo forecast is 7 days by default; we also set timezone + units.
    const forecastUrl =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${latitude}&longitude=${longitude}` +
      "&hourly=temperature_2m" +
      "&temperature_unit=fahrenheit" +
      "&timezone=America%2FChicago" +
      "&forecast_days=7";

    const wxResp = await fetch(forecastUrl);
    if (!wxResp.ok) throw new Error("Forecast request failed.");

    const wxData = await wxResp.json();

    const times = wxData.hourly?.time;
    const temps = wxData.hourly?.temperature_2m;

    if (!times || !temps || times.length === 0) {
      errorMsg.textContent = "Forecast data was returned, but it did not include hourly temperature.";
      return;
    }

    // 4) Convert time strings to friendly format (your professor’s snippet)
    const friendlyTimes = [];
    for (let i = 0; i < times.length; i++) {
      let unixmillsec = Date.parse(times[i]);
      let tmpdate = new Date(unixmillsec);
      friendlyTimes[i] = tmpdate.toLocaleString();
    }

    // 5) Build table rows
    const rowsHtml = times
      .map((_, i) => {
        return `<tr><td>${friendlyTimes[i]}</td><td>${temps[i]}</td></tr>`;
      })
      .join("");

    tbody.innerHTML = rowsHtml;

    // 6) Line chart
    renderChart(friendlyTimes, temps);

  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Something went wrong while loading weather data. Please try again.";
  }
});

function renderChart(labels, dataPoints) {
  if (tempChart) tempChart.destroy();

  tempChart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Temperature (°F)",
          data: dataPoints,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        x: { ticks: { maxTicksLimit: 12 } }
      }
    }
  });
}

// Basic HTML escaping so user input can't inject HTML into your page
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[ch];
  });
}

}); 
 


