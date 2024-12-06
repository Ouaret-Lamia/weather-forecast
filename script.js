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
    document.querySelector("#feelLike").innerHTML = `${data.main.feels_like}°C`;
    document.querySelector("#humidity").innerHTML = `${data.main.humidity}`;

    windChartDisplay(data.wind.speed);
    pressureChartDisplay(data.main.pressure);

    mapDisplay(data.coord.lat, data.coord.lon);

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

searchBtn.addEventListener("click", () => {
    getAPI(cityValue.value);
});

function weatherIconDisplay(state, element) {
    if (state == "Clouds") {
        element.src = "images/cloud.png";
    } else if (state == "Clear") {
        element.src = "images/clear.png";
    } else if (state == "Rain") {
        element.src = "images/rain.png";
    } else if (state == "Drizzle") {
        element.src = "images/drizzle.png";
    } else if (state == "Mist") {
        element.src = "images/mist.png";
    } else if (state == "Snow") {
        element.src = "images/snow.png";
    }
}

let windChart = null;
function windChartDisplay(speed) {
    if (windChart) {
        windChart.destroy();
    }
    const labels = ['Speed'];
    const windData = [speed];
    const windCtx = document.getElementById('wind');
    windChart = new Chart(windCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                barThickness: 80,
                data: windData,
                backgroundColor: 'rgba(54, 162, 235, 0.4)',
                borderColor: 'rgba(54, 162, 235)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    document.querySelector("#windSpeed").innerHTML = `${speed} km/h`;
}

let pressureChart = null;
function pressureChartDisplay(p) {
    if (pressureChart) {
        pressureChart.destroy();
    }
    const pressureData = [p, 5000 - p];
    const pressureCtx = document.getElementById('pressure').getContext('2d');
    pressureChart = new Chart(pressureCtx, {
        type: 'doughnut',
        data: {
            labels: ['Pressure'],
            datasets: [{
                data: pressureData,
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(201, 203, 207, 0.2)'],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            rotation: -90,
            circumference: 180,
            responsive: false,
            maintainAspectRatio: false
        }
    });
    document.querySelector("#pressureVal").innerHTML = `${p} pascal`
}

let mapInstance = null;
function mapDisplay(lat, lon) {
    if (mapInstance) {
        mapInstance.remove();
    }
    mapInstance = L.map('map', {
        center: [lat, lon],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(mapInstance);

    L.marker([lat, lon]).addTo(mapInstance).openPopup();
}
