const apiKey = "f39a8549e82ca5f22d9925c08eafeae0";

const cityValue = document.querySelector(".searchDiv input");
const searchBtn = document.querySelector(".searchDiv button");

const weather = document.querySelector(".weather_icon");

const forecast = document.querySelector(".forecastData")

async function getAPI(city) {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await result.json();
    console.log(data);

    document.querySelector(".temp").innerHTML = `${data.main.temp}°C`;
    document.querySelector(".state").innerHTML = `<b>${data.weather[0].main}</b> in ${data.name}`;

    weatherIconDisplay(data.weather[0].main, weather);

    displayMap(data.coord.lat, data.coord.lon);

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=7&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();
    console.log(forecastData);
    
    forecast.innerHTML = "";
    forecastData.list.forEach(f => {
        const newElement = document.createElement("div");

        const icon = document.createElement("img");
        weatherIconDisplay(f.weather[0].main, icon);
        newElement.appendChild(icon);

        const temp = document.createElement("b");
        temp.innerHTML = `${f.main.temp}°C`;
        newElement.appendChild(temp);

        const date = new Date(f.dt_txt);
        const hours = date.getHours();
        const time = document.createTextNode(`\n${hours}h`);
        newElement.appendChild(time);

        forecast.appendChild(newElement);
    });
    
}

searchBtn.addEventListener("click", () =>{
    getAPI("setif");
    // getAPI(cityValue.value);
})

function weatherIconDisplay(state, element){
    if(state == "Clouds"){
        element.src = "images/cloud.png";
    } else if(state == "Clear"){
        element.src = "images/clear.png";
    } else if(state == "Rain"){
        element.src = "images/rain.png";
    } else if(state == "Drizzle"){
        element.src = "images/drizzle.png";
    } else if(state == "Mist"){
        element.src = "images/mist.png";
    } else if(state == "Snow"){
        element.src = "images/snow.png";
    } 
}


// _________________________ map ___________________________
function displayMap(lat, lon){
    // Initialize the map without zoom and attribution controls
    const map = L.map('map', {
        center: [lat, lon],  // Set coordinates for your city
        zoom: 13,
        zoomControl: false,  // Disable zoom controls
        attributionControl: false // Disable attribution control
    });

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // Optionally, add a marker to the map (Example: London coordinates)
    const marker = L.marker([51.505, -0.09]).addTo(map)
        .openPopup();

}