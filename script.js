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
        const time = document.createTextNode(`${hours}h`);
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


// _____________________________ Charts ____________________________
const labels = ['Speed', 'Gust']; 
const windData = [60, 55]; 
const pressureData = [60, 40]; 


const humidityCtx = document.getElementById('wind');
new Chart(humidityCtx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            barThickness: 100,
            label: 'speed',
            data: windData,
            backgroundColor: ['rgba(54, 162, 235, 0.4)' ,'rgba(255, 99, 132, 0.4)'],
            borderColor: [ 'rgba(54, 162, 235)', 'rgba(255, 99, 132)'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                beginAtZero: true
            }
        }
    }
});


const pressureCtx = document.getElementById('pressure').getContext('2d');
new Chart(pressureCtx, {
    type: 'doughnut',
    data: {
        labels: ['Pressure'],
        datasets: [{
            data: pressureData,
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(201, 203, 207, 0.2)'],
            hoverOffset: 4
        }]
    },
    options: {
        rotation: -90, // Rotate to start from the top
        circumference: 180, // Limit to half-circle
        responsive: false, // Disable responsiveness
        maintainAspectRatio: false // Allow custom height/width
    }
});



// _________________________ map ___________________________
function displayMap(lat, lon){
    const map = L.map('map', {
        center: [lat, lon],  
        zoom: 13,
        zoomControl: false,
        attributionControl: false 
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map)
        .openPopup();

}