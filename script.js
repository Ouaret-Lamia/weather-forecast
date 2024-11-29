const apiKey = "f39a8549e82ca5f22d9925c08eafeae0";

const cityValue = document.querySelector(".searchDiv input");
const searchBtn = document.querySelector(".searchDiv button");

const weather = document.querySelector(".weather_icon");

async function getAPI(city) {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await result.json();
    console.log(data);

    document.querySelector(".temp").innerHTML = `${data.main.temp}°C`;
    document.querySelector(".state").innerHTML = `Today it's <b>${data.weather[0].main}</b> in ${data.name}`;

    if(data.weather[0].main == "Clouds"){
        weather.src = "images/cloud.png";
    } else if(data.weather[0].main == "Clear"){
        weather.src = "images/clear.png";
    } else if(data.weather[0].main == "Rain"){
        weather.src = "images/rain.png";
    } else if(data.weather[0].main == "Drizzle"){
        weather.src = "images/drizzle.png";
    } else if(data.weather[0].main == "Mist"){
        weather.src = "images/mist.png";
    } else if(data.weather[0].main == "Snow"){
        weather.src = "images/snow.png";
    } 
}

searchBtn.addEventListener("click", () =>{
    getAPI("setif");
    // getAPI(cityValue.value);
})