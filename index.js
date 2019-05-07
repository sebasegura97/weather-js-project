// 1º window.addEventListener -->  getLocation --> callApi.
window.addEventListener('load', getLocation);

let long;
let lat;
let temperatureDescription = document.querySelector('.temperature-description')
let temperatureDegree = document.querySelector('.temperature-degree')
let locationTimezone = document.querySelector('.location-timezone')
let iconElement = document.querySelector('.icon')
let temperatureSection = document.querySelector('.temperature-section')
let temperatureSpan = document.querySelector('.temperature-section span')

async function getLocation() {
    if (navigator.geolocation) {
        // navigator.geolocation.getCurrentPosition(position => console.log("position:", position));
        navigator.geolocation.getCurrentPosition(position => callApi(position));
    } else {
        return alert("Tu navegador no tiene localizacion")
    }
}

async function callApi(position) {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    
    // Forzar error de proxy
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const apiURL = `${proxy}https://api.darksky.net/forecast/6b2496268d88020c2b6230da84aac686/${lat},${long}`;

    let apiCall = await fetch(apiURL)
    // console.log(apiCall)
    let dataJSON = await apiCall.json();
    // console.log(dataJSON)
    setWeatherData(dataJSON)
}

function setWeatherData(data){
    const { temperature, summary, icon } = data.currently;
    
    // Set DOM elements from the API
    temperatureDegree.textContent = temperature;
    temperatureDescription.textContent = summary;
    locationTimezone.textContent = data.timezone;

    // Set Icon
    this.setIcon(icon);

    // Change temperature to celsius/farenheit
    temperatureSection.addEventListener("click", () => toggleDegree(temperature));
}

function setIcon(icon){
    // Para usar skycons hay que descargar el zip desde:
    // https://github.com/darkskyapp/skycons
    // y copiar skycons.js dentro de la carpeta del proyecto    
    const skycons = new Skycons({ color: "white" });
    // reemplaza - por _ y lo pasa a mayusculas
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconElement, Skycons[currentIcon]);
}

function toggleDegree(temperature){
    if (temperatureSpan.textContent === "F") {
        // Formula for celsius 
        var celsius = (temperature - 32) * (5 / 9); 
        temperatureSpan.textContent = "C"
        temperatureDegree.textContent = Math.floor(celsius);
    } else {
        temperatureSpan.textContent = "F"
        temperatureDegree.textContent = temperature;
    }
}