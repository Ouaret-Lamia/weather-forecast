const apiKey = "f39a8549e82ca5f22d9925c08eafeae0";

const cityValue = document.querySelector(".searchDiv input");
const searchBtn = document.querySelector(".searchBtn");
const locBtn = document.querySelector(".locBtn");

const weather = document.querySelector(".weather_icon");

const forecast = document.querySelector(".forecastData")

async function getAPI(city=null, lat=null, lon=null) {
    let result;
    if(city)
        result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    else
        result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    const data = await result.json();
    console.log(data);

    document.querySelector(".temp").innerHTML = `${data.main.temp}°C`;
    document.querySelector(".state").innerHTML = `<b>${data.weather[0].main}</b> in ${data.name}`;
    weatherIconDisplay(data.weather[0].main, weather);
    document.querySelector("#feelLike").innerHTML = `${data.main.feels_like}°C`;
    document.querySelector("#humidity").innerHTML = `${data.main.humidity} g/m3`;

    windChartDisplay(data.wind.speed);
    pressureChartDisplay(data.main.pressure);

    mapDisplay(data.coord.lat, data.coord.lon);

    let forecastRes;
    if (city)
        forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    else
        forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

    const forecastData = await forecastRes.json();
    console.log(forecastData);

    forecastFunction(forecastData);


    document.querySelector(".mainDiv").style.cssText = 'display: grid;';
    document.querySelector(".waiting").style.cssText = 'display: none;';
}

searchBtn.addEventListener("click", () => {
    getAPI(cityValue.value);
});

locBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(currentPosition);
    }
})

function currentPosition(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getAPI(null,lat,lon);
}


async function weatherIconDisplay(state, element) {
    const icons = {
        Clouds: "images/cloud.png",
        Clear: "images/clear.png",
        Rain: "images/rain.png",
        Drizzle: "images/drizzle.png",
        Mist: "images/mist.png",
        Snow: "images/snow.png",
    };
    element.src = icons[state];
}

// _________________________________ Forcast __________________________________
async function forecastFunction(forecastData) {
    const timeTaken = '00:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecast.innerHTML = "";
    forecastData.list.forEach(f => {
        if (f.dt_txt.includes(timeTaken) && !f.dt_txt.includes(todayDate)) {
            const newElement = document.createElement("div");

            const date = new Date(f.dt_txt);
            const options = { weekday: 'long' }; 
            const day = date.toLocaleDateString('en-US', options); 
            const dayElement = document.createTextNode(day);
            newElement.appendChild(dayElement);

            const icon = document.createElement("img");
            weatherIconDisplay(f.weather[0].main, icon);
            newElement.appendChild(icon);

            const temp = document.createElement("b");
            temp.innerHTML = `${f.main.temp}°C`;
            newElement.appendChild(temp);

            forecast.appendChild(newElement);
        }
    });
}

// _________________________________ charts _________________________________
let windChart = null;
async function windChartDisplay(speed) {
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
                backgroundColor: 'rgba(54, 163, 235, 0.76)',
                borderColor: 'rgba(54, 162, 235)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    }
                }
            },
            elements: {
                bar: {
                    borderWidth: 2
                }
            }
        }
    }); 

    document.querySelector("#windSpeed").innerHTML = `${speed} km/h`;
}

let pressureChart = null;
async function pressureChartDisplay(p) {
    if (pressureChart) {
        pressureChart.destroy();
    }
    const pressureData = [p, 5000 - p];
    const pressureCtx = document.getElementById('pressure').getContext('2d');

    pressureCtx.canvas.width = 250; 
    pressureCtx.canvas.height = 150;

    pressureChart = new Chart(pressureCtx, {
        type: 'doughnut',
        data: {
            labels: ['Pressure'],
            datasets: [{
                data: pressureData,
                backgroundColor: ['rgb(255, 99, 133)', 'rgba(201, 203, 207, 0.2)'],
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

// __________________________________ Map __________________________________
let mapInstance = null;
async function mapDisplay(lat, lon) {
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

